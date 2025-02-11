import * as bs58 from "bs58";
export function encode(data) {
    return bs58.encode(data);
}
export function decode(data) {
    return bs58.decode(data);
}
//# sourceMappingURL=bs58.js.map