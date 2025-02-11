var _a;
/**
 * Returns true if being run inside a web browser,
 * false if in a Node process or electron app.
 */
export const isBrowser = typeof window !== "undefined" && !((_a = window.process) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("type"));
//# sourceMappingURL=common.js.map