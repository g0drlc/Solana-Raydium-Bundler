import { VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/**
 * Encodes short u16 numbers.
 * @see {@link getShortU16Codec} for a more detailed description.
 */
export declare const getShortU16Encoder: () => VariableSizeEncoder<bigint | number>;
/**
 * Decodes short u16 numbers.
 * @see {@link getShortU16Codec} for a more detailed description.
 */
export declare const getShortU16Decoder: () => VariableSizeDecoder<number>;
/**
 * Encodes and decodes short u16 numbers.
 *
 * Short u16 numbers are the same as u16, but serialized with 1 to 3 bytes.
 * If the value is above 0x7f, the top bit is set and the remaining
 * value is stored in the next bytes. Each byte follows the same
 * pattern until the 3rd byte. The 3rd byte, if needed, uses
 * all 8 bits to store the last byte of the original value.
 */
export declare const getShortU16Codec: () => VariableSizeCodec<bigint | number, number>;
//# sourceMappingURL=short-u16.d.ts.map