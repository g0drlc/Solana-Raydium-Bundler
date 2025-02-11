import { Buffer } from "buffer";
export function encode(data) {
    return data.toString("base64");
}
export function decode(data) {
    return Buffer.from(data, "base64");
}
//# sourceMappingURL=base64.js.map