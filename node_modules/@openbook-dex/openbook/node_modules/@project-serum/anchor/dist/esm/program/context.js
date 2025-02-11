export function splitArgsAndCtx(idlIx, args) {
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
//# sourceMappingURL=context.js.map