var _a;
/**
 * Returns true if being run inside a web browser,
 * false if in a Node process or electron app.
 */
export const isBrowser = process.env.ANCHOR_BROWSER ||
    (typeof window !== "undefined" && !((_a = window.process) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("type")));
/**
 * Splits an array into chunks
 *
 * @param array Array of objects to chunk.
 * @param size The max size of a chunk.
 * @returns A two dimensional array where each T[] length is < the provided size.
 */
export function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
}
/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
export const isVersionedTransaction = (tx) => {
    return "version" in tx;
};
//# sourceMappingURL=common.js.map