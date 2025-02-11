"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
const common_1 = require("../common");
function decode(array) {
    const decoder = common_1.isBrowser
        ? new TextDecoder("utf-8") // Browser https://caniuse.com/textencoder.
        : new (require("util").TextDecoder)("utf-8"); // Node.
    return decoder.decode(array);
}
exports.decode = decode;
function encode(input) {
    const encoder = common_1.isBrowser
        ? new TextEncoder() // Browser.
        : new (require("util").TextEncoder)("utf-8"); // Node.
    return encoder.encode(input);
}
exports.encode = encode;
//# sourceMappingURL=utf8.js.map