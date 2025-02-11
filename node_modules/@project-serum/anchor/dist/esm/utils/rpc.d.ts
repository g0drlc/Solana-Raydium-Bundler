/// <reference types="node" />
import { Buffer } from "buffer";
import { AccountInfo, AccountMeta, Connection, PublicKey, TransactionSignature, Transaction, Commitment, Signer, RpcResponseAndContext, SimulatedTransactionResponse, Context } from "@solana/web3.js";
import { Address } from "../program/common.js";
import Provider from "../provider.js";
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
export declare function invoke(programId: Address, accounts?: Array<AccountMeta>, data?: Buffer, provider?: Provider): Promise<TransactionSignature>;
export declare function getMultipleAccounts(connection: Connection, publicKeys: PublicKey[], commitment?: Commitment): Promise<Array<null | {
    publicKey: PublicKey;
    account: AccountInfo<Buffer>;
}>>;
export declare function getMultipleAccountsAndContext(connection: Connection, publicKeys: PublicKey[], commitment?: Commitment): Promise<Array<null | {
    context: Context;
    publicKey: PublicKey;
    account: AccountInfo<Buffer>;
}>>;
export declare function simulateTransaction(connection: Connection, transaction: Transaction, signers?: Array<Signer>, commitment?: Commitment, includeAccounts?: boolean | Array<PublicKey>): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
export type SuccessfulTxSimulationResponse = Omit<SimulatedTransactionResponse, "err">;
//# sourceMappingURL=rpc.d.ts.map