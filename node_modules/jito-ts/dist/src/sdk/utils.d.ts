import {Transaction} from '@solana/web3.js';
import {Packet} from '../gen/packet';
export declare const unixTimestampFromDate: (date: Date) => number;
export declare const deserializeTransactions: (
  packets: Packet[]
) => Transaction[];
export declare const serializeTransactions: (txs: Transaction[]) => Packet[];
export declare const isError: <T>(value: Error | T) => value is Error;
