export class SystemStateCoder {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("System does not have state");
    }
    decode(_ix) {
        throw new Error("System does not have state");
    }
}
//# sourceMappingURL=state.js.map