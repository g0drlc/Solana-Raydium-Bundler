import { splitArgsAndCtx } from "../context.js";
import { translateError } from "../../error.js";
export default class RpcFactory {
    static build(idlIx, txFn, idlErrors, provider) {
        const rpc = async (...args) => {
            var _a;
            const tx = txFn(...args);
            const [, ctx] = splitArgsAndCtx(idlIx, [...args]);
            if (provider.sendAndConfirm === undefined) {
                throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
            }
            try {
                return await provider.sendAndConfirm(tx, (_a = ctx.signers) !== null && _a !== void 0 ? _a : [], ctx.options);
            }
            catch (err) {
                throw translateError(err, idlErrors);
            }
        };
        return rpc;
    }
}
//# sourceMappingURL=rpc.js.map