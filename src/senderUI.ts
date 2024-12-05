import { Keypair, PublicKey, SystemProgram, TransactionInstruction, VersionedTransaction, LAMPORTS_PER_SOL, TransactionMessage, Blockhash } from '@solana/web3.js';
import { loadKeypairs } from './createKeys';
import { calculateTokensBoughtPercentage } from './computeLPO';
import { wallet, connection, tipAcct, payer } from '../config';
import * as spl from '@solana/spl-token';
import { searcherClient } from "./clients/jito";
import { Bundle as JitoBundle } from 'jito-ts/dist/sdk/block-engine/types.js';
import promptSync from 'prompt-sync';
import { mkMrkt } from './createMarket';
import { createLUT, extendLUT } from './createLUT';
import fs from 'fs';
import path from 'path';

const prompt = promptSync();
const keyInfoPath = path.join(__dirname, 'keyInfo.json');

let poolInfo: { [key: string]: any } = {};
    if (fs.existsSync(keyInfoPath)) {
        const data = fs.readFileSync(keyInfoPath, 'utf-8');
        poolInfo = JSON.parse(data);
    }


// Global Variables
const keypairSOLIxs: TransactionInstruction[] = [];
const keypairTOKENATAIxs: TransactionInstruction[] = [];
const keypairWSOLIxs: TransactionInstruction[] = [];
const sendTxns: VersionedTransaction[] = [];


async function generateSOLTransferForKeypairs(SendAmt: number, steps: number = 27) {
    const amount = SendAmt * LAMPORTS_PER_SOL;
    const keypairs: Keypair[] = loadKeypairs(); // Load your keypairs


    keypairs.forEach((keypair, index) => {
        if (index >= steps) return; // Ensure we only process up to 'steps' keypairs
        const transferIx = SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: keypair.publicKey,
            lamports: amount,
        });
        keypairSOLIxs.push(transferIx);
        console.log(`Transfer of ${Number(amount) / LAMPORTS_PER_SOL} SOL to Wallet ${index + 1} (${keypair.publicKey.toString()}) bundled.`);
    });
}

async function generateATAForKeypairs(baseAddr: string, steps: number = 27) {
    const keypairs: Keypair[] = loadKeypairs();

    for (const [index, keypair] of keypairs.entries()) {
        if (index >= steps) break;
        const ataAddress = await spl.getAssociatedTokenAddress(
            new PublicKey(baseAddr),
            keypair.publicKey,
        );
        const createTokenBaseAta = spl.createAssociatedTokenAccountIdempotentInstruction(
            payer.publicKey,
            ataAddress,
            keypair.publicKey,
            new PublicKey(baseAddr)
        );

        keypairTOKENATAIxs.push(createTokenBaseAta);
        console.log(`Created ATA for Wallet ${index + 1} (${keypair.publicKey.toString()}).`);
    }

    // payer accounts
    const ataAddresspayer = await spl.getAssociatedTokenAddress(
        new PublicKey(baseAddr),
        payer.publicKey,
    );
    const createAtapayer = spl.createAssociatedTokenAccountIdempotentInstruction(
        payer.publicKey,
        ataAddresspayer,
        payer.publicKey,
        new PublicKey(baseAddr)
    );
    keypairTOKENATAIxs.push(createAtapayer);
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

async function createAndSignVersionedTxWithKeypairs(
    instructionsChunk: TransactionInstruction[], 
    blockhash: Blockhash | string,
): Promise<VersionedTransaction> {
    let poolInfo: { [key: string]: any } = {};
    if (fs.existsSync(keyInfoPath)) {
        const data = fs.readFileSync(keyInfoPath, 'utf-8');
        poolInfo = JSON.parse(data);
    }

    const lut = new PublicKey(poolInfo.addressLUT.toString());

    const lookupTableAccount = (
        await connection.getAddressLookupTable(lut)
    ).value;

    if (lookupTableAccount == null) {
        console.log("Lookup table account not found!");
        process.exit(0);
    }

    const addressesMain: PublicKey[] = [];
    instructionsChunk.forEach((ixn) => {
        ixn.keys.forEach((key) => {
            addressesMain.push(key.pubkey);
        });
    });

    const message = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash,
        instructions: instructionsChunk,
    }).compileToV0Message([lookupTableAccount]);

    const versionedTx = new VersionedTransaction(message);
    const serializedMsg = versionedTx.serialize();

    console.log("Txn size:", serializedMsg.length);
    if (serializedMsg.length > 1232) { console.log('tx too big'); }
    versionedTx.sign([payer]);

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

async function processInstructionsSOL(blockhash: string | Blockhash) {
    const instructionChunks = chunkArray(keypairSOLIxs, 20); // Adjust the chunk size as needed

    for (let i = 0; i < instructionChunks.length; i++) {
        const versionedTx = await createAndSignVersionedTxWithKeypairs(instructionChunks[i], blockhash);
        sendTxns.push(versionedTx);
    }
}

async function processInstructionsATA(jitoTipAmt: number, blockhash: string | Blockhash) {
    const instructionChunks = chunkArray(keypairTOKENATAIxs, 10); // Adjust the chunk size as needed

    for (let i = 0; i < instructionChunks.length; i++) {
        if (i === instructionChunks.length - 1) {
            const tipIxn = SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: tipAcct,
                lamports: BigInt(jitoTipAmt),
            });
            instructionChunks[i].push(tipIxn);
            console.log('Jito tip added :).');
        }
        const versionedTx = await createAndSignVersionedTxWithKeypairs(instructionChunks[i], blockhash);
        sendTxns.push(versionedTx);
    }
}

async function distributeWSOL(distributeAmt: number, jitoTip: number, steps = 27) {
    const keypairs = loadKeypairs();
    const totalDistributedAmount: number = (distributeAmt * steps * (steps + 1)) / 2; // Sum of arithmetic series formula
    const totalSolRequired: number = totalDistributedAmount / LAMPORTS_PER_SOL;
    console.log(`Distributing ${totalSolRequired.toFixed(2)} SOL...`);

    const ixsTransfer: TransactionInstruction[] = [];
    
    for (let i = 0; i < Math.min(steps, keypairs.length); i++) {
      const incrementalAmount = distributeAmt * (i + 1); // Incremental amount for each step
      const keypair = keypairs[i];
      const ataAddressKeypair = await spl.getAssociatedTokenAddress(
        new PublicKey(spl.NATIVE_MINT),
        keypair.publicKey,
      );

      ixsTransfer.push(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: ataAddressKeypair,
            lamports: incrementalAmount
        }),
        spl.createSyncNativeInstruction(ataAddressKeypair),
      );
      
      console.log(`Distributed ${(incrementalAmount / LAMPORTS_PER_SOL).toFixed(2)} WSOL to Wallet ${i + 1} (${keypair.publicKey.toString()}) ATA`);
    }

    // Adding a tip transfer to the instructions
    ixsTransfer.push(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: tipAcct,
            lamports: BigInt(jitoTip),
        })
    );
    console.log("Tip pushed :)");

    const bundleTxns: VersionedTransaction[] = [];
    const chunkSize = 18; // Adjust as needed
    const ixsChunks = chunkArray(ixsTransfer, chunkSize);

    const { blockhash } = await connection.getLatestBlockhash();

    // Create and sign each chunk of instructions
    for (const chunk of ixsChunks) {
        const versionedTx = await createAndSignVersionedTxWithKeypairs(chunk, blockhash);
        bundleTxns.push(versionedTx);
    }

    // Sending the transactions
    await sendBundleWithParameters(bundleTxns);
    bundleTxns.length = 0;
    ixsTransfer.length = 0;
};

  

async function sendBundle() {
    /*
    // Simulate each transaction
    for (const tx of sendTxns) {
        try {
            const simulationResult = await connection.simulateTransaction(tx, { commitment: "processed" });

            if (simulationResult.value.err) {
                console.error("Simulation error for transaction:", simulationResult.value.err);
            } else {
                console.log("Simulation success for transaction. Logs:");
                simulationResult.value.logs?.forEach(log => console.log(log));
            }
        } catch (error) {
            console.error("Error during simulation:", error);
        }
    }
    */

    try {
        const bundleId = await searcherClient.sendBundle(new JitoBundle(sendTxns, sendTxns.length));
        console.log(`Bundle ${bundleId} sent.`);
    } catch (error) {
        const err = error as any;
        console.error("Error sending bundle:", err.message);
    
        if (err?.message?.includes('Bundle Dropped, no connected leader up soon')) {
            console.error("Error sending bundle: Bundle Dropped, no connected leader up soon.");
        } else {
            console.error("An unexpected error occurred:", err.message);
        }
    } finally {
        // Clear the arrays regardless of whether an error occurred or not
        keypairSOLIxs.length = 0; // Reset keypairIxs array
        keypairTOKENATAIxs.length = 0; // Reset keypairIxs array
        keypairWSOLIxs.length = 0; // Reset keypairIxs array
        sendTxns.length = 0;   // Reset sendTxns array
    }
}

async function sendBundleWithParameters(bundledTxns: VersionedTransaction[]) {
    /*
        // Simulate each transaction
        for (const tx of bundledTxns) {
            try {
                const simulationResult = await connection.simulateTransaction(tx, { commitment: "processed" });
                console.log(simulationResult);

                if (simulationResult.value.err) {
                    console.error("Simulation error for transaction:", simulationResult.value.err);
                } else {
                    console.log("Simulation success for transaction. Logs:");
                    simulationResult.value.logs?.forEach(log => console.log(log));
                }
            } catch (error) {
                console.error("Error during simulation:", error);
            }
        }
    */


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

async function generateATAandSOL() {
    console.log("\n!!! WARNING: SOL IS FOR TXN FEES ONLY !!!");
    const SolAmt = prompt('Sol to send (Ex. 0.005): ');
    const baseAddr = prompt('Token Address: ');
    const jitoTipAmtInput = prompt('Jito tip in Sol (Ex. 0.01): ');
    const SendAmt = parseFloat(SolAmt);
    const jitoTipAmt = parseFloat(jitoTipAmtInput) * LAMPORTS_PER_SOL;
    const { blockhash } = await connection.getLatestBlockhash();
    await generateSOLTransferForKeypairs(SendAmt);
    await generateATAForKeypairs(baseAddr);
    await processInstructionsSOL(blockhash);
    await processInstructionsATA(jitoTipAmt, blockhash);
    await sendBundle();
}

async function closeWSOLAcc(jitoTip: number) {
    const keypairs: Keypair[] = loadKeypairs();
    const txsSigned: VersionedTransaction[] = [];
    const chunkedKeypairs = chunkArray(keypairs, 7); // EDIT CHUNKS?
    const { blockhash } = await connection.getLatestBlockhash();

    // Iterate over each chunk of keypairs
    for (let chunkIndex = 0; chunkIndex < chunkedKeypairs.length; chunkIndex++) {
        const chunk = chunkedKeypairs[chunkIndex];
        const instructionsForChunk: TransactionInstruction[] = [];

        // Iterate over each keypair in the chunk to create swap instructions
        for (let i = 0; i < chunk.length; i++) {
            const keypair = chunk[i];
            console.log(`Processing keypair ${i + 1}/${chunk.length}:`, keypair.publicKey.toString());

            const ataAddressKeypair = await spl.getAssociatedTokenAddress(
                new PublicKey(spl.NATIVE_MINT),
                keypair.publicKey,
            );
    
            const closeAcctixs = spl.createCloseAccountInstruction(
                    ataAddressKeypair, // WSOL account to close
                    payer.publicKey, // Destination for remaining SOL
                    keypair.publicKey, // Owner of the WSOL account, may need to be the wallet if it's the owner
            );

            instructionsForChunk.push(closeAcctixs); // CHANGE FOR SELL (sellIxs)
        }

        if (chunkIndex === chunkedKeypairs.length - 1) {
            const tipSwapIxn = SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: tipAcct,
                lamports: BigInt(jitoTip),
            });
            instructionsForChunk.push(tipSwapIxn);
            console.log('Jito tip added :).');
        }

        const message = new TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: instructionsForChunk,
        }).compileToV0Message();

        const versionedTx = new VersionedTransaction(message);

        const serializedMsg = versionedTx.serialize();
        console.log("Txn size:", serializedMsg.length);
        if (serializedMsg.length > 1232) { console.log('tx too big'); }
        
        console.log("Signing transaction with chunk signers", chunk.map(kp => kp.publicKey.toString()));
        
        versionedTx.sign([wallet]);

        for (const keypair of chunk) {
            versionedTx.sign([keypair]);
        }   


        txsSigned.push(versionedTx);
    }

    await sendBundleWithParameters(txsSigned);
}

export async function sender() {
    let running = true;

    while (running) {
        console.log("\nBuyer UI:");
        console.log("1. Create Market (0.3 SOL)");
        console.log("2. Create LUT and WSOL ATAs Bundle");
        console.log("3. Extend LUT Bundle");
        console.log("4. Create ATAs and Send SOL Bundle");
        console.log("5. Simulate LP Buys (Get exact amounts)");
        console.log("6. Send WSOL Bundle");
        console.log("7. Close WSOL Accounts to deployer");

        const answer = prompt("Choose an option or 'exit': "); // Use prompt-sync for user input

        switch (answer) {
            case '1':
                await mkMrkt();
                break;
            case '2':
                await createLUT();
                break;
            case '3':
                await extendLUT();
                break;
            case '4':
                await generateATAandSOL();
                break;
            case '5':
                await calculateTokensBoughtPercentage();
                break;
            case '6':
                const initialBuyAmt = prompt('Distribute amount increment (Ex: 0.05): ');
                const initAmt = parseFloat(initialBuyAmt) * LAMPORTS_PER_SOL;
                const jitoTipIn = prompt('Jito tip in Sol (Ex. 0.01): ');
                const TipAmt = parseFloat(jitoTipIn) * LAMPORTS_PER_SOL;
                await distributeWSOL(initAmt, TipAmt);
                break;
            case '7':
                const jitotp = prompt('Jito tip in Sol (Ex. 0.01): ');
                const TipAmtjito = parseFloat(jitotp) * LAMPORTS_PER_SOL;
                await closeWSOLAcc(TipAmtjito);
                break;
            case 'exit':
                running = false;
                break;
            default:
                console.log("Invalid option, please choose again.");
        }
    }

    console.log("Exiting...");
}


