/// <reference types="node" />
import EventEmitter from "eventemitter3";
import { Signer, PublicKey, TransactionInstruction, Commitment, GetProgramAccountsFilter, AccountInfo, RpcResponseAndContext, Context } from "@solana/web3.js";
import Provider from "../../provider.js";
import { Idl, IdlAccountDef } from "../../idl.js";
import { Coder } from "../../coder/index.js";
import { Address } from "../common.js";
import { AllAccountsMap, IdlAccounts } from "./types.js";
export default class AccountFactory {
    static build<IDL extends Idl>(idl: IDL, coder: Coder, programId: PublicKey, provider?: Provider): AccountNamespace<IDL>;
}
type NullableIdlAccount<IDL extends Idl> = IDL["accounts"] extends undefined ? IdlAccountDef : NonNullable<IDL["accounts"]>[number];
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
export type AccountNamespace<IDL extends Idl = Idl> = {
    [N in keyof AllAccountsMap<IDL>]: AccountClient<IDL, N>;
};
export declare class AccountClient<IDL extends Idl = Idl, N extends keyof IdlAccounts<IDL> = keyof IdlAccounts<IDL>, A extends NullableIdlAccount<IDL> = NullableIdlAccount<IDL>, T = IdlAccounts<IDL>[N]> {
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
    /**
     * Returns the idl account.
     */
    get idlAccount(): A;
    private _idlAccount;
    constructor(idl: IDL, idlAccount: A, programId: PublicKey, provider?: Provider, coder?: Coder);
    /**
     * Returns a deserialized account, returning null if it doesn't exist.
     *
     * @param address The address of the account to fetch.
     */
    fetchNullable(address: Address, commitment?: Commitment): Promise<T | null>;
    /**
     * Returns a deserialized account along with the associated rpc response context, returning null if it doesn't exist.
     *
     * @param address The address of the account to fetch.
     */
    fetchNullableAndContext(address: Address, commitment?: Commitment): Promise<{
        data: T | null;
        context: Context;
    }>;
    /**
     * Returns a deserialized account.
     *
     * @param address The address of the account to fetch.
     */
    fetch(address: Address, commitment?: Commitment): Promise<T>;
    /**
     * Returns a deserialized account along with the associated rpc response context.
     *
     * @param address The address of the account to fetch.
     */
    fetchAndContext(address: Address, commitment?: Commitment): Promise<{
        data: T | null;
        context: Context;
    }>;
    /**
     * Returns multiple deserialized accounts.
     * Accounts not found or with wrong discriminator are returned as null.
     *
     * @param addresses The addresses of the accounts to fetch.
     */
    fetchMultiple(addresses: Address[], commitment?: Commitment): Promise<(T | null)[]>;
    /**
     * Returns multiple deserialized accounts.
     * Accounts not found or with wrong discriminator are returned as null.
     *
     * @param addresses The addresses of the accounts to fetch.
     */
    fetchMultipleAndContext(addresses: Address[], commitment?: Commitment): Promise<({
        data: T;
        context: Context;
    } | null)[]>;
    /**
     * Returns all instances of this account type for the program.
     *
     * @param filters User-provided filters to narrow the results from `connection.getProgramAccounts`.
     *
     *                When filters are not defined this method returns all
     *                the account instances.
     *
     *                When filters are of type `Buffer`, the filters are appended
     *                after the discriminator.
     *
     *                When filters are of type `GetProgramAccountsFilter[]`,
     *                filters are appended after the discriminator filter.
     */
    all(filters?: Buffer | GetProgramAccountsFilter[]): Promise<ProgramAccount<T>[]>;
    /**
     * Returns an `EventEmitter` emitting a "change" event whenever the account
     * changes.
     */
    subscribe(address: Address, commitment?: Commitment): EventEmitter;
    /**
     * Unsubscribes from the account at the given address.
     */
    unsubscribe(address: Address): Promise<void>;
    /**
     * Returns an instruction for creating this account.
     */
    createInstruction(signer: Signer, sizeOverride?: number): Promise<TransactionInstruction>;
    /**
     * @deprecated since version 14.0.
     *
     * Function returning the associated account. Args are keys to associate.
     * Order matters.
     */
    associated(...args: Array<PublicKey | Buffer>): Promise<T>;
    /**
     * @deprecated since version 14.0.
     *
     * Function returning the associated address. Args are keys to associate.
     * Order matters.
     */
    associatedAddress(...args: Array<PublicKey | Buffer>): Promise<PublicKey>;
    getAccountInfo(address: Address, commitment?: Commitment): Promise<AccountInfo<Buffer> | null>;
    getAccountInfoAndContext(address: Address, commitment?: Commitment): Promise<RpcResponseAndContext<AccountInfo<Buffer> | null>>;
}
/**
 * @hidden
 *
 * Deserialized account owned by a program.
 */
export type ProgramAccount<T = any> = {
    publicKey: PublicKey;
    account: T;
};
export {};
//# sourceMappingURL=account.d.ts.map