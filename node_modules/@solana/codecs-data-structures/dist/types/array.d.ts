import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
/**
 * Represents all the size options for array-like codecs
 * — i.e. `array`, `map` and `set`.
 *
 * It can be one of the following:
 * - a {@link NumberCodec} that prefixes its content with its size.
 * - a fixed number of items.
 * - or `'remainder'` to infer the number of items by dividing
 *   the rest of the byte array by the fixed size of its item.
 *   Note that this option is only available for fixed-size items.
 */
export type ArrayLikeCodecSize<TPrefix extends NumberCodec | NumberDecoder | NumberEncoder> = TPrefix | number | 'remainder';
/** Defines the configs for array codecs. */
export type ArrayCodecConfig<TPrefix extends NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * The size of the array.
     * @defaultValue u32 prefix.
     */
    size?: ArrayLikeCodecSize<TPrefix>;
};
/**
 * Encodes an array of items.
 *
 * @param item - The encoder to use for the array's items.
 * @param config - A set of config for the encoder.
 */
export declare function getArrayEncoder<TFrom>(item: Encoder<TFrom>, config: ArrayCodecConfig<NumberEncoder> & {
    size: 0;
}): FixedSizeEncoder<TFrom[], 0>;
export declare function getArrayEncoder<TFrom>(item: FixedSizeEncoder<TFrom>, config: ArrayCodecConfig<NumberEncoder> & {
    size: number;
}): FixedSizeEncoder<TFrom[]>;
export declare function getArrayEncoder<TFrom>(item: Encoder<TFrom>, config?: ArrayCodecConfig<NumberEncoder>): VariableSizeEncoder<TFrom[]>;
/**
 * Decodes an array of items.
 *
 * @param item - The encoder to use for the array's items.
 * @param config - A set of config for the encoder.
 */
export declare function getArrayDecoder<TTo>(item: Decoder<TTo>, config: ArrayCodecConfig<NumberDecoder> & {
    size: 0;
}): FixedSizeDecoder<TTo[], 0>;
export declare function getArrayDecoder<TTo>(item: FixedSizeDecoder<TTo>, config: ArrayCodecConfig<NumberDecoder> & {
    size: number;
}): FixedSizeDecoder<TTo[]>;
export declare function getArrayDecoder<TTo>(item: Decoder<TTo>, config?: ArrayCodecConfig<NumberDecoder>): VariableSizeDecoder<TTo[]>;
/**
 * Creates a codec for an array of items.
 *
 * @param item - The codec to use for the array's items.
 * @param config - A set of config for the codec.
 */
export declare function getArrayCodec<TFrom, TTo extends TFrom = TFrom>(item: Codec<TFrom, TTo>, config: ArrayCodecConfig<NumberCodec> & {
    size: 0;
}): FixedSizeCodec<TFrom[], TTo[], 0>;
export declare function getArrayCodec<TFrom, TTo extends TFrom = TFrom>(item: FixedSizeCodec<TFrom, TTo>, config: ArrayCodecConfig<NumberCodec> & {
    size: number;
}): FixedSizeCodec<TFrom[], TTo[]>;
export declare function getArrayCodec<TFrom, TTo extends TFrom = TFrom>(item: Codec<TFrom, TTo>, config?: ArrayCodecConfig<NumberCodec>): VariableSizeCodec<TFrom[], TTo[]>;
//# sourceMappingURL=array.d.ts.map