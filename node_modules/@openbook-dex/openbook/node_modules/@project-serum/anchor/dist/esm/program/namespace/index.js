import camelCase from "camelcase";
import StateFactory from "./state";
import InstructionFactory from "./instruction";
import TransactionFactory from "./transaction";
import RpcFactory from "./rpc";
import AccountFactory from "./account";
import SimulateFactory from "./simulate";
import { parseIdlErrors } from "../common";
// Re-exports.
export { StateClient } from "./state";
export { AccountClient } from "./account";
export default class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */
    static build(idl, coder, programId, provider) {
        const rpc = {};
        const instruction = {};
        const transaction = {};
        const simulate = {};
        const idlErrors = parseIdlErrors(idl);
        const state = StateFactory.build(idl, coder, programId, provider);
        idl.instructions.forEach((idlIx) => {
            const ixItem = InstructionFactory.build(idlIx, (ixName, ix) => coder.instruction.encode(ixName, ix), programId);
            const txItem = TransactionFactory.build(idlIx, ixItem);
            const rpcItem = RpcFactory.build(idlIx, txItem, idlErrors, provider);
            const simulateItem = SimulateFactory.build(idlIx, txItem, idlErrors, provider, coder, programId, idl);
            const name = camelCase(idlIx.name);
            instruction[name] = ixItem;
            transaction[name] = txItem;
            rpc[name] = rpcItem;
            simulate[name] = simulateItem;
        });
        const account = idl.accounts
            ? AccountFactory.build(idl, coder, programId, provider)
            : {};
        return [rpc, instruction, transaction, account, simulate, state];
    }
}
//# sourceMappingURL=index.js.map