import { VersionedTransaction } from '@solana/web3.js';
import { Packet } from '../../gen/block-engine/packet';
export declare const unixTimestampFromDate: (date: Date) => number;
export declare const deserializeTransactions: (packets: Packet[]) => VersionedTransaction[];
export declare const serializeTransactions: (txs: VersionedTransaction[]) => Packet[];
export declare const isError: <T>(value: Error | T) => value is Error;
