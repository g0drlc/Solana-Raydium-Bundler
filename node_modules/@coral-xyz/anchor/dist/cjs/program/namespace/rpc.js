"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_js_1 = require("../context.js");
const error_js_1 = require("../../error.js");
class RpcFactory {
    static build(idlIx, txFn, idlErrors, provider) {
        const rpc = async (...args) => {
            var _a;
            const tx = txFn(...args);
            const [, ctx] = (0, context_js_1.splitArgsAndCtx)(idlIx, [...args]);
            if (provider.sendAndConfirm === undefined) {
                throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
            }
            try {
                return await provider.sendAndConfirm(tx, (_a = ctx.signers) !== null && _a !== void 0 ? _a : [], ctx.options);
            }
            catch (err) {
                throw (0, error_js_1.translateError)(err, idlErrors);
            }
        };
        return rpc;
    }
}
exports.default = RpcFactory;
//# sourceMappingURL=rpc.js.map