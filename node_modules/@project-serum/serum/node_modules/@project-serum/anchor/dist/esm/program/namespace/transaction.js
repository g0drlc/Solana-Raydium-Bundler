import { Transaction } from "@solana/web3.js";
import { splitArgsAndCtx } from "../context";
export default class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = (...args) => {
            const [, ctx] = splitArgsAndCtx(idlIx, [...args]);
            const tx = new Transaction();
            if (ctx.instructions !== undefined) {
                tx.add(...ctx.instructions);
            }
            tx.add(ixFn(...args));
            return tx;
        };
        return txFn;
    }
}
//# sourceMappingURL=transaction.js.map