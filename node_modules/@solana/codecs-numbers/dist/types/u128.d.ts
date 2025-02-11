import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getU128Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 16>;
export declare const getU128Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<bigint, 16>;
export declare const getU128Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, bigint, 16>;
//# sourceMappingURL=u128.d.ts.map