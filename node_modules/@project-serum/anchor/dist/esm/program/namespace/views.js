import { IdlCoder } from "../../coder/borsh/idl";
import { decode } from "../../utils/bytes/base64";
export default class ViewFactory {
    static build(programId, idlIx, simulateFn, idl) {
        const isMut = idlIx.accounts.find((a) => a.isMut);
        const hasReturn = !!idlIx.returns;
        if (isMut || !hasReturn)
            return;
        const view = async (...args) => {
            var _a, _b;
            let simulationResult = await simulateFn(...args);
            const returnPrefix = `Program return: ${programId} `;
            let returnLog = simulationResult.raw.find((l) => l.startsWith(returnPrefix));
            if (!returnLog) {
                throw new Error("View expected return log");
            }
            let returnData = decode(returnLog.slice(returnPrefix.length));
            let returnType = idlIx.returns;
            if (!returnType) {
                throw new Error("View expected return type");
            }
            const coder = IdlCoder.fieldLayout({ type: returnType }, Array.from([...((_a = idl.accounts) !== null && _a !== void 0 ? _a : []), ...((_b = idl.types) !== null && _b !== void 0 ? _b : [])]));
            return coder.decode(returnData);
        };
        return view;
    }
}
//# sourceMappingURL=views.js.map