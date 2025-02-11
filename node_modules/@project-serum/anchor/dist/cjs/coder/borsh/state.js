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
exports.stateDiscriminator = exports.BorshStateCoder = void 0;
const buffer_1 = require("buffer");
const js_sha256_1 = require("js-sha256");
const idl_js_1 = require("./idl.js");
const features = __importStar(require("../../utils/features.js"));
class BorshStateCoder {
    constructor(idl) {
        if (idl.state === undefined) {
            throw new Error("Idl state not defined.");
        }
        this.layout = idl_js_1.IdlCoder.typeDefLayout(idl.state.struct, idl.types);
    }
    async encode(name, account) {
        const buffer = buffer_1.Buffer.alloc(1000); // TODO: use a tighter buffer.
        const len = this.layout.encode(account, buffer);
        const disc = await stateDiscriminator(name);
        const accData = buffer.slice(0, len);
        return buffer_1.Buffer.concat([disc, accData]);
    }
    decode(ix) {
        // Chop off discriminator.
        const data = ix.slice(8);
        return this.layout.decode(data);
    }
}
exports.BorshStateCoder = BorshStateCoder;
// Calculates unique 8 byte discriminator prepended to all anchor state accounts.
async function stateDiscriminator(name) {
    let ns = features.isSet("anchor-deprecated-state") ? "account" : "state";
    return buffer_1.Buffer.from(js_sha256_1.sha256.digest(`${ns}:${name}`)).slice(0, 8);
}
exports.stateDiscriminator = stateDiscriminator;
//# sourceMappingURL=state.js.map