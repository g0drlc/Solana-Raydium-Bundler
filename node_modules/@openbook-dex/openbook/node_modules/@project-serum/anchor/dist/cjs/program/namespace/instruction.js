"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const error_1 = require("../../error");
const common_1 = require("../common");
const context_1 = require("../context");
class InstructionNamespaceFactory {
    static build(idlIx, encodeFn, programId) {
        if (idlIx.name === "_inner") {
            throw new error_1.IdlError("the _inner name is reserved");
        }
        const ix = (...args) => {
            const [ixArgs, ctx] = context_1.splitArgsAndCtx(idlIx, [...args]);
            common_1.validateAccounts(idlIx.accounts, ctx.accounts);
            validateInstruction(idlIx, ...args);
            const keys = ix.accounts(ctx.accounts);
            if (ctx.remainingAccounts !== undefined) {
                keys.push(...ctx.remainingAccounts);
            }
            if (ctx.__private && ctx.__private.logAccounts) {
                console.log("Outgoing account metas:", keys);
            }
            return new web3_js_1.TransactionInstruction({
                keys,
                programId,
                data: encodeFn(idlIx.name, common_1.toInstruction(idlIx, ...ixArgs)),
            });
        };
        // Utility fn for ordering the accounts for this instruction.
        ix["accounts"] = (accs) => {
            return InstructionNamespaceFactory.accountsArray(accs, idlIx.accounts);
        };
        return ix;
    }
    static accountsArray(ctx, accounts) {
        return accounts
            .map((acc) => {
            // Nested accounts.
            // @ts-ignore
            const nestedAccounts = acc.accounts;
            if (nestedAccounts !== undefined) {
                const rpcAccs = ctx[acc.name];
                return InstructionNamespaceFactory.accountsArray(rpcAccs, nestedAccounts).flat();
            }
            else {
                const account = acc;
                return {
                    pubkey: common_1.translateAddress(ctx[acc.name]),
                    isWritable: account.isMut,
                    isSigner: account.isSigner,
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