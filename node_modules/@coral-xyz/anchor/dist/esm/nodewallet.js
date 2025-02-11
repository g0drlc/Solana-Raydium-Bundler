import { Buffer } from "buffer";
import { Keypair, } from "@solana/web3.js";
import { isVersionedTransaction } from "./utils/common.js";
/**
 * Node only wallet.
 */
export default class NodeWallet {
    constructor(payer) {
        this.payer = payer;
    }
    static local() {
        const process = require("process");
        if (!process.env.ANCHOR_WALLET || process.env.ANCHOR_WALLET === "") {
            throw new Error("expected environment variable `ANCHOR_WALLET` is not set.");
        }
        const payer = Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync(process.env.ANCHOR_WALLET, {
            encoding: "utf-8",
        }))));
        return new NodeWallet(payer);
    }
    async signTransaction(tx) {
        if (isVersionedTransaction(tx)) {
            tx.sign([this.payer]);
        }
        else {
            tx.partialSign(this.payer);
        }
        return tx;
    }
    async signAllTransactions(txs) {
        return txs.map((t) => {
            if (isVersionedTransaction(t)) {
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
//# sourceMappingURL=nodewallet.js.map