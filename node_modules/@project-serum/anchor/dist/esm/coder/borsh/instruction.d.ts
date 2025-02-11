/// <reference types="node" />
import { Buffer } from "buffer";
import { AccountMeta, PublicKey } from "@solana/web3.js";
import { Idl } from "../../idl.js";
import { InstructionCoder } from "../index.js";
/**
 * Namespace for state method function signatures.
 */
export declare const SIGHASH_STATE_NAMESPACE = "state";
/**
 * Namespace for global instruction function signatures (i.e. functions
 * that aren't namespaced by the state or any of its trait implementations).
 */
export declare const SIGHASH_GLOBAL_NAMESPACE = "global";
/**
 * Encodes and decodes program instructions.
 */
export declare class BorshInstructionCoder implements InstructionCoder {
    private idl;
    private ixLayout;
    private sighashLayouts;
    constructor(idl: Idl);
    /**
     * Encodes a program instruction.
     */
    encode(ixName: string, ix: any): Buffer;
    /**
     * Encodes a program state instruction.
     */
    encodeState(ixName: string, ix: any): Buffer;
    private _encode;
    private static parseIxLayout;
    /**
     * Decodes a program instruction.
     */
    decode(ix: Buffer | string, encoding?: "hex" | "base58"): Instruction | null;
    /**
     * Returns a formatted table of all the fields in the given instruction data.
     */
    format(ix: Instruction, accountMetas: AccountMeta[]): InstructionDisplay | null;
}
export type Instruction = {
    name: string;
    data: Object;
};
export type InstructionDisplay = {
    args: {
        name: string;
        type: string;
        data: string;
    }[];
    accounts: {
        name?: string;
        pubkey: PublicKey;
        isSigner: boolean;
        isWritable: boolean;
    }[];
};
//# sourceMappingURL=instruction.d.ts.map