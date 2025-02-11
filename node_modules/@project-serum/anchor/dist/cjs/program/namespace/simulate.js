"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_js_1 = require("../context.js");
const event_js_1 = require("../event.js");
const error_js_1 = require("../../error.js");
class SimulateFactory {
    static build(idlIx, txFn, idlErrors, provider, coder, programId, idl) {
        const simulate = async (...args) => {
            var _a;
            const tx = txFn(...args);
            const [, ctx] = (0, context_js_1.splitArgsAndCtx)(idlIx, [...args]);
            let resp = undefined;
            if (provider.simulate === undefined) {
                throw new Error("This function requires 'Provider.simulate' to be implemented.");
            }
            try {
                resp = await provider.simulate(tx, ctx.signers, (_a = ctx.options) === null || _a === void 0 ? void 0 : _a.commitment);
            }
            catch (err) {
                throw (0, error_js_1.translateError)(err, idlErrors);
            }
            if (resp === undefined) {
                throw new Error("Unable to simulate transaction");
            }
            const logs = resp.logs;
            if (!logs) {
                throw new Error("Simulated logs not found");
            }
            const events = [];
            if (idl.events) {
                let parser = new event_js_1.EventParser(programId, coder);
                for (const event of parser.parseLogs(logs)) {
                    events.push(event);
                }
            }
            return { events, raw: logs };
        };
        return simulate;
    }
}
exports.default = SimulateFactory;
//# sourceMappingURL=simulate.js.map