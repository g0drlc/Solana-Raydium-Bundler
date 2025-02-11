"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const buffer_1 = require("buffer");
function encode(data) {
    return data.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "0x");
}
exports.encode = encode;
function decode(data) {
    if (data.indexOf("0x") === 0) {
        data = data.substr(2);
    }
    if (data.length % 2 === 1) {
        data = "0" + data;
    }
    let key = data.match(/.{2}/g);
    if (key === null) {
        return buffer_1.Buffer.from([]);
    }
    return buffer_1.Buffer.from(key.map((byte) => parseInt(byte, 16)));
}
exports.decode = decode;
//# sourceMappingURL=hex.js.map