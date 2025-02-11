import { Connection, Signer, PublicKey, Transaction, TransactionSignature, ConfirmOptions, Commitment, SendOptions, VersionedTransaction } from "@solana/web3.js";
import { SuccessfulTxSimulationResponse } from "./utils/rpc.js";
export default interface Provider {
    readonly connection: Connection;
    readonly publicKey?: PublicKey;
    send?(tx: Transaction | VersionedTransaction, signers?: Signer[], opts?: SendOptions): Promise<TransactionSignature>;
    sendAndConfirm?(tx: Transaction | VersionedTransaction, signers?: Signer[], opts?: ConfirmOptions): Promise<TransactionSignature>;
    sendAll?<T extends Transaction | VersionedTransaction>(txWithSigners: {
        tx: T;
        signers?: Signer[];
    }[], opts?: ConfirmOptions): Promise<Array<TransactionSignature>>;
    simulate?(tx: Transaction | VersionedTransaction, signers?: Signer[], commitment?: Commitment, includeAccounts?: boolean | PublicKey[]): Promise<SuccessfulTxSimulationResponse>;
}
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */
export declare class AnchorProvider implements Provider {
    readonly connection: Connection;
    readonly wallet: Wallet;
    readonly opts: ConfirmOptions;
    readonly publicKey: PublicKey;
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
    static local(url?: string, opts?: ConfirmOptions): AnchorProvider;
    /**
     * Returns a `Provider` read from the `ANCHOR_PROVIDER_URL` environment
     * variable
     *
     * (This api is for Node only.)
     */
    static env(): AnchorProvider;
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The signers of the transaction.
     * @param opts    Transaction confirmation options.
     */
    sendAndConfirm(tx: Transaction | VersionedTransaction, signers?: Signer[], opts?: ConfirmOptions): Promise<TransactionSignature>;
    /**
     * Similar to `send`, but for an array of transactions and signers.
     * All transactions need to be of the same type, it doesn't support a mix of `VersionedTransaction`s and `Transaction`s.
     *
     * @param txWithSigners Array of transactions and signers.
     * @param opts          Transaction confirmation options.
     */
    sendAll<T extends Transaction | VersionedTransaction>(txWithSigners: {
        tx: T;
        signers?: Signer[];
    }[], opts?: ConfirmOptions): Promise<Array<TransactionSignature>>;
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
    simulate(tx: Transaction | VersionedTransaction, signers?: Signer[], commitment?: Commitment, includeAccounts?: boolean | PublicKey[]): Promise<SuccessfulTxSimulationResponse>;
}
export type SendTxRequest = {
    tx: Transaction;
    signers: Array<Signer | undefined>;
};
/**
 * Wallet interface for objects that can be used to sign provider transactions.
 * VersionedTransactions sign everything at once
 */
export interface Wallet {
    signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
    publicKey: PublicKey;
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