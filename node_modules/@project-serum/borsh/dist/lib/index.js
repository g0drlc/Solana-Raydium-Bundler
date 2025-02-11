"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.array = exports.rustEnum = exports.str = exports.vecU8 = exports.tagged = exports.vec = exports.bool = exports.option = exports.publicKey = exports.i128 = exports.u128 = exports.i64 = exports.u64 = exports.struct = exports.f64 = exports.f32 = exports.i32 = exports.u32 = exports.i16 = exports.u16 = exports.i8 = exports.u8 = void 0;
const buffer_layout_1 = require("buffer-layout");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
var buffer_layout_2 = require("buffer-layout");
Object.defineProperty(exports, "u8", { enumerable: true, get: function () { return buffer_layout_2.u8; } });
Object.defineProperty(exports, "i8", { enumerable: true, get: function () { return buffer_layout_2.s8; } });
Object.defineProperty(exports, "u16", { enumerable: true, get: function () { return buffer_layout_2.u16; } });
Object.defineProperty(exports, "i16", { enumerable: true, get: function () { return buffer_layout_2.s16; } });
Object.defineProperty(exports, "u32", { enumerable: true, get: function () { return buffer_layout_2.u32; } });
Object.defineProperty(exports, "i32", { enumerable: true, get: function () { return buffer_layout_2.s32; } });
Object.defineProperty(exports, "f32", { enumerable: true, get: function () { return buffer_layout_2.f32; } });
Object.defineProperty(exports, "f64", { enumerable: true, get: function () { return buffer_layout_2.f64; } });
Object.defineProperty(exports, "struct", { enumerable: true, get: function () { return buffer_layout_2.struct; } });
class BNLayout extends buffer_layout_1.Layout {
    constructor(span, signed, property) {
        super(span, property);
        this.blob = buffer_layout_1.blob(span);
        this.signed = signed;
    }
    decode(b, offset = 0) {
        const num = new bn_js_1.default(this.blob.decode(b, offset), 10, 'le');
        if (this.signed) {
            return num.fromTwos(this.span * 8).clone();
        }
        return num;
    }
    encode(src, b, offset = 0) {
        if (this.signed) {
            src = src.toTwos(this.span * 8);
        }
        return this.blob.encode(src.toArrayLike(Buffer, 'le', this.span), b, offset);
    }
}
function u64(property) {
    return new BNLayout(8, false, property);
}
exports.u64 = u64;
function i64(property) {
    return new BNLayout(8, true, property);
}
exports.i64 = i64;
function u128(property) {
    return new BNLayout(16, false, property);
}
exports.u128 = u128;
function i128(property) {
    return new BNLayout(16, true, property);
}
exports.i128 = i128;
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
function publicKey(property) {
    return new WrappedLayout(buffer_layout_1.blob(32), (b) => new web3_js_1.PublicKey(b), (key) => key.toBuffer(), property);
}
exports.publicKey = publicKey;
class OptionLayout extends buffer_layout_1.Layout {
    constructor(layout, property) {
        super(-1, property);
        this.layout = layout;
        this.discriminator = buffer_layout_1.u8();
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.discriminator.encode(0, b, offset);
        }
        this.discriminator.encode(1, b, offset);
        return this.layout.encode(src, b, offset + 1) + 1;
    }
    decode(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return null;
        }
        else if (discriminator === 1) {
            return this.layout.decode(b, offset + 1);
        }
        throw new Error('Invalid option ' + this.property);
    }
    getSpan(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return 1;
        }
        else if (discriminator === 1) {
            return this.layout.getSpan(b, offset + 1) + 1;
        }
        throw new Error('Invalid option ' + this.property);
    }
}
function option(layout, property) {
    return new OptionLayout(layout, property);
}
exports.option = option;
function bool(property) {
    return new WrappedLayout(buffer_layout_1.u8(), decodeBool, encodeBool, property);
}
exports.bool = bool;
function decodeBool(value) {
    if (value === 0) {
        return false;
    }
    else if (value === 1) {
        return true;
    }
    throw new Error('Invalid bool: ' + value);
}
function encodeBool(value) {
    return value ? 1 : 0;
}
function vec(elementLayout, property) {
    const length = buffer_layout_1.u32('length');
    const layout = buffer_layout_1.struct([
        length,
        buffer_layout_1.seq(elementLayout, buffer_layout_1.offset(length, -length.span), 'values'),
    ]);
    return new WrappedLayout(layout, ({ values }) => values, values => ({ values }), property);
}
exports.vec = vec;
function tagged(tag, layout, property) {
    const wrappedLayout = buffer_layout_1.struct([
        u64('tag'),
        layout.replicate('data'),
    ]);
    function decodeTag({ tag: receivedTag, data }) {
        if (!receivedTag.eq(tag)) {
            throw new Error('Invalid tag, expected: ' +
                tag.toString('hex') +
                ', got: ' +
                receivedTag.toString('hex'));
        }
        return data;
    }
    return new WrappedLayout(wrappedLayout, decodeTag, data => ({ tag, data }), property);
}
exports.tagged = tagged;
function vecU8(property) {
    const length = buffer_layout_1.u32('length');
    const layout = buffer_layout_1.struct([
        length,
        buffer_layout_1.blob(buffer_layout_1.offset(length, -length.span), 'data'),
    ]);
    return new WrappedLayout(layout, ({ data }) => data, data => ({ data }), property);
}
exports.vecU8 = vecU8;
function str(property) {
    return new WrappedLayout(vecU8(), data => data.toString('utf-8'), s => Buffer.from(s, 'utf-8'), property);
}
exports.str = str;
function rustEnum(variants, property, discriminant) {
    const unionLayout = buffer_layout_1.union(discriminant !== null && discriminant !== void 0 ? discriminant : buffer_layout_1.u8(), property);
    variants.forEach((variant, index) => unionLayout.addVariant(index, variant, variant.property));
    return unionLayout;
}
exports.rustEnum = rustEnum;
function array(elementLayout, length, property) {
    const layout = buffer_layout_1.struct([
        buffer_layout_1.seq(elementLayout, length, 'values'),
    ]);
    return new WrappedLayout(layout, ({ values }) => values, values => ({ values }), property);
}
exports.array = array;
class MapEntryLayout extends buffer_layout_1.Layout {
    constructor(keyLayout, valueLayout, property) {
        super(keyLayout.span + valueLayout.span, property);
        this.keyLayout = keyLayout;
        this.valueLayout = valueLayout;
    }
    decode(b, offset) {
        offset = offset || 0;
        const key = this.keyLayout.decode(b, offset);
        const value = this.valueLayout.decode(b, offset + this.keyLayout.getSpan(b, offset));
        return [key, value];
    }
    encode(src, b, offset) {
        offset = offset || 0;
        const keyBytes = this.keyLayout.encode(src[0], b, offset);
        const valueBytes = this.valueLayout.encode(src[1], b, offset + keyBytes);
        return keyBytes + valueBytes;
    }
    getSpan(b, offset) {
        return (this.keyLayout.getSpan(b, offset) + this.valueLayout.getSpan(b, offset));
    }
}
function map(keyLayout, valueLayout, property) {
    const length = buffer_layout_1.u32('length');
    const layout = buffer_layout_1.struct([
        length,
        buffer_layout_1.seq(new MapEntryLayout(keyLayout, valueLayout), buffer_layout_1.offset(length, -length.span), 'values'),
    ]);
    return new WrappedLayout(layout, ({ values }) => new Map(values), values => ({ values: Array.from(values.entries()) }), property);
}
exports.map = map;
//# sourceMappingURL=index.js.map