import * as base64 from "base64-js";
export function encode(data) {
    return base64.fromByteArray(data);
}
export function decode(data) {
    return Buffer.from(base64.toByteArray(data));
}
//# sourceMappingURL=base64.js.map