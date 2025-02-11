import EventEmitter from "eventemitter3";
import { PublicKey } from "@solana/web3.js";
import { Idl, IdlInstruction, IdlAccountItem, IdlStateMethod } from "../idl.js";
import { Accounts } from "./context.js";
export type Subscription = {
    listener: number;
    ee: EventEmitter;
};
export declare function parseIdlErrors(idl: Idl): Map<number, string>;
export declare function toInstruction(idlIx: IdlInstruction | IdlStateMethod, ...args: any[]): {
    [key: string]: any;
};
export declare function validateAccounts(ixAccounts: IdlAccountItem[], accounts?: Accounts): void;
export declare function translateAddress(address: Address): PublicKey;
/**
 * An address to identify an account on chain. Can be a [[PublicKey]],
 * or Base 58 encoded string.
 */
export type Address = PublicKey | string;
//# sourceMappingURL=common.d.ts.map