import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getI32Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 4>;
export declare const getI32Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<number, 4>;
export declare const getI32Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, number, 4>;
//# sourceMappingURL=i32.d.ts.map