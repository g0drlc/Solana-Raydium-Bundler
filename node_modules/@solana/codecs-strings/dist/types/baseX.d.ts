import { VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/**
 * Encodes a string using a custom alphabet by dividing
 * by the base and handling leading zeroes.
 * @see {@link getBaseXCodec} for a more detailed description.
 */
export declare const getBaseXEncoder: (alphabet: string) => VariableSizeEncoder<string>;
/**
 * Decodes a string using a custom alphabet by dividing
 * by the base and handling leading zeroes.
 * @see {@link getBaseXCodec} for a more detailed description.
 */
export declare const getBaseXDecoder: (alphabet: string) => VariableSizeDecoder<string>;
/**
 * A string codec that requires a custom alphabet and uses
 * the length of that alphabet as the base. It then divides
 * the input by the base as many times as necessary to get
 * the output. It also supports leading zeroes by using the
 * first character of the alphabet as the zero character.
 *
 * This can be used to create codecs such as base10 or base58.
 */
export declare const getBaseXCodec: (alphabet: string) => VariableSizeCodec<string>;
//# sourceMappingURL=baseX.d.ts.map