import {Keypair, PublicKey, Transaction} from '@solana/web3.js';
import {Bundle as IBundle} from '../gen/bundle';
import {Header} from '../gen/shared';
import {Packet} from '../gen/packet';
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
