import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getF32Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 4>;
export declare const getF32Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<number, 4>;
export declare const getF32Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, number, 4>;
//# sourceMappingURL=f32.d.ts.map