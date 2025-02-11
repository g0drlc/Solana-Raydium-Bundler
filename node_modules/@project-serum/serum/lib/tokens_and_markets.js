"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARKETS = exports.TOKEN_MINTS = exports.getLayoutVersion = exports.PROGRAM_LAYOUT_VERSIONS = void 0;
const web3_js_1 = require("@solana/web3.js");
const markets_json_1 = __importDefault(require("./markets.json"));
const token_mints_json_1 = __importDefault(require("./token-mints.json"));
exports.PROGRAM_LAYOUT_VERSIONS = {
    '4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn': 1,
    BJ3jrUzddfuSrZHXSCxMUUQsjKEyLmuuyZebkcaFp2fg: 1,
    EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o: 2,
    '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin': 3,
};
function getLayoutVersion(programId) {
    return exports.PROGRAM_LAYOUT_VERSIONS[programId.toString()] || 3;
}
exports.getLayoutVersion = getLayoutVersion;
exports.TOKEN_MINTS = token_mints_json_1.default.map((mint) => {
    return {
        address: new web3_js_1.PublicKey(mint.address),
        name: mint.name,
    };
});
exports.MARKETS = markets_json_1.default.map((market) => {
    return {
        address: new web3_js_1.PublicKey(market.address),
        name: market.name,
        programId: new web3_js_1.PublicKey(market.programId),
        deprecated: market.deprecated,
    };
});
//# sourceMappingURL=tokens_and_markets.js.map