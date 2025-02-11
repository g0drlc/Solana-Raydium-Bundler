import { PublicKey } from "@solana/web3.js";
export function parseIdlErrors(idl) {
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
// Allow either IdLInstruction or IdlStateMethod since the types share fields.
export function toInstruction(idlIx, ...args) {
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
// Throws error if any account required for the `ix` is not given.
export function validateAccounts(ixAccounts, accounts) {
    ixAccounts.forEach((acc) => {
        // @ts-ignore
        if (acc.accounts !== undefined) {
            // @ts-ignore
            validateAccounts(acc.accounts, accounts[acc.name]);
        }
        else {
            if (accounts[acc.name] === undefined) {
                throw new Error(`Invalid arguments: ${acc.name} not provided.`);
            }
        }
    });
}
// Translates an address to a Pubkey.
export function translateAddress(address) {
    if (typeof address === "string") {
        const pk = new PublicKey(address);
        return pk;
    }
    else {
        return address;
    }
}
//# sourceMappingURL=common.js.map