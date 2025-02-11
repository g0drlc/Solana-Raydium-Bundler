import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Wallet } from "./provider";
/**
 * Node only wallet.
 */
export default class NodeWallet implements Wallet {
    readonly payer: Keypair;
    constructor(payer: Keypair);
    static local(): NodeWallet | never;
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    get publicKey(): PublicKey;
}
//# sourceMappingURL=nodewallet.d.ts.map