import { Codec, Decoder, Encoder } from '@solana/codecs-core';
import { NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
import { DrainOuterGeneric } from './utils';
/**
 * Defines a discriminated union using discriminated union types.
 *
 * @example
 * ```ts
 * type WebPageEvent =
 *   | { __kind: 'pageview', url: string }
 *   | { __kind: 'click', x: number, y: number };
 * ```
 */
export type DiscriminatedUnion<TDiscriminatorProperty extends string = '__kind', TDiscriminatorValue extends string = string> = {
    [P in TDiscriminatorProperty]: TDiscriminatorValue;
};
/**
 * Extracts a variant from a discriminated union.
 *
 * @example
 * ```ts
 * type WebPageEvent =
 *   | { __kind: 'pageview', url: string }
 *   | { __kind: 'click', x: number, y: number };
 * type ClickEvent = GetDiscriminatedUnionVariant<WebPageEvent, '__kind', 'click'>;
 * // -> { __kind: 'click', x: number, y: number }
 * ```
 */
export type GetDiscriminatedUnionVariant<TUnion extends DiscriminatedUnion<TDiscriminatorProperty>, TDiscriminatorProperty extends string, TDiscriminatorValue extends TUnion[TDiscriminatorProperty]> = Extract<TUnion, DiscriminatedUnion<TDiscriminatorProperty, TDiscriminatorValue>>;
/**
 * Extracts a variant from a discriminated union without its discriminator.
 *
 * @example
 * ```ts
 * type WebPageEvent =
 *   | { __kind: 'pageview', url: string }
 *   | { __kind: 'click', x: number, y: number };
 * type ClickEvent = GetDiscriminatedUnionVariantContent<WebPageEvent, '__kind', 'click'>;
 * // -> { x: number, y: number }
 * ```
 */
export type GetDiscriminatedUnionVariantContent<TUnion extends DiscriminatedUnion<TDiscriminatorProperty>, TDiscriminatorProperty extends string, TDiscriminatorValue extends TUnion[TDiscriminatorProperty]> = Omit<GetDiscriminatedUnionVariant<TUnion, TDiscriminatorProperty, TDiscriminatorValue>, TDiscriminatorProperty>;
/** Defines the config for discriminated union codecs. */
export type DiscriminatedUnionCodecConfig<TDiscriminatorProperty extends string = '__kind', TDiscriminatorSize = NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * The property name of the discriminator.
     * @defaultValue `__kind`.
     */
    discriminator?: TDiscriminatorProperty;
    /**
     * The codec to use for the enum discriminator prefixing the variant.
     * @defaultValue u8 prefix.
     */
    size?: TDiscriminatorSize;
};
type DiscriminatorValue = bigint | boolean | number | string | null | undefined;
type Variants<T> = readonly (readonly [DiscriminatorValue, T])[];
type ArrayIndices<T extends readonly unknown[]> = Exclude<Partial<T>['length'], T['length']> & number;
type GetEncoderTypeFromVariants<TVariants extends Variants<Encoder<any>>, TDiscriminatorProperty extends string> = DrainOuterGeneric<{
    [I in ArrayIndices<TVariants>]: (TVariants[I][1] extends Encoder<infer TFrom> ? TFrom extends object ? TFrom : object : never) & {
        [P in TDiscriminatorProperty]: TVariants[I][0];
    };
}>[ArrayIndices<TVariants>];
type GetDecoderTypeFromVariants<TVariants extends Variants<Decoder<any>>, TDiscriminatorProperty extends string> = DrainOuterGeneric<{
    [I in ArrayIndices<TVariants>]: (TVariants[I][1] extends Decoder<infer TTo> ? TTo extends object ? TTo : object : never) & {
        [P in TDiscriminatorProperty]: TVariants[I][0];
    };
}>[ArrayIndices<TVariants>];
/**
 * Creates a discriminated union encoder.
 *
 * @param variants - The variant encoders of the discriminated union.
 * @param config - A set of config for the encoder.
 */
export declare function getDiscriminatedUnionEncoder<const TVariants extends Variants<Encoder<any>>, const TDiscriminatorProperty extends string = '__kind'>(variants: TVariants, config?: DiscriminatedUnionCodecConfig<TDiscriminatorProperty, NumberEncoder>): Encoder<GetEncoderTypeFromVariants<TVariants, TDiscriminatorProperty>>;
/**
 * Creates a discriminated union decoder.
 *
 * @param variants - The variant decoders of the discriminated union.
 * @param config - A set of config for the decoder.
 */
export declare function getDiscriminatedUnionDecoder<const TVariants extends Variants<Decoder<any>>, const TDiscriminatorProperty extends string = '__kind'>(variants: TVariants, config?: DiscriminatedUnionCodecConfig<TDiscriminatorProperty, NumberDecoder>): Decoder<GetDecoderTypeFromVariants<TVariants, TDiscriminatorProperty>>;
/**
 * Creates a discriminated union codec.
 *
 * @param variants - The variant codecs of the discriminated union.
 * @param config - A set of config for the codec.
 */
export declare function getDiscriminatedUnionCodec<const TVariants extends Variants<Codec<any, any>>, const TDiscriminatorProperty extends string = '__kind'>(variants: TVariants, config?: DiscriminatedUnionCodecConfig<TDiscriminatorProperty, NumberCodec>): Codec<GetEncoderTypeFromVariants<TVariants, TDiscriminatorProperty>, GetDecoderTypeFromVariants<TVariants, TDiscriminatorProperty> & GetEncoderTypeFromVariants<TVariants, TDiscriminatorProperty>>;
/** @deprecated Use `getDiscriminatedUnionEncoder` instead. */
export declare const getDataEnumEncoder: typeof getDiscriminatedUnionEncoder;
/** @deprecated Use `getDiscriminatedUnionDecoder` instead. */
export declare const getDataEnumDecoder: typeof getDiscriminatedUnionDecoder;
/** @deprecated Use `getDiscriminatedUnionCodec` instead. */
export declare const getDataEnumCodec: typeof getDiscriminatedUnionCodec;
export {};
//# sourceMappingURL=discriminated-union.d.ts.map