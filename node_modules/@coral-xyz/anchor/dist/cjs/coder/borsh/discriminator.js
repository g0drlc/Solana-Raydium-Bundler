"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discriminator = exports.DISCRIMINATOR_SIZE = void 0;
const sha256_1 = require("@noble/hashes/sha256");
/**
 * Number of bytes in anchor discriminators
 */
exports.DISCRIMINATOR_SIZE = 8;
function discriminator(preimage) {
    return Buffer.from((0, sha256_1.sha256)(preimage).slice(0, exports.DISCRIMINATOR_SIZE));
}
exports.discriminator = discriminator;
//# sourceMappingURL=discriminator.js.map