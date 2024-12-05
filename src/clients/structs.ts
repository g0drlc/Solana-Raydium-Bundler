import { u8, u32, struct } from '@solana/buffer-layout';
import { u64, publicKey } from '@solana/buffer-layout-utils';

export const SPL_MINT_LAYOUT = struct<any>([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  u8('isInitialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority')
]);

export const SPL_ACCOUNT_LAYOUT = struct<any>([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
]);