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
//# sourceMappingURL=common.d.ts.map