import { PublicKey } from '@solana/web3.js';
export declare function supportsSrmFeeDiscounts(programId: PublicKey): boolean;
export declare function getFeeRates(feeTier: number): {
    taker: number;
    maker: number;
};
export declare function getFeeTier(msrmBalance: number, srmBalance: number): number;
//# sourceMappingURL=fees.d.ts.map