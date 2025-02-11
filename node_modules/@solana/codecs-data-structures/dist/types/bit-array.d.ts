import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
/** Defines the config for bitArray codecs. */
export type BitArrayCodecConfig = {
    /**
     * Whether to read the bits in reverse order.
     * @defaultValue `false`
     */
    backward?: boolean;
};
/**
 * Encodes an array of booleans into bits.
 *
 * @param size - The amount of bytes to use for the bit array.
 * @param config - A set of config for the encoder.
 */
export declare function getBitArrayEncoder<TSize extends number>(size: TSize, config?: BitArrayCodecConfig | boolean): FixedSizeEncoder<boolean[], TSize>;
/**
 * Decodes bits into an array of booleans.
 *
 * @param size - The amount of bytes to use for the bit array.
 * @param config - A set of config for the decoder.
 */
export declare function getBitArrayDecoder<TSize extends number>(size: TSize, config?: BitArrayCodecConfig | boolean): FixedSizeDecoder<boolean[], TSize>;
/**
 * An array of boolean codec that converts booleans to bits and vice versa.
 *
 * @param size - The amount of bytes to use for the bit array.
 * @param config - A set of config for the codec.
 */
export declare function getBitArrayCodec<TSize extends number>(size: TSize, config?: BitArrayCodecConfig | boolean): FixedSizeCodec<boolean[], boolean[], TSize>;
//# sourceMappingURL=bit-array.d.ts.map