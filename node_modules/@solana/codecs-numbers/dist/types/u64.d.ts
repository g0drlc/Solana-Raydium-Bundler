import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getU64Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 8>;
export declare const getU64Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<bigint, 8>;
export declare const getU64Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, bigint, 8>;
//# sourceMappingURL=u64.d.ts.map