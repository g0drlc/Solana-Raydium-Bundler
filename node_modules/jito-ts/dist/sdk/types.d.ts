import {Keypair, PublicKey, Transaction} from '@solana/web3.js';
import {Bundle as IBundle} from '../gen/block-engine/bundle';
import {Header} from '../gen/block-engine/shared';
import {Packet} from '../gen/block-engine/packet';
export declare class Bundle implements IBundle {
  private transactions;
  private readonly transactionLimit;
  header: Header | undefined;
  packets: Packet[];
  constructor(txs: Transaction[], transactionLimit: number);
  addSignedTransactions(...signedTransactions: Transaction[]): Bundle | Error;
  attachTip(
    keypair: Keypair,
    tipLamports: number,
    tipAccount: PublicKey,
    recentBlockhash: string,
    lastValidBlockHeight: number,
    tx?: Transaction
  ): Bundle | Error;
}
