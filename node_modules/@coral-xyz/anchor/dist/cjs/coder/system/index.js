"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemCoder = void 0;
const instruction_js_1 = require("./instruction.js");
const accounts_js_1 = require("./accounts.js");
const events_js_1 = require("./events.js");
const types_js_1 = require("./types.js");
/**
 * Coder for the System program.
 */
class SystemCoder {
    constructor(idl) {
        this.instruction = new instruction_js_1.SystemInstructionCoder(idl);
        this.accounts = new accounts_js_1.SystemAccountsCoder(idl);
        this.events = new events_js_1.SystemEventsCoder(idl);
        this.types = new types_js_1.SystemTypesCoder(idl);
    }
}
exports.SystemCoder = SystemCoder;
//# sourceMappingURL=index.js.map