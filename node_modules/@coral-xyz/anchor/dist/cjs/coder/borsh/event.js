"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventDiscriminator = exports.BorshEventCoder = void 0;
const base64 = __importStar(require("../../utils/bytes/base64.js"));
const idl_js_1 = require("./idl.js");
const discriminator_js_1 = require("./discriminator.js");
class BorshEventCoder {
    constructor(idl) {
        if (idl.events === undefined) {
            this.layouts = new Map();
            return;
        }
        const layouts = idl.events.map((event) => {
            let eventTypeDef = {
                name: event.name,
                type: {
                    kind: "struct",
                    fields: event.fields.map((f) => {
                        return { name: f.name, type: f.type };
                    }),
                },
            };
            return [event.name, idl_js_1.IdlCoder.typeDefLayout(eventTypeDef, idl.types)];
        });
        this.layouts = new Map(layouts);
        this.discriminators = new Map(idl.events === undefined
            ? []
            : idl.events.map((e) => [
                base64.encode(eventDiscriminator(e.name)),
                e.name,
            ]));
    }
    decode(log) {
        let logArr;
        // This will throw if log length is not a multiple of 4.
        try {
            logArr = base64.decode(log);
        }
        catch (e) {
            return null;
        }
        const disc = base64.encode(logArr.slice(0, 8));
        // Only deserialize if the discriminator implies a proper event.
        const eventName = this.discriminators.get(disc);
        if (eventName === undefined) {
            return null;
        }
        const layout = this.layouts.get(eventName);
        if (!layout) {
            throw new Error(`Unknown event: ${eventName}`);
        }
        const data = layout.decode(logArr.slice(8));
        return { data, name: eventName };
    }
}
exports.BorshEventCoder = BorshEventCoder;
function eventDiscriminator(name) {
    return (0, discriminator_js_1.discriminator)(`event:${name}`);
}
exports.eventDiscriminator = eventDiscriminator;
//# sourceMappingURL=event.js.map