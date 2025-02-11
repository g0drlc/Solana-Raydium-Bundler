import BN from "bn.js";
import * as BufferLayout from "buffer-layout";
import { Layout } from "buffer-layout";
import { PublicKey } from "@solana/web3.js";
function uint64(property) {
    return new WrappedLayout(BufferLayout.blob(8), (b) => u64.fromBuffer(b), (n) => n.toBuffer(), property);
}
function publicKey(property) {
    return new WrappedLayout(BufferLayout.blob(32), (b) => new PublicKey(b), (key) => key.toBuffer(), property);
}
function coption(layout, property) {
    return new COptionLayout(layout, property);
}
class WrappedLayout extends Layout {
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
class COptionLayout extends Layout {
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
class u64 extends BN {
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
export function decodeTokenAccount(b) {
    return TOKEN_ACCOUNT_LAYOUT.decode(b);
}
//# sourceMappingURL=token-account-layout.js.map