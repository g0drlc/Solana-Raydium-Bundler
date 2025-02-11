import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { FixedSizeNumberCodec, FixedSizeNumberDecoder, FixedSizeNumberEncoder, NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
import { EnumLookupObject, GetEnumFrom, GetEnumTo } from './enum-helpers';
/** Defines the config for enum codecs. */
export type EnumCodecConfig<TDiscriminator extends NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * The codec to use for the enum discriminator.
     * @defaultValue u8 discriminator.
     */
    size?: TDiscriminator;
    /**
     * When set to `true`, numeric values will be used as discriminantors and
     * an error will be thrown if a string value is found on the enum.
     * @defaultValue `false`
     */
    useValuesAsDiscriminators?: boolean;
};
/**
 * Creates an enum encoder.
 *
 * @param constructor - The constructor of the enum.
 * @param config - A set of config for the encoder.
 */
export declare function getEnumEncoder<TEnum extends EnumLookupObject>(constructor: TEnum, config?: Omit<EnumCodecConfig<NumberEncoder>, 'size'>): FixedSizeEncoder<GetEnumFrom<TEnum>, 1>;
export declare function getEnumEncoder<TEnum extends EnumLookupObject, TSize extends number>(constructor: TEnum, config: EnumCodecConfig<NumberEncoder> & {
    size: FixedSizeNumberEncoder<TSize>;
}): FixedSizeEncoder<GetEnumFrom<TEnum>, TSize>;
export declare function getEnumEncoder<TEnum extends EnumLookupObject>(constructor: TEnum, config?: EnumCodecConfig<NumberEncoder>): VariableSizeEncoder<GetEnumFrom<TEnum>>;
/**
 * Creates an enum decoder.
 *
 * @param constructor - The constructor of the enum.
 * @param config - A set of config for the decoder.
 */
export declare function getEnumDecoder<TEnum extends EnumLookupObject>(constructor: TEnum, config?: Omit<EnumCodecConfig<NumberDecoder>, 'size'>): FixedSizeDecoder<GetEnumTo<TEnum>, 1>;
export declare function getEnumDecoder<TEnum extends EnumLookupObject, TSize extends number>(constructor: TEnum, config: EnumCodecConfig<NumberDecoder> & {
    size: FixedSizeNumberDecoder<TSize>;
}): FixedSizeDecoder<GetEnumTo<TEnum>, TSize>;
export declare function getEnumDecoder<TEnum extends EnumLookupObject>(constructor: TEnum, config?: EnumCodecConfig<NumberDecoder>): VariableSizeDecoder<GetEnumTo<TEnum>>;
/**
 * Creates an enum codec.
 *
 * @param constructor - The constructor of the enum.
 * @param config - A set of config for the codec.
 */
export declare function getEnumCodec<TEnum extends EnumLookupObject>(constructor: TEnum, config?: Omit<EnumCodecConfig<NumberCodec>, 'size'>): FixedSizeCodec<GetEnumFrom<TEnum>, GetEnumTo<TEnum>, 1>;
export declare function getEnumCodec<TEnum extends EnumLookupObject, TSize extends number>(constructor: TEnum, config: EnumCodecConfig<NumberCodec> & {
    size: FixedSizeNumberCodec<TSize>;
}): FixedSizeCodec<GetEnumFrom<TEnum>, GetEnumTo<TEnum>, TSize>;
export declare function getEnumCodec<TEnum extends EnumLookupObject>(constructor: TEnum, config?: EnumCodecConfig<NumberCodec>): VariableSizeCodec<GetEnumFrom<TEnum>, GetEnumTo<TEnum>>;
/** @deprecated Use `getEnumEncoder` instead. */
export declare const getScalarEnumEncoder: typeof getEnumEncoder;
/** @deprecated Use `getEnumDecoder` instead. */
export declare const getScalarEnumDecoder: typeof getEnumDecoder;
/** @deprecated Use `getEnumCodec` instead. */
export declare const getScalarEnumCodec: typeof getEnumCodec;
//# sourceMappingURL=enum.d.ts.map