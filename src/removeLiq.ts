import fs from 'fs';
import path from 'path';
import assert from 'assert';
import * as readline from 'readline';
import { BN } from 'bn.js';
import {
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  TokenAmount,
  TOKEN_PROGRAM_ID,
  Token,
  TxVersion,
  SPL_ACCOUNT_LAYOUT,
  TokenAccount,
  LOOKUP_TABLE_CACHE,
  InnerTransaction,
  CacheLTA,
  getMultipleLookupTableInfo,
  InnerSimpleTransaction,
  InnerSimpleV0Transaction,
} from '@raydium-io/raydium-sdk';
import { 
    Keypair, 
    Signer, 
    PublicKey, 
    Connection, 
    VersionedTransaction, 
    SystemProgram, 
    TransactionMessage, 
    TransactionInstruction, 
    Transaction, 
    AddressLookupTableAccount, 
    Blockhash,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  connection,
  wallet,
  tipAcct
} from '../config';
import { formatAmmKeysById } from './clients/formatAmmKeysById';
import { derivePoolKeys } from "./clients/poolKeysReassigned"; 
import promptSync from 'prompt-sync';
import { searcherClient } from "./clients/jito";
import { Bundle as JitoBundle } from 'jito-ts/dist/sdk/block-engine/types.js';
import * as spl from '@solana/spl-token';


const prompt = promptSync();


type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  removeLpTokenAmount: TokenAmount
  targetPool: string
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}

async function ammRemoveLiquidity(input: TestTxInputInfo, jitoTip: number) {
    const bundledTxns: VersionedTransaction[] = [];
    const targetPoolInfo = await formatAmmKeysById(input.targetPool)
    assert(targetPoolInfo, 'cannot find the target pool')


    const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
    const { innerTransactions } = await Liquidity.makeRemoveLiquidityInstructionSimple({
        connection,
        poolKeys,
        userKeys: {
            owner: input.wallet.publicKey,
            payer: input.wallet.publicKey,
            tokenAccounts: input.walletTokenAccounts,
        },
        amountIn: input.removeLpTokenAmount,
        makeTxVersion: TxVersion.V0,
    })

    const { blockhash } = await connection.getLatestBlockhash('finalized');

    const willSendTx = await buildSimpleTransaction({
        innerTransactions: innerTransactions,
        recentBlockhash: blockhash,
        addLookupTableInfo: LOOKUP_TABLE_CACHE
    });

    bundledTxns.push(...willSendTx);

    const tipSwapIxn = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: tipAcct,
        lamports: BigInt(jitoTip),
    });
    
    console.log('Jito tip added :).');
    
    const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: [tipSwapIxn],
    }).compileToV0Message();

    const tipTxn = new VersionedTransaction(message);
    tipTxn.sign([wallet]);

    bundledTxns.push(tipTxn);


    // SEND BUNDLEEEE
    await sendBundle(bundledTxns);
    bundledTxns.length = 0;
}

export async function remove() {
  const configPath = path.join(__dirname, 'keyInfo.json'); 
  const configFile = fs.readFileSync(configPath); 
  const config = JSON.parse(configFile.toString('utf-8')); 

  const lpTokenAddr = config.lpTokenAddr;
  const targetPool = config.targetPool;
  const OpenBookID = new PublicKey(config.marketID);

  const jitoTipAmt = parseFloat(prompt('Jito tip in Sol (Ex. 0.01): ') || '0') * LAMPORTS_PER_SOL;

  const keys = await derivePoolKeys(OpenBookID);


  const lpToken = new Token(TOKEN_PROGRAM_ID, new PublicKey(lpTokenAddr), keys?.baseDecimals);
  const lpATA = await spl.getAssociatedTokenAddress(
    new PublicKey(lpTokenAddr),
    wallet.publicKey,
  );
  const lpBalance = await connection.getTokenAccountBalance(lpATA);

  const removeLpTokenAmount = new TokenAmount(lpToken, lpBalance.value.amount, true)
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

  try {
    await ammRemoveLiquidity(
        {
            removeLpTokenAmount,
            targetPool,
            walletTokenAccounts,
            wallet: wallet,
        },
        jitoTipAmt
    )
  } catch (error) {
    console.error('An error occurred:', error);
  }
}


export async function getWalletTokenAccount(connection: Connection, wallet: PublicKey): Promise<TokenAccount[]> {
    const walletTokenAccount = await connection.getTokenAccountsByOwner(wallet, {
        programId: TOKEN_PROGRAM_ID,
    });
    return walletTokenAccount.value.map((i) => ({
        pubkey: i.pubkey,
        programId: i.account.owner,
        accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
    }));
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

async function buildSimpleTransaction({
    innerTransactions,
    recentBlockhash,
    addLookupTableInfo,
  }: {
    innerTransactions: InnerSimpleTransaction[]
    recentBlockhash: string | Blockhash
    addLookupTableInfo?: CacheLTA | undefined
  }): Promise<VersionedTransaction[]> {
  
    const txList: VersionedTransaction[] = []
    console.log('innerLen:', innerTransactions.length);
    for (const itemIx of innerTransactions) {
      txList.push(
        _makeTransaction({
          instructions: itemIx.instructions,
          recentBlockhash,
          signers: itemIx.signers,
          lookupTableInfos: Object.values({
            ...(addLookupTableInfo ?? {}),
            ...((itemIx as InnerSimpleV0Transaction).lookupTableAddress ?? {}),
          }),
        }),
      )
    }
    return txList
}
  
function _makeTransaction({
    instructions,
    recentBlockhash,
    signers,
    lookupTableInfos,
  }: {
    instructions: TransactionInstruction[]
    recentBlockhash: string | Blockhash
    signers: (Signer | Keypair)[]
    lookupTableInfos?: AddressLookupTableAccount[]
  }): VersionedTransaction {
      const transactionMessage = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash,
        instructions,
      })
      const itemV = new VersionedTransaction(transactionMessage.compileToV0Message(lookupTableInfos))
      itemV.sign(signers)
      itemV.sign([wallet])
      return itemV
}
