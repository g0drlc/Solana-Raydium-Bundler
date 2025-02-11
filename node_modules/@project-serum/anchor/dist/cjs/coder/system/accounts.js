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
exports.SystemAccountsCoder = void 0;
const BufferLayout = __importStar(require("buffer-layout"));
const web3_js_1 = require("@solana/web3.js");
const common_js_1 = require("../common.js");
class SystemAccountsCoder {
    constructor(idl) {
        this.idl = idl;
    }
    async encode(accountName, account) {
        switch (accountName) {
            case "nonce": {
                const buffer = Buffer.alloc(web3_js_1.NONCE_ACCOUNT_LENGTH);
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
                    dataSize: web3_js_1.NONCE_ACCOUNT_LENGTH,
                };
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(idlAccount) {
        var _a;
        return (_a = (0, common_js_1.accountSize)(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0;
    }
}
exports.SystemAccountsCoder = SystemAccountsCoder;
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
    return new WrappedLayout(BufferLayout.blob(32), (b) => new web3_js_1.PublicKey(b), (key) => key.toBuffer(), property);
}
const NONCE_ACCOUNT_LAYOUT = BufferLayout.struct([
    BufferLayout.u32("version"),
    BufferLayout.u32("state"),
    publicKey("authorizedPubkey"),
    publicKey("nonce"),
    BufferLayout.struct([BufferLayout.nu64("lamportsPerSignature")], "feeCalculator"),
]);
//# sourceMappingURL=accounts.js.map