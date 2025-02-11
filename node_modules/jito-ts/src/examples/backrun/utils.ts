import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

import {SearcherClient} from '../../sdk/block-engine/searcher';
import {Bundle} from '../../sdk/block-engine/types';
import {isError} from '../../sdk/block-engine/utils';

const MEMO_PROGRAM_ID = 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo';

export const onAccountUpdates = async (
  c: SearcherClient,
  accounts: PublicKey[],
  regions: string[],
  bundleTransactionLimit: number,
  keypair: Keypair,
  conn: Connection
) => {
  const _tipAccount = (await c.getTipAccounts())[0];
  console.log('tip account:', _tipAccount);
  const tipAccount = new PublicKey(_tipAccount);
  c.onAccountUpdate(
    accounts,
    regions,
    async (transactions: VersionedTransaction[]) => {
      console.log(`received ${transactions.length} transactions`);

      const resp = await conn.getLatestBlockhash('processed');

      const bundles = transactions.map(tx => {
        const b = new Bundle([tx], bundleTransactionLimit);

        let maybeBundle = b.addTransactions(
          buildMemoTransaction(keypair, resp.blockhash)
        );
        if (isError(maybeBundle)) {
          throw maybeBundle;
        }

        maybeBundle = maybeBundle.addTipTx(
          keypair,
          100_000_000,
          tipAccount,
          resp.blockhash
        );

        if (isError(maybeBundle)) {
          throw maybeBundle;
        }

        return maybeBundle;
      });

      bundles.map(async b => {
        try {
          const resp = await c.sendBundle(b);
          console.log('resp:', resp);
        } catch (e) {
          console.error('error sending bundle:', e);
        }
      });
    },
    (e: Error) => {
      throw e;
    }
  );
};

export const onBundleResult = (c: SearcherClient) => {
  c.onBundleResult(
    result => {
      console.log('received bundle result:', result);
    },
    e => {
      throw e;
    }
  );
};

const buildMemoTransaction = (
  keypair: Keypair,
  recentBlockhash: string
): VersionedTransaction => {
  const ix = new TransactionInstruction({
    keys: [
      {
        pubkey: keypair.publicKey,
        isSigner: true,
        isWritable: true,
      },
    ],
    programId: new PublicKey(MEMO_PROGRAM_ID),
    data: Buffer.from('Jito Backrun'),
  });

  const instructions = [ix];

  const messageV0 = new TransactionMessage({
    payerKey: keypair.publicKey,
    recentBlockhash: recentBlockhash,
    instructions,
  }).compileToV0Message();

  const tx = new VersionedTransaction(messageV0);

  tx.sign([keypair]);

  return tx;
};
