"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitArgsAndCtx = void 0;
function splitArgsAndCtx(idlIx, args) {
    let options = {};
    const inputLen = idlIx.args ? idlIx.args.length : 0;
    if (args.length > inputLen) {
        if (args.length !== inputLen + 1) {
            throw new Error("provided too many arguments ${args}");
        }
        options = args.pop();
    }
    return [args, options];
}
exports.splitArgsAndCtx = splitArgsAndCtx;
//# sourceMappingURL=context.js.map