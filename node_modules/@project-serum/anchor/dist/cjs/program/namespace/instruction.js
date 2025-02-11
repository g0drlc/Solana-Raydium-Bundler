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
const web3_js_1 = require("@solana/web3.js");
const error_js_1 = require("../../error.js");
const common_js_1 = require("../common.js");
const context_js_1 = require("../context.js");
const features = __importStar(require("../../utils/features.js"));
class InstructionNamespaceFactory {
    static build(idlIx, encodeFn, programId) {
        if (idlIx.name === "_inner") {
            throw new error_js_1.IdlError("the _inner name is reserved");
        }
        const ix = (...args) => {
            const [ixArgs, ctx] = (0, context_js_1.splitArgsAndCtx)(idlIx, [...args]);
            (0, common_js_1.validateAccounts)(idlIx.accounts, ctx.accounts);
            validateInstruction(idlIx, ...args);
            const keys = ix.accounts(ctx.accounts);
            if (ctx.remainingAccounts !== undefined) {
                keys.push(...ctx.remainingAccounts);
            }
            if (features.isSet("debug-logs")) {
                console.log("Outgoing account metas:", keys);
            }
            return new web3_js_1.TransactionInstruction({
                keys,
                programId,
                data: encodeFn(idlIx.name, (0, common_js_1.toInstruction)(idlIx, ...ixArgs)),
            });
        };
        // Utility fn for ordering the accounts for this instruction.
        ix["accounts"] = (accs) => {
            return InstructionNamespaceFactory.accountsArray(accs, idlIx.accounts, programId, idlIx.name);
        };
        return ix;
    }
    static accountsArray(ctx, accounts, programId, ixName) {
        if (!ctx) {
            return [];
        }
        return accounts
            .map((acc) => {
            // Nested accounts.
            const nestedAccounts = "accounts" in acc ? acc.accounts : undefined;
            if (nestedAccounts !== undefined) {
                const rpcAccs = ctx[acc.name];
                return InstructionNamespaceFactory.accountsArray(rpcAccs, acc.accounts, programId, ixName).flat();
            }
            else {
                const account = acc;
                let pubkey;
                try {
                    pubkey = (0, common_js_1.translateAddress)(ctx[acc.name]);
                }
                catch (err) {
                    throw new Error(`Wrong input type for account "${acc.name}" in the instruction accounts object${ixName !== undefined ? ' for instruction "' + ixName + '"' : ""}. Expected PublicKey or string.`);
                }
                const optional = account.isOptional && pubkey.equals(programId);
                const isWritable = account.isMut && !optional;
                const isSigner = account.isSigner && !optional;
                return {
                    pubkey,
                    isWritable,
                    isSigner,
                };
            }
        })
            .flat();
    }
}
exports.default = InstructionNamespaceFactory;
// Throws error if any argument required for the `ix` is not given.
function validateInstruction(ix, ...args) {
    // todo
}
//# sourceMappingURL=instruction.js.map