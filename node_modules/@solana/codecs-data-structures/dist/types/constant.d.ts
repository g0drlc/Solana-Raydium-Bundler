import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, ReadonlyUint8Array } from '@solana/codecs-core';
/**
 * Creates a void encoder that always sets the provided byte array when encoding.
 */
export declare function getConstantEncoder<TConstant extends ReadonlyUint8Array>(constant: TConstant): FixedSizeEncoder<void, TConstant['length']>;
/**
 * Creates a void decoder that reads the next bytes and fails if they do not match the provided constant.
 */
export declare function getConstantDecoder<TConstant extends ReadonlyUint8Array>(constant: TConstant): FixedSizeDecoder<void, TConstant['length']>;
/**
 * Creates a void codec that always sets the provided byte array
 * when encoding and, when decoding, asserts that the next
 * bytes match the provided byte array.
 */
export declare function getConstantCodec<TConstant extends ReadonlyUint8Array>(constant: TConstant): FixedSizeCodec<void, void, TConstant['length']>;
//# sourceMappingURL=constant.d.ts.map