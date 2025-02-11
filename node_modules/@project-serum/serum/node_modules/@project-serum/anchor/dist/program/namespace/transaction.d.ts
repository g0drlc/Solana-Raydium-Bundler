import { Transaction } from "@solana/web3.js";
import { IdlInstruction } from "../../idl";
import { InstructionFn } from "./instruction";
export default class TransactionFactory {
    static build(idlIx: IdlInstruction, ixFn: InstructionFn): TransactionFn;
}
/**
 * The namespace provides functions to build [[Transaction]] objects for each
 * method of a program.
 *
 * ## Usage
 *
 * ```javascript
 * program.transaction.<method>(...args, ctx);
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
 * const tx = await program.transaction.increment({
 *   accounts: {
 *     counter,
 *   },
 * });
 * ```
 */
export interface TransactionNamespace {
    [key: string]: TransactionFn;
}
/**
 * Tx is a function to create a `Transaction` for a given program instruction.
 */
export declare type TransactionFn = (...args: any[]) => Transaction;
//# sourceMappingURL=transaction.d.ts.map