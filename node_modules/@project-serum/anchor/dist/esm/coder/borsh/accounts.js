import bs58 from "bs58";
import { Buffer } from "buffer";
import camelcase from "camelcase";
import { sha256 } from "js-sha256";
import { IdlCoder } from "./idl.js";
import { accountSize } from "../common.js";
/**
 * Number of bytes of the account discriminator.
 */
export const ACCOUNT_DISCRIMINATOR_SIZE = 8;
/**
 * Encodes and decodes account objects.
 */
export class BorshAccountsCoder {
    constructor(idl) {
        if (idl.accounts === undefined) {
            this.accountLayouts = new Map();
            return;
        }
        const layouts = idl.accounts.map((acc) => {
            return [acc.name, IdlCoder.typeDefLayout(acc, idl.types)];
        });
        this.accountLayouts = new Map(layouts);
        this.idl = idl;
    }
    async encode(accountName, account) {
        const buffer = Buffer.alloc(1000); // TODO: use a tighter buffer.
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error(`Unknown account: ${accountName}`);
        }
        const len = layout.encode(account, buffer);
        let accountData = buffer.slice(0, len);
        let discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
        return Buffer.concat([discriminator, accountData]);
    }
    decode(accountName, data) {
        // Assert the account discriminator is correct.
        const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
        if (discriminator.compare(data.slice(0, 8))) {
            throw new Error("Invalid account discriminator");
        }
        return this.decodeUnchecked(accountName, data);
    }
    decodeAny(data) {
        const accountDescriminator = data.slice(0, 8);
        const accountName = Array.from(this.accountLayouts.keys()).find((key) => BorshAccountsCoder.accountDiscriminator(key).equals(accountDescriminator));
        if (!accountName) {
            throw new Error("Account descriminator not found");
        }
        return this.decodeUnchecked(accountName, data);
    }
    decodeUnchecked(accountName, ix) {
        // Chop off the discriminator before decoding.
        const data = ix.slice(ACCOUNT_DISCRIMINATOR_SIZE);
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error(`Unknown account: ${accountName}`);
        }
        return layout.decode(data);
    }
    memcmp(accountName, appendData) {
        const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
        return {
            offset: 0,
            bytes: bs58.encode(appendData ? Buffer.concat([discriminator, appendData]) : discriminator),
        };
    }
    size(idlAccount) {
        var _a;
        return (ACCOUNT_DISCRIMINATOR_SIZE + ((_a = accountSize(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0));
    }
    /**
     * Calculates and returns a unique 8 byte discriminator prepended to all anchor accounts.
     *
     * @param name The name of the account to calculate the discriminator.
     */
    static accountDiscriminator(name) {
        return Buffer.from(sha256.digest(`account:${camelcase(name, {
            pascalCase: true,
            preserveConsecutiveUppercase: true,
        })}`)).slice(0, ACCOUNT_DISCRIMINATOR_SIZE);
    }
}
//# sourceMappingURL=accounts.js.map