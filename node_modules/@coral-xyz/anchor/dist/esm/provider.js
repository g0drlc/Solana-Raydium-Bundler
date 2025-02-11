import { Connection, SendTransactionError, } from "@solana/web3.js";
import { bs58 } from "./utils/bytes/index.js";
import { isBrowser, isVersionedTransaction } from "./utils/common.js";
import { simulateTransaction, } from "./utils/rpc.js";
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */
export class AnchorProvider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */
    constructor(connection, wallet, opts) {
        this.connection = connection;
        this.wallet = wallet;
        this.opts = opts;
        this.publicKey = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey;
    }
    static defaultOptions() {
        return {
            preflightCommitment: "processed",
            commitment: "processed",
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
        if (isBrowser) {
            throw new Error(`Provider local is not available on browser.`);
        }
        opts = opts !== null && opts !== void 0 ? opts : AnchorProvider.defaultOptions();
        const connection = new Connection(url !== null && url !== void 0 ? url : "http://localhost:8899", opts.preflightCommitment);
        const NodeWallet = require("./nodewallet.js").default;
        const wallet = NodeWallet.local();
        return new AnchorProvider(connection, wallet, opts);
    }
    /**
     * Returns a `Provider` read from the `ANCHOR_PROVIDER_URL` environment
     * variable
     *
     * (This api is for Node only.)
     */
    static env() {
        if (isBrowser) {
            throw new Error(`Provider env is not available on browser.`);
        }
        const process = require("process");
        const url = process.env.ANCHOR_PROVIDER_URL;
        if (url === undefined) {
            throw new Error("ANCHOR_PROVIDER_URL is not defined");
        }
        const options = AnchorProvider.defaultOptions();
        const connection = new Connection(url, options.commitment);
        const NodeWallet = require("./nodewallet.js").default;
        const wallet = NodeWallet.local();
        return new AnchorProvider(connection, wallet, options);
    }
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The signers of the transaction.
     * @param opts    Transaction confirmation options.
     */
    async sendAndConfirm(tx, signers, opts) {
        var _a, _b, _c, _d;
        if (opts === undefined) {
            opts = this.opts;
        }
        if (isVersionedTransaction(tx)) {
            if (signers) {
                tx.sign(signers);
            }
        }
        else {
            tx.feePayer = (_a = tx.feePayer) !== null && _a !== void 0 ? _a : this.wallet.publicKey;
            tx.recentBlockhash = (await this.connection.getLatestBlockhash(opts.preflightCommitment)).blockhash;
            if (signers) {
                for (const signer of signers) {
                    tx.partialSign(signer);
                }
            }
        }
        tx = await this.wallet.signTransaction(tx);
        const rawTx = tx.serialize();
        try {
            return await sendAndConfirmRawTransaction(this.connection, rawTx, opts);
        }
        catch (err) {
            // thrown if the underlying 'confirmTransaction' encounters a failed tx
            // the 'confirmTransaction' error does not return logs so we make another rpc call to get them
            if (err instanceof ConfirmError) {
                // choose the shortest available commitment for 'getTransaction'
                // (the json RPC does not support any shorter than "confirmed" for 'getTransaction')
                // because that will see the tx sent with `sendAndConfirmRawTransaction` no matter which
                // commitment `sendAndConfirmRawTransaction` used
                const txSig = bs58.encode(isVersionedTransaction(tx)
                    ? ((_b = tx.signatures) === null || _b === void 0 ? void 0 : _b[0]) || new Uint8Array()
                    : (_c = tx.signature) !== null && _c !== void 0 ? _c : new Uint8Array());
                const failedTx = await this.connection.getTransaction(txSig, {
                    commitment: "confirmed",
                });
                if (!failedTx) {
                    throw err;
                }
                else {
                    const logs = (_d = failedTx.meta) === null || _d === void 0 ? void 0 : _d.logMessages;
                    throw !logs ? err : new SendTransactionError(err.message, logs);
                }
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Similar to `send`, but for an array of transactions and signers.
     * All transactions need to be of the same type, it doesn't support a mix of `VersionedTransaction`s and `Transaction`s.
     *
     * @param txWithSigners Array of transactions and signers.
     * @param opts          Transaction confirmation options.
     */
    async sendAll(txWithSigners, opts) {
        var _a, _b, _c;
        if (opts === undefined) {
            opts = this.opts;
        }
        const recentBlockhash = (await this.connection.getLatestBlockhash(opts.preflightCommitment)).blockhash;
        let txs = txWithSigners.map((r) => {
            var _a, _b;
            if (isVersionedTransaction(r.tx)) {
                let tx = r.tx;
                if (r.signers) {
                    tx.sign(r.signers);
                }
                return tx;
            }
            else {
                let tx = r.tx;
                let signers = (_a = r.signers) !== null && _a !== void 0 ? _a : [];
                tx.feePayer = (_b = tx.feePayer) !== null && _b !== void 0 ? _b : this.wallet.publicKey;
                tx.recentBlockhash = recentBlockhash;
                signers.forEach((kp) => {
                    tx.partialSign(kp);
                });
                return tx;
            }
        });
        const signedTxs = await this.wallet.signAllTransactions(txs);
        const sigs = [];
        for (let k = 0; k < txs.length; k += 1) {
            const tx = signedTxs[k];
            const rawTx = tx.serialize();
            try {
                sigs.push(await sendAndConfirmRawTransaction(this.connection, rawTx, opts));
            }
            catch (err) {
                // thrown if the underlying 'confirmTransaction' encounters a failed tx
                // the 'confirmTransaction' error does not return logs so we make another rpc call to get them
                if (err instanceof ConfirmError) {
                    // choose the shortest available commitment for 'getTransaction'
                    // (the json RPC does not support any shorter than "confirmed" for 'getTransaction')
                    // because that will see the tx sent with `sendAndConfirmRawTransaction` no matter which
                    // commitment `sendAndConfirmRawTransaction` used
                    const txSig = bs58.encode(isVersionedTransaction(tx)
                        ? ((_a = tx.signatures) === null || _a === void 0 ? void 0 : _a[0]) || new Uint8Array()
                        : (_b = tx.signature) !== null && _b !== void 0 ? _b : new Uint8Array());
                    const failedTx = await this.connection.getTransaction(txSig, {
                        commitment: "confirmed",
                    });
                    if (!failedTx) {
                        throw err;
                    }
                    else {
                        const logs = (_c = failedTx.meta) === null || _c === void 0 ? void 0 : _c.logMessages;
                        throw !logs ? err : new SendTransactionError(err.message, logs);
                    }
                }
                else {
                    throw err;
                }
            }
        }
        return sigs;
    }
    /**
     * Simulates the given transaction, returning emitted logs from execution.
     *
     * @param tx      The transaction to send.
     * @param signers The signers of the transaction. If unset, the transaction
     *                will be simulated with the "sigVerify: false" option. This
     *                allows for simulation of transactions without asking the
     *                wallet for a signature.
     * @param opts    Transaction confirmation options.
     */
    async simulate(tx, signers, commitment, includeAccounts) {
        let recentBlockhash = (await this.connection.getLatestBlockhash(commitment !== null && commitment !== void 0 ? commitment : this.connection.commitment)).blockhash;
        let result;
        if (isVersionedTransaction(tx)) {
            if (signers) {
                tx.sign(signers);
                tx = await this.wallet.signTransaction(tx);
            }
            // Doesn't support includeAccounts which has been changed to something
            // else in later versions of this function.
            result = await this.connection.simulateTransaction(tx, { commitment });
        }
        else {
            tx.feePayer = tx.feePayer || this.wallet.publicKey;
            tx.recentBlockhash = recentBlockhash;
            if (signers) {
                tx = await this.wallet.signTransaction(tx);
            }
            result = await simulateTransaction(this.connection, tx, signers, commitment, includeAccounts);
        }
        if (result.value.err) {
            throw new SimulateError(result.value);
        }
        return result.value;
    }
}
class SimulateError extends Error {
    constructor(simulationResponse, message) {
        super(message);
        this.simulationResponse = simulationResponse;
    }
}
// Copy of Connection.sendAndConfirmRawTransaction that throws
// a better error if 'confirmTransaction` returns an error status
async function sendAndConfirmRawTransaction(connection, rawTransaction, options) {
    const sendOptions = options && {
        skipPreflight: options.skipPreflight,
        preflightCommitment: options.preflightCommitment || options.commitment,
    };
    const signature = await connection.sendRawTransaction(rawTransaction, sendOptions);
    const status = (await connection.confirmTransaction(signature, options && options.commitment)).value;
    if (status.err) {
        throw new ConfirmError(`Raw transaction ${signature} failed (${JSON.stringify(status)})`);
    }
    return signature;
}
class ConfirmError extends Error {
    constructor(message) {
        super(message);
    }
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
        return AnchorProvider.local();
    }
    return _provider;
}
// Global provider used as the default when a provider is not given.
let _provider = null;
//# sourceMappingURL=provider.js.map