import { IdlCoder } from "./idl";
import { sha256 } from "js-sha256";
/**
 * Number of bytes of the account discriminator.
 */
export const ACCOUNT_DISCRIMINATOR_SIZE = 8;
/**
 * Encodes and decodes account objects.
 */
export class AccountsCoder {
    constructor(idl) {
        if (idl.accounts === undefined) {
            this.accountLayouts = new Map();
            return;
        }
        const layouts = idl.accounts.map((acc) => {
            return [acc.name, IdlCoder.typeDefLayout(acc, idl.types)];
        });
        this.accountLayouts = new Map(layouts);
    }
    async encode(accountName, account) {
        const buffer = Buffer.alloc(1000); // TODO: use a tighter buffer.
        const layout = this.accountLayouts.get(accountName);
        const len = layout.encode(account, buffer);
        let accountData = buffer.slice(0, len);
        let discriminator = await accountDiscriminator(accountName);
        return Buffer.concat([discriminator, accountData]);
    }
    decode(accountName, ix) {
        // Chop off the discriminator before decoding.
        const data = ix.slice(8);
        const layout = this.accountLayouts.get(accountName);
        return layout.decode(data);
    }
}
// Calculates unique 8 byte discriminator prepended to all anchor accounts.
export async function accountDiscriminator(name) {
    return Buffer.from(sha256.digest(`account:${name}`)).slice(0, 8);
}
//# sourceMappingURL=accounts.js.map