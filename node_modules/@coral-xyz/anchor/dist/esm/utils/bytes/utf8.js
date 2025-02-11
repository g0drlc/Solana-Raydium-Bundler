import { isBrowser } from "../common";
export function decode(array) {
    const decoder = isBrowser
        ? new TextDecoder("utf-8") // Browser https://caniuse.com/textencoder.
        : new (require("util").TextDecoder)("utf-8"); // Node.
    return decoder.decode(array);
}
export function encode(input) {
    const encoder = isBrowser
        ? new TextEncoder() // Browser.
        : new (require("util").TextEncoder)("utf-8"); // Node.
    return encoder.encode(input);
}
//# sourceMappingURL=utf8.js.map