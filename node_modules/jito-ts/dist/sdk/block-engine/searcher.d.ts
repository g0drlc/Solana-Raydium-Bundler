import { Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { ChannelOptions } from '@grpc/grpc-js';
import { BundleResult } from '../../gen/block-engine/bundle';
import { SearcherServiceClient, SlotList } from '../../gen/block-engine/searcher';
import { Bundle } from './types';
export declare class SearcherClient {
    private client;
    constructor(client: SearcherServiceClient);
    /**
     * Submits a bundle to the block-engine.
     *
     * @param bundle - The Bundle object to be sent.
     * @returns A Promise that resolves to the bundle's UUID (string) on successful submission.
     * @throws A ServiceError if there's an issue with the server while sending the bundle.
     */
    sendBundle(bundle: Bundle): Promise<string>;
    /**
     * Retrieves tip accounts from the server.
     *
     * @returns A Promise that resolves to an array of account strings (usually public keys).
     * @throws A ServiceError if there's an issue with the server while fetching tip accounts.
     */
    getTipAccounts(): Promise<string[]>;
    /**
     * Retrieves connected leaders (validators) from the server.
     *
     * @returns A Promise that resolves to a map, where keys are validator identity keys (usually public keys), and values are SlotList objects.
     * @throws A ServiceError if there's an issue with the server while fetching connected leaders.
     */
    getConnectedLeaders(): Promise<{
        [key: string]: SlotList;
    }>;
    /**
     * Returns the next scheduled leader connected to the block-engine.
     *
     * @returns A Promise that resolves with an object containing:
     *        - currentSlot: The current slot number the backend is on
     *        - nextLeaderSlot: The slot number of the next scheduled leader
     *        - nextLeaderIdentity: The identity of the next scheduled leader
     * @throws A ServiceError if there's an issue with the server while fetching the next scheduled leader.
     */
    getNextScheduledLeader(): Promise<{
        currentSlot: number;
        nextLeaderSlot: number;
        nextLeaderIdentity: string;
    }>;
    /**
     * Triggers the provided callback on account updates owned by the provided list of programs.
     *
     * @param programs - An array of program PublicKeys
     * @param successCallback - A callback function that receives the updated transactions (VersionedTransaction[])
     * @param errorCallback - A callback function that receives the stream error (Error)
     * @returns A function to cancel the subscription
     */
    onProgramUpdate(programs: PublicKey[], regions: string[], successCallback: (transactions: VersionedTransaction[]) => void, errorCallback: (e: Error) => void): () => void;
    /**
     * Yields on account updates owned by the provided list of programs.
     *
     * @param programs - An array of program PublicKeys
     * @param onError - A callback function that receives the stream error (Error)
     * @returns An async generator that yields transactions (VersionedTransaction[]) that use the provided programs
     */
    programUpdates(programs: PublicKey[], regions: string[], onError: (e: Error) => void): AsyncGenerator<VersionedTransaction[]>;
    /**
     * Triggers the provided callback on updates to the provided accounts.
     *
     * @param accounts - An array of account PublicKeys
     * @param successCallback - A callback function that receives the updated transactions (VersionedTransaction[])
     * @param errorCallback - A callback function that receives the stream error (Error)
     * @returns A function to cancel the subscription
     */
    onAccountUpdate(accounts: PublicKey[], regions: string[], successCallback: (transactions: VersionedTransaction[]) => void, errorCallback: (e: Error) => void): () => void;
    /**
     * Yields on updates to the provided accounts.
     *
     * @param accounts - An array of account PublicKeys
     * @param onError - A callback function that receives the stream error (Error)
     * @returns An async generator that yields updated transactions (VersionedTransaction[]) on account updates
     */
    accountUpdates(accounts: PublicKey[], regions: string[], onError: (e: Error) => void): AsyncGenerator<VersionedTransaction[]>;
    /**
     * Triggers the provided callback on BundleResult updates.
     *
     * @param successCallback - A callback function that receives the BundleResult updates
     * @param errorCallback - A callback function that receives the stream error (Error)
     * @returns A function to cancel the subscription
     */
    onBundleResult(successCallback: (bundleResult: BundleResult) => void, errorCallback: (e: Error) => void): () => void;
    /**
     * Yields on bundle results.
     *
     * @param onError - A callback function that receives the stream error (Error)
     * @returns An async generator that yields BundleResult updates
     */
    bundleResults(onError: (e: Error) => void): AsyncGenerator<BundleResult>;
}
/**
 * Creates and returns a SearcherClient instance.
 *
 * @param url - The URL of the SearcherService
 * @param authKeypair - Keypair authorized for the block engine
 * @param grpcOptions - Optional configuration options for the gRPC client
 * @returns SearcherClient - An instance of the SearcherClient
 */
export declare const searcherClient: (url: string, authKeypair: Keypair, grpcOptions?: Partial<ChannelOptions>) => SearcherClient;
