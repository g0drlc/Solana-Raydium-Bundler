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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTokenAccount = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const BufferLayout = __importStar(require("buffer-layout"));
const buffer_layout_1 = require("buffer-layout");
const web3_js_1 = require("@solana/web3.js");
function uint64(property) {
    return new WrappedLayout(BufferLayout.blob(8), (b) => u64.fromBuffer(b), (n) => n.toBuffer(), property);
}
function publicKey(property) {
    return new WrappedLayout(BufferLayout.blob(32), (b) => new web3_js_1.PublicKey(b), (key) => key.toBuffer(), property);
}
function coption(layout, property) {
    return new COptionLayout(layout, property);
}
class WrappedLayout extends buffer_layout_1.Layout {
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
class COptionLayout extends buffer_layout_1.Layout {
    constructor(layout, property) {
        super(-1, property);
        this.layout = layout;
        this.discriminator = BufferLayout.u32();
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.layout.span + this.discriminator.encode(0, b, offset);
        }
        this.discriminator.encode(1, b, offset);
        return this.layout.encode(src, b, offset + 4) + 4;
    }
    decode(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return null;
        }
        else if (discriminator === 1) {
            return this.layout.decode(b, offset + 4);
        }
        throw new Error("Invalid coption " + this.layout.property);
    }
    getSpan(b, offset = 0) {
        return this.layout.getSpan(b, offset + 4) + 4;
    }
}
class u64 extends bn_js_1.default {
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 8) {
            return b;
        }
        if (b.length >= 8) {
            throw new Error("u64 too large");
        }
        const zeroPad = Buffer.alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a u64 from Buffer representation
     */
    static fromBuffer(buffer) {
        if (buffer.length !== 8) {
            throw new Error(`Invalid buffer length: ${buffer.length}`);
        }
        return new u64([...buffer]
            .reverse()
            .map((i) => `00${i.toString(16)}`.slice(-2))
            .join(""), 16);
    }
}
const TOKEN_ACCOUNT_LAYOUT = BufferLayout.struct([
    publicKey("mint"),
    publicKey("owner"),
    uint64("amount"),
    coption(publicKey(), "delegate"),
    ((p) => {
        const U = BufferLayout.union(BufferLayout.u8("discriminator"), null, p);
        U.addVariant(0, BufferLayout.struct([]), "uninitialized");
        U.addVariant(1, BufferLayout.struct([]), "initialized");
        U.addVariant(2, BufferLayout.struct([]), "frozen");
        return U;
    })("state"),
    coption(uint64(), "isNative"),
    uint64("delegatedAmount"),
    coption(publicKey(), "closeAuthority"),
]);
function decodeTokenAccount(b) {
    return TOKEN_ACCOUNT_LAYOUT.decode(b);
}
exports.decodeTokenAccount = decodeTokenAccount;
//# sourceMappingURL=token-account-layout.js.map