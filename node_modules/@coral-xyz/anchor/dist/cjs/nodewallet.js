"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const common_js_1 = require("./utils/common.js");
/**
 * Node only wallet.
 */
class NodeWallet {
    constructor(payer) {
        this.payer = payer;
    }
    static local() {
        const process = require("process");
        if (!process.env.ANCHOR_WALLET || process.env.ANCHOR_WALLET === "") {
            throw new Error("expected environment variable `ANCHOR_WALLET` is not set.");
        }
        const payer = web3_js_1.Keypair.fromSecretKey(buffer_1.Buffer.from(JSON.parse(require("fs").readFileSync(process.env.ANCHOR_WALLET, {
            encoding: "utf-8",
        }))));
        return new NodeWallet(payer);
    }
    async signTransaction(tx) {
        if ((0, common_js_1.isVersionedTransaction)(tx)) {
            tx.sign([this.payer]);
        }
        else {
            tx.partialSign(this.payer);
        }
        return tx;
    }
    async signAllTransactions(txs) {
        return txs.map((t) => {
            if ((0, common_js_1.isVersionedTransaction)(t)) {
                t.sign([this.payer]);
            }
            else {
                t.partialSign(this.payer);
            }
            return t;
        });
    }
    get publicKey() {
        return this.payer.publicKey;
    }
}
exports.default = NodeWallet;
//# sourceMappingURL=nodewallet.js.map