import camelCase from "camelcase";
import InstructionFactory from "./instruction.js";
import TransactionFactory from "./transaction.js";
import RpcFactory from "./rpc.js";
import AccountFactory from "./account.js";
import SimulateFactory from "./simulate.js";
import { parseIdlErrors } from "../common.js";
import { MethodsBuilderFactory } from "./methods";
import ViewFactory from "./views";
export { AccountClient } from "./account.js";
export { MethodsBuilderFactory } from "./methods";
export default class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */
    static build(idl, coder, programId, provider, getCustomResolver) {
        const rpc = {};
        const instruction = {};
        const transaction = {};
        const simulate = {};
        const methods = {};
        const view = {};
        const idlErrors = parseIdlErrors(idl);
        const account = idl.accounts
            ? AccountFactory.build(idl, coder, programId, provider)
            : {};
        idl.instructions.forEach((idlIx) => {
            const ixItem = InstructionFactory.build(idlIx, (ixName, ix) => coder.instruction.encode(ixName, ix), programId);
            const txItem = TransactionFactory.build(idlIx, ixItem);
            const rpcItem = RpcFactory.build(idlIx, txItem, idlErrors, provider);
            const simulateItem = SimulateFactory.build(idlIx, txItem, idlErrors, provider, coder, programId, idl);
            const viewItem = ViewFactory.build(programId, idlIx, simulateItem, idl);
            const methodItem = MethodsBuilderFactory.build(provider, programId, idlIx, ixItem, txItem, rpcItem, simulateItem, viewItem, account, idl.types || [], getCustomResolver && getCustomResolver(idlIx));
            const name = camelCase(idlIx.name);
            instruction[name] = ixItem;
            transaction[name] = txItem;
            rpc[name] = rpcItem;
            simulate[name] = simulateItem;
            methods[name] = methodItem;
            if (viewItem) {
                view[name] = viewItem;
            }
        });
        return [
            rpc,
            instruction,
            transaction,
            account,
            simulate,
            methods,
            view,
        ];
    }
}
//# sourceMappingURL=index.js.map