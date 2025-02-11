import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from './codec';
/**
 * Reverses the bytes of a fixed-size encoder.
 */
export declare function reverseEncoder<TFrom, TSize extends number>(encoder: FixedSizeEncoder<TFrom, TSize>): FixedSizeEncoder<TFrom, TSize>;
/**
 * Reverses the bytes of a fixed-size decoder.
 */
export declare function reverseDecoder<TTo, TSize extends number>(decoder: FixedSizeDecoder<TTo, TSize>): FixedSizeDecoder<TTo, TSize>;
/**
 * Reverses the bytes of a fixed-size codec.
 */
export declare function reverseCodec<TFrom, TTo extends TFrom, TSize extends number>(codec: FixedSizeCodec<TFrom, TTo, TSize>): FixedSizeCodec<TFrom, TTo, TSize>;
//# sourceMappingURL=reverse-codec.d.ts.map