import { PublicKey } from "@solana/web3.js";
import { Idl, IdlTypeDef } from "../idl.js";
import { AllInstructions } from "./namespace/types.js";
import Provider from "../provider.js";
import { AccountNamespace } from "./namespace/account.js";
import { PartialAccounts } from "./namespace/methods";
export type AccountsGeneric = {
    [name: string]: PublicKey | AccountsGeneric;
};
export declare function isAccountsGeneric(accounts: PublicKey | AccountsGeneric): accounts is AccountsGeneric;
export type CustomAccountResolver<IDL extends Idl> = (params: {
    args: Array<any>;
    accounts: AccountsGeneric;
    provider: Provider;
    programId: PublicKey;
    idlIx: AllInstructions<IDL>;
}) => Promise<{
    accounts: AccountsGeneric;
    resolved: number;
}>;
export declare class AccountsResolver<IDL extends Idl> {
    private _accounts;
    private _provider;
    private _programId;
    private _idlIx;
    private _idlTypes;
    private _customResolver?;
    _args: Array<any>;
    static readonly CONST_ACCOUNTS: {
        associatedTokenProgram: PublicKey;
        rent: PublicKey;
        systemProgram: PublicKey;
        tokenProgram: PublicKey;
        clock: PublicKey;
    };
    private _accountStore;
    constructor(_args: Array<any>, _accounts: AccountsGeneric, _provider: Provider, _programId: PublicKey, _idlIx: AllInstructions<IDL>, _accountNamespace: AccountNamespace<IDL>, _idlTypes: IdlTypeDef[], _customResolver?: CustomAccountResolver<IDL> | undefined);
    args(_args: Array<any>): void;
    resolve(): Promise<void>;
    private resolveCustom;
    private resolveOptionalsHelper;
    resolveOptionals(accounts: PartialAccounts): void;
    private get;
    private set;
    private resolveConst;
    private resolvePdas;
    private resolveRelations;
    private autoPopulatePda;
    private parseProgramId;
    private toBuffer;
    /**
     * Recursively get the type at some path of either a primitive or a user defined struct.
     */
    private getType;
    private toBufferConst;
    private toBufferArg;
    private argValue;
    private toBufferAccount;
    private accountValue;
    private parseAccountValue;
    private toBufferValue;
}
export declare class AccountStore<IDL extends Idl> {
    private _provider;
    private _programId;
    private _cache;
    private _idls;
    constructor(_provider: Provider, _accounts: AccountNamespace<IDL>, _programId: PublicKey);
    private ensureIdl;
    fetchAccount<T = any>({ publicKey, name, programId, }: {
        publicKey: PublicKey;
        name?: string;
        programId?: PublicKey;
    }): Promise<T>;
}
//# sourceMappingURL=accounts-resolver.d.ts.map