import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
export declare const getI8Encoder: () => FixedSizeEncoder<bigint | number, 1>;
export declare const getI8Decoder: () => FixedSizeDecoder<number, 1>;
export declare const getI8Codec: () => FixedSizeCodec<bigint | number, number, 1>;
//# sourceMappingURL=i8.d.ts.map