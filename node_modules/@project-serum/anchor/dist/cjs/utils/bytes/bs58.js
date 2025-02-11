"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const bs58_1 = __importDefault(require("bs58"));
function encode(data) {
    return bs58_1.default.encode(data);
}
exports.encode = encode;
function decode(data) {
    return bs58_1.default.decode(data);
}
exports.decode = decode;
//# sourceMappingURL=bs58.js.map