"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const web3_js_1 = require("@solana/web3.js");
const Fs = __importStar(require("fs"));
const searcher_1 = require("../../sdk/block-engine/searcher");
const utils_1 = require("./utils");
const main = async () => {
    const blockEngineUrl = process.env.BLOCK_ENGINE_URL || '';
    console.log('BLOCK_ENGINE_URL:', blockEngineUrl);
    const authKeypairPath = process.env.AUTH_KEYPAIR_PATH || '';
    console.log('AUTH_KEYPAIR_PATH:', authKeypairPath);
    const decodedKey = new Uint8Array(JSON.parse(Fs.readFileSync(authKeypairPath).toString()));
    const keypair = web3_js_1.Keypair.fromSecretKey(decodedKey);
    const _accounts = (process.env.ACCOUNTS_OF_INTEREST || '').split(',');
    console.log('ACCOUNTS_OF_INTEREST:', _accounts);
    const accounts = _accounts.map(a => new web3_js_1.PublicKey(a));
    const bundleTransactionLimit = parseInt(process.env.BUNDLE_TRANSACTION_LIMIT || '0');
    const c = (0, searcher_1.searcherClient)(blockEngineUrl, keypair);
    const rpcUrl = process.env.RPC_URL || '';
    console.log('RPC_URL:', rpcUrl);
    const conn = new web3_js_1.Connection(rpcUrl, 'confirmed');
    await (0, utils_1.onAccountUpdates)(c, accounts, [], bundleTransactionLimit, keypair, conn);
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