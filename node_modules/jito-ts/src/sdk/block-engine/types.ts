import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

import {Bundle as IBundle} from '../../gen/block-engine/bundle';
import {Header} from '../../gen/block-engine/shared';
import {Packet} from '../../gen/block-engine/packet';
import {serializeTransactions} from './utils';

// Represents a bundle of transactions expected to execute all or nothing, atomically and sequentially.
export class Bundle implements IBundle {
  private transactions: VersionedTransaction[];
  // Maximum number of transactions a bundle may have.
  private readonly transactionLimit: number;
  header: Header | undefined;
  packets: Packet[];

  constructor(txs: VersionedTransaction[], transactionLimit: number) {
    this.transactions = txs;
    this.transactionLimit = transactionLimit;
    this.packets = serializeTransactions(txs);
  }

  // Adds transactions to the bundle.
  addTransactions(...transactions: VersionedTransaction[]): Bundle | Error {
    const numTransactions = this.transactions.length + transactions.length;
    if (numTransactions > this.transactionLimit) {
      return new Error(
        `${numTransactions} exceeds transaction limit of ${this.transactionLimit}`
      );
    }

    this.transactions.push(...transactions);
    this.packets = this.packets.concat(serializeTransactions(transactions));

    return this;
  }

  // Creates a new transaction to tip.
  addTipTx(
    keypair: Keypair,
    tipLamports: number,
    tipAccount: PublicKey,
    recentBlockhash: string
  ): Bundle | Error {
    const numTransactions = this.transactions.length + 1;
    if (numTransactions > this.transactionLimit) {
      return new Error(
        `${numTransactions} exceeds transaction limit of ${this.transactionLimit}`
      );
    }

    const tipIx = SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: tipAccount,
      lamports: tipLamports,
    });

    const instructions = [tipIx];

    const messageV0 = new TransactionMessage({
      payerKey: keypair.publicKey,
      recentBlockhash: recentBlockhash,
      instructions,
    }).compileToV0Message();

    const tipTx = new VersionedTransaction(messageV0);

    tipTx.sign([keypair]);

    this.transactions.push(tipTx);
    this.packets = this.packets.concat(serializeTransactions([tipTx]));

    return this;
  }
}
