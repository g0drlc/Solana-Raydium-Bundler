"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associatedAddress = void 0;
const web3_js_1 = require("@solana/web3.js");
const TOKEN_PROGRAM_ID = new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_PROGRAM_ID = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
async function associatedAddress({ mint, owner, }) {
    return (await web3_js_1.PublicKey.findProgramAddress([owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_PROGRAM_ID))[0];
}
exports.associatedAddress = associatedAddress;
//# sourceMappingURL=token.js.map