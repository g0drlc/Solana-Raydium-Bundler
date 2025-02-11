import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from './codec';
/**
 * Combines an encoder and a decoder into a codec.
 * The encoder and decoder must have the same fixed size, max size and description.
 * If a description is provided, it will override the encoder and decoder descriptions.
 */
export declare function combineCodec<TFrom, TTo extends TFrom, TSize extends number>(encoder: FixedSizeEncoder<TFrom, TSize>, decoder: FixedSizeDecoder<TTo, TSize>): FixedSizeCodec<TFrom, TTo, TSize>;
export declare function combineCodec<TFrom, TTo extends TFrom>(encoder: VariableSizeEncoder<TFrom>, decoder: VariableSizeDecoder<TTo>): VariableSizeCodec<TFrom, TTo>;
export declare function combineCodec<TFrom, TTo extends TFrom>(encoder: Encoder<TFrom>, decoder: Decoder<TTo>): Codec<TFrom, TTo>;
//# sourceMappingURL=combine-codec.d.ts.map