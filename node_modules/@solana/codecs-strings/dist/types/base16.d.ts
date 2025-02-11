import { VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/** Encodes strings in base16. */
export declare const getBase16Encoder: () => VariableSizeEncoder<string>;
/** Decodes strings in base16. */
export declare const getBase16Decoder: () => VariableSizeDecoder<string>;
/** Encodes and decodes strings in base16. */
export declare const getBase16Codec: () => VariableSizeCodec<string>;
//# sourceMappingURL=base16.d.ts.map