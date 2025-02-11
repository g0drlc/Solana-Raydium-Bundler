/// <reference types="node" />
import EventEmitter from "eventemitter3";
import { Signer, PublicKey, TransactionInstruction, Commitment } from "@solana/web3.js";
import Provider from "../../provider";
import { Idl, IdlTypeDef } from "../../idl";
import Coder from "../../coder";
import { Address } from "../common";
export default class AccountFactory {
    static build(idl: Idl, coder: Coder, programId: PublicKey, provider: Provider): AccountNamespace;
}
/**
 * The namespace provides handles to an [[AccountClient]] object for each
 * account in a program.
 *
 * ## Usage
 *
 * ```javascript
 * account.<account-client>
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
export interface AccountNamespace {
    [key: string]: AccountClient;
}
export declare class AccountClient {
    /**
     * Returns the number of bytes in this account.
     */
    get size(): number;
    private _size;
    /**
     * Returns the program ID owning all accounts.
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
    private _coder;
    private _idlAccount;
    constructor(idl: Idl, idlAccount: IdlTypeDef, programId: PublicKey, provider?: Provider, coder?: Coder);
    /**
     * Returns a deserialized account.
     *
     * @param address The address of the account to fetch.
     */
    fetch(address: Address): Promise<Object>;
    /**
     * Returns all instances of this account type for the program.
     */
    all(filter?: Buffer): Promise<ProgramAccount<any>[]>;
    /**
     * Returns an `EventEmitter` emitting a "change" event whenever the account
     * changes.
     */
    subscribe(address: Address, commitment?: Commitment): EventEmitter;
    /**
     * Unsubscribes from the account at the given address.
     */
    unsubscribe(address: Address): void;
    /**
     * Returns an instruction for creating this account.
     */
    createInstruction(signer: Signer, sizeOverride?: number): Promise<TransactionInstruction>;
    /**
     * Function returning the associated account. Args are keys to associate.
     * Order matters.
     */
    associated(...args: Array<PublicKey | Buffer>): Promise<any>;
    /**
     * Function returning the associated address. Args are keys to associate.
     * Order matters.
     */
    associatedAddress(...args: Array<PublicKey | Buffer>): Promise<PublicKey>;
}
/**
 * @hidden
 *
 * Deserialized account owned by a program.
 */
export declare type ProgramAccount<T = any> = {
    publicKey: PublicKey;
    account: T;
};
//# sourceMappingURL=account.d.ts.map