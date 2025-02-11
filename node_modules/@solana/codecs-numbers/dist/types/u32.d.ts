import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getU32Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 4>;
export declare const getU32Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<number, 4>;
export declare const getU32Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, number, 4>;
//# sourceMappingURL=u32.d.ts.map