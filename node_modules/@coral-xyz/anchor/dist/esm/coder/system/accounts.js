import * as BufferLayout from "buffer-layout";
import { NONCE_ACCOUNT_LENGTH, PublicKey } from "@solana/web3.js";
import { accountSize } from "../common.js";
export class SystemAccountsCoder {
    constructor(idl) {
        this.idl = idl;
    }
    async encode(accountName, account) {
        switch (accountName) {
            case "nonce": {
                const buffer = Buffer.alloc(NONCE_ACCOUNT_LENGTH);
                const len = NONCE_ACCOUNT_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch (accountName) {
            case "nonce": {
                return decodeNonceAccount(ix);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    // TODO: this won't use the appendData.
    memcmp(accountName, _appendData) {
        switch (accountName) {
            case "nonce": {
                return {
                    dataSize: NONCE_ACCOUNT_LENGTH,
                };
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(idlAccount) {
        var _a;
        return (_a = accountSize(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0;
    }
}
function decodeNonceAccount(ix) {
    return NONCE_ACCOUNT_LAYOUT.decode(ix);
}
class WrappedLayout extends BufferLayout.Layout {
    constructor(layout, decoder, encoder, property) {
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
}
function publicKey(property) {
    return new WrappedLayout(BufferLayout.blob(32), (b) => new PublicKey(b), (key) => key.toBuffer(), property);
}
const NONCE_ACCOUNT_LAYOUT = BufferLayout.struct([
    BufferLayout.u32("version"),
    BufferLayout.u32("state"),
    publicKey("authorizedPubkey"),
    publicKey("nonce"),
    BufferLayout.struct([BufferLayout.nu64("lamportsPerSignature")], "feeCalculator"),
]);
//# sourceMappingURL=accounts.js.map