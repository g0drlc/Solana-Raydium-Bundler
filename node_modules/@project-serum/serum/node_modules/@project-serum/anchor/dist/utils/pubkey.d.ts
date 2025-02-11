/// <reference types="node" />
import { PublicKey } from "@solana/web3.js";
import { Address } from "../program/common";
export declare function createWithSeedSync(fromPublicKey: PublicKey, seed: string, programId: PublicKey): PublicKey;
export declare function createProgramAddressSync(seeds: Array<Buffer | Uint8Array>, programId: PublicKey): PublicKey;
export declare function findProgramAddressSync(seeds: Array<Buffer | Uint8Array>, programId: PublicKey): [PublicKey, number];
export declare function associated(programId: Address, ...args: Array<PublicKey | Buffer>): Promise<PublicKey>;
//# sourceMappingURL=pubkey.d.ts.map