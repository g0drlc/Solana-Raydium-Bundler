import { PublicKey } from "@solana/web3.js";
export declare const TOKEN_PROGRAM_ID: PublicKey;
export declare const ASSOCIATED_PROGRAM_ID: PublicKey;
export declare function associatedAddress({ mint, owner, }: {
    mint: PublicKey;
    owner: PublicKey;
}): Promise<PublicKey>;
//# sourceMappingURL=token.d.ts.map