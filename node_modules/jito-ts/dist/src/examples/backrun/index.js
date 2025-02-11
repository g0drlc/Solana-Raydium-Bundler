'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
require('dotenv').config();
const web3_js_1 = require('@solana/web3.js');
const Fs = require('fs');
const searcher_1 = require('../../sdk/searcher');
const utils_1 = require('./utils');
const main = async () => {
  const blockEngineUrl = process.env.BLOCK_ENGINE_URL || '';
  console.log('BLOCK_ENGINE_URL:', blockEngineUrl);
  const authKeypairPath = process.env.AUTH_KEYPAIR_PATH || '';
  console.log('AUTH_KEYPAIR_PATH:', authKeypairPath);
  const decodedKey = new Uint8Array(
    JSON.parse(Fs.readFileSync(authKeypairPath).toString())
  );
  const keypair = web3_js_1.Keypair.fromSecretKey(decodedKey);
  const _accounts = process.env.ACCOUNTS_OF_INTEREST || '';
  console.log('ACCOUNTS_OF_INTEREST:', _accounts);
  const accounts = _accounts.split(',');
  const bundleTransactionLimit = parseInt(
    process.env.BUNDLE_TRANSACTION_LIMIT || '0'
  );
  const c = (0, searcher_1.searcherClient)(blockEngineUrl, keypair);
  const rpcUrl = process.env.RPC_URL || '';
  console.log('RPC_URL:', rpcUrl);
  const conn = new web3_js_1.Connection(rpcUrl, 'confirmed');
  await (0, utils_1.onPendingTransactions)(
    c,
    accounts,
    bundleTransactionLimit,
    keypair,
    conn
  );
  (0, utils_1.onBundleResult)(c);
};
main()
  .then(() => {
    console.log('Back running:', process.env.ACCOUNTS_OF_INTEREST);
  })
  .catch(e => {
    throw e;
  });
//# sourceMappingURL=index.js.map
