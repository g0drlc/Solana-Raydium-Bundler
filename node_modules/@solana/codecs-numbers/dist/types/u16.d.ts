import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
export declare const getU16Encoder: (config?: NumberCodecConfig) => FixedSizeEncoder<bigint | number, 2>;
export declare const getU16Decoder: (config?: NumberCodecConfig) => FixedSizeDecoder<number, 2>;
export declare const getU16Codec: (config?: NumberCodecConfig) => FixedSizeCodec<bigint | number, number, 2>;
//# sourceMappingURL=u16.d.ts.map