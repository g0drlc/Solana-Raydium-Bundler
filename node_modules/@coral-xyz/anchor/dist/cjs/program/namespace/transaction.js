"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const context_js_1 = require("../context.js");
class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = (...args) => {
            var _a, _b, _c;
            const [, ctx] = (0, context_js_1.splitArgsAndCtx)(idlIx, [...args]);
            const tx = new web3_js_1.Transaction();
            if (ctx.preInstructions && ctx.instructions) {
                throw new Error("instructions is deprecated, use preInstructions");
            }
            (_a = ctx.preInstructions) === null || _a === void 0 ? void 0 : _a.forEach((ix) => tx.add(ix));
            (_b = ctx.instructions) === null || _b === void 0 ? void 0 : _b.forEach((ix) => tx.add(ix));
            tx.add(ixFn(...args));
            (_c = ctx.postInstructions) === null || _c === void 0 ? void 0 : _c.forEach((ix) => tx.add(ix));
            return tx;
        };
        return txFn;
    }
}
exports.default = TransactionFactory;
//# sourceMappingURL=transaction.js.map