import { VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/** Encodes strings in base64. */
export declare const getBase64Encoder: () => VariableSizeEncoder<string>;
/** Decodes strings in base64. */
export declare const getBase64Decoder: () => VariableSizeDecoder<string>;
/** Encodes and decodes strings in base64. */
export declare const getBase64Codec: () => VariableSizeCodec<string>;
//# sourceMappingURL=base64.d.ts.map