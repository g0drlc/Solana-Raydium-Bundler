import { PublicKey } from "@solana/web3.js";
import Provider from "../../provider.js";
import { TransactionFn } from "./transaction.js";
import { Event } from "../event.js";
import { Coder } from "../../coder/index.js";
import { Idl, IdlEvent } from "../../idl.js";
import { AllInstructions, IdlTypes, InstructionContextFn, MakeInstructionsNamespace } from "./types";
export default class SimulateFactory {
    static build<IDL extends Idl, I extends AllInstructions<IDL>>(idlIx: AllInstructions<IDL>, txFn: TransactionFn<IDL>, idlErrors: Map<number, string>, provider: Provider, coder: Coder, programId: PublicKey, idl: IDL): SimulateFn<IDL, I>;
}
/**
 * The namespace provides functions to simulate transactions for each method
 * of a program, returning a list of deserialized events *and* raw program
 * logs.
 *
 * One can use this to read data calculated from a program on chain, by
 * emitting an event in the program and reading the emitted event client side
 * via the `simulate` namespace.
 *
 * ## Usage
 *
 * ```javascript
 * program.simulate.<method>(...args, ctx);
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
 * To simulate the `increment` method above,
 *
 * ```javascript
 * const events = await program.simulate.increment({
 *   accounts: {
 *     counter,
 *   },
 * });
 * ```
 */
export type SimulateNamespace<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = MakeInstructionsNamespace<IDL, I, Promise<SimulateResponse<NullableEvents<IDL>, IdlTypes<IDL>>>>;
type NullableEvents<IDL extends Idl> = IDL["events"] extends undefined ? IdlEvent : NonNullable<IDL["events"]>[number];
/**
 * SimulateFn is a single method generated from an IDL. It simulates a method
 * against a cluster configured by the provider, returning a list of all the
 * events and raw logs that were emitted during the execution of the
 * method.
 */
export type SimulateFn<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = InstructionContextFn<IDL, I, Promise<SimulateResponse<NullableEvents<IDL>, IdlTypes<IDL>>>>;
export type SimulateResponse<E extends IdlEvent, Defined> = {
    events: readonly Event<E, Defined>[];
    raw: readonly string[];
};
export {};
//# sourceMappingURL=simulate.d.ts.map