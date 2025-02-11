import { Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { Wallet } from "./provider";
/**
 * Node only wallet.
 */
export default class NodeWallet implements Wallet {
    readonly payer: Keypair;
    constructor(payer: Keypair);
    static local(): NodeWallet | never;
    signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
    get publicKey(): PublicKey;
}
//# sourceMappingURL=nodewallet.d.ts.map