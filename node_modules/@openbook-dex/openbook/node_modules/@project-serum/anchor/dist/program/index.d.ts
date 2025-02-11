import { PublicKey } from "@solana/web3.js";
import Provider from "../provider";
import { Idl } from "../idl";
import Coder from "../coder";
import { RpcNamespace, InstructionNamespace, TransactionNamespace, AccountNamespace, StateClient, SimulateNamespace } from "./namespace";
import { Address } from "./common";
/**
 * ## Program
 *
 * Program provides the IDL deserialized client representation of an Anchor
 * program.
 *
 * This API is the one stop shop for all things related to communicating with
 * on-chain programs. Among other things, one can send transactions, fetch
 * deserialized accounts, decode instruction data, subscribe to account
 * changes, and listen to events.
 *
 * In addition to field accessors and methods, the object provides a set of
 * dynamically generated properties, also known as namespaces, that
 * map one-to-one to program methods and accounts. These namespaces generally
 *  can be used as follows:
 *
 * ## Usage
 *
 * ```javascript
 * program.<namespace>.<program-specific-method>
 * ```
 *
 * API specifics are namespace dependent. The examples used in the documentation
 * below will refer to the two counter examples found
 * [here](https://github.com/project-serum/anchor#examples).
 */
export declare class Program {
    /**
     * Async methods to send signed transactions to *non*-state methods on the
     * program, returning a [[TransactionSignature]].
     *
     * ## Usage
     *
     * ```javascript
     * rpc.<method>(...args, ctx);
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
     * To send a transaction invoking the `increment` method above,
     *
     * ```javascript
     * const txSignature = await program.rpc.increment({
     *   accounts: {
     *     counter,
     *     authority,
     *   },
     * });
     * ```
     */
    readonly rpc: RpcNamespace;
    /**
     * The namespace provides handles to an [[AccountClient]] object for each
     * account in the program.
     *
     * ## Usage
     *
     * ```javascript
     * program.account.<account-client>
     * ```
     *
     * ## Example
     *
     * To fetch a `Counter` account from the above example,
     *
     * ```javascript
     * const counter = await program.account.counter.fetch(address);
     * ```
     *
     * For the full API, see the [[AccountClient]] reference.
     */
    readonly account: AccountNamespace;
    /**
     * The namespace provides functions to build [[TransactionInstruction]]
     * objects for each method of a program.
     *
     * ## Usage
     *
     * ```javascript
     * program.instruction.<method>(...args, ctx);
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
    readonly instruction: InstructionNamespace;
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
    readonly transaction: TransactionNamespace;
    /**
     * The namespace provides functions to simulate transactions for each method
     * of a program, returning a list of deserialized events *and* raw program
     * logs.
     *
     * One can use this to read data calculated from a program on chain, by
     * emitting an event in the program and reading the emitted event client side
     * via the `simulate` namespace.
     *
     * ## simulate
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
    readonly simulate: SimulateNamespace;
    /**
     * A client for the program state. Similar to the base [[Program]] client,
     * one can use this to send transactions and read accounts for the state
     * abstraction.
     */
    readonly state: StateClient;
    /**
     * Address of the program.
     */
    get programId(): PublicKey;
    private _programId;
    /**
     * IDL defining the program's interface.
     */
    get idl(): Idl;
    private _idl;
    /**
     * Coder for serializing requests.
     */
    get coder(): Coder;
    private _coder;
    /**
     * Wallet and network provider.
     */
    get provider(): Provider;
    private _provider;
    /**
     * @param idl       The interface definition.
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context to use. If not provided
     *                  then uses [[getProvider]].
     */
    constructor(idl: Idl, programId: Address, provider?: Provider);
    /**
     * Generates a Program client by fetching the IDL from the network.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static at(address: Address, provider?: Provider): Promise<Program>;
    /**
     * Fetches an idl from the blockchain.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static fetchIdl(address: Address, provider?: Provider): Promise<any>;
    /**
     * Invokes the given callback every time the given event is emitted.
     *
     * @param eventName The PascalCase name of the event, provided by the IDL.
     * @param callback  The function to invoke whenever the event is emitted from
     *                  program logs.
     */
    addEventListener(eventName: string, callback: (event: any, slot: number) => void): number;
    /**
     * Unsubscribes from the given event listener.
     */
    removeEventListener(listener: number): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map