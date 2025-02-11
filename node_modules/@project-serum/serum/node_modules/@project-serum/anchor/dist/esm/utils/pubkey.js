import BN from "bn.js";
import { sha256 as sha256Sync } from "js-sha256";
import { PublicKey } from "@solana/web3.js";
import { translateAddress } from "../program/common";
// Sync version of web3.PublicKey.createWithSeed.
export function createWithSeedSync(fromPublicKey, seed, programId) {
    const buffer = Buffer.concat([
        fromPublicKey.toBuffer(),
        Buffer.from(seed),
        programId.toBuffer(),
    ]);
    const hash = sha256Sync.digest(buffer);
    return new PublicKey(Buffer.from(hash));
}
// Sync version of web3.PublicKey.createProgramAddress.
export function createProgramAddressSync(seeds, programId) {
    const MAX_SEED_LENGTH = 32;
    let buffer = Buffer.alloc(0);
    seeds.forEach(function (seed) {
        if (seed.length > MAX_SEED_LENGTH) {
            throw new TypeError(`Max seed length exceeded`);
        }
        buffer = Buffer.concat([buffer, toBuffer(seed)]);
    });
    buffer = Buffer.concat([
        buffer,
        programId.toBuffer(),
        Buffer.from("ProgramDerivedAddress"),
    ]);
    let hash = sha256Sync(new Uint8Array(buffer));
    let publicKeyBytes = new BN(hash, 16).toArray(undefined, 32);
    if (PublicKey.isOnCurve(new Uint8Array(publicKeyBytes))) {
        throw new Error(`Invalid seeds, address must fall off the curve`);
    }
    return new PublicKey(publicKeyBytes);
}
// Sync version of web3.PublicKey.findProgramAddress.
export function findProgramAddressSync(seeds, programId) {
    let nonce = 255;
    let address;
    while (nonce != 0) {
        try {
            const seedsWithNonce = seeds.concat(Buffer.from([nonce]));
            address = createProgramAddressSync(seedsWithNonce, programId);
        }
        catch (err) {
            if (err instanceof TypeError) {
                throw err;
            }
            nonce--;
            continue;
        }
        return [address, nonce];
    }
    throw new Error(`Unable to find a viable program address nonce`);
}
const toBuffer = (arr) => {
    if (arr instanceof Buffer) {
        return arr;
    }
    else if (arr instanceof Uint8Array) {
        return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    else {
        return Buffer.from(arr);
    }
};
export async function associated(programId, ...args) {
    let seeds = [Buffer.from([97, 110, 99, 104, 111, 114])]; // b"anchor".
    args.forEach((arg) => {
        seeds.push(
        // @ts-ignore
        arg.buffer !== undefined ? arg : translateAddress(arg).toBuffer());
    });
    const [assoc] = await PublicKey.findProgramAddress(seeds, translateAddress(programId));
    return assoc;
}
//# sourceMappingURL=pubkey.js.map