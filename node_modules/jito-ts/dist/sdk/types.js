'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.Bundle = void 0;
const web3_js_1 = require('@solana/web3.js');
const utils_1 = require('./utils');
// Represents a bundle of transactions expected to execute all or nothing, atomically and sequentially.
class Bundle {
  constructor(txs, transactionLimit) {
    this.transactions = txs;
    this.transactionLimit = transactionLimit;
    this.packets = (0, utils_1.serializeTransactions)(txs);
  }
  // Adds signed transactions to the bundle. Filters out any txs failing signature verification.
  addSignedTransactions(...signedTransactions) {
    const numTransactions =
      this.transactions.length + signedTransactions.length;
    if (numTransactions > this.transactionLimit) {
      return new Error(
        `${numTransactions} exceeds transaction limit of ${this.transactionLimit}`
      );
    }
    // TODO: Is this expensive?
    if (this.transactions.some(tx => !tx.verifySignatures())) {
      return new Error('Some transaction failed signature verification');
    }
    this.transactions.push(...signedTransactions);
    this.packets = this.packets.concat(
      (0, utils_1.serializeTransactions)(signedTransactions)
    );
    return this;
  }
  // Attaches a tip instruction to an existing transaction if provided otherwise creates a new transaction to tip.
  attachTip(
    keypair,
    tipLamports,
    tipAccount,
    recentBlockhash,
    lastValidBlockHeight,
    tx
  ) {
    const numTransactions = this.transactions.length + 1;
    if (numTransactions > this.transactionLimit) {
      return new Error(
        `${numTransactions} exceeds transaction limit of ${this.transactionLimit}`
      );
    }
    const tipIx = web3_js_1.SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: tipAccount,
      lamports: tipLamports,
    });
    let tipTx;
    if (!tx) {
      tipTx = new web3_js_1.Transaction();
    } else {
      tipTx = tx;
    }
    tipTx.add(tipIx);
    tipTx.recentBlockhash = recentBlockhash;
    tipTx.lastValidBlockHeight = lastValidBlockHeight;
    tipTx.sign({
      publicKey: keypair.publicKey,
      secretKey: keypair.secretKey,
    });
    this.transactions.push(tipTx);
    this.packets = this.packets.concat(
      (0, utils_1.serializeTransactions)([tipTx])
    );
    return this;
  }
}
exports.Bundle = Bundle;
//# sourceMappingURL=types.js.map
