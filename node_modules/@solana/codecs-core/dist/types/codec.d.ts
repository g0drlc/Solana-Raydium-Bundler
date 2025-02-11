import { ReadonlyUint8Array } from './readonly-uint8array';
/**
 * Defines an offset in bytes.
 */
export type Offset = number;
type BaseEncoder<TFrom> = {
    /** Encode the provided value and return the encoded bytes directly. */
    readonly encode: (value: TFrom) => ReadonlyUint8Array;
    /**
     * Writes the encoded value into the provided byte array at the given offset.
     * Returns the offset of the next byte after the encoded value.
     */
    readonly write: (value: TFrom, bytes: Uint8Array, offset: Offset) => Offset;
};
export type FixedSizeEncoder<TFrom, TSize extends number = number> = BaseEncoder<TFrom> & {
    /** The fixed size of the encoded value in bytes. */
    readonly fixedSize: TSize;
};
export type VariableSizeEncoder<TFrom> = BaseEncoder<TFrom> & {
    /** The total size of the encoded value in bytes. */
    readonly getSizeFromValue: (value: TFrom) => number;
    /** The maximum size an encoded value can be in bytes, if applicable. */
    readonly maxSize?: number;
};
/**
 * An object that can encode a value to a `Uint8Array`.
 */
export type Encoder<TFrom> = FixedSizeEncoder<TFrom> | VariableSizeEncoder<TFrom>;
type BaseDecoder<TTo> = {
    /** Decodes the provided byte array at the given offset (or zero) and returns the value directly. */
    readonly decode: (bytes: ReadonlyUint8Array | Uint8Array, offset?: Offset) => TTo;
    /**
     * Reads the encoded value from the provided byte array at the given offset.
     * Returns the decoded value and the offset of the next byte after the encoded value.
     */
    readonly read: (bytes: ReadonlyUint8Array | Uint8Array, offset: Offset) => [TTo, Offset];
};
export type FixedSizeDecoder<TTo, TSize extends number = number> = BaseDecoder<TTo> & {
    /** The fixed size of the encoded value in bytes. */
    readonly fixedSize: TSize;
};
export type VariableSizeDecoder<TTo> = BaseDecoder<TTo> & {
    /** The maximum size an encoded value can be in bytes, if applicable. */
    readonly maxSize?: number;
};
/**
 * An object that can decode a value from a `Uint8Array`.
 */
export type Decoder<TTo> = FixedSizeDecoder<TTo> | VariableSizeDecoder<TTo>;
export type FixedSizeCodec<TFrom, TTo extends TFrom = TFrom, TSize extends number = number> = FixedSizeDecoder<TTo, TSize> & FixedSizeEncoder<TFrom, TSize>;
export type VariableSizeCodec<TFrom, TTo extends TFrom = TFrom> = VariableSizeDecoder<TTo> & VariableSizeEncoder<TFrom>;
/**
 * An object that can encode and decode a value to and from a `Uint8Array`.
 * It supports encoding looser types than it decodes for convenience.
 * For example, a `bigint` encoder will always decode to a `bigint`
 * but can be used to encode a `number`.
 *
 * @typeParam TFrom - The type of the value to encode.
 * @typeParam TTo - The type of the decoded value. Defaults to `TFrom`.
 */
export type Codec<TFrom, TTo extends TFrom = TFrom> = FixedSizeCodec<TFrom, TTo> | VariableSizeCodec<TFrom, TTo>;
/**
 * Get the encoded size of a given value in bytes.
 */
export declare function getEncodedSize<TFrom>(value: TFrom, encoder: {
    fixedSize: number;
} | {
    getSizeFromValue: (value: TFrom) => number;
}): number;
/** Fills the missing `encode` function using the existing `write` function. */
export declare function createEncoder<TFrom, TSize extends number>(encoder: Omit<FixedSizeEncoder<TFrom, TSize>, 'encode'>): FixedSizeEncoder<TFrom, TSize>;
export declare function createEncoder<TFrom>(encoder: Omit<VariableSizeEncoder<TFrom>, 'encode'>): VariableSizeEncoder<TFrom>;
export declare function createEncoder<TFrom>(encoder: Omit<FixedSizeEncoder<TFrom>, 'encode'> | Omit<VariableSizeEncoder<TFrom>, 'encode'>): Encoder<TFrom>;
/** Fills the missing `decode` function using the existing `read` function. */
export declare function createDecoder<TTo, TSize extends number>(decoder: Omit<FixedSizeDecoder<TTo, TSize>, 'decode'>): FixedSizeDecoder<TTo, TSize>;
export declare function createDecoder<TTo>(decoder: Omit<VariableSizeDecoder<TTo>, 'decode'>): VariableSizeDecoder<TTo>;
export declare function createDecoder<TTo>(decoder: Omit<FixedSizeDecoder<TTo>, 'decode'> | Omit<VariableSizeDecoder<TTo>, 'decode'>): Decoder<TTo>;
/** Fills the missing `encode` and `decode` function using the existing `write` and `read` functions. */
export declare function createCodec<TFrom, TTo extends TFrom = TFrom, TSize extends number = number>(codec: Omit<FixedSizeCodec<TFrom, TTo, TSize>, 'decode' | 'encode'>): FixedSizeCodec<TFrom, TTo, TSize>;
export declare function createCodec<TFrom, TTo extends TFrom = TFrom>(codec: Omit<VariableSizeCodec<TFrom, TTo>, 'decode' | 'encode'>): VariableSizeCodec<TFrom, TTo>;
export declare function createCodec<TFrom, TTo extends TFrom = TFrom>(codec: Omit<FixedSizeCodec<TFrom, TTo>, 'decode' | 'encode'> | Omit<VariableSizeCodec<TFrom, TTo>, 'decode' | 'encode'>): Codec<TFrom, TTo>;
export declare function isFixedSize<TFrom, TSize extends number>(encoder: FixedSizeEncoder<TFrom, TSize> | VariableSizeEncoder<TFrom>): encoder is FixedSizeEncoder<TFrom, TSize>;
export declare function isFixedSize<TTo, TSize extends number>(decoder: FixedSizeDecoder<TTo, TSize> | VariableSizeDecoder<TTo>): decoder is FixedSizeDecoder<TTo, TSize>;
export declare function isFixedSize<TFrom, TTo extends TFrom, TSize extends number>(codec: FixedSizeCodec<TFrom, TTo, TSize> | VariableSizeCodec<TFrom, TTo>): codec is FixedSizeCodec<TFrom, TTo, TSize>;
export declare function isFixedSize<TSize extends number>(codec: {
    fixedSize: TSize;
} | {
    maxSize?: number;
}): codec is {
    fixedSize: TSize;
};
export declare function assertIsFixedSize<TFrom, TSize extends number>(encoder: FixedSizeEncoder<TFrom, TSize> | VariableSizeEncoder<TFrom>): asserts encoder is FixedSizeEncoder<TFrom, TSize>;
export declare function assertIsFixedSize<TTo, TSize extends number>(decoder: FixedSizeDecoder<TTo, TSize> | VariableSizeDecoder<TTo>): asserts decoder is FixedSizeDecoder<TTo, TSize>;
export declare function assertIsFixedSize<TFrom, TTo extends TFrom, TSize extends number>(codec: FixedSizeCodec<TFrom, TTo, TSize> | VariableSizeCodec<TFrom, TTo>): asserts codec is FixedSizeCodec<TFrom, TTo, TSize>;
export declare function assertIsFixedSize<TSize extends number>(codec: {
    fixedSize: TSize;
} | {
    maxSize?: number;
}): asserts codec is {
    fixedSize: TSize;
};
export declare function isVariableSize<TFrom>(encoder: Encoder<TFrom>): encoder is VariableSizeEncoder<TFrom>;
export declare function isVariableSize<TTo>(decoder: Decoder<TTo>): decoder is VariableSizeDecoder<TTo>;
export declare function isVariableSize<TFrom, TTo extends TFrom>(codec: Codec<TFrom, TTo>): codec is VariableSizeCodec<TFrom, TTo>;
export declare function isVariableSize(codec: {
    fixedSize: number;
} | {
    maxSize?: number;
}): codec is {
    maxSize?: number;
};
export declare function assertIsVariableSize<T>(encoder: Encoder<T>): asserts encoder is VariableSizeEncoder<T>;
export declare function assertIsVariableSize<T>(decoder: Decoder<T>): asserts decoder is VariableSizeDecoder<T>;
export declare function assertIsVariableSize<TFrom, TTo extends TFrom>(codec: Codec<TFrom, TTo>): asserts codec is VariableSizeCodec<TFrom, TTo>;
export declare function assertIsVariableSize(codec: {
    fixedSize: number;
} | {
    maxSize?: number;
}): asserts codec is {
    maxSize?: number;
};
export {};
//# sourceMappingURL=codec.d.ts.map