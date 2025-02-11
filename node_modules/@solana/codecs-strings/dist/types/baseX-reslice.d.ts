import { VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/**
 * Encodes a string using a custom alphabet by reslicing the bits of the byte array.
 * @see {@link getBaseXResliceCodec} for a more detailed description.
 */
export declare const getBaseXResliceEncoder: (alphabet: string, bits: number) => VariableSizeEncoder<string>;
/**
 * Decodes a string using a custom alphabet by reslicing the bits of the byte array.
 * @see {@link getBaseXResliceCodec} for a more detailed description.
 */
export declare const getBaseXResliceDecoder: (alphabet: string, bits: number) => VariableSizeDecoder<string>;
/**
 * A string serializer that reslices bytes into custom chunks
 * of bits that are then mapped to a custom alphabet.
 *
 * This can be used to create serializers whose alphabet
 * is a power of 2 such as base16 or base64.
 */
export declare const getBaseXResliceCodec: (alphabet: string, bits: number) => VariableSizeCodec<string>;
//# sourceMappingURL=baseX-reslice.d.ts.map