import EventEmitter from "eventemitter3";
import { PublicKey, Commitment } from "@solana/web3.js";
import Provider from "../../provider";
import { Idl } from "../../idl";
import Coder from "../../coder";
import { RpcNamespace, InstructionNamespace, TransactionNamespace } from "./";
export default class StateFactory {
    static build(idl: Idl, coder: Coder, programId: PublicKey, provider: Provider): StateClient | undefined;
}
/**
 * A client for the program state. Similar to the base [[Program]] client,
 * one can use this to send transactions and read accounts for the state
 * abstraction.
 */
export declare class StateClient {
    /**
     * [[RpcNamespace]] for all state methods.
     */
    readonly rpc: RpcNamespace;
    /**
     * [[InstructionNamespace]] for all state methods.
     */
    readonly instruction: InstructionNamespace;
    /**
     * [[TransactionNamespace]] for all state methods.
     */
    readonly transaction: TransactionNamespace;
    /**
     * Returns the program ID owning the state.
     */
    get programId(): PublicKey;
    private _programId;
    /**
     * Returns the client's wallet and network provider.
     */
    get provider(): Provider;
    private _provider;
    /**
     * Returns the coder.
     */
    get coder(): Coder;
    private _address;
    private _coder;
    private _idl;
    private _sub;
    constructor(idl: Idl, programId: PublicKey, provider?: Provider, coder?: Coder);
    /**
     * Returns the deserialized state account.
     */
    fetch(): Promise<Object>;
    /**
     * Returns the state address.
     */
    address(): PublicKey;
    /**
     * Returns an `EventEmitter` with a `"change"` event that's fired whenever
     * the state account cahnges.
     */
    subscribe(commitment?: Commitment): EventEmitter;
    /**
     * Unsubscribes to state changes.
     */
    unsubscribe(): void;
}
//# sourceMappingURL=state.d.ts.map