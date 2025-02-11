"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.AnchorProvider = exports.setProvider = exports.getProvider = exports.web3 = exports.BN = void 0;
const nodewallet_1 = __importDefault(require("./nodewallet"));
const common_js_1 = require("./utils/common.js");
var bn_js_1 = require("bn.js");
Object.defineProperty(exports, "BN", { enumerable: true, get: function () { return __importDefault(bn_js_1).default; } });
exports.web3 = __importStar(require("@solana/web3.js"));
var provider_js_1 = require("./provider.js");
Object.defineProperty(exports, "getProvider", { enumerable: true, get: function () { return provider_js_1.getProvider; } });
Object.defineProperty(exports, "setProvider", { enumerable: true, get: function () { return provider_js_1.setProvider; } });
Object.defineProperty(exports, "AnchorProvider", { enumerable: true, get: function () { return provider_js_1.AnchorProvider; } });
__exportStar(require("./error.js"), exports);
__exportStar(require("./coder/index.js"), exports);
exports.utils = __importStar(require("./utils/index.js"));
__exportStar(require("./program/index.js"), exports);
__exportStar(require("./native/index.js"), exports);
if (!common_js_1.isBrowser) {
    exports.workspace = require("./workspace.js").default;
    exports.Wallet = require("./nodewallet.js").default;
}
//# sourceMappingURL=index.js.map