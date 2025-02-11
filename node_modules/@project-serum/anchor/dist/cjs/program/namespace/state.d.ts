import EventEmitter from "eventemitter3";
import { PublicKey, Commitment } from "@solana/web3.js";
import Provider from "../../provider.js";
import { Idl, IdlInstruction, IdlTypeDef } from "../../idl.js";
import { Coder } from "../../coder/index.js";
import { RpcNamespace, InstructionNamespace, TransactionNamespace } from "./index.js";
import { IdlTypes, TypeDef } from "./types.js";
export default class StateFactory {
    static build<IDL extends Idl>(idl: IDL, coder: Coder, programId: PublicKey, provider?: Provider): StateClient<IDL> | undefined;
}
type NullableMethods<IDL extends Idl> = IDL["state"] extends undefined ? IdlInstruction[] : NonNullable<IDL["state"]>["methods"];
/**
 * A client for the program state. Similar to the base [[Program]] client,
 * one can use this to send transactions and read accounts for the state
 * abstraction.
 */
export declare class StateClient<IDL extends Idl> {
    /**
     * Returns the client's wallet and network provider.
     */
    readonly provider: Provider;
    /**
     * Returns the coder.
     */
    readonly coder: Coder;
    /**
     * [[RpcNamespace]] for all state methods.
     */
    readonly rpc: RpcNamespace<IDL, NullableMethods<IDL>[number]>;
    /**
     * [[InstructionNamespace]] for all state methods.
     */
    readonly instruction: InstructionNamespace<IDL, NullableMethods<IDL>[number]>;
    /**
     * [[TransactionNamespace]] for all state methods.
     */
    readonly transaction: TransactionNamespace<IDL, NullableMethods<IDL>[number]>;
    /**
     * Returns the program ID owning the state.
     */
    get programId(): PublicKey;
    private _programId;
    private _address;
    private _coder;
    private _idl;
    private _sub;
    constructor(idl: IDL, programId: PublicKey, 
    /**
     * Returns the client's wallet and network provider.
     */
    provider?: Provider, 
    /**
     * Returns the coder.
     */
    coder?: Coder);
    /**
     * Returns the deserialized state account.
     */
    fetch(): Promise<TypeDef<IDL["state"] extends undefined ? IdlTypeDef : NonNullable<IDL["state"]>["struct"], IdlTypes<IDL>>>;
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
export {};
//# sourceMappingURL=state.d.ts.map