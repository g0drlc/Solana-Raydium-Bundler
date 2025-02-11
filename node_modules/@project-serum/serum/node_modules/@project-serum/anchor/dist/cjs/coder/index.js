"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateDiscriminator = exports.StateCoder = exports.eventDiscriminator = exports.EventCoder = exports.ACCOUNT_DISCRIMINATOR_SIZE = exports.accountDiscriminator = exports.AccountsCoder = exports.InstructionCoder = exports.TypesCoder = exports.accountSize = void 0;
const instruction_1 = require("./instruction");
const accounts_1 = require("./accounts");
const types_1 = require("./types");
const event_1 = require("./event");
const state_1 = require("./state");
const common_1 = require("./common");
var common_2 = require("./common");
Object.defineProperty(exports, "accountSize", { enumerable: true, get: function () { return common_2.accountSize; } });
var types_2 = require("./types");
Object.defineProperty(exports, "TypesCoder", { enumerable: true, get: function () { return types_2.TypesCoder; } });
var instruction_2 = require("./instruction");
Object.defineProperty(exports, "InstructionCoder", { enumerable: true, get: function () { return instruction_2.InstructionCoder; } });
var accounts_2 = require("./accounts");
Object.defineProperty(exports, "AccountsCoder", { enumerable: true, get: function () { return accounts_2.AccountsCoder; } });
Object.defineProperty(exports, "accountDiscriminator", { enumerable: true, get: function () { return accounts_2.accountDiscriminator; } });
Object.defineProperty(exports, "ACCOUNT_DISCRIMINATOR_SIZE", { enumerable: true, get: function () { return accounts_2.ACCOUNT_DISCRIMINATOR_SIZE; } });
var event_2 = require("./event");
Object.defineProperty(exports, "EventCoder", { enumerable: true, get: function () { return event_2.EventCoder; } });
Object.defineProperty(exports, "eventDiscriminator", { enumerable: true, get: function () { return event_2.eventDiscriminator; } });
var state_2 = require("./state");
Object.defineProperty(exports, "StateCoder", { enumerable: true, get: function () { return state_2.StateCoder; } });
Object.defineProperty(exports, "stateDiscriminator", { enumerable: true, get: function () { return state_2.stateDiscriminator; } });
/**
 * Coder provides a facade for encoding and decoding all IDL related objects.
 */
class Coder {
    constructor(idl) {
        this.instruction = new instruction_1.InstructionCoder(idl);
        this.accounts = new accounts_1.AccountsCoder(idl);
        this.types = new types_1.TypesCoder(idl);
        this.events = new event_1.EventCoder(idl);
        if (idl.state) {
            this.state = new state_1.StateCoder(idl);
        }
    }
    sighash(nameSpace, ixName) {
        return common_1.sighash(nameSpace, ixName);
    }
}
exports.default = Coder;
//# sourceMappingURL=index.js.map