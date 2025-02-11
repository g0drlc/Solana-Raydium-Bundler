import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import * as borsh from "@coral-xyz/borsh";
export function isIdlAccounts(accountItem) {
    return "accounts" in accountItem;
}
// Deterministic IDL address as a function of the program id.
export async function idlAddress(programId) {
    const base = (await PublicKey.findProgramAddress([], programId))[0];
    return await PublicKey.createWithSeed(base, seed(), programId);
}
// Seed for generating the idlAddress.
export function seed() {
    return "anchor:idl";
}
const IDL_ACCOUNT_LAYOUT = borsh.struct([
    borsh.publicKey("authority"),
    borsh.vecU8("data"),
]);
export function decodeIdlAccount(data) {
    return IDL_ACCOUNT_LAYOUT.decode(data);
}
export function encodeIdlAccount(acc) {
    const buffer = Buffer.alloc(1000); // TODO: use a tighter buffer.
    const len = IDL_ACCOUNT_LAYOUT.encode(acc, buffer);
    return buffer.slice(0, len);
}
//# sourceMappingURL=idl.js.map