import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { DrainOuterGeneric } from './utils';
type Fields<T> = readonly (readonly [string, T])[];
type ArrayIndices<T extends readonly unknown[]> = Exclude<Partial<T>['length'], T['length']> & number;
type GetEncoderTypeFromFields<TFields extends Fields<Encoder<any>>> = DrainOuterGeneric<{
    [I in ArrayIndices<TFields> as TFields[I][0]]: TFields[I][1] extends Encoder<infer TFrom> ? TFrom : never;
}>;
type GetDecoderTypeFromFields<TFields extends Fields<Decoder<any>>> = DrainOuterGeneric<{
    [I in ArrayIndices<TFields> as TFields[I][0]]: TFields[I][1] extends Decoder<infer TTo> ? TTo : never;
}>;
/**
 * Creates a encoder for a custom object.
 *
 * @param fields - The name and encoder of each field.
 */
export declare function getStructEncoder<const TFields extends Fields<FixedSizeEncoder<any>>>(fields: TFields): FixedSizeEncoder<GetEncoderTypeFromFields<TFields>>;
export declare function getStructEncoder<const TFields extends Fields<Encoder<any>>>(fields: TFields): VariableSizeEncoder<GetEncoderTypeFromFields<TFields>>;
/**
 * Creates a decoder for a custom object.
 *
 * @param fields - The name and decoder of each field.
 */
export declare function getStructDecoder<const TFields extends Fields<FixedSizeDecoder<any>>>(fields: TFields): FixedSizeDecoder<GetDecoderTypeFromFields<TFields>>;
export declare function getStructDecoder<const TFields extends Fields<Decoder<any>>>(fields: TFields): VariableSizeDecoder<GetDecoderTypeFromFields<TFields>>;
/**
 * Creates a codec for a custom object.
 *
 * @param fields - The name and codec of each field.
 */
export declare function getStructCodec<const TFields extends Fields<FixedSizeCodec<any>>>(fields: TFields): FixedSizeCodec<GetEncoderTypeFromFields<TFields>, GetDecoderTypeFromFields<TFields> & GetEncoderTypeFromFields<TFields>>;
export declare function getStructCodec<const TFields extends Fields<Codec<any>>>(fields: TFields): VariableSizeCodec<GetEncoderTypeFromFields<TFields>, GetDecoderTypeFromFields<TFields> & GetEncoderTypeFromFields<TFields>>;
export {};
//# sourceMappingURL=struct.d.ts.map