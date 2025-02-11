import { ReadonlyUint8Array } from './readonly-uint8array';
/**
 * Concatenates an array of `Uint8Array`s into a single `Uint8Array`.
 * Reuses the original byte array when applicable.
 */
export declare const mergeBytes: (byteArrays: Uint8Array[]) => Uint8Array;
/**
 * Pads a `Uint8Array` with zeroes to the specified length.
 * If the array is longer than the specified length, it is returned as-is.
 */
export declare const padBytes: (bytes: ReadonlyUint8Array | Uint8Array, length: number) => ReadonlyUint8Array | Uint8Array;
/**
 * Fixes a `Uint8Array` to the specified length.
 * If the array is longer than the specified length, it is truncated.
 * If the array is shorter than the specified length, it is padded with zeroes.
 */
export declare const fixBytes: (bytes: ReadonlyUint8Array | Uint8Array, length: number) => ReadonlyUint8Array | Uint8Array;
/**
 * Returns true if and only if the provided `data` byte array contains
 * the provided `bytes` byte array at the specified `offset`.
 */
export declare function containsBytes(data: ReadonlyUint8Array | Uint8Array, bytes: ReadonlyUint8Array | Uint8Array, offset: number): boolean;
//# sourceMappingURL=bytes.d.ts.map