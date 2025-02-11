import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { DrainOuterGeneric } from './utils';
type GetEncoderTypeFromItems<TItems extends readonly Encoder<any>[]> = DrainOuterGeneric<{
    [I in keyof TItems]: TItems[I] extends Encoder<infer TFrom> ? TFrom : never;
}>;
type GetDecoderTypeFromItems<TItems extends readonly Decoder<any>[]> = DrainOuterGeneric<{
    [I in keyof TItems]: TItems[I] extends Decoder<infer TTo> ? TTo : never;
}>;
/**
 * Creates a encoder for a tuple-like array.
 *
 * @param items - The encoders to use for each item in the tuple.
 */
export declare function getTupleEncoder<const TItems extends readonly FixedSizeEncoder<any>[]>(items: TItems): FixedSizeEncoder<GetEncoderTypeFromItems<TItems>>;
export declare function getTupleEncoder<const TItems extends readonly Encoder<any>[]>(items: TItems): VariableSizeEncoder<GetEncoderTypeFromItems<TItems>>;
/**
 * Creates a decoder for a tuple-like array.
 *
 * @param items - The decoders to use for each item in the tuple.
 */
export declare function getTupleDecoder<const TItems extends readonly FixedSizeDecoder<any>[]>(items: TItems): FixedSizeDecoder<GetDecoderTypeFromItems<TItems>>;
export declare function getTupleDecoder<const TItems extends readonly Decoder<any>[]>(items: TItems): VariableSizeDecoder<GetDecoderTypeFromItems<TItems>>;
/**
 * Creates a codec for a tuple-like array.
 *
 * @param items - The codecs to use for each item in the tuple.
 */
export declare function getTupleCodec<const TItems extends readonly FixedSizeCodec<any>[]>(items: TItems): FixedSizeCodec<GetEncoderTypeFromItems<TItems>, GetDecoderTypeFromItems<TItems> & GetEncoderTypeFromItems<TItems>>;
export declare function getTupleCodec<const TItems extends readonly Codec<any>[]>(items: TItems): VariableSizeCodec<GetEncoderTypeFromItems<TItems>, GetDecoderTypeFromItems<TItems> & GetEncoderTypeFromItems<TItems>>;
export {};
//# sourceMappingURL=tuple.d.ts.map