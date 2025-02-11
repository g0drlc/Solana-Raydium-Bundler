"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemEventsCoder = void 0;
class SystemEventsCoder {
    constructor(_idl) { }
    decode(_log) {
        throw new Error("System program does not have events");
    }
}
exports.SystemEventsCoder = SystemEventsCoder;
//# sourceMappingURL=events.js.map