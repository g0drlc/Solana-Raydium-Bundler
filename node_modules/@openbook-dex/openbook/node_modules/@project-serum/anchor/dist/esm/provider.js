import { Connection, Keypair, sendAndConfirmRawTransaction, } from "@solana/web3.js";
import { isBrowser } from "./utils/common";
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */
export default class Provider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */
    constructor(connection, wallet, opts) {
        this.connection = connection;
        this.wallet = wallet;
        this.opts = opts;
    }
    static defaultOptions() {
        return {
            preflightCommitment: "recent",
            commitment: "recent",
        };
    }
    /**
     * Returns a `Provider` with a wallet read from the local filesystem.
     *
     * @param url  The network cluster url.
     * @param opts The default transaction confirmation options.
     *
     * (This api is for Node only.)
     */
    static local(url, opts) {
        opts = opts !== null && opts !== void 0 ? opts : Provider.defaultOptions();
        const connection = new Connection(url !== null && url !== void 0 ? url : "http://localhost:8899", opts.preflightCommitment);
        const wallet = NodeWallet.local();
        return new Provider(connection, wallet, opts);
    }
    /**
     * Returns a `Provider` read from the `ANCHOR_PROVIDER_URL` environment
     * variable
     *
     * (This api is for Node only.)
     */
    static env() {
        if (isBrowser)
            return;
        const process = require("process");
        const url = process.env.ANCHOR_PROVIDER_URL;
        if (url === undefined) {
            throw new Error("ANCHOR_PROVIDER_URL is not defined");
        }
        const options = Provider.defaultOptions();
        const connection = new Connection(url, options.commitment);
        const wallet = NodeWallet.local();
        return new Provider(connection, wallet, options);
    }
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provdier wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    async send(tx, signers, opts) {
        if (signers === undefined) {
            signers = [];
        }
        if (opts === undefined) {
            opts = this.opts;
        }
        tx.feePayer = this.wallet.publicKey;
        tx.recentBlockhash = (await this.connection.getRecentBlockhash(opts.preflightCommitment)).blockhash;
        await this.wallet.signTransaction(tx);
        signers
            .filter((s) => s !== undefined)
            .forEach((kp) => {
            tx.partialSign(kp);
        });
        const rawTx = tx.serialize();
        const txId = await sendAndConfirmRawTransaction(this.connection, rawTx, opts);
        return txId;
    }
    /**
     * Similar to `send`, but for an array of transactions and signers.
     */
    async sendAll(reqs, opts) {
        if (opts === undefined) {
            opts = this.opts;
        }
        const blockhash = await this.connection.getRecentBlockhash(opts.preflightCommitment);
        let txs = reqs.map((r) => {
            let tx = r.tx;
            let signers = r.signers;
            if (signers === undefined) {
                signers = [];
            }
            tx.feePayer = this.wallet.publicKey;
            tx.recentBlockhash = blockhash.blockhash;
            signers
                .filter((s) => s !== undefined)
                .forEach((kp) => {
                tx.partialSign(kp);
            });
            return tx;
        });
        const signedTxs = await this.wallet.signAllTransactions(txs);
        const sigs = [];
        for (let k = 0; k < txs.length; k += 1) {
            const tx = signedTxs[k];
            const rawTx = tx.serialize();
            sigs.push(await sendAndConfirmRawTransaction(this.connection, rawTx, opts));
        }
        return sigs;
    }
    /**
     * Simulates the given transaction, returning emitted logs from execution.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provdier wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    async simulate(tx, signers, opts) {
        var _a, _b;
        if (signers === undefined) {
            signers = [];
        }
        if (opts === undefined) {
            opts = this.opts;
        }
        tx.feePayer = this.wallet.publicKey;
        tx.recentBlockhash = (await this.connection.getRecentBlockhash((_a = opts.preflightCommitment) !== null && _a !== void 0 ? _a : this.opts.preflightCommitment)).blockhash;
        await this.wallet.signTransaction(tx);
        signers
            .filter((s) => s !== undefined)
            .forEach((kp) => {
            tx.partialSign(kp);
        });
        return await simulateTransaction(this.connection, tx, (_b = opts.commitment) !== null && _b !== void 0 ? _b : this.opts.commitment);
    }
}
/**
 * Node only wallet.
 */
export class NodeWallet {
    constructor(payer) {
        this.payer = payer;
    }
    static local() {
        const payer = Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync(require("os").homedir() + "/.config/solana/id.json", {
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
// Copy of Connection.simulateTransaction that takes a commitment parameter.
async function simulateTransaction(connection, transaction, commitment) {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching);
    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = { encoding: "base64", commitment };
    const args = [encodedTransaction, config];
    // @ts-ignore
    const res = await connection._rpcRequest("simulateTransaction", args);
    if (res.error) {
        throw new Error("failed to simulate transaction: " + res.error.message);
    }
    return res.result;
}
/**
 * Sets the default provider on the client.
 */
export function setProvider(provider) {
    _provider = provider;
}
/**
 * Returns the default provider being used by the client.
 */
export function getProvider() {
    if (_provider === null) {
        return Provider.local();
    }
    return _provider;
}
// Global provider used as the default when a provider is not given.
let _provider = null;
//# sourceMappingURL=provider.js.map