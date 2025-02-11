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
exports.encodeIdlAccount = exports.decodeIdlAccount = exports.seed = exports.idlAddress = void 0;
const web3_js_1 = require("@solana/web3.js");
const borsh = __importStar(require("@project-serum/borsh"));
// Deterministic IDL address as a function of the program id.
async function idlAddress(programId) {
    const base = (await web3_js_1.PublicKey.findProgramAddress([], programId))[0];
    return await web3_js_1.PublicKey.createWithSeed(base, seed(), programId);
}
exports.idlAddress = idlAddress;
// Seed for generating the idlAddress.
function seed() {
    return "anchor:idl";
}
exports.seed = seed;
const IDL_ACCOUNT_LAYOUT = borsh.struct([
    borsh.publicKey("authority"),
    borsh.vecU8("data"),
]);
function decodeIdlAccount(data) {
    return IDL_ACCOUNT_LAYOUT.decode(data);
}
exports.decodeIdlAccount = decodeIdlAccount;
function encodeIdlAccount(acc) {
    const buffer = Buffer.alloc(1000); // TODO: use a tighter buffer.
    const len = IDL_ACCOUNT_LAYOUT.encode(acc, buffer);
    return buffer.slice(0, len);
}
exports.encodeIdlAccount = encodeIdlAccount;
//# sourceMappingURL=idl.js.map