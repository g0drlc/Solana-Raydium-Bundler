import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
import { ArrayLikeCodecSize } from './array';
/** Defines the config for set codecs. */
export type SetCodecConfig<TPrefix extends NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * The size of the set.
     * @defaultValue u32 prefix.
     */
    size?: ArrayLikeCodecSize<TPrefix>;
};
/**
 * Encodes an set of items.
 *
 * @param item - The encoder to use for the set's items.
 * @param config - A set of config for the encoder.
 */
export declare function getSetEncoder<TFrom>(item: Encoder<TFrom>, config: SetCodecConfig<NumberEncoder> & {
    size: 0;
}): FixedSizeEncoder<Set<TFrom>, 0>;
export declare function getSetEncoder<TFrom>(item: FixedSizeEncoder<TFrom>, config: SetCodecConfig<NumberEncoder> & {
    size: number;
}): FixedSizeEncoder<Set<TFrom>>;
export declare function getSetEncoder<TFrom>(item: Encoder<TFrom>, config?: SetCodecConfig<NumberEncoder>): VariableSizeEncoder<Set<TFrom>>;
/**
 * Decodes an set of items.
 *
 * @param item - The encoder to use for the set's items.
 * @param config - A set of config for the encoder.
 */
export declare function getSetDecoder<TTo>(item: Decoder<TTo>, config: SetCodecConfig<NumberDecoder> & {
    size: 0;
}): FixedSizeDecoder<Set<TTo>, 0>;
export declare function getSetDecoder<TTo>(item: FixedSizeDecoder<TTo>, config: SetCodecConfig<NumberDecoder> & {
    size: number;
}): FixedSizeDecoder<Set<TTo>>;
export declare function getSetDecoder<TTo>(item: Decoder<TTo>, config?: SetCodecConfig<NumberDecoder>): VariableSizeDecoder<Set<TTo>>;
/**
 * Creates a codec for an set of items.
 *
 * @param item - The codec to use for the set's items.
 * @param config - A set of config for the codec.
 */
export declare function getSetCodec<TFrom, TTo extends TFrom = TFrom>(item: Codec<TFrom, TTo>, config: SetCodecConfig<NumberCodec> & {
    size: 0;
}): FixedSizeCodec<Set<TFrom>, Set<TTo>, 0>;
export declare function getSetCodec<TFrom, TTo extends TFrom = TFrom>(item: FixedSizeCodec<TFrom, TTo>, config: SetCodecConfig<NumberCodec> & {
    size: number;
}): FixedSizeCodec<Set<TFrom>, Set<TTo>>;
export declare function getSetCodec<TFrom, TTo extends TFrom = TFrom>(item: Codec<TFrom, TTo>, config?: SetCodecConfig<NumberCodec>): VariableSizeCodec<Set<TFrom>, Set<TTo>>;
//# sourceMappingURL=set.d.ts.map