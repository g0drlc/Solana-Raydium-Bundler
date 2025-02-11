import { PublicKey } from "@solana/web3.js";
import Provider from "../../provider";
import { IdlInstruction } from "../../idl";
import { TransactionFn } from "./transaction";
import { Event } from "../event";
import Coder from "../../coder";
import { Idl } from "../../idl";
export default class SimulateFactory {
    static build(idlIx: IdlInstruction, txFn: TransactionFn, idlErrors: Map<number, string>, provider: Provider, coder: Coder, programId: PublicKey, idl: Idl): SimulateFn;
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
export interface SimulateNamespace {
    [key: string]: SimulateFn;
}
/**
 * RpcFn is a single method generated from an IDL. It simulates a method
 * against a cluster configured by the provider, returning a list of all the
 * events and raw logs that were emitted during the execution of the
 * method.
 */
export declare type SimulateFn = (...args: any[]) => Promise<SimulateResponse>;
declare type SimulateResponse = {
    events: Event[];
    raw: string[];
};
export {};
//# sourceMappingURL=simulate.d.ts.map