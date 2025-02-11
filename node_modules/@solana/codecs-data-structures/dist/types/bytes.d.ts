import { ReadonlyUint8Array, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/**
 * Encodes byte arrays as provided.
 *
 * To control the size of the encoded byte array, you can use
 * the `fixEncoderSize` or `addEncoderSizePrefix` functions.
 */
export declare function getBytesEncoder(): VariableSizeEncoder<ReadonlyUint8Array | Uint8Array>;
/**
 * Decodes byte arrays as-is.
 *
 * To control the size of the decoded byte array, you can use
 * the `fixDecoderSize` or `addDecoderSizePrefix` functions.
 */
export declare function getBytesDecoder(): VariableSizeDecoder<ReadonlyUint8Array>;
/**
 * Creates a sized bytes codec.
 *
 * To control the size of the encoded and decoded byte arrays,
 * you can use the `fixCodecSize` or `addCodecSizePrefix` functions.
 */
export declare function getBytesCodec(): VariableSizeCodec<ReadonlyUint8Array | Uint8Array, ReadonlyUint8Array>;
//# sourceMappingURL=bytes.d.ts.map