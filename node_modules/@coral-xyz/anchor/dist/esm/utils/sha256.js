import { sha256 } from "@noble/hashes/sha256";
export function hash(data) {
    return new TextDecoder().decode(sha256(data));
}
//# sourceMappingURL=sha256.js.map