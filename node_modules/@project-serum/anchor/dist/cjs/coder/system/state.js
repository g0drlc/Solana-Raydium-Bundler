"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemStateCoder = void 0;
class SystemStateCoder {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("System does not have state");
    }
    decode(_ix) {
        throw new Error("System does not have state");
    }
}
exports.SystemStateCoder = SystemStateCoder;
//# sourceMappingURL=state.js.map