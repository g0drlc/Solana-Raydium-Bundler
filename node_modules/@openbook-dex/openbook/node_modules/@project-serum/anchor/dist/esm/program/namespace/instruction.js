import { TransactionInstruction } from "@solana/web3.js";
import { IdlError } from "../../error";
import { toInstruction, validateAccounts, translateAddress, } from "../common";
import { splitArgsAndCtx } from "../context";
export default class InstructionNamespaceFactory {
    static build(idlIx, encodeFn, programId) {
        if (idlIx.name === "_inner") {
            throw new IdlError("the _inner name is reserved");
        }
        const ix = (...args) => {
            const [ixArgs, ctx] = splitArgsAndCtx(idlIx, [...args]);
            validateAccounts(idlIx.accounts, ctx.accounts);
            validateInstruction(idlIx, ...args);
            const keys = ix.accounts(ctx.accounts);
            if (ctx.remainingAccounts !== undefined) {
                keys.push(...ctx.remainingAccounts);
            }
            if (ctx.__private && ctx.__private.logAccounts) {
                console.log("Outgoing account metas:", keys);
            }
            return new TransactionInstruction({
                keys,
                programId,
                data: encodeFn(idlIx.name, toInstruction(idlIx, ...ixArgs)),
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
                    pubkey: translateAddress(ctx[acc.name]),
                    isWritable: account.isMut,
                    isSigner: account.isSigner,
                };
            }
        })
            .flat();
    }
}
// Throws error if any argument required for the `ix` is not given.
function validateInstruction(ix, ...args) {
    // todo
}
//# sourceMappingURL=instruction.js.map