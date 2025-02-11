export function decodeTokenInstructionData(instruction: any): any;
export function initializeMint({ mint, decimals, mintAuthority, freezeAuthority, }: {
    mint: any;
    decimals: any;
    mintAuthority: any;
    freezeAuthority?: any;
}): TransactionInstruction;
export function initializeAccount({ account, mint, owner }: {
    account: any;
    mint: any;
    owner: any;
}): TransactionInstruction;
export function transfer({ source, destination, amount, owner }: {
    source: any;
    destination: any;
    amount: any;
    owner: any;
}): TransactionInstruction;
export function approve({ source, delegate, amount, owner }: {
    source: any;
    delegate: any;
    amount: any;
    owner: any;
}): TransactionInstruction;
export function revoke({ source, owner }: {
    source: any;
    owner: any;
}): TransactionInstruction;
export function setAuthority({ target, currentAuthority, newAuthority, authorityType, }: {
    target: any;
    currentAuthority: any;
    newAuthority: any;
    authorityType: any;
}): TransactionInstruction;
export function mintTo({ mint, destination, amount, mintAuthority }: {
    mint: any;
    destination: any;
    amount: any;
    mintAuthority: any;
}): TransactionInstruction;
export function closeAccount({ source, destination, owner }: {
    source: any;
    destination: any;
    owner: any;
}): TransactionInstruction;
export const INITIALIZE_ACCOUNT_ACCOUNT_INDEX: 0;
export const INITIALIZE_ACCOUNT_MINT_INDEX: 1;
export const INITIALIZE_ACCOUNT_OWNER_INDEX: 2;
export const TRANSFER_SOURCE_INDEX: 0;
export const TRANSFER_DESTINATION_INDEX: 1;
export const TRANSFER_OWNER_INDEX: 2;
export const CLOSE_ACCOUNT_SOURCE_INDEX: 0;
export const CLOSE_ACCOUNT_DESTINATION_INDEX: 1;
export const CLOSE_ACCOUNT_OWNER_INDEX: 2;
export const TOKEN_PROGRAM_ID: PublicKey;
export const WRAPPED_SOL_MINT: PublicKey;
export const MSRM_MINT: PublicKey;
export const MSRM_DECIMALS: 0;
export const SRM_MINT: PublicKey;
export const SRM_DECIMALS: 6;
import { TransactionInstruction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
//# sourceMappingURL=token-instructions.d.ts.map