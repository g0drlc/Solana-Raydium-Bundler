"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSet = exports.set = void 0;
const _AVAILABLE_FEATURES = new Set(["anchor-deprecated-state", "debug-logs"]);
const _FEATURES = new Map();
function set(key) {
    if (!_AVAILABLE_FEATURES.has(key)) {
        throw new Error("Invalid feature");
    }
    _FEATURES.set(key, true);
}
exports.set = set;
function isSet(key) {
    return _FEATURES.get(key) !== undefined;
}
exports.isSet = isSet;
//# sourceMappingURL=features.js.map