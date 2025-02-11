import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/**
 * Prefixes a given encoder with a list of void encoders.
 * All void encoders are hidden from the returned encoder.
 */
export declare function getHiddenPrefixEncoder<TFrom>(encoder: FixedSizeEncoder<TFrom>, prefixedEncoders: readonly FixedSizeEncoder<void>[]): FixedSizeEncoder<TFrom>;
export declare function getHiddenPrefixEncoder<TFrom>(encoder: Encoder<TFrom>, prefixedEncoders: readonly Encoder<void>[]): VariableSizeEncoder<TFrom>;
/**
 * Prefixes a given decoder with a list of void decoder.
 * All void decoder are hidden from the returned decoder.
 */
export declare function getHiddenPrefixDecoder<TTo>(decoder: FixedSizeDecoder<TTo>, prefixedDecoders: readonly FixedSizeDecoder<void>[]): FixedSizeDecoder<TTo>;
export declare function getHiddenPrefixDecoder<TTo>(decoder: Decoder<TTo>, prefixedDecoders: readonly Decoder<void>[]): VariableSizeDecoder<TTo>;
/**
 * Prefixes a given codec with a list of void codec.
 * All void codec are hidden from the returned codec.
 */
export declare function getHiddenPrefixCodec<TFrom, TTo extends TFrom>(codec: FixedSizeCodec<TFrom, TTo>, prefixedCodecs: readonly FixedSizeCodec<void>[]): FixedSizeCodec<TFrom, TTo>;
export declare function getHiddenPrefixCodec<TFrom, TTo extends TFrom>(codec: Codec<TFrom, TTo>, prefixedCodecs: readonly Codec<void>[]): VariableSizeCodec<TFrom, TTo>;
//# sourceMappingURL=hidden-prefix.d.ts.map