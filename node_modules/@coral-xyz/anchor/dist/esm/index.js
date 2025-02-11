import NodeWallet from "./nodewallet";
import { isBrowser } from "./utils/common.js";
export { default as BN } from "bn.js";
export * as web3 from "@solana/web3.js";
export { getProvider, setProvider, AnchorProvider, } from "./provider.js";
export * from "./error.js";
export * from "./coder/index.js";
export * as utils from "./utils/index.js";
export * from "./program/index.js";
export * from "./native/index.js";
if (!isBrowser) {
    exports.workspace = require("./workspace.js").default;
    exports.Wallet = require("./nodewallet.js").default;
}
//# sourceMappingURL=index.js.map