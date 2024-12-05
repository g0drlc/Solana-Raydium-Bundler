import { AddressLookupTableProgram, Keypair, PublicKey, VersionedTransaction, TransactionMessage, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL, Blockhash, AddressLookupTableAccount } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import { wallet, connection, walletconn, RayLiqPoolv4, tipAcct, payer } from '../config';
import promptSync from 'prompt-sync';
import { searcherClient } from "./clients/jito";
import { Bundle as JitoBundle } from 'jito-ts/dist/sdk/block-engine/types.js';
//import { getRandomTipAccount } from "./clients/config";
import { lookupTableProvider } from "./clients/LookupTableProvider";
import { derivePoolKeys } from "./clients/poolKeysReassigned"; 
import { loadKeypairs } from './createKeys';
import * as spl from '@solana/spl-token';

const prompt = promptSync();
const keyInfoPath = path.join(__dirname, 'keyInfo.json');
const keypairWSOLATAIxs: TransactionInstruction[] = []

export async function extendLUT() {

    // -------- step 1: ask nessesary questions for LUT build --------
    const OpenBookID = prompt('OpenBook MarketID: ') || '';
    const jitoTipAmtInput = prompt('Jito tip in Sol (Ex. 0.01): ') || '0';
    const jitoTipAmt = parseFloat(jitoTipAmtInput) * LAMPORTS_PER_SOL;

    // Read existing data from poolInfo.json
    let poolInfo: { [key: string]: any } = {};
    if (fs.existsSync(keyInfoPath)) {
        const data = fs.readFileSync(keyInfoPath, 'utf-8');
        poolInfo = JSON.parse(data);
    }

    const bundledTxns1: VersionedTransaction[] = [];
    


    // -------- step 2: get all LUT addresses --------
    const accounts: PublicKey[] = []; // Array with all new keys to push to the new LUT
    const lut = new PublicKey(poolInfo.addressLUT.toString());

    const lookupTableAccount = (
        await connection.getAddressLookupTable(lut)
    ).value;

    if (lookupTableAccount == null) {
        console.log("Lookup table account not found!");
        process.exit(0);
    }

    // Get new market keys
    const keys = await derivePoolKeys(new PublicKey(OpenBookID));
    if (keys == null) {
        console.log("Poolkeys not found!");
        process.exit(0);
    }

    // These values vary based on the new market created
    accounts.push(
        RayLiqPoolv4,
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // token program
        keys.id, // amm id  writable
        keys.authority, // amm authority
        keys.openOrders, // amm open orders  writable
        keys.targetOrders, // amm target orders  writable
        keys.baseVault, // pool coin token account  writable  AKA baseVault
        keys.quoteVault, // pool pc token account  writable   AKA quoteVault
        keys.marketProgramId, // serum program id
        keys.marketId, //   serum market  writable
        keys.marketBids, // serum bids  writable
        keys.marketAsks, // serum asks  writable
        keys.marketEventQueue, // serum event queue  writable
        keys.marketBaseVault, // serum coin vault  writable     AKA marketBaseVault
        keys.marketQuoteVault, //   serum pc vault  writable    AKA marketQuoteVault
        keys.marketAuthority, // serum vault signer       AKA marketAuthority
        keys.ownerQuoteAta, // user source token account  writable
        keys.ownerBaseAta, // user dest token account   writable
    );

    // Loop through each keypair and push its pubkey and ATAs to the accounts array
    const keypairs = loadKeypairs();
    for (const keypair of keypairs) {
        const ataToken = await spl.getAssociatedTokenAddress(
            new PublicKey(keys.baseMint),
            keypair.publicKey,
        );
        const ataWSOL = await spl.getAssociatedTokenAddress(
            spl.NATIVE_MINT,
            keypair.publicKey,
        );
        accounts.push(keypair.publicKey, ataToken, ataWSOL);
    }

    // Push wallet and payer ATAs and pubkey JUST IN CASE (not sure tbh)
    const ataTokenwall = await spl.getAssociatedTokenAddress(
        new PublicKey(keys.baseMint),
        wallet.publicKey,
    );
    const ataWSOLwall = await spl.getAssociatedTokenAddress(
        spl.NATIVE_MINT,
        wallet.publicKey,
    ); 

    const ataTokenpayer = await spl.getAssociatedTokenAddress(
        new PublicKey(keys.baseMint),
        payer.publicKey,
    );
    const ataWSOLpayer = await spl.getAssociatedTokenAddress(
        spl.NATIVE_MINT,
        payer.publicKey,
    );    

    // Add just in case
    accounts.push(
        wallet.publicKey,
        payer.publicKey, 
        ataTokenwall, 
        ataWSOLwall, 
        ataTokenpayer,
        ataWSOLpayer,
        lut, 
        spl.NATIVE_MINT, 
        keys.baseMint,
    );  // DO NOT ADD PROGRAM OR JITO TIP ACCOUNT



    
    // -------- step 5: push LUT addresses to a txn --------
    const extendLUTixs1: TransactionInstruction[] = [];
    const extendLUTixs2: TransactionInstruction[] = [];
    const extendLUTixs3: TransactionInstruction[] = [];
    const extendLUTixs4: TransactionInstruction[] = [];

    // Chunk accounts array into groups of 30
    const accountChunks = Array.from({ length: Math.ceil(accounts.length / 30) }, (v, i) => accounts.slice(i * 30, (i + 1) * 30));
    console.log("Num of chunks:", accountChunks.length);
    console.log("Num of accounts:", accounts.length);

    for (let i = 0; i < accountChunks.length; i++) {
        const chunk = accountChunks[i];
        const extendInstruction = AddressLookupTableProgram.extendLookupTable({
            lookupTable: lut,
            authority: wallet.publicKey,
            payer: wallet.publicKey,
            addresses: chunk,
        });
        if (i == 0) {
            extendLUTixs1.push(extendInstruction);
            console.log("Chunk:", i);
        } else if (i == 1) {
            extendLUTixs2.push(extendInstruction);
            console.log("Chunk:", i);
        } else if (i == 2) {
            extendLUTixs3.push(extendInstruction);
            console.log("Chunk:", i);
        } else if (i == 3) {
            extendLUTixs4.push(extendInstruction);
            console.log("Chunk:", i);
        }
    }
    
    // Add the jito tip to the last txn
    extendLUTixs4.push(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: tipAcct,
            lamports: BigInt(jitoTipAmt),
        })
    );




    // -------- step 6: seperate into 2 different bundles to complete all txns --------
    const { blockhash: block1 } = await connection.getLatestBlockhash();

    const extend1 = await buildTxn(extendLUTixs1, block1, lookupTableAccount);
    const extend2 = await buildTxn(extendLUTixs2, block1, lookupTableAccount);
    const extend3 = await buildTxn(extendLUTixs3, block1, lookupTableAccount);
    const extend4 = await buildTxn(extendLUTixs4, block1, lookupTableAccount);

    bundledTxns1.push(
        extend1,
        extend2,
        extend3,
        extend4,
    );
    
    // Send bundle
    await sendBundle(bundledTxns1);





    // -------- step 7: reset arrays --------
    bundledTxns1.length = 0;   // Reset array
    extendLUTixs1.length = 0;   // Reset array
    extendLUTixs2.length = 0;   // Reset array
    extendLUTixs3.length = 0;   // Reset array
    extendLUTixs4.length = 0;   // Reset array

    
}




export async function createLUT() {

    // -------- step 1: ask nessesary questions for LUT build --------
    const jitoTipAmtInput = prompt('Jito tip in Sol (Ex. 0.01): ') || '0';
    const jitoTipAmt = parseFloat(jitoTipAmtInput) * LAMPORTS_PER_SOL;

    // Read existing data from poolInfo.json
    let poolInfo: { [key: string]: any } = {};
    if (fs.existsSync(keyInfoPath)) {
        const data = fs.readFileSync(keyInfoPath, 'utf-8');
        poolInfo = JSON.parse(data);
    }

    const bundledTxns: VersionedTransaction[] = [];



    // -------- step 2: create a new LUT every time there is a new launch --------
    const createLUTixs: TransactionInstruction[] = [];

    const [ create, lut ] = AddressLookupTableProgram.createLookupTable({
        authority: wallet.publicKey,
        payer: wallet.publicKey,
        recentSlot: await connection.getSlot("finalized")
    });

    createLUTixs.push(
        create
    );

    const addressesMain: PublicKey[] = [];
    createLUTixs.forEach((ixn) => {
        ixn.keys.forEach((key) => {
            addressesMain.push(key.pubkey);
        });
    });

    const lookupTablesMain1 =
        lookupTableProvider.computeIdealLookupTablesForAddresses(addressesMain);

    const { blockhash } = await connection.getLatestBlockhash();

    const messageMain1 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: createLUTixs,
    }).compileToV0Message(lookupTablesMain1);
    const createLUT = new VersionedTransaction(messageMain1);

    // Append new LUT info
    poolInfo.addressLUT = lut.toString(); // Using 'addressLUT' as the field name

    try {
        const serializedMsg = createLUT.serialize();
        console.log('Txn size:', serializedMsg.length);
        if (serializedMsg.length > 1232) {
            console.log('tx too big');
        }
        createLUT.sign([walletconn.payer]);
    } catch (e) {
        console.log(e, 'error signing createLUT');
        process.exit(0);
    }

    // Write updated content back to poolInfo.json
    fs.writeFileSync(keyInfoPath, JSON.stringify(poolInfo, null, 2));

    // Push to bundle
    bundledTxns.push(createLUT);



    // -------- step 3: add all create WSOL ATA ixs --------
    await generateWSOLATAForKeypairs();
    const wsolATATxn = await processWSOLInstructionsATA(jitoTipAmt, blockhash)
    bundledTxns.push(...wsolATATxn);



    // -------- step 4: SEND BUNDLE --------
    await sendBundle(bundledTxns);
    bundledTxns.length = 0;   // Reset array
    createLUTixs.length = 0;
    keypairWSOLATAIxs.length = 0;

}


async function buildTxn(extendLUTixs: TransactionInstruction[], blockhash: string | Blockhash, lut: AddressLookupTableAccount): Promise<VersionedTransaction> {
    const messageMain = new TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: extendLUTixs,
        }).compileToV0Message([lut]);
        const txn = new VersionedTransaction(messageMain);
    
        try {
            const serializedMsg = txn.serialize();
            console.log('Txn size:', serializedMsg.length);
            if (serializedMsg.length > 1232) {
                console.log('tx too big');
            }
            txn.sign([walletconn.payer]);
        } catch (e) {
            const serializedMsg = txn.serialize();
            console.log('txn size:', serializedMsg.length);
            console.log(e, 'error signing extendLUT');
            process.exit(0);
        }
        return txn;
}



async function sendBundle(bundledTxns: VersionedTransaction[]) {
    try {
        const bundleId = await searcherClient.sendBundle(new JitoBundle(bundledTxns, bundledTxns.length));
        console.log(`Bundle ${bundleId} sent.`);
    } catch (error) {
        const err = error as any;
        console.error("Error sending bundle:", err.message);
    
        if (err?.message?.includes('Bundle Dropped, no connected leader up soon')) {
            console.error("Error sending bundle: Bundle Dropped, no connected leader up soon.");
        } else {
            console.error("An unexpected error occurred:", err.message);
        }
    }
}

async function generateWSOLATAForKeypairs(steps: number = 27) {
    const keypairs: Keypair[] = loadKeypairs();

    // payer accounts
    const wsolataAddresspayer = await spl.getAssociatedTokenAddress(
        new PublicKey(spl.NATIVE_MINT),
        payer.publicKey,
    );
    const createWSOLAtapayer = spl.createAssociatedTokenAccountIdempotentInstruction(
        wallet.publicKey,
        wsolataAddresspayer,
        payer.publicKey,
        new PublicKey(spl.NATIVE_MINT)
    );
    keypairWSOLATAIxs.push(createWSOLAtapayer);

    for (const [index, keypair] of keypairs.entries()) {
        if (index >= steps) break;
        const wsolataAddress = await spl.getAssociatedTokenAddress(
            new PublicKey(spl.NATIVE_MINT),
            keypair.publicKey,
        );
        const createWSOLAta = spl.createAssociatedTokenAccountIdempotentInstruction(
            wallet.publicKey,
            wsolataAddress,
            keypair.publicKey,
            new PublicKey(spl.NATIVE_MINT)
        );

        keypairWSOLATAIxs.push(createWSOLAta);
        console.log(`Created WSOL ATA for Wallet ${index + 1} (${keypair.publicKey.toString()}).`);
    }
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

async function processWSOLInstructionsATA(jitoTipAmt: number, blockhash: string | Blockhash) : Promise<VersionedTransaction[]> {
    const instructionChunks = chunkArray(keypairWSOLATAIxs, 10); // Adjust the chunk size as needed
    const WSOLtxns: VersionedTransaction[] = [];

    for (let i = 0; i < instructionChunks.length; i++) {
        if (i === instructionChunks.length - 1) {
            const tipIxn = SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: tipAcct,
                lamports: BigInt(jitoTipAmt),
            });
            instructionChunks[i].push(tipIxn);
            console.log('Jito tip added :).');
        }
        const versionedTx = await createAndSignVersionedTxNOLUT(instructionChunks[i], blockhash);
        WSOLtxns.push(versionedTx);
    }

    return WSOLtxns;
}

async function createAndSignVersionedTxNOLUT(
    instructionsChunk: TransactionInstruction[], 
    blockhash: Blockhash | string,
): Promise<VersionedTransaction> {
    const addressesMain: PublicKey[] = [];
    instructionsChunk.forEach((ixn) => {
        ixn.keys.forEach((key) => {
            addressesMain.push(key.pubkey);
        });
    });

    const lookupTablesMain1 =
        lookupTableProvider.computeIdealLookupTablesForAddresses(addressesMain);

    const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: instructionsChunk,
    }).compileToV0Message(lookupTablesMain1);

    const versionedTx = new VersionedTransaction(message);
    const serializedMsg = versionedTx.serialize();

    console.log("Txn size:", serializedMsg.length);
    if (serializedMsg.length > 1232) { console.log('tx too big'); }
    versionedTx.sign([wallet]);

    /*
    // Simulate each txn
    const simulationResult = await connection.simulateTransaction(versionedTx, { commitment: "processed" });

    if (simulationResult.value.err) {
    console.log("Simulation error:", simulationResult.value.err);
    } else {
    console.log("Simulation success. Logs:");
    simulationResult.value.logs?.forEach(log => console.log(log));
    }
    */

    return versionedTx;
}

