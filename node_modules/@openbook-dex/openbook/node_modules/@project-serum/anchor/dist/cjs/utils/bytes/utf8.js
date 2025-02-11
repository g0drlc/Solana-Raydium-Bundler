"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
function decode(array) {
    const decoder = typeof TextDecoder === "undefined"
        ? new (require("util").TextDecoder)("utf-8") // Node.
        : new TextDecoder("utf-8"); // Browser.
    return decoder.decode(array);
}
exports.decode = decode;
function encode(input) {
    const encoder = typeof TextEncoder === "undefined"
        ? new (require("util").TextEncoder)("utf-8") // Node.
        : new TextEncoder(); // Browser.
    return encoder.encode(input);
}
exports.encode = encode;
//# sourceMappingURL=utf8.js.map