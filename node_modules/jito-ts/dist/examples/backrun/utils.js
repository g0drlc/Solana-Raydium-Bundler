"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onBundleResult = exports.onAccountUpdates = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../sdk/block-engine/types");
const utils_1 = require("../../sdk/block-engine/utils");
const MEMO_PROGRAM_ID = 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo';
const onAccountUpdates = async (c, accounts, regions, bundleTransactionLimit, keypair, conn) => {
    const _tipAccount = (await c.getTipAccounts())[0];
    console.log('tip account:', _tipAccount);
    const tipAccount = new web3_js_1.PublicKey(_tipAccount);
    c.onAccountUpdate(accounts, regions, async (transactions) => {
        console.log(`received ${transactions.length} transactions`);
        const resp = await conn.getLatestBlockhash('processed');
        const bundles = transactions.map(tx => {
            const b = new types_1.Bundle([tx], bundleTransactionLimit);
            let maybeBundle = b.addTransactions(buildMemoTransaction(keypair, resp.blockhash));
            if ((0, utils_1.isError)(maybeBundle)) {
                throw maybeBundle;
            }
            maybeBundle = maybeBundle.addTipTx(keypair, 100000000, tipAccount, resp.blockhash);
            if ((0, utils_1.isError)(maybeBundle)) {
                throw maybeBundle;
            }
            return maybeBundle;
        });
        bundles.map(async (b) => {
            try {
                const resp = await c.sendBundle(b);
                console.log('resp:', resp);
            }
            catch (e) {
                console.error('error sending bundle:', e);
            }
        });
    }, (e) => {
        throw e;
    });
};
exports.onAccountUpdates = onAccountUpdates;
const onBundleResult = (c) => {
    c.onBundleResult(result => {
        console.log('received bundle result:', result);
    }, e => {
        throw e;
    });
};
exports.onBundleResult = onBundleResult;
const buildMemoTransaction = (keypair, recentBlockhash) => {
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
    const instructions = [ix];
    const messageV0 = new web3_js_1.TransactionMessage({
        payerKey: keypair.publicKey,
        recentBlockhash: recentBlockhash,
        instructions,
    }).compileToV0Message();
    const tx = new web3_js_1.VersionedTransaction(messageV0);
    tx.sign([keypair]);
    return tx;
};
//# sourceMappingURL=utils.js.map