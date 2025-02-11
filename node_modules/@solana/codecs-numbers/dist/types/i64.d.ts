import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getI64Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 8>;
export declare const getI64Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<bigint, 8>;
export declare const getI64Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, bigint, 8>;
//# sourceMappingURL=i64.d.ts.map