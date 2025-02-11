import { Transaction, VersionedTransaction } from "@solana/web3.js";
/**
 * Returns true if being run inside a web browser,
 * false if in a Node process or electron app.
 */
export declare const isBrowser: string | boolean;
/**
 * Splits an array into chunks
 *
 * @param array Array of objects to chunk.
 * @param size The max size of a chunk.
 * @returns A two dimensional array where each T[] length is < the provided size.
 */
export declare function chunks<T>(array: T[], size: number): T[][];
/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
export declare const isVersionedTransaction: (tx: Transaction | VersionedTransaction) => tx is VersionedTransaction;
//# sourceMappingURL=common.d.ts.map