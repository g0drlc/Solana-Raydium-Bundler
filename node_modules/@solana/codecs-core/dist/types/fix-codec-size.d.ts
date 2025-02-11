import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from './codec';
/**
 * Creates a fixed-size encoder from a given encoder.
 *
 * @param encoder - The encoder to wrap into a fixed-size encoder.
 * @param fixedBytes - The fixed number of bytes to write.
 */
export declare function fixEncoderSize<TFrom, TSize extends number>(encoder: Encoder<TFrom>, fixedBytes: TSize): FixedSizeEncoder<TFrom, TSize>;
/**
 * Creates a fixed-size decoder from a given decoder.
 *
 * @param decoder - The decoder to wrap into a fixed-size decoder.
 * @param fixedBytes - The fixed number of bytes to read.
 */
export declare function fixDecoderSize<TTo, TSize extends number>(decoder: Decoder<TTo>, fixedBytes: TSize): FixedSizeDecoder<TTo, TSize>;
/**
 * Creates a fixed-size codec from a given codec.
 *
 * @param codec - The codec to wrap into a fixed-size codec.
 * @param fixedBytes - The fixed number of bytes to read/write.
 */
export declare function fixCodecSize<TFrom, TTo extends TFrom, TSize extends number>(codec: Codec<TFrom, TTo>, fixedBytes: TSize): FixedSizeCodec<TFrom, TTo, TSize>;
//# sourceMappingURL=fix-codec-size.d.ts.map