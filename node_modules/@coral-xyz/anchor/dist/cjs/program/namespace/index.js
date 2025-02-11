"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodsBuilderFactory = exports.AccountClient = void 0;
const camelcase_1 = __importDefault(require("camelcase"));
const instruction_js_1 = __importDefault(require("./instruction.js"));
const transaction_js_1 = __importDefault(require("./transaction.js"));
const rpc_js_1 = __importDefault(require("./rpc.js"));
const account_js_1 = __importDefault(require("./account.js"));
const simulate_js_1 = __importDefault(require("./simulate.js"));
const common_js_1 = require("../common.js");
const methods_1 = require("./methods");
const views_1 = __importDefault(require("./views"));
var account_js_2 = require("./account.js");
Object.defineProperty(exports, "AccountClient", { enumerable: true, get: function () { return account_js_2.AccountClient; } });
var methods_2 = require("./methods");
Object.defineProperty(exports, "MethodsBuilderFactory", { enumerable: true, get: function () { return methods_2.MethodsBuilderFactory; } });
class NamespaceFactory {
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
        const idlErrors = (0, common_js_1.parseIdlErrors)(idl);
        const account = idl.accounts
            ? account_js_1.default.build(idl, coder, programId, provider)
            : {};
        idl.instructions.forEach((idlIx) => {
            const ixItem = instruction_js_1.default.build(idlIx, (ixName, ix) => coder.instruction.encode(ixName, ix), programId);
            const txItem = transaction_js_1.default.build(idlIx, ixItem);
            const rpcItem = rpc_js_1.default.build(idlIx, txItem, idlErrors, provider);
            const simulateItem = simulate_js_1.default.build(idlIx, txItem, idlErrors, provider, coder, programId, idl);
            const viewItem = views_1.default.build(programId, idlIx, simulateItem, idl);
            const methodItem = methods_1.MethodsBuilderFactory.build(provider, programId, idlIx, ixItem, txItem, rpcItem, simulateItem, viewItem, account, idl.types || [], getCustomResolver && getCustomResolver(idlIx));
            const name = (0, camelcase_1.default)(idlIx.name);
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
exports.default = NamespaceFactory;
//# sourceMappingURL=index.js.map