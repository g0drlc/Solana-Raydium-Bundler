import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
import { ArrayLikeCodecSize } from './array';
/** Defines the config for Map codecs. */
export type MapCodecConfig<TPrefix extends NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * The size of the array.
     * @defaultValue u32 prefix.
     */
    size?: ArrayLikeCodecSize<TPrefix>;
};
/**
 * Creates a encoder for a map.
 *
 * @param key - The encoder to use for the map's keys.
 * @param value - The encoder to use for the map's values.
 * @param config - A set of config for the encoder.
 */
export declare function getMapEncoder<TFromKey, TFromValue>(key: Encoder<TFromKey>, value: Encoder<TFromValue>, config: MapCodecConfig<NumberEncoder> & {
    size: 0;
}): FixedSizeEncoder<Map<TFromKey, TFromValue>, 0>;
export declare function getMapEncoder<TFromKey, TFromValue>(key: FixedSizeEncoder<TFromKey>, value: FixedSizeEncoder<TFromValue>, config: MapCodecConfig<NumberEncoder> & {
    size: number;
}): FixedSizeEncoder<Map<TFromKey, TFromValue>>;
export declare function getMapEncoder<TFromKey, TFromValue>(key: Encoder<TFromKey>, value: Encoder<TFromValue>, config?: MapCodecConfig<NumberEncoder>): VariableSizeEncoder<Map<TFromKey, TFromValue>>;
/**
 * Creates a decoder for a map.
 *
 * @param key - The decoder to use for the map's keys.
 * @param value - The decoder to use for the map's values.
 * @param config - A set of config for the decoder.
 */
export declare function getMapDecoder<TToKey, TToValue>(key: Decoder<TToKey>, value: Decoder<TToValue>, config: MapCodecConfig<NumberDecoder> & {
    size: 0;
}): FixedSizeDecoder<Map<TToKey, TToValue>, 0>;
export declare function getMapDecoder<TToKey, TToValue>(key: FixedSizeDecoder<TToKey>, value: FixedSizeDecoder<TToValue>, config: MapCodecConfig<NumberDecoder> & {
    size: number;
}): FixedSizeDecoder<Map<TToKey, TToValue>>;
export declare function getMapDecoder<TToKey, TToValue>(key: Decoder<TToKey>, value: Decoder<TToValue>, config?: MapCodecConfig<NumberDecoder>): VariableSizeDecoder<Map<TToKey, TToValue>>;
/**
 * Creates a codec for a map.
 *
 * @param key - The codec to use for the map's keys.
 * @param value - The codec to use for the map's values.
 * @param config - A set of config for the codec.
 */
export declare function getMapCodec<TFromKey, TFromValue, TToKey extends TFromKey = TFromKey, TToValue extends TFromValue = TFromValue>(key: Codec<TFromKey, TToKey>, value: Codec<TFromValue, TToValue>, config: MapCodecConfig<NumberCodec> & {
    size: 0;
}): FixedSizeCodec<Map<TFromKey, TFromValue>, Map<TToKey, TToValue>, 0>;
export declare function getMapCodec<TFromKey, TFromValue, TToKey extends TFromKey = TFromKey, TToValue extends TFromValue = TFromValue>(key: FixedSizeCodec<TFromKey, TToKey>, value: FixedSizeCodec<TFromValue, TToValue>, config: MapCodecConfig<NumberCodec> & {
    size: number;
}): FixedSizeCodec<Map<TFromKey, TFromValue>, Map<TToKey, TToValue>>;
export declare function getMapCodec<TFromKey, TFromValue, TToKey extends TFromKey = TFromKey, TToValue extends TFromValue = TFromValue>(key: Codec<TFromKey, TToKey>, value: Codec<TFromValue, TToValue>, config?: MapCodecConfig<NumberCodec>): VariableSizeCodec<Map<TFromKey, TFromValue>, Map<TToKey, TToValue>>;
//# sourceMappingURL=map.d.ts.map