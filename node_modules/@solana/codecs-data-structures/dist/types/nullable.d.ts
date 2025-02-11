import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, ReadonlyUint8Array, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { FixedSizeNumberCodec, FixedSizeNumberDecoder, FixedSizeNumberEncoder, NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
/** Defines the config for nullable codecs. */
export type NullableCodecConfig<TPrefix extends NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * Defines how the `None` (or `null`) value should be represented.
     *
     * By default, no none value is used. This means a `null` value will be
     * represented by the absence of the item.
     *
     * When `'zeroes'` is provided, a `null` value will skip the bytes that would
     * have been used for the item. Note that this returns a fixed-size codec
     * and thus will only work if the item codec is of fixed size.
     *
     * When a custom byte array is provided, a `null` value will be represented
     * by the provided byte array. Note that this returns a variable-size codec
     * since the byte array representing `null` does not need to match the size
     * of the item codec.
     *
     * @defaultValue No none value is used.
     */
    noneValue?: ReadonlyUint8Array | 'zeroes';
    /**
     * The codec to use for the boolean prefix, if any.
     *
     * By default a `u8` number is used as a prefix to determine if the value is `null`.
     * The value `0` is encoded for `null` and `1` if the value is present.
     * This can be set to any number codec to customize the prefix.
     *
     * When `null` is provided, no prefix is used and the `noneValue` is used to
     * determine if the value is `null`. If no `noneValue` is provided, then the
     * absence of any bytes is used to determine if the value is `null`.
     *
     * @defaultValue `u8` prefix.
     */
    prefix?: TPrefix | null;
};
/**
 * Creates a encoder for an optional value using `null` as the `None` value.
 *
 * @param item - The encoder to use for the value that may be present.
 * @param config - A set of config for the encoder.
 */
export declare function getNullableEncoder<TFrom, TSize extends number>(item: FixedSizeEncoder<TFrom, TSize>, config: NullableCodecConfig<NumberEncoder> & {
    noneValue: 'zeroes';
    prefix: null;
}): FixedSizeEncoder<TFrom | null, TSize>;
export declare function getNullableEncoder<TFrom>(item: FixedSizeEncoder<TFrom>, config: NullableCodecConfig<FixedSizeNumberEncoder> & {
    noneValue: 'zeroes';
}): FixedSizeEncoder<TFrom | null>;
export declare function getNullableEncoder<TFrom>(item: FixedSizeEncoder<TFrom>, config: NullableCodecConfig<NumberEncoder> & {
    noneValue: 'zeroes';
}): VariableSizeEncoder<TFrom | null>;
export declare function getNullableEncoder<TFrom>(item: Encoder<TFrom>, config?: NullableCodecConfig<NumberEncoder> & {
    noneValue?: ReadonlyUint8Array;
}): VariableSizeEncoder<TFrom | null>;
/**
 * Creates a decoder for an optional value using `null` as the `None` value.
 *
 * @param item - The decoder to use for the value that may be present.
 * @param config - A set of config for the decoder.
 */
export declare function getNullableDecoder<TTo, TSize extends number>(item: FixedSizeDecoder<TTo, TSize>, config: NullableCodecConfig<NumberDecoder> & {
    noneValue: 'zeroes';
    prefix: null;
}): FixedSizeDecoder<TTo | null, TSize>;
export declare function getNullableDecoder<TTo>(item: FixedSizeDecoder<TTo>, config: NullableCodecConfig<FixedSizeNumberDecoder> & {
    noneValue: 'zeroes';
}): FixedSizeDecoder<TTo | null>;
export declare function getNullableDecoder<TTo>(item: FixedSizeDecoder<TTo>, config: NullableCodecConfig<NumberDecoder> & {
    noneValue: 'zeroes';
}): VariableSizeDecoder<TTo | null>;
export declare function getNullableDecoder<TTo>(item: Decoder<TTo>, config?: NullableCodecConfig<NumberDecoder> & {
    noneValue?: ReadonlyUint8Array;
}): VariableSizeDecoder<TTo | null>;
/**
 * Creates a codec for an optional value using `null` as the `None` value.
 *
 * @param item - The codec to use for the value that may be present.
 * @param config - A set of config for the codec.
 */
export declare function getNullableCodec<TFrom, TTo extends TFrom, TSize extends number>(item: FixedSizeCodec<TFrom, TTo, TSize>, config: NullableCodecConfig<NumberCodec> & {
    noneValue: 'zeroes';
    prefix: null;
}): FixedSizeCodec<TFrom | null, TTo | null, TSize>;
export declare function getNullableCodec<TFrom, TTo extends TFrom = TFrom>(item: FixedSizeCodec<TFrom, TTo>, config: NullableCodecConfig<FixedSizeNumberCodec> & {
    noneValue: 'zeroes';
}): FixedSizeCodec<TFrom | null, TTo | null>;
export declare function getNullableCodec<TFrom, TTo extends TFrom = TFrom>(item: FixedSizeCodec<TFrom, TTo>, config: NullableCodecConfig<NumberCodec> & {
    noneValue: 'zeroes';
}): VariableSizeCodec<TFrom | null, TTo | null>;
export declare function getNullableCodec<TFrom, TTo extends TFrom = TFrom>(item: Codec<TFrom, TTo>, config?: NullableCodecConfig<NumberCodec> & {
    noneValue?: ReadonlyUint8Array;
}): VariableSizeCodec<TFrom | null, TTo | null>;
//# sourceMappingURL=nullable.d.ts.map