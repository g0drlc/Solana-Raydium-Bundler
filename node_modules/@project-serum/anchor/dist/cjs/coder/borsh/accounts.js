"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorshAccountsCoder = exports.ACCOUNT_DISCRIMINATOR_SIZE = void 0;
const bs58_1 = __importDefault(require("bs58"));
const buffer_1 = require("buffer");
const camelcase_1 = __importDefault(require("camelcase"));
const js_sha256_1 = require("js-sha256");
const idl_js_1 = require("./idl.js");
const common_js_1 = require("../common.js");
/**
 * Number of bytes of the account discriminator.
 */
exports.ACCOUNT_DISCRIMINATOR_SIZE = 8;
/**
 * Encodes and decodes account objects.
 */
class BorshAccountsCoder {
    constructor(idl) {
        if (idl.accounts === undefined) {
            this.accountLayouts = new Map();
            return;
        }
        const layouts = idl.accounts.map((acc) => {
            return [acc.name, idl_js_1.IdlCoder.typeDefLayout(acc, idl.types)];
        });
        this.accountLayouts = new Map(layouts);
        this.idl = idl;
    }
    async encode(accountName, account) {
        const buffer = buffer_1.Buffer.alloc(1000); // TODO: use a tighter buffer.
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error(`Unknown account: ${accountName}`);
        }
        const len = layout.encode(account, buffer);
        let accountData = buffer.slice(0, len);
        let discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
        return buffer_1.Buffer.concat([discriminator, accountData]);
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
        const data = ix.slice(exports.ACCOUNT_DISCRIMINATOR_SIZE);
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
            bytes: bs58_1.default.encode(appendData ? buffer_1.Buffer.concat([discriminator, appendData]) : discriminator),
        };
    }
    size(idlAccount) {
        var _a;
        return (exports.ACCOUNT_DISCRIMINATOR_SIZE + ((_a = (0, common_js_1.accountSize)(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0));
    }
    /**
     * Calculates and returns a unique 8 byte discriminator prepended to all anchor accounts.
     *
     * @param name The name of the account to calculate the discriminator.
     */
    static accountDiscriminator(name) {
        return buffer_1.Buffer.from(js_sha256_1.sha256.digest(`account:${(0, camelcase_1.default)(name, {
            pascalCase: true,
            preserveConsecutiveUppercase: true,
        })}`)).slice(0, exports.ACCOUNT_DISCRIMINATOR_SIZE);
    }
}
exports.BorshAccountsCoder = BorshAccountsCoder;
//# sourceMappingURL=accounts.js.map