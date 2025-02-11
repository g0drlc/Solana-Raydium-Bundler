"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLayoutEncoder = exports.setLayoutDecoder = exports.accountFlagsLayout = exports.selfTradeBehaviorLayout = exports.orderTypeLayout = exports.sideLayout = exports.VersionedLayout = exports.WideBits = exports.u128 = exports.i64 = exports.u64 = exports.publicKeyLayout = exports.zeros = void 0;
const buffer_layout_1 = require("buffer-layout");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
class Zeros extends buffer_layout_1.Blob {
    decode(b, offset) {
        const slice = super.decode(b, offset);
        if (!slice.every((v) => v === 0)) {
            throw new Error('nonzero padding bytes');
        }
        return slice;
    }
}
function zeros(length) {
    return new Zeros(length);
}
exports.zeros = zeros;
class PublicKeyLayout extends buffer_layout_1.Blob {
    constructor(property) {
        super(32, property);
    }
    decode(b, offset) {
        return new web3_js_1.PublicKey(super.decode(b, offset));
    }
    encode(src, b, offset) {
        return super.encode(src.toBuffer(), b, offset);
    }
}
function publicKeyLayout(property) {
    return new PublicKeyLayout(property);
}
exports.publicKeyLayout = publicKeyLayout;
class BNLayout extends buffer_layout_1.Blob {
    decode(b, offset) {
        return new bn_js_1.default(super.decode(b, offset), 10, 'le');
    }
    encode(src, b, offset) {
        return super.encode(src.toArrayLike(Buffer, 'le', this.span), b, offset);
    }
}
function u64(property) {
    return new BNLayout(8, property);
}
exports.u64 = u64;
function i64(property) {
    return new BNLayout(8, property);
}
exports.i64 = i64;
function u128(property) {
    return new BNLayout(16, property);
}
exports.u128 = u128;
class WideBits extends buffer_layout_1.Layout {
    constructor(property) {
        super(8, property);
        this._lower = buffer_layout_1.bits(buffer_layout_1.u32(), false);
        this._upper = buffer_layout_1.bits(buffer_layout_1.u32(), false);
    }
    addBoolean(property) {
        if (this._lower.fields.length < 32) {
            this._lower.addBoolean(property);
        }
        else {
            this._upper.addBoolean(property);
        }
    }
    decode(b, offset = 0) {
        const lowerDecoded = this._lower.decode(b, offset);
        const upperDecoded = this._upper.decode(b, offset + this._lower.span);
        return { ...lowerDecoded, ...upperDecoded };
    }
    encode(src, b, offset = 0) {
        return (this._lower.encode(src, b, offset) +
            this._upper.encode(src, b, offset + this._lower.span));
    }
}
exports.WideBits = WideBits;
class VersionedLayout extends buffer_layout_1.Layout {
    constructor(version, inner, property) {
        super(inner.span > 0 ? inner.span + 1 : inner.span, property);
        this.version = version;
        this.inner = inner;
    }
    decode(b, offset = 0) {
        // if (b.readUInt8(offset) !== this._version) {
        //   throw new Error('invalid version');
        // }
        return this.inner.decode(b, offset + 1);
    }
    encode(src, b, offset = 0) {
        b.writeUInt8(this.version, offset);
        return 1 + this.inner.encode(src, b, offset + 1);
    }
    getSpan(b, offset = 0) {
        return 1 + this.inner.getSpan(b, offset + 1);
    }
}
exports.VersionedLayout = VersionedLayout;
class EnumLayout extends buffer_layout_1.UInt {
    constructor(values, span, property) {
        super(span, property);
        this.values = values;
    }
    encode(src, b, offset) {
        if (this.values[src] !== undefined) {
            return super.encode(this.values[src], b, offset);
        }
        throw new Error('Invalid ' + this.property);
    }
    decode(b, offset) {
        const decodedValue = super.decode(b, offset);
        const entry = Object.entries(this.values).find(([, value]) => value === decodedValue);
        if (entry) {
            return entry[0];
        }
        throw new Error('Invalid ' + this.property);
    }
}
function sideLayout(property) {
    return new EnumLayout({ buy: 0, sell: 1 }, 4, property);
}
exports.sideLayout = sideLayout;
function orderTypeLayout(property) {
    return new EnumLayout({ limit: 0, ioc: 1, postOnly: 2 }, 4, property);
}
exports.orderTypeLayout = orderTypeLayout;
function selfTradeBehaviorLayout(property) {
    return new EnumLayout({ decrementTake: 0, cancelProvide: 1, abortTransaction: 2 }, 4, property);
}
exports.selfTradeBehaviorLayout = selfTradeBehaviorLayout;
const ACCOUNT_FLAGS_LAYOUT = new WideBits();
ACCOUNT_FLAGS_LAYOUT.addBoolean('initialized');
ACCOUNT_FLAGS_LAYOUT.addBoolean('market');
ACCOUNT_FLAGS_LAYOUT.addBoolean('openOrders');
ACCOUNT_FLAGS_LAYOUT.addBoolean('requestQueue');
ACCOUNT_FLAGS_LAYOUT.addBoolean('eventQueue');
ACCOUNT_FLAGS_LAYOUT.addBoolean('bids');
ACCOUNT_FLAGS_LAYOUT.addBoolean('asks');
function accountFlagsLayout(property = 'accountFlags') {
    return ACCOUNT_FLAGS_LAYOUT.replicate(property);
}
exports.accountFlagsLayout = accountFlagsLayout;
function setLayoutDecoder(layout, decoder) {
    const originalDecode = layout.decode;
    layout.decode = function decode(b, offset = 0) {
        return decoder(originalDecode.call(this, b, offset));
    };
}
exports.setLayoutDecoder = setLayoutDecoder;
function setLayoutEncoder(layout, encoder) {
    const originalEncode = layout.encode;
    layout.encode = function encode(src, b, offset) {
        return originalEncode.call(this, encoder(src), b, offset);
    };
    return layout;
}
exports.setLayoutEncoder = setLayoutEncoder;
//# sourceMappingURL=layout.js.map