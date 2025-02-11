/// <reference types="node" />
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import { Address } from "../program/common.js";
export declare function createWithSeedSync(fromPublicKey: PublicKey, seed: string, programId: PublicKey): PublicKey;
export declare function associated(programId: Address, ...args: Array<Address | Buffer>): PublicKey;
//# sourceMappingURL=pubkey.d.ts.map