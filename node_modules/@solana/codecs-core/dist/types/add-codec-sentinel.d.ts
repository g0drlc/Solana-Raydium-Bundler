import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from './codec';
import { ReadonlyUint8Array } from './readonly-uint8array';
/**
 * Creates an encoder that writes a `Uint8Array` sentinel after the encoded value.
 * This is useful to delimit the encoded value when being read by a decoder.
 *
 * Note that, if the sentinel is found in the encoded value, an error is thrown.
 */
export declare function addEncoderSentinel<TFrom>(encoder: FixedSizeEncoder<TFrom>, sentinel: ReadonlyUint8Array): FixedSizeEncoder<TFrom>;
export declare function addEncoderSentinel<TFrom>(encoder: Encoder<TFrom>, sentinel: ReadonlyUint8Array): VariableSizeEncoder<TFrom>;
/**
 * Creates a decoder that continues reading until a `Uint8Array` sentinel is found.
 *
 * If the sentinel is not found in the byte array to decode, an error is thrown.
 */
export declare function addDecoderSentinel<TTo>(decoder: FixedSizeDecoder<TTo>, sentinel: ReadonlyUint8Array): FixedSizeDecoder<TTo>;
export declare function addDecoderSentinel<TTo>(decoder: Decoder<TTo>, sentinel: ReadonlyUint8Array): VariableSizeDecoder<TTo>;
/**
 * Creates a Codec that writes a `Uint8Array` sentinel after the encoded
 * value and, when decoding, continues reading until the sentinel is found.
 *
 * Note that, if the sentinel is found in the encoded value
 * or not found in the byte array to decode, an error is thrown.
 */
export declare function addCodecSentinel<TFrom, TTo extends TFrom>(codec: FixedSizeCodec<TFrom, TTo>, sentinel: ReadonlyUint8Array): FixedSizeCodec<TFrom, TTo>;
export declare function addCodecSentinel<TFrom, TTo extends TFrom>(codec: Codec<TFrom, TTo>, sentinel: ReadonlyUint8Array): VariableSizeCodec<TFrom, TTo>;
//# sourceMappingURL=add-codec-sentinel.d.ts.map