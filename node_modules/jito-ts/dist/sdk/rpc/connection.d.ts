import { Commitment, Connection, ConnectionConfig, RpcResponseAndContext, SimulatedTransactionAccountInfo, TransactionError, TransactionReturnData, VersionedTransaction } from '@solana/web3.js';
import RpcClient from 'jayson/lib/client/browser';
export type Slot = number;
export type Tip = 'tip';
/**
 * Simulate on top of bank with the provided commitment or on the provided slot's bank or on top of the RPC's highest slot's bank i.e. the working bank.
 */
export type SimulationSlotConfig = Commitment | Slot | Tip;
export type SimulateBundleConfig = {
    /** list of accounts to return the pre transaction execution state for. The length of the array must be equal to the number transactions in the bundle */
    preExecutionAccountsConfigs: ({
        encoding: 'base64';
        addresses: string[];
    } | null)[];
    /** list of accounts to return the post transaction execution state for. The length of the array must be equal to the number transactions in the bundle */
    postExecutionAccountsConfigs: ({
        encoding: 'base64';
        addresses: string[];
    } | null)[];
    /** Optional parameter to specify the bank to run simulation against */
    simulationBank?: SimulationSlotConfig;
    /** Optional parameter used to enable signature verification before simulation */
    skipSigVerify?: boolean;
    /** Optional parameter used to replace the simulated transaction's recent blockhash with the latest blockhash */
    replaceRecentBlockhash?: boolean;
};
export type SimulatedBundleTransactionResult = {
    err: TransactionError | string | null;
    logs: Array<string> | null;
    preExecutionAccounts?: SimulatedTransactionAccountInfo[] | null;
    postExecutionAccounts?: SimulatedTransactionAccountInfo[] | null;
    unitsConsumed?: number;
    returnData?: TransactionReturnData | null;
};
export type BundleError = {} | string;
export type BundleSimulationSummary = 'succeeded' | {
    failed: {
        error: BundleError;
        tx_signature: string;
    };
};
export type SimulatedBundleResponse = {
    summary: BundleSimulationSummary;
    transactionResults: SimulatedBundleTransactionResult[];
};
type RpcRequest = (methodName: string, args: Array<any>) => Promise<any>;
/**
 * The JitoRpcConnection class extends the Connection class from @solana/web3.js
 * to provide an additional method called 'simulateBundle'.
 *
 * When constructing the JitoRpcConnection object, an httpAgent can be passed as
 * part of the ConnectionConfig. If it is not provided, the constructor will
 * internally create a separate httpAgent to be used for the 'simulateBundle' method.
 * This means that if a httpAgent is not passed, a separate TCP connection will
 * be used for 'simulateBundle'.
 */
export declare class JitoRpcConnection extends Connection {
    /** @internal */ _commitment?: Commitment;
    /** @internal */ _confirmTransactionInitialTimeout?: number;
    /** @internal */ _rpcClient: RpcClient;
    /** @internal */ _rpcRequest: RpcRequest;
    constructor(endpoint: string, commitmentOrConfig?: Commitment | ConnectionConfig);
    /**
     * Simulate a bundle
     */
    simulateBundle(bundle: VersionedTransaction[], config?: SimulateBundleConfig): Promise<RpcResponseAndContext<SimulatedBundleResponse>>;
}
export {};
