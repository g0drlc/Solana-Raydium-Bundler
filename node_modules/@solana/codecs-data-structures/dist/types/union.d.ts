import { Codec, Decoder, Encoder, Offset, ReadonlyUint8Array } from '@solana/codecs-core';
import { DrainOuterGeneric } from './utils';
type GetEncoderTypeFromVariants<TVariants extends readonly Encoder<any>[]> = DrainOuterGeneric<{
    [I in keyof TVariants]: TVariants[I] extends Encoder<infer TFrom> ? TFrom : never;
}>[number];
type GetDecoderTypeFromVariants<TVariants extends readonly Decoder<any>[]> = DrainOuterGeneric<{
    [I in keyof TVariants]: TVariants[I] extends Decoder<infer TFrom> ? TFrom : never;
}>[number];
/**
 * Creates a union encoder from the provided array of encoder.
 *
 * @param variants - The variant encoders of the union.
 * @param getIndexFromValue - A function that returns the index of the variant from the provided value.
 */
export declare function getUnionEncoder<const TVariants extends readonly Encoder<any>[]>(variants: TVariants, getIndexFromValue: (value: GetEncoderTypeFromVariants<TVariants>) => number): Encoder<GetEncoderTypeFromVariants<TVariants>>;
/**
 * Creates a union decoder from the provided array of decoder.
 *
 * @param variants - The variant decoders of the union.
 * @param getIndexFromBytes - A function that returns the index of the variant from the byte array.
 */
export declare function getUnionDecoder<const TVariants extends readonly Decoder<any>[]>(variants: TVariants, getIndexFromBytes: (bytes: ReadonlyUint8Array, offset: Offset) => number): Decoder<GetDecoderTypeFromVariants<TVariants>>;
/**
 * Creates a union codec from the provided array of codec.
 *
 * @param variants - The variant codecs of the union.
 * @param getIndexFromValue - A function that returns the index of the variant from the provided value.
 * @param getIndexFromBytes - A function that returns the index of the variant from the byte array.
 */
export declare function getUnionCodec<const TVariants extends readonly Codec<any>[]>(variants: TVariants, getIndexFromValue: (value: GetEncoderTypeFromVariants<TVariants>) => number, getIndexFromBytes: (bytes: ReadonlyUint8Array, offset: Offset) => number): Codec<GetEncoderTypeFromVariants<TVariants>, GetDecoderTypeFromVariants<TVariants> & GetEncoderTypeFromVariants<TVariants>>;
export {};
//# sourceMappingURL=union.d.ts.map