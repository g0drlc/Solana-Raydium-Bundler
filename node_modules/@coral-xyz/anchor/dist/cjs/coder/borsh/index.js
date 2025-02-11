"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorshCoder = exports.eventDiscriminator = exports.BorshEventCoder = exports.DISCRIMINATOR_SIZE = exports.BorshAccountsCoder = exports.BorshInstructionCoder = void 0;
const instruction_js_1 = require("./instruction.js");
const accounts_js_1 = require("./accounts.js");
const event_js_1 = require("./event.js");
const types_js_1 = require("./types.js");
var instruction_js_2 = require("./instruction.js");
Object.defineProperty(exports, "BorshInstructionCoder", { enumerable: true, get: function () { return instruction_js_2.BorshInstructionCoder; } });
var accounts_js_2 = require("./accounts.js");
Object.defineProperty(exports, "BorshAccountsCoder", { enumerable: true, get: function () { return accounts_js_2.BorshAccountsCoder; } });
var discriminator_js_1 = require("./discriminator.js");
Object.defineProperty(exports, "DISCRIMINATOR_SIZE", { enumerable: true, get: function () { return discriminator_js_1.DISCRIMINATOR_SIZE; } });
var event_js_2 = require("./event.js");
Object.defineProperty(exports, "BorshEventCoder", { enumerable: true, get: function () { return event_js_2.BorshEventCoder; } });
Object.defineProperty(exports, "eventDiscriminator", { enumerable: true, get: function () { return event_js_2.eventDiscriminator; } });
/**
 * BorshCoder is the default Coder for Anchor programs implementing the
 * borsh based serialization interface.
 */
class BorshCoder {
    constructor(idl) {
        this.instruction = new instruction_js_1.BorshInstructionCoder(idl);
        this.accounts = new accounts_js_1.BorshAccountsCoder(idl);
        this.events = new event_js_1.BorshEventCoder(idl);
        this.types = new types_js_1.BorshTypesCoder(idl);
    }
}
exports.BorshCoder = BorshCoder;
//# sourceMappingURL=index.js.map