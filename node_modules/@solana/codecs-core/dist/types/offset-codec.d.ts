import { Codec, Decoder, Encoder, Offset } from './codec';
import { ReadonlyUint8Array } from './readonly-uint8array';
type AnyEncoder = Encoder<any>;
type AnyDecoder = Decoder<any>;
type AnyCodec = Codec<any>;
type OffsetConfig = {
    postOffset?: PostOffsetFunction;
    preOffset?: PreOffsetFunction;
};
type PreOffsetFunctionScope = {
    /** The entire byte array. */
    bytes: ReadonlyUint8Array | Uint8Array;
    /** The original offset prior to encode or decode. */
    preOffset: Offset;
    /** Wraps the offset to the byte array length. */
    wrapBytes: (offset: Offset) => Offset;
};
type PreOffsetFunction = (scope: PreOffsetFunctionScope) => Offset;
type PostOffsetFunction = (scope: PreOffsetFunctionScope & {
    /** The modified offset used to encode or decode. */
    newPreOffset: Offset;
    /** The original offset returned by the encoder or decoder. */
    postOffset: Offset;
}) => Offset;
/**
 * Moves the offset of a given encoder.
 */
export declare function offsetEncoder<TEncoder extends AnyEncoder>(encoder: TEncoder, config: OffsetConfig): TEncoder;
/**
 * Moves the offset of a given decoder.
 */
export declare function offsetDecoder<TDecoder extends AnyDecoder>(decoder: TDecoder, config: OffsetConfig): TDecoder;
/**
 * Moves the offset of a given codec.
 */
export declare function offsetCodec<TCodec extends AnyCodec>(codec: TCodec, config: OffsetConfig): TCodec;
export {};
//# sourceMappingURL=offset-codec.d.ts.map