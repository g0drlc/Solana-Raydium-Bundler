import { Codec, Decoder, Encoder, FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from './codec';
import { ReadonlyUint8Array } from './readonly-uint8array';
/**
 * Converts an encoder A to a encoder B by mapping their values.
 */
export declare function transformEncoder<TOldFrom, TNewFrom, TSize extends number>(encoder: FixedSizeEncoder<TOldFrom, TSize>, unmap: (value: TNewFrom) => TOldFrom): FixedSizeEncoder<TNewFrom, TSize>;
export declare function transformEncoder<TOldFrom, TNewFrom>(encoder: VariableSizeEncoder<TOldFrom>, unmap: (value: TNewFrom) => TOldFrom): VariableSizeEncoder<TNewFrom>;
export declare function transformEncoder<TOldFrom, TNewFrom>(encoder: Encoder<TOldFrom>, unmap: (value: TNewFrom) => TOldFrom): Encoder<TNewFrom>;
/**
 * Converts an decoder A to a decoder B by mapping their values.
 */
export declare function transformDecoder<TOldTo, TNewTo, TSize extends number>(decoder: FixedSizeDecoder<TOldTo, TSize>, map: (value: TOldTo, bytes: ReadonlyUint8Array | Uint8Array, offset: number) => TNewTo): FixedSizeDecoder<TNewTo, TSize>;
export declare function transformDecoder<TOldTo, TNewTo>(decoder: VariableSizeDecoder<TOldTo>, map: (value: TOldTo, bytes: ReadonlyUint8Array | Uint8Array, offset: number) => TNewTo): VariableSizeDecoder<TNewTo>;
export declare function transformDecoder<TOldTo, TNewTo>(decoder: Decoder<TOldTo>, map: (value: TOldTo, bytes: ReadonlyUint8Array | Uint8Array, offset: number) => TNewTo): Decoder<TNewTo>;
/**
 * Converts a codec A to a codec B by mapping their values.
 */
export declare function transformCodec<TOldFrom, TNewFrom, TTo extends TNewFrom & TOldFrom, TSize extends number>(codec: FixedSizeCodec<TOldFrom, TTo, TSize>, unmap: (value: TNewFrom) => TOldFrom): FixedSizeCodec<TNewFrom, TTo, TSize>;
export declare function transformCodec<TOldFrom, TNewFrom, TTo extends TNewFrom & TOldFrom>(codec: VariableSizeCodec<TOldFrom, TTo>, unmap: (value: TNewFrom) => TOldFrom): VariableSizeCodec<TNewFrom, TTo>;
export declare function transformCodec<TOldFrom, TNewFrom, TTo extends TNewFrom & TOldFrom>(codec: Codec<TOldFrom, TTo>, unmap: (value: TNewFrom) => TOldFrom): Codec<TNewFrom, TTo>;
export declare function transformCodec<TOldFrom, TNewFrom, TOldTo extends TOldFrom, TNewTo extends TNewFrom, TSize extends number>(codec: FixedSizeCodec<TOldFrom, TOldTo, TSize>, unmap: (value: TNewFrom) => TOldFrom, map: (value: TOldTo, bytes: ReadonlyUint8Array | Uint8Array, offset: number) => TNewTo): FixedSizeCodec<TNewFrom, TNewTo, TSize>;
export declare function transformCodec<TOldFrom, TNewFrom, TOldTo extends TOldFrom, TNewTo extends TNewFrom>(codec: VariableSizeCodec<TOldFrom, TOldTo>, unmap: (value: TNewFrom) => TOldFrom, map: (value: TOldTo, bytes: ReadonlyUint8Array | Uint8Array, offset: number) => TNewTo): VariableSizeCodec<TNewFrom, TNewTo>;
export declare function transformCodec<TOldFrom, TNewFrom, TOldTo extends TOldFrom, TNewTo extends TNewFrom>(codec: Codec<TOldFrom, TOldTo>, unmap: (value: TNewFrom) => TOldFrom, map: (value: TOldTo, bytes: ReadonlyUint8Array | Uint8Array, offset: number) => TNewTo): Codec<TNewFrom, TNewTo>;
//# sourceMappingURL=transform-codec.d.ts.map