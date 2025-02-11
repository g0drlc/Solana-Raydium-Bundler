import { PublicKey } from "@solana/web3.js";
import Coder from "../../coder";
import Provider from "../../provider";
import { Idl } from "../../idl";
import { StateClient } from "./state";
import { InstructionNamespace } from "./instruction";
import { TransactionNamespace } from "./transaction";
import { RpcNamespace } from "./rpc";
import { AccountNamespace } from "./account";
import { SimulateNamespace } from "./simulate";
export { StateClient } from "./state";
export { InstructionNamespace, InstructionFn } from "./instruction";
export { TransactionNamespace, TransactionFn } from "./transaction";
export { RpcNamespace, RpcFn } from "./rpc";
export { AccountNamespace, AccountClient, ProgramAccount } from "./account";
export { SimulateNamespace, SimulateFn } from "./simulate";
export default class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */
    static build(idl: Idl, coder: Coder, programId: PublicKey, provider: Provider): [
        RpcNamespace,
        InstructionNamespace,
        TransactionNamespace,
        AccountNamespace,
        SimulateNamespace,
        StateClient
    ];
}
//# sourceMappingURL=index.d.ts.map