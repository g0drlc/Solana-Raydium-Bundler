import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface IPoolKeys {
  keg?: PublicKey;
  version?: number;
  marketVersion?: number;
  programId?: PublicKey;
  baseMint: any;
  quoteMint?: any;
  ownerBaseAta: PublicKey;
  ownerQuoteAta: PublicKey;
  baseDecimals: any;
  quoteDecimals?: any;
  lpDecimals?: any;
  authority?: any;
  marketAuthority?: any;
  marketProgramId?: any;
  marketId?: any;
  marketBids?: any;
  marketAsks?: any;
  marketQuoteVault?: any;
  marketBaseVault?: any;
  marketEventQueue?: any;
  id?: any;
  baseVault?: any;
  coinVault?: PublicKey;
  lpMint: PublicKey;
  lpVault?: PublicKey;
  targetOrders?: any;
  withdrawQueue?: PublicKey;
  openOrders?: any;
  quoteVault?: any;
  lookupTableAccount?: PublicKey;
}

export interface ISwpBaseIn {
  swapBaseIn?: {
    amountIn?: BN;
    minimumAmountOut?: BN;
  };
}
