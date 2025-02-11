import { AccountMeta, ConfirmOptions, PublicKey, Signer, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { Idl, IdlAccountItem, IdlAccounts, IdlTypeDef } from "../../idl.js";
import Provider from "../../provider.js";
import { AccountsGeneric, CustomAccountResolver } from "../accounts-resolver.js";
import { Address } from "../common.js";
import { Accounts } from "../context.js";
import { AccountNamespace } from "./account.js";
import { InstructionFn } from "./instruction.js";
import { RpcFn } from "./rpc.js";
import { SimulateFn, SimulateResponse } from "./simulate.js";
import { TransactionFn } from "./transaction.js";
import { AllInstructions, InstructionAccountAddresses, MakeMethodsNamespace, MethodsFn } from "./types.js";
import { ViewFn } from "./views.js";
export type MethodsNamespace<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = MakeMethodsNamespace<IDL, I>;
export declare class MethodsBuilderFactory {
    static build<IDL extends Idl, I extends AllInstructions<IDL>>(provider: Provider, programId: PublicKey, idlIx: AllInstructions<IDL>, ixFn: InstructionFn<IDL>, txFn: TransactionFn<IDL>, rpcFn: RpcFn<IDL>, simulateFn: SimulateFn<IDL>, viewFn: ViewFn<IDL> | undefined, accountNamespace: AccountNamespace<IDL>, idlTypes: IdlTypeDef[], customResolver?: CustomAccountResolver<IDL>): MethodsFn<IDL, I, MethodsBuilder<IDL, I>>;
}
export type PartialAccounts<A extends IdlAccountItem = IdlAccountItem> = Partial<{
    [N in A["name"]]: PartialAccount<A & {
        name: N;
    }>;
}>;
type PartialAccount<A extends IdlAccountItem> = A extends IdlAccounts ? PartialAccounts<A["accounts"][number]> : A extends {
    isOptional: true;
} ? Address | null : Address;
export declare function isPartialAccounts(partialAccount: PartialAccount<IdlAccountItem>): partialAccount is PartialAccounts;
export declare function flattenPartialAccounts<A extends IdlAccountItem>(partialAccounts: PartialAccounts<A>, throwOnNull: boolean): AccountsGeneric;
export declare class MethodsBuilder<IDL extends Idl, I extends AllInstructions<IDL>> {
    private _ixFn;
    private _txFn;
    private _rpcFn;
    private _simulateFn;
    private _viewFn;
    private _programId;
    private readonly _accounts;
    private _remainingAccounts;
    private _signers;
    private _preInstructions;
    private _postInstructions;
    private _accountsResolver;
    private _autoResolveAccounts;
    private _args;
    constructor(_args: Array<any>, _ixFn: InstructionFn<IDL>, _txFn: TransactionFn<IDL>, _rpcFn: RpcFn<IDL>, _simulateFn: SimulateFn<IDL>, _viewFn: ViewFn<IDL> | undefined, _provider: Provider, _programId: PublicKey, _idlIx: AllInstructions<IDL>, _accountNamespace: AccountNamespace<IDL>, _idlTypes: IdlTypeDef[], _customResolver?: CustomAccountResolver<IDL>);
    args(_args: Array<any>): void;
    pubkeys(): Promise<Partial<InstructionAccountAddresses<IDL, I>>>;
    accounts(accounts: PartialAccounts<I["accounts"][number]>): MethodsBuilder<IDL, I>;
    accountsStrict(accounts: Accounts<I["accounts"][number]>): MethodsBuilder<IDL, I>;
    signers(signers: Array<Signer>): MethodsBuilder<IDL, I>;
    remainingAccounts(accounts: Array<AccountMeta>): MethodsBuilder<IDL, I>;
    preInstructions(ixs: Array<TransactionInstruction>): MethodsBuilder<IDL, I>;
    postInstructions(ixs: Array<TransactionInstruction>): MethodsBuilder<IDL, I>;
    rpc(options?: ConfirmOptions): Promise<TransactionSignature>;
    rpcAndKeys(options?: ConfirmOptions): Promise<{
        pubkeys: Partial<InstructionAccountAddresses<IDL, I>>;
        signature: TransactionSignature;
    }>;
    view(options?: ConfirmOptions): Promise<any>;
    simulate(options?: ConfirmOptions): Promise<SimulateResponse<any, any>>;
    instruction(): Promise<TransactionInstruction>;
    /**
     * Convenient shortcut to get instructions and pubkeys via
     * const { pubkeys, instructions } = await prepare();
     */
    prepare(): Promise<{
        pubkeys: Partial<InstructionAccountAddresses<IDL, I>>;
        instruction: TransactionInstruction;
        signers: Signer[];
    }>;
    transaction(): Promise<Transaction>;
}
export {};
//# sourceMappingURL=methods.d.ts.map