"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
const js_sha256_1 = require("js-sha256");
function hash(data) {
    return js_sha256_1.sha256(data);
}
exports.hash = hash;
//# sourceMappingURL=sha256.js.map