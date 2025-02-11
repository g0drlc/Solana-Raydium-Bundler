"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemTypesCoder = void 0;
class SystemTypesCoder {
    constructor(_idl) { }
    encode(_name, _type) {
        throw new Error("System does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("System does not have user-defined types");
    }
}
exports.SystemTypesCoder = SystemTypesCoder;
//# sourceMappingURL=types.js.map