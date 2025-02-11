"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVersionedTransaction = exports.chunks = exports.isBrowser = void 0;
/**
 * Returns true if being run inside a web browser,
 * false if in a Node process or electron app.
 */
exports.isBrowser = process.env.ANCHOR_BROWSER ||
    (typeof window !== "undefined" && !((_a = window.process) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("type")));
/**
 * Splits an array into chunks
 *
 * @param array Array of objects to chunk.
 * @param size The max size of a chunk.
 * @returns A two dimensional array where each T[] length is < the provided size.
 */
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
}
exports.chunks = chunks;
/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
const isVersionedTransaction = (tx) => {
    return "version" in tx;
};
exports.isVersionedTransaction = isVersionedTransaction;
//# sourceMappingURL=common.js.map