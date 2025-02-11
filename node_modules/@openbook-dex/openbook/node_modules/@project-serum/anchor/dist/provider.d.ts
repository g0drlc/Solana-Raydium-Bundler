import { Connection, Keypair, Signer, PublicKey, Transaction, TransactionSignature, ConfirmOptions, RpcResponseAndContext, SimulatedTransactionResponse } from "@solana/web3.js";
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */
export default class Provider {
    readonly connection: Connection;
    readonly wallet: Wallet;
    readonly opts: ConfirmOptions;
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */
    constructor(connection: Connection, wallet: Wallet, opts: ConfirmOptions);
    static defaultOptions(): ConfirmOptions;
    /**
     * Returns a `Provider` with a wallet read from the local filesystem.
     *
     * @param url  The network cluster url.
     * @param opts The default transaction confirmation options.
     *
     * (This api is for Node only.)
     */
    static local(url?: string, opts?: ConfirmOptions): Provider;
    /**
     * Returns a `Provider` read from the `ANCHOR_PROVIDER_URL` environment
     * variable
     *
     * (This api is for Node only.)
     */
    static env(): Provider;
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provdier wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    send(tx: Transaction, signers?: Array<Signer | undefined>, opts?: ConfirmOptions): Promise<TransactionSignature>;
    /**
     * Similar to `send`, but for an array of transactions and signers.
     */
    sendAll(reqs: Array<SendTxRequest>, opts?: ConfirmOptions): Promise<Array<TransactionSignature>>;
    /**
     * Simulates the given transaction, returning emitted logs from execution.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provdier wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    simulate(tx: Transaction, signers?: Array<Signer | undefined>, opts?: ConfirmOptions): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
}
export declare type SendTxRequest = {
    tx: Transaction;
    signers: Array<Signer | undefined>;
};
/**
 * Wallet interface for objects that can be used to sign provider transactions.
 */
export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}
/**
 * Node only wallet.
 */
export declare class NodeWallet implements Wallet {
    readonly payer: Keypair;
    constructor(payer: Keypair);
    static local(): NodeWallet;
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    get publicKey(): PublicKey;
}
/**
 * Sets the default provider on the client.
 */
export declare function setProvider(provider: Provider): void;
/**
 * Returns the default provider being used by the client.
 */
export declare function getProvider(): Provider;
//# sourceMappingURL=provider.d.ts.map