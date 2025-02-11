"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bundle = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
// Represents a bundle of transactions expected to execute all or nothing, atomically and sequentially.
class Bundle {
    constructor(txs, transactionLimit) {
        this.transactions = txs;
        this.transactionLimit = transactionLimit;
        this.packets = (0, utils_1.serializeTransactions)(txs);
    }
    // Adds transactions to the bundle.
    addTransactions(...transactions) {
        const numTransactions = this.transactions.length + transactions.length;
        if (numTransactions > this.transactionLimit) {
            return new Error(`${numTransactions} exceeds transaction limit of ${this.transactionLimit}`);
        }
        this.transactions.push(...transactions);
        this.packets = this.packets.concat((0, utils_1.serializeTransactions)(transactions));
        return this;
    }
    // Creates a new transaction to tip.
    addTipTx(keypair, tipLamports, tipAccount, recentBlockhash) {
        const numTransactions = this.transactions.length + 1;
        if (numTransactions > this.transactionLimit) {
            return new Error(`${numTransactions} exceeds transaction limit of ${this.transactionLimit}`);
        }
        const tipIx = web3_js_1.SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: tipAccount,
            lamports: tipLamports,
        });
        const instructions = [tipIx];
        const messageV0 = new web3_js_1.TransactionMessage({
            payerKey: keypair.publicKey,
            recentBlockhash: recentBlockhash,
            instructions,
        }).compileToV0Message();
        const tipTx = new web3_js_1.VersionedTransaction(messageV0);
        tipTx.sign([keypair]);
        this.transactions.push(tipTx);
        this.packets = this.packets.concat((0, utils_1.serializeTransactions)([tipTx]));
        return this;
    }
}
exports.Bundle = Bundle;
//# sourceMappingURL=types.js.map