import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder, VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
import { FixedSizeNumberCodec, FixedSizeNumberDecoder, FixedSizeNumberEncoder, NumberCodec, NumberDecoder, NumberEncoder } from '@solana/codecs-numbers';
/** Defines the config for boolean codecs. */
export type BooleanCodecConfig<TSize extends NumberCodec | NumberDecoder | NumberEncoder> = {
    /**
     * The number codec to delegate to.
     * @defaultValue u8 size.
     */
    size?: TSize;
};
/**
 * Encodes booleans.
 *
 * @param config - A set of config for the encoder.
 */
export declare function getBooleanEncoder(): FixedSizeEncoder<boolean, 1>;
export declare function getBooleanEncoder<TSize extends number>(config: BooleanCodecConfig<NumberEncoder> & {
    size: FixedSizeNumberEncoder<TSize>;
}): FixedSizeEncoder<boolean, TSize>;
export declare function getBooleanEncoder(config: BooleanCodecConfig<NumberEncoder>): VariableSizeEncoder<boolean>;
/**
 * Decodes booleans.
 *
 * @param config - A set of config for the decoder.
 */
export declare function getBooleanDecoder(): FixedSizeDecoder<boolean, 1>;
export declare function getBooleanDecoder<TSize extends number>(config: BooleanCodecConfig<NumberDecoder> & {
    size: FixedSizeNumberDecoder<TSize>;
}): FixedSizeDecoder<boolean, TSize>;
export declare function getBooleanDecoder(config: BooleanCodecConfig<NumberDecoder>): VariableSizeDecoder<boolean>;
/**
 * Creates a boolean codec.
 *
 * @param config - A set of config for the codec.
 */
export declare function getBooleanCodec(): FixedSizeCodec<boolean, boolean, 1>;
export declare function getBooleanCodec<TSize extends number>(config: BooleanCodecConfig<NumberCodec> & {
    size: FixedSizeNumberCodec<TSize>;
}): FixedSizeCodec<boolean, boolean, TSize>;
export declare function getBooleanCodec(config: BooleanCodecConfig<NumberCodec>): VariableSizeCodec<boolean>;
//# sourceMappingURL=boolean.d.ts.map