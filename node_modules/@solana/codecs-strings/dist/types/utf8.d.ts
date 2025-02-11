import { VariableSizeCodec, VariableSizeDecoder, VariableSizeEncoder } from '@solana/codecs-core';
/** Encodes UTF-8 strings using the native `TextEncoder` API. */
export declare const getUtf8Encoder: () => VariableSizeEncoder<string>;
/** Decodes UTF-8 strings using the native `TextDecoder` API. */
export declare const getUtf8Decoder: () => VariableSizeDecoder<string>;
/** Encodes and decodes UTF-8 strings using the native `TextEncoder` and `TextDecoder` API. */
export declare const getUtf8Codec: () => VariableSizeCodec<string>;
//# sourceMappingURL=utf8.d.ts.map