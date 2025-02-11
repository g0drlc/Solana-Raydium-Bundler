import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from './codec';
type NumberEncoder = Encoder<bigint | number> | Encoder<number>;
type FixedSizeNumberEncoder<TSize extends number = number> = FixedSizeEncoder<bigint | number, TSize> | FixedSizeEncoder<number, TSize>;
type NumberDecoder = Decoder<bigint> | Decoder<number>;
type FixedSizeNumberDecoder<TSize extends number = number> = FixedSizeDecoder<bigint, TSize> | FixedSizeDecoder<number, TSize>;
type NumberCodec = Codec<bigint | number, bigint> | Codec<number>;
type FixedSizeNumberCodec<TSize extends number = number> = FixedSizeCodec<bigint | number, bigint, TSize> | FixedSizeCodec<number, number, TSize>;
/**
 * Stores the size of the `encoder` in bytes as a prefix using the `prefix` encoder.
 */
export declare function addEncoderSizePrefix<TFrom>(encoder: FixedSizeEncoder<TFrom>, prefix: FixedSizeNumberEncoder): FixedSizeEncoder<TFrom>;
export declare function addEncoderSizePrefix<TFrom>(encoder: Encoder<TFrom>, prefix: NumberEncoder): VariableSizeEncoder<TFrom>;
/**
 * Bounds the size of the `decoder` by reading the `prefix` encoder prefix.
 */
export declare function addDecoderSizePrefix<TTo>(decoder: FixedSizeDecoder<TTo>, prefix: FixedSizeNumberDecoder): FixedSizeDecoder<TTo>;
export declare function addDecoderSizePrefix<TTo>(decoder: Decoder<TTo>, prefix: NumberDecoder): VariableSizeDecoder<TTo>;
/**
 * Bounds the size of the `codec` using the provided `prefix` codec prefix.
 */
export declare function addCodecSizePrefix<TFrom, TTo extends TFrom>(codec: FixedSizeCodec<TFrom, TTo>, prefix: FixedSizeNumberCodec): FixedSizeCodec<TFrom, TTo>;
export declare function addCodecSizePrefix<TFrom, TTo extends TFrom>(codec: Codec<TFrom, TTo>, prefix: NumberCodec): VariableSizeCodec<TFrom, TTo>;
export {};
//# sourceMappingURL=add-codec-size-prefix.d.ts.map