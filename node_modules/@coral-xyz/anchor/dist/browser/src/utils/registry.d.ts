/// <reference types="node" />
import BN from "bn.js";
import { Connection, PublicKey } from "@solana/web3.js";
/**
 * Returns a verified build from the anchor registry. null if no such
 * verified build exists, e.g., if the program has been upgraded since the
 * last verified build.
 */
export declare function verifiedBuild(connection: Connection, programId: PublicKey, limit?: number): Promise<Build | null>;
/**
 * Returns the program data account for this program, containing the
 * metadata for this program, e.g., the upgrade authority.
 */
export declare function fetchData(connection: Connection, programId: PublicKey): Promise<ProgramData>;
export declare function decodeUpgradeableLoaderState(data: Buffer): any;
export type ProgramData = {
    slot: BN;
    upgradeAuthorityAddress: PublicKey | null;
};
export type Build = {
    aborted: boolean;
    address: string;
    created_at: string;
    updated_at: string;
    descriptor: string[];
    docker: string;
    id: number;
    name: string;
    sha256: string;
    upgrade_authority: string;
    verified: string;
    verified_slot: number;
    state: string;
};
//# sourceMappingURL=registry.d.ts.map