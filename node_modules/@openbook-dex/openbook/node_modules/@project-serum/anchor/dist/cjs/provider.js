"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = exports.setProvider = exports.NodeWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("./utils/common");
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */
class Provider {
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
        const connection = new web3_js_1.Connection(url !== null && url !== void 0 ? url : "http://localhost:8899", opts.preflightCommitment);
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
        if (common_1.isBrowser)
            return;
        const process = require("process");
        const url = process.env.ANCHOR_PROVIDER_URL;
        if (url === undefined) {
            throw new Error("ANCHOR_PROVIDER_URL is not defined");
        }
        const options = Provider.defaultOptions();
        const connection = new web3_js_1.Connection(url, options.commitment);
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
        const txId = await web3_js_1.sendAndConfirmRawTransaction(this.connection, rawTx, opts);
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
            sigs.push(await web3_js_1.sendAndConfirmRawTransaction(this.connection, rawTx, opts));
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
exports.default = Provider;
/**
 * Node only wallet.
 */
class NodeWallet {
    constructor(payer) {
        this.payer = payer;
    }
    static local() {
        const payer = web3_js_1.Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync(require("os").homedir() + "/.config/solana/id.json", {
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
exports.NodeWallet = NodeWallet;
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
function setProvider(provider) {
    _provider = provider;
}
exports.setProvider = setProvider;
/**
 * Returns the default provider being used by the client.
 */
function getProvider() {
    if (_provider === null) {
        return Provider.local();
    }
    return _provider;
}
exports.getProvider = getProvider;
// Global provider used as the default when a provider is not given.
let _provider = null;
//# sourceMappingURL=provider.js.map