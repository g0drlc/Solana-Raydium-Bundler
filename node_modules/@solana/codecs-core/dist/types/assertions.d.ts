import { ReadonlyUint8Array } from './readonly-uint8array';
/**
 * Asserts that a given byte array is not empty.
 */
export declare function assertByteArrayIsNotEmptyForCodec(codecDescription: string, bytes: ReadonlyUint8Array | Uint8Array, offset?: number): void;
/**
 * Asserts that a given byte array has enough bytes to decode.
 */
export declare function assertByteArrayHasEnoughBytesForCodec(codecDescription: string, expected: number, bytes: ReadonlyUint8Array | Uint8Array, offset?: number): void;
/**
 * Asserts that a given offset is within the byte array bounds.
 * This range is between 0 and the byte array length and is inclusive.
 * An offset equals to the byte array length is considered a valid offset
 * as it allows the post-offset of codecs to signal the end of the byte array.
 */
export declare function assertByteArrayOffsetIsNotOutOfRange(codecDescription: string, offset: number, bytesLength: number): void;
//# sourceMappingURL=assertions.d.ts.map