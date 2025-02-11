"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateAddress = exports.validateAccounts = exports.toInstruction = exports.parseIdlErrors = void 0;
const web3_js_1 = require("@solana/web3.js");
function parseIdlErrors(idl) {
    const errors = new Map();
    if (idl.errors) {
        idl.errors.forEach((e) => {
            var _a;
            let msg = (_a = e.msg) !== null && _a !== void 0 ? _a : e.name;
            errors.set(e.code, msg);
        });
    }
    return errors;
}
exports.parseIdlErrors = parseIdlErrors;
// Allow either IdLInstruction or IdlStateMethod since the types share fields.
function toInstruction(idlIx, ...args) {
    if (idlIx.args.length != args.length) {
        throw new Error("Invalid argument length");
    }
    const ix = {};
    let idx = 0;
    idlIx.args.forEach((ixArg) => {
        ix[ixArg.name] = args[idx];
        idx += 1;
    });
    return ix;
}
exports.toInstruction = toInstruction;
// Throws error if any account required for the `ix` is not given.
function validateAccounts(ixAccounts, accounts = {}) {
    ixAccounts.forEach((acc) => {
        if ("accounts" in acc) {
            validateAccounts(acc.accounts, accounts[acc.name]);
        }
        else {
            if (accounts[acc.name] === undefined) {
                throw new Error(`Invalid arguments: ${acc.name} not provided.`);
            }
        }
    });
}
exports.validateAccounts = validateAccounts;
// Translates an address to a Pubkey.
function translateAddress(address) {
    return address instanceof web3_js_1.PublicKey ? address : new web3_js_1.PublicKey(address);
}
exports.translateAddress = translateAddress;
//# sourceMappingURL=common.js.map