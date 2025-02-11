import {connection, wallet, walletconn, RayLiqPoolv4, tipAcct} from "../config";
import {
    PublicKey,
    ComputeBudgetProgram,
    VersionedTransaction,
    TransactionInstruction,
    TransactionMessage,
    SystemProgram,
    Keypair,
    LAMPORTS_PER_SOL,
    AddressLookupTableAccount
} from '@solana/web3.js';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {loadKeypairs} from './createKeys';
import {searcherClient} from "./clients/jito";
import {Bundle as JitoBundle} from 'jito-ts/dist/sdk/block-engine/types.js';
import promptSync from 'prompt-sync';
import * as spl from '@solana/spl-token';
import {IPoolKeys} from './clients/interfaces';
import {derivePoolKeys} from "./clients/poolKeysReassigned";
import path from 'path';
import fs from 'fs';

const prompt = promptSync();
const keyInfoPath = path.join(__dirname, 'keyInfo.json');

swapper();

export async function swapper() {
    const bundledTxns: VersionedTransaction[] = [];
    const keypairs: Keypair[] = loadKeypairs();

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

    // -------- step 1: ask necessary questions for pool build --------
    const OpenBookID = prompt('OpenBook MarketID: ') || '';
    const jitoTipAmtInput = prompt('Jito tip in Sol (Ex. 0.01): ') || '0';
    const jitoTipAmt = parseFloat(jitoTipAmtInput) * LAMPORTS_PER_SOL;

    // -------- step 2: create pool txn -------
    const targetMarketId = new PublicKey(OpenBookID)

    const {blockhash} = await connection.getLatestBlockhash('finalized');

    // -------- step 3: create swap txns --------
    const txMainSwaps: VersionedTransaction[] = await createWalletSwaps(
        targetMarketId,
        blockhash,
        keypairs,
        jitoTipAmt,
        lookupTableAccount,
    )
    bundledTxns.push(...txMainSwaps);

    // -------- step 4: send bundle --------
    ///*
    // Simulate each transaction
    for (const tx of bundledTxns) {
        try {
            const simulationResult = await connection.simulateTransaction(tx, {commitment: "processed"});
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
    //*/

    //await sendBundle(bundledTxns);

    bundledTxns.length = 0;   // Reset bundledTxns array
    return;
}

async function createWalletSwaps(
    marketID: PublicKey,
    blockhash: string,
    keypairs: Keypair[],
    jitoTip: number,
    lut: AddressLookupTableAccount,
): Promise<VersionedTransaction[]> {
    const txsSigned: VersionedTransaction[] = [];
    const chunkedKeypairs = chunkArray(keypairs, 7); // EDIT CHUNKS?
    const keys = await derivePoolKeys(marketID);

    // Iterate over each chunk of keypairs
    for (let chunkIndex = 0; chunkIndex < chunkedKeypairs.length; chunkIndex++) {
        const chunk = chunkedKeypairs[chunkIndex];
        const instructionsForChunk: TransactionInstruction[] = [];

        // Iterate over each keypair in the chunk to create swap instructions
        for (let i = 0; i < chunk.length; i++) {
            const keypair = chunk[i];
            console.log(`Processing keypair ${i + 1}/${chunk.length}:`, keypair.publicKey.toString());

            if (keys == null) {
                console.log("Error fetching poolkeys");
                process.exit(0);
            }

            const TokenATA = await spl.getAssociatedTokenAddress(
                new PublicKey(keys.baseMint),
                keypair.publicKey,
            );

            const wSolATA = await spl.getAssociatedTokenAddress(
                spl.NATIVE_MINT,
                keypair.publicKey,
            );

            const {buyIxs} = makeSwap(keys, wSolATA, TokenATA, true, keypair);

            instructionsForChunk.push(...buyIxs);
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
        }).compileToV0Message([lut]);

        const versionedTx = new VersionedTransaction(message);

        const serializedMsg = versionedTx.serialize();
        console.log("Txn size:", serializedMsg.length);
        if (serializedMsg.length > 1232) {
            console.log('tx too big');
        }

        console.log("Signing transaction with chunk signers", chunk.map(kp => kp.publicKey.toString()));

        for (const keypair of chunk) {
            versionedTx.sign([keypair]);
        }
        versionedTx.sign([wallet])

        txsSigned.push(versionedTx);
    }

    return txsSigned;
}

function chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({length: Math.ceil(array.length / size)}, (v, i) =>
        array.slice(i * size, i * size + size)
    );
}

async function sendBundle(bundledTxns: VersionedTransaction[]) {
    try {
        const bundleId = await searcherClient.sendBundle(new JitoBundle(bundledTxns, bundledTxns.length));
        console.log(`Bundle ${bundleId} sent.`);

        const result = await new Promise((resolve, reject) => {
            searcherClient.onBundleResult(
                (result) => {
                    console.log('Received bundle result:', result);
                    resolve(result);
                },
                (e: Error) => {
                    console.error('Error receiving bundle result:', e);
                    reject(e);
                }
            );
        });

        console.log('Result:', result);

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

function makeSwap(
    poolKeys: IPoolKeys,
    wSolATA: PublicKey,
    TokenATA: PublicKey,
    reverse: boolean,
    keypair: Keypair,
) {
    const programId = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'); // My Perogram
    const accountMetas = [
        /* account 1 */  {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
        /* account 2 */   {pubkey: poolKeys.id, isSigner: false, isWritable: true},
        /* account 3 */  {pubkey: poolKeys.authority, isSigner: false, isWritable: false},
        /* account 4 */   {pubkey: poolKeys.openOrders, isSigner: false, isWritable: true},
        /* account 5 */   {pubkey: poolKeys.targetOrders, isSigner: false, isWritable: true},
        /* account 6 */   {pubkey: poolKeys.baseVault, isSigner: false, isWritable: true},
        /* account 7 */  {pubkey: poolKeys.quoteVault, isSigner: false, isWritable: true},
        /* account 8 */   {pubkey: poolKeys.marketProgramId, isSigner: false, isWritable: false},
        /* account 9 */   {pubkey: poolKeys.marketId, isSigner: false, isWritable: true},
        /* account 10 */   {pubkey: poolKeys.marketBids, isSigner: false, isWritable: true},
        /* account 11 */   {pubkey: poolKeys.marketAsks, isSigner: false, isWritable: true},
        /* account 12 */   {pubkey: poolKeys.marketEventQueue, isSigner: false, isWritable: true},
        /* account 13 */   {pubkey: poolKeys.marketBaseVault, isSigner: false, isWritable: true},
        /* account 14 */   {pubkey: poolKeys.marketQuoteVault, isSigner: false, isWritable: true},
        /* account 15 */   {pubkey: poolKeys.marketAuthority, isSigner: false, isWritable: false},
        /* account 16 */   {pubkey: reverse ? TokenATA : wSolATA, isSigner: false, isWritable: true},
        /* account 17 */   {pubkey: reverse ? wSolATA : TokenATA, isSigner: false, isWritable: true},
        /* account 18 */   {pubkey: keypair.publicKey, isSigner: true, isWritable: true},
    ];

    const buffer = Buffer.alloc(16);
    const prefix = Buffer.from([0x09]);
    const instructionData = Buffer.concat([prefix, buffer]);

    const swap = new TransactionInstruction({
        keys: accountMetas,
        programId,
        data: instructionData
    });

    return {
        buyIxs: reverse ? [] : [swap],
        sellIxs: reverse ? [swap] : []
    };
}