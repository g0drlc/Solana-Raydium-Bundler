import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, ReadonlyUint8Array, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { FixedSizeNumberCodec, FixedSizeNumberDecoder, FixedSizeNumberEncoder, NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
import { Option, OptionOrNullable } from './option';
/** Defines the config for Option codecs. */
export type OptionCodecConfig<TPrefix extends NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * Defines how the `None` value should be represented.
     *
     * By default, no none value is used. This means a `None` value will be
     * represented by the absence of the item.
     *
     * When `'zeroes'` is provided, a `None` value will skip the bytes that would
     * have been used for the item. Note that this returns a fixed-size codec
     * and thus will only work if the item codec is of fixed size.
     *
     * When a custom byte array is provided, a `None` value will be represented
     * by the provided byte array. Note that this returns a variable-size codec
     * since the byte array representing `None` does not need to match the size
     * of the item codec.
     *
     * @defaultValue No none value is used.
     */
    noneValue?: ReadonlyUint8Array | 'zeroes';
    /**
     * The codec to use for the boolean prefix, if any.
     *
     * By default a `u8` number is used as a prefix to determine if the value is `None`.
     * The value `0` is encoded for `None` and `1` if the value is present.
     * This can be set to any number codec to customize the prefix.
     *
     * When `null` is provided, no prefix is used and the `noneValue` is used to
     * determine if the value is `None`. If no `noneValue` is provided, then the
     * absence of any bytes is used to determine if the value is `None`.
     *
     * @defaultValue `u8` prefix.
     */
    prefix?: TPrefix | null;
};
/**
 * Creates a encoder for an optional value using the `Option<T>` type.
 *
 * @param item - The encoder to use for the value that may be present.
 * @param config - A set of config for the encoder.
 */
export declare function getOptionEncoder<TFrom, TSize extends number>(item: FixedSizeEncoder<TFrom, TSize>, config: OptionCodecConfig<NumberEncoder> & {
    noneValue: 'zeroes';
    prefix: null;
}): FixedSizeEncoder<OptionOrNullable<TFrom>, TSize>;
export declare function getOptionEncoder<TFrom>(item: FixedSizeEncoder<TFrom>, config: OptionCodecConfig<FixedSizeNumberEncoder> & {
    noneValue: 'zeroes';
}): FixedSizeEncoder<OptionOrNullable<TFrom>>;
export declare function getOptionEncoder<TFrom>(item: FixedSizeEncoder<TFrom>, config: OptionCodecConfig<NumberEncoder> & {
    noneValue: 'zeroes';
}): VariableSizeEncoder<OptionOrNullable<TFrom>>;
export declare function getOptionEncoder<TFrom>(item: Encoder<TFrom>, config?: OptionCodecConfig<NumberEncoder> & {
    noneValue?: ReadonlyUint8Array;
}): VariableSizeEncoder<OptionOrNullable<TFrom>>;
/**
 * Creates a decoder for an optional value using the `Option<T>` type.
 *
 * @param item - The decoder to use for the value that may be present.
 * @param config - A set of config for the decoder.
 */
export declare function getOptionDecoder<TTo, TSize extends number>(item: FixedSizeDecoder<TTo, TSize>, config: OptionCodecConfig<NumberDecoder> & {
    noneValue: 'zeroes';
    prefix: null;
}): FixedSizeDecoder<Option<TTo>, TSize>;
export declare function getOptionDecoder<TTo>(item: FixedSizeDecoder<TTo>, config: OptionCodecConfig<FixedSizeNumberDecoder> & {
    noneValue: 'zeroes';
}): FixedSizeDecoder<Option<TTo>>;
export declare function getOptionDecoder<TTo>(item: FixedSizeDecoder<TTo>, config: OptionCodecConfig<NumberDecoder> & {
    noneValue: 'zeroes';
}): VariableSizeDecoder<Option<TTo>>;
export declare function getOptionDecoder<TTo>(item: Decoder<TTo>, config?: OptionCodecConfig<NumberDecoder> & {
    noneValue?: ReadonlyUint8Array;
}): VariableSizeDecoder<Option<TTo>>;
/**
 * Creates a codec for an optional value using the `Option<T>` type.
 *
 * @param item - The codec to use for the value that may be present.
 * @param config - A set of config for the codec.
 */
export declare function getOptionCodec<TFrom, TTo extends TFrom, TSize extends number>(item: FixedSizeCodec<TFrom, TTo, TSize>, config: OptionCodecConfig<NumberCodec> & {
    noneValue: 'zeroes';
    prefix: null;
}): FixedSizeCodec<OptionOrNullable<TFrom>, Option<TTo>, TSize>;
export declare function getOptionCodec<TFrom, TTo extends TFrom = TFrom>(item: FixedSizeCodec<TFrom, TTo>, config: OptionCodecConfig<FixedSizeNumberCodec> & {
    noneValue: 'zeroes';
}): FixedSizeCodec<OptionOrNullable<TFrom>, Option<TTo>>;
export declare function getOptionCodec<TFrom, TTo extends TFrom = TFrom>(item: FixedSizeCodec<TFrom, TTo>, config: OptionCodecConfig<NumberCodec> & {
    noneValue: 'zeroes';
}): VariableSizeCodec<OptionOrNullable<TFrom>, Option<TTo>>;
export declare function getOptionCodec<TFrom, TTo extends TFrom = TFrom>(item: Codec<TFrom, TTo>, config?: OptionCodecConfig<NumberCodec> & {
    noneValue?: ReadonlyUint8Array;
}): VariableSizeCodec<OptionOrNullable<TFrom>, Option<TTo>>;
//# sourceMappingURL=option-codec.d.ts.map