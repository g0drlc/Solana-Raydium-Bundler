import { FixedSizeDecoder, FixedSizeEncoder } from '@solana/codecs-core';
import { NumberCodecConfig } from './common';
type NumberFactorySharedInput<TSize extends number> = {
    config?: NumberCodecConfig;
    name: string;
    size: TSize;
};
type NumberFactoryEncoderInput<TFrom, TSize extends number> = NumberFactorySharedInput<TSize> & {
    range?: [bigint | number, bigint | number];
    set: (view: DataView, value: TFrom, littleEndian?: boolean) => void;
};
type NumberFactoryDecoderInput<TTo, TSize extends number> = NumberFactorySharedInput<TSize> & {
    get: (view: DataView, littleEndian?: boolean) => TTo;
};
export declare function numberEncoderFactory<TFrom extends bigint | number, TSize extends number>(input: NumberFactoryEncoderInput<TFrom, TSize>): FixedSizeEncoder<TFrom, TSize>;
export declare function numberDecoderFactory<TTo extends bigint | number, TSize extends number>(input: NumberFactoryDecoderInput<TTo, TSize>): FixedSizeDecoder<TTo, TSize>;
export {};
//# sourceMappingURL=utils.d.ts.map