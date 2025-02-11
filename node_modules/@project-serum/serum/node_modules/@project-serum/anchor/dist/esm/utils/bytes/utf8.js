export function decode(array) {
    const decoder = typeof TextDecoder === "undefined"
        ? new (require("util").TextDecoder)("utf-8") // Node.
        : new TextDecoder("utf-8"); // Browser.
    return decoder.decode(array);
}
export function encode(input) {
    const encoder = typeof TextEncoder === "undefined"
        ? new (require("util").TextEncoder)("utf-8") // Node.
        : new TextEncoder(); // Browser.
    return encoder.encode(input);
}
//# sourceMappingURL=utf8.js.map