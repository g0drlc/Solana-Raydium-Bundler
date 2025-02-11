import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getI16Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 2>;
export declare const getI16Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<number, 2>;
export declare const getI16Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, number, 2>;
//# sourceMappingURL=i16.d.ts.map