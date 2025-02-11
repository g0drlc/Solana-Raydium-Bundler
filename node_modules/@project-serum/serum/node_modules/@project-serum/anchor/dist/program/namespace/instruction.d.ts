/// <reference types="node" />
import { PublicKey } from "@solana/web3.js";
import { IdlInstruction, IdlAccountItem } from "../../idl";
import { Accounts } from "../context";
export default class InstructionNamespaceFactory {
    static build(idlIx: IdlInstruction, encodeFn: InstructionEncodeFn, programId: PublicKey): InstructionFn;
    static accountsArray(ctx: Accounts, accounts: IdlAccountItem[]): any;
}
/**
 * The namespace provides functions to build [[TransactionInstruction]]
 * objects for each method of a program.
 *
 * ## Usage
 *
 * ```javascript
 * instruction.<method>(...args, ctx);
 * ```
 *
 * ## Parameters
 *
 * 1. `args` - The positional arguments for the program. The type and number
 *    of these arguments depend on the program being used.
 * 2. `ctx`  - [[Context]] non-argument parameters to pass to the method.
 *    Always the last parameter in the method call.
 *
 * ## Example
 *
 * To create an instruction for the `increment` method above,
 *
 * ```javascript
 * const tx = await program.instruction.increment({
 *   accounts: {
 *     counter,
 *   },
 * });
 * ```
 */
export interface InstructionNamespace {
    [key: string]: InstructionFn;
}
/**
 * Function to create a `TransactionInstruction` generated from an IDL.
 * Additionally it provides an `accounts` utility method, returning a list
 * of ordered accounts for the instruction.
 */
export declare type InstructionFn = IxProps & ((...args: any[]) => any);
declare type IxProps = {
    accounts: (ctx: Accounts) => any;
};
export declare type InstructionEncodeFn = (ixName: string, ix: any) => Buffer;
export {};
//# sourceMappingURL=instruction.d.ts.map