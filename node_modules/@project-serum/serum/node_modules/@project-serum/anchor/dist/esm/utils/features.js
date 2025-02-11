const _AVAILABLE_FEATURES = new Set(["anchor-deprecated-state"]);
const _FEATURES = new Map();
export function set(key) {
    if (!_AVAILABLE_FEATURES.has(key)) {
        throw new Error("Invalid feature");
    }
    _FEATURES.set(key, true);
}
export function isSet(key) {
    return _FEATURES.get(key) !== undefined;
}
//# sourceMappingURL=features.js.map