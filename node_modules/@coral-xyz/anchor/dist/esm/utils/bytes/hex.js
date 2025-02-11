import { Buffer } from "buffer";
export function encode(data) {
    return data.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "0x");
}
export function decode(data) {
    if (data.indexOf("0x") === 0) {
        data = data.substr(2);
    }
    if (data.length % 2 === 1) {
        data = "0" + data;
    }
    let key = data.match(/.{2}/g);
    if (key === null) {
        return Buffer.from([]);
    }
    return Buffer.from(key.map((byte) => parseInt(byte, 16)));
}
//# sourceMappingURL=hex.js.map