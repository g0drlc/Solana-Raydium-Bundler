/// <reference types="node" />
import { AccountInfo, AccountMeta, Connection, PublicKey, TransactionSignature } from "@solana/web3.js";
import { Address } from "../program/common";
import Provider from "../provider";
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
export declare function invoke(programId: Address, accounts?: Array<AccountMeta>, data?: Buffer, provider?: Provider): Promise<TransactionSignature>;
export declare function getMultipleAccounts(connection: Connection, publicKeys: PublicKey[]): Promise<Array<null | {
    publicKey: PublicKey;
    account: AccountInfo<Buffer>;
}>>;
//# sourceMappingURL=rpc.d.ts.map