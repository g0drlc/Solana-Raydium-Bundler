import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";
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
        tx.partialSign(this.payer);
        return tx;
    }
    async signAllTransactions(txs) {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }
    get publicKey() {
        return this.payer.publicKey;
    }
}
//# sourceMappingURL=nodewallet.js.map