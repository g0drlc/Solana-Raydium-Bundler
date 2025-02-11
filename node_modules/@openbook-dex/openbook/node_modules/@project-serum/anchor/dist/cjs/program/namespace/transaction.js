"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const context_1 = require("../context");
class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = (...args) => {
            const [, ctx] = context_1.splitArgsAndCtx(idlIx, [...args]);
            const tx = new web3_js_1.Transaction();
            if (ctx.instructions !== undefined) {
                tx.add(...ctx.instructions);
            }
            tx.add(ixFn(...args));
            return tx;
        };
        return txFn;
    }
}
exports.default = TransactionFactory;
//# sourceMappingURL=transaction.js.map