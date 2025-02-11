import { FixedSizeCodec, FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
export declare const getU8Encoder: () => FixedSizeEncoder<bigint | number, 1>;
export declare const getU8Decoder: () => FixedSizeDecoder<number, 1>;
export declare const getU8Codec: () => FixedSizeCodec<bigint | number, number, 1>;
//# sourceMappingURL=u8.d.ts.map