/// <reference types="node" />
import { AccountMeta, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Idl, IdlAccountItem, IdlInstruction } from "../../idl.js";
import { Accounts } from "../context.js";
import { AllInstructions, AllInstructionsMap, InstructionContextFn, MakeInstructionsNamespace } from "./types.js";
export default class InstructionNamespaceFactory {
    static build<IDL extends Idl, I extends AllInstructions<IDL>>(idlIx: I, encodeFn: InstructionEncodeFn<I>, programId: PublicKey): InstructionFn<IDL, I>;
    static accountsArray(ctx: Accounts | undefined, accounts: readonly IdlAccountItem[], programId: PublicKey, ixName?: string): AccountMeta[];
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
export type InstructionNamespace<IDL extends Idl = Idl, I extends IdlInstruction = IDL["instructions"][number]> = MakeInstructionsNamespace<IDL, I, TransactionInstruction, {
    [M in keyof AllInstructionsMap<IDL>]: {
        accounts: (ctx: Accounts<AllInstructionsMap<IDL>[M]["accounts"][number]>) => unknown;
    };
}>;
/**
 * Function to create a `TransactionInstruction` generated from an IDL.
 * Additionally it provides an `accounts` utility method, returning a list
 * of ordered accounts for the instruction.
 */
export type InstructionFn<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = InstructionContextFn<IDL, I, TransactionInstruction> & IxProps<Accounts<I["accounts"][number]>>;
type IxProps<A extends Accounts> = {
    /**
     * Returns an ordered list of accounts associated with the instruction.
     */
    accounts: (ctx: A) => AccountMeta[];
};
export type InstructionEncodeFn<I extends IdlInstruction = IdlInstruction> = (ixName: I["name"], ix: any) => Buffer;
export {};
//# sourceMappingURL=instruction.d.ts.map