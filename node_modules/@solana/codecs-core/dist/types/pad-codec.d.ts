import { Codec, Decoder, Encoder, Offset } from './codec';
type AnyEncoder = Encoder<any>;
type AnyDecoder = Decoder<any>;
type AnyCodec = Codec<any>;
/**
 * Adds left padding to the given encoder.
 */
export declare function padLeftEncoder<TEncoder extends AnyEncoder>(encoder: TEncoder, offset: Offset): TEncoder;
/**
 * Adds right padding to the given encoder.
 */
export declare function padRightEncoder<TEncoder extends AnyEncoder>(encoder: TEncoder, offset: Offset): TEncoder;
/**
 * Adds left padding to the given decoder.
 */
export declare function padLeftDecoder<TDecoder extends AnyDecoder>(decoder: TDecoder, offset: Offset): TDecoder;
/**
 * Adds right padding to the given decoder.
 */
export declare function padRightDecoder<TDecoder extends AnyDecoder>(decoder: TDecoder, offset: Offset): TDecoder;
/**
 * Adds left padding to the given codec.
 */
export declare function padLeftCodec<TCodec extends AnyCodec>(codec: TCodec, offset: Offset): TCodec;
/**
 * Adds right padding to the given codec.
 */
export declare function padRightCodec<TCodec extends AnyCodec>(codec: TCodec, offset: Offset): TCodec;
export {};
//# sourceMappingURL=pad-codec.d.ts.map