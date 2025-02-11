"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associated = exports.createWithSeedSync = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const common_js_1 = require("../program/common.js");
const sha256_1 = require("@noble/hashes/sha256");
// Sync version of web3.PublicKey.createWithSeed.
function createWithSeedSync(fromPublicKey, seed, programId) {
    const buffer = buffer_1.Buffer.concat([
        fromPublicKey.toBuffer(),
        buffer_1.Buffer.from(seed),
        programId.toBuffer(),
    ]);
    return new web3_js_1.PublicKey((0, sha256_1.sha256)(buffer));
}
exports.createWithSeedSync = createWithSeedSync;
function associated(programId, ...args) {
    let seeds = [buffer_1.Buffer.from([97, 110, 99, 104, 111, 114])]; // b"anchor".
    args.forEach((arg) => {
        seeds.push(arg instanceof buffer_1.Buffer ? arg : (0, common_js_1.translateAddress)(arg).toBuffer());
    });
    const [assoc] = web3_js_1.PublicKey.findProgramAddressSync(seeds, (0, common_js_1.translateAddress)(programId));
    return assoc;
}
exports.associated = associated;
//# sourceMappingURL=pubkey.js.map