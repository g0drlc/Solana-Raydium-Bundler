'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.onBundleResult = exports.onPendingTransactions = void 0;
const web3_js_1 = require('@solana/web3.js');
const types_1 = require('../../sdk/types');
const utils_1 = require('../../sdk/utils');
const MEMO_PROGRAM_ID = 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo';
const onPendingTransactions = async (
  c,
  accounts,
  bundleTransactionLimit,
  keypair,
  conn
) => {
  const _tipAccount = (await c.getTipAccounts())[0];
  console.log('tip account:', _tipAccount);
  const tipAccount = new web3_js_1.PublicKey(_tipAccount);
  c.onPendingTransactions(
    accounts,
    async transactions => {
      console.log(`received ${transactions.length} transactions`);
      const resp = await conn.getLatestBlockhash('processed');
      const bundles = transactions.map(tx => {
        const b = new types_1.Bundle([tx], bundleTransactionLimit);
        let maybeBundle = b.addSignedTransactions(
          buildMemoTransaction(
            keypair,
            resp.blockhash,
            resp.lastValidBlockHeight
          )
        );
        if ((0, utils_1.isError)(maybeBundle)) {
          throw maybeBundle;
        }
        maybeBundle = maybeBundle.attachTip(
          keypair,
          100000000,
          tipAccount,
          resp.blockhash,
          resp.lastValidBlockHeight
        );
        if ((0, utils_1.isError)(maybeBundle)) {
          throw maybeBundle;
        }
        return maybeBundle;
      });
      bundles.map(async b => {
        try {
          const resp = await c.sendBundle(b);
          console.log('resp:', resp);
        } catch (e) {
          console.log('error:', e);
        }
      });
    },
    e => {
      throw e;
    }
  );
};
exports.onPendingTransactions = onPendingTransactions;
const onBundleResult = c => {
  c.onBundleResult(
    result => {
      console.log('received bundle result:', result);
    },
    e => {
      throw e;
    }
  );
};
exports.onBundleResult = onBundleResult;
const buildMemoTransaction = (
  keypair,
  recentBlockhash,
  lastValidBlockHeight
) => {
  const ix = new web3_js_1.TransactionInstruction({
    keys: [
      {
        pubkey: keypair.publicKey,
        isSigner: true,
        isWritable: true,
      },
    ],
    programId: new web3_js_1.PublicKey(MEMO_PROGRAM_ID),
    data: Buffer.from('Jito Backrun'),
  });
  const tx = new web3_js_1.Transaction();
  tx.recentBlockhash = recentBlockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.add(ix);
  tx.sign({
    publicKey: keypair.publicKey,
    secretKey: keypair.secretKey,
  });
  return tx;
};
//# sourceMappingURL=utils.js.map
