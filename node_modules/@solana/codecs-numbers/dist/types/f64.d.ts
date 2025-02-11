import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getF64Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 8>;
export declare const getF64Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<number, 8>;
export declare const getF64Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, number, 8>;
//# sourceMappingURL=f64.d.ts.map