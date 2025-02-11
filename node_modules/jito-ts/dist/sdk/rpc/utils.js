"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
// copied from @solana/web3.js 1.74.0
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/utils/sleep.ts
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map