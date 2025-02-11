import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/**
 * Suffixes a given encoder with a list of void encoders.
 * All void encoders are hidden from the returned encoder.
 */
export declare function getHiddenSuffixEncoder<TFrom>(encoder: FixedSizeEncoder<TFrom>, suffixedEncoders: readonly FixedSizeEncoder<void>[]): FixedSizeEncoder<TFrom>;
export declare function getHiddenSuffixEncoder<TFrom>(encoder: Encoder<TFrom>, suffixedEncoders: readonly Encoder<void>[]): VariableSizeEncoder<TFrom>;
/**
 * Suffixes a given decoder with a list of void decoder.
 * All void decoder are hidden from the returned decoder.
 */
export declare function getHiddenSuffixDecoder<TTo>(decoder: FixedSizeDecoder<TTo>, suffixedDecoders: readonly FixedSizeDecoder<void>[]): FixedSizeDecoder<TTo>;
export declare function getHiddenSuffixDecoder<TTo>(decoder: Decoder<TTo>, suffixedDecoders: readonly Decoder<void>[]): VariableSizeDecoder<TTo>;
/**
 * Suffixes a given codec with a list of void codec.
 * All void codec are hidden from the returned codec.
 */
export declare function getHiddenSuffixCodec<TFrom, TTo extends TFrom>(codec: FixedSizeCodec<TFrom, TTo>, suffixedCodecs: readonly FixedSizeCodec<void>[]): FixedSizeCodec<TFrom, TTo>;
export declare function getHiddenSuffixCodec<TFrom, TTo extends TFrom>(codec: Codec<TFrom, TTo>, suffixedCodecs: readonly Codec<void>[]): VariableSizeCodec<TFrom, TTo>;
//# sourceMappingURL=hidden-suffix.d.ts.map