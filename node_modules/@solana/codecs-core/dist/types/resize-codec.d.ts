import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from './codec';
type AnyEncoder = Encoder<any>;
type AnyDecoder = Decoder<any>;
type AnyCodec = Codec<any>;
/**
 * Updates the size of a given encoder.
 */
export declare function resizeEncoder<TFrom, TSize extends number, TNewSize extends number>(encoder: FixedSizeEncoder<TFrom, TSize>, resize: (size: TSize) => TNewSize): FixedSizeEncoder<TFrom, TNewSize>;
export declare function resizeEncoder<TEncoder extends AnyEncoder>(encoder: TEncoder, resize: (size: number) => number): TEncoder;
/**
 * Updates the size of a given decoder.
 */
export declare function resizeDecoder<TFrom, TSize extends number, TNewSize extends number>(decoder: FixedSizeDecoder<TFrom, TSize>, resize: (size: TSize) => TNewSize): FixedSizeDecoder<TFrom, TNewSize>;
export declare function resizeDecoder<TDecoder extends AnyDecoder>(decoder: TDecoder, resize: (size: number) => number): TDecoder;
/**
 * Updates the size of a given codec.
 */
export declare function resizeCodec<TFrom, TTo extends TFrom, TSize extends number, TNewSize extends number>(codec: FixedSizeCodec<TFrom, TTo, TSize>, resize: (size: TSize) => TNewSize): FixedSizeCodec<TFrom, TTo, TNewSize>;
export declare function resizeCodec<TCodec extends AnyCodec>(codec: TCodec, resize: (size: number) => number): TCodec;
export {};
//# sourceMappingURL=resize-codec.d.ts.map