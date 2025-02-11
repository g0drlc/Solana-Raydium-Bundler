"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.eventDiscriminator = exports.EventCoder = void 0;
const base64 = __importStar(require("base64-js"));
const js_sha256_1 = require("js-sha256");
const idl_1 = require("./idl");
class EventCoder {
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
            return [event.name, idl_1.IdlCoder.typeDefLayout(eventTypeDef, idl.types)];
        });
        // @ts-ignore
        this.layouts = new Map(layouts);
        this.discriminators = new Map(idl.events === undefined
            ? []
            : idl.events.map((e) => [
                base64.fromByteArray(eventDiscriminator(e.name)),
                e.name,
            ]));
    }
    decode(log) {
        let logArr;
        // This will throw if log length is not a multiple of 4.
        try {
            logArr = Buffer.from(base64.toByteArray(log));
        }
        catch (e) {
            return null;
        }
        const disc = base64.fromByteArray(logArr.slice(0, 8));
        // Only deserialize if the discriminator implies a proper event.
        const eventName = this.discriminators.get(disc);
        if (eventName === undefined) {
            return null;
        }
        const layout = this.layouts.get(eventName);
        const data = layout.decode(logArr.slice(8));
        return { data, name: eventName };
    }
}
exports.EventCoder = EventCoder;
function eventDiscriminator(name) {
    return Buffer.from(js_sha256_1.sha256.digest(`event:${name}`)).slice(0, 8);
}
exports.eventDiscriminator = eventDiscriminator;
//# sourceMappingURL=event.js.map