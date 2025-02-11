import { PublicKey } from "@solana/web3.js";
import { Coder } from "../../coder/index.js";
import Provider from "../../provider.js";
import { Idl, IdlInstruction } from "../../idl.js";
import { InstructionNamespace } from "./instruction.js";
import { TransactionNamespace } from "./transaction.js";
import { RpcNamespace } from "./rpc.js";
import { AccountNamespace } from "./account.js";
import { SimulateNamespace } from "./simulate.js";
import { MethodsNamespace } from "./methods";
import { ViewNamespace } from "./views";
import { CustomAccountResolver } from "../accounts-resolver.js";
export { InstructionNamespace, InstructionFn } from "./instruction.js";
export { TransactionNamespace, TransactionFn } from "./transaction.js";
export { RpcNamespace, RpcFn } from "./rpc.js";
export { AccountNamespace, AccountClient, ProgramAccount } from "./account.js";
export { SimulateNamespace, SimulateFn } from "./simulate.js";
export { IdlAccounts, IdlTypes, DecodeType, IdlEvents } from "./types.js";
export { MethodsBuilderFactory, MethodsNamespace } from "./methods";
export { ViewNamespace, ViewFn } from "./views";
export default class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */
    static build<IDL extends Idl>(idl: IDL, coder: Coder, programId: PublicKey, provider: Provider, getCustomResolver?: (instruction: IdlInstruction) => CustomAccountResolver<IDL> | undefined): [
        RpcNamespace<IDL>,
        InstructionNamespace<IDL>,
        TransactionNamespace<IDL>,
        AccountNamespace<IDL>,
        SimulateNamespace<IDL>,
        MethodsNamespace<IDL>,
        ViewNamespace<IDL> | undefined
    ];
}
//# sourceMappingURL=index.d.ts.map