import { ChannelOptions } from '@grpc/grpc-js';
import { PublicKey } from '@solana/web3.js';
import { GeyserClient as GeyserClientStub, TimestampedAccountUpdate, TimestampedBlockUpdate } from '../../gen/geyser/geyser';
export declare class GeyserClient {
    private client;
    constructor(client: GeyserClientStub);
    /**
     * Retrieves the heartbeat interval in milliseconds from the server.
     *
     * @returns A Promise that resolves to a number representing the heartbeat interval in milliseconds.
     * @throws A ServiceError if there's an issue with the server while fetching the heartbeat interval.
  
     */
    getHeartbeatIntervalMillis(): Promise<number>;
    /**
     * Triggers the supplied callback on an update of the provided accounts of interest.
     *
     * @param accountsOfInterest - An array of PublicKeys of the accounts to subscribe for updates.
     * @param successCallback - A callback function that receives a TimestampedAccountUpdate object whenever updates are available.
     * @param errorCallback - A callback function that is triggered whenever an error occurs during the subscription process.
     * @returns A function that can be called to cancel the subscription.
     */
    onAccountUpdate(accountsOfInterest: PublicKey[], successCallback: (resp: TimestampedAccountUpdate) => void, errorCallback: (e: Error) => void): () => void;
    /**
     * Triggers the supplied callback on an account update owned by the provided programs of interest.
     *
     * @param programsOfInterest - An array of PublicKeys of the programs to subscribe for updates.
     * @param successCallback - A callback function that receives a TimestampedAccountUpdate object whenever updates are available.
     * @param errorCallback - A callback function that is triggered whenever an error occurs during the subscription process.
     * @returns A function that can be called to cancel the subscription.
     */
    onProgramUpdate(programsOfInterest: PublicKey[], successCallback: (resp: TimestampedAccountUpdate) => void, errorCallback: (e: Error) => void): () => void;
    /**
     * Triggers the supplied callback for every processed block.
     *
     * @param successCallback - A callback function that receives a TimestampedBlockUpdate object whenever a block update is available.
     * @param errorCallback - A callback function that is triggered whenever an error occurs during the subscription process.
     * @returns A function that can be called to cancel the subscription.
     */
    onProcessedBlock(successCallback: (resp: TimestampedBlockUpdate) => void, errorCallback: (e: Error) => void): () => void;
}
/**
 * Creates and returns a new GeyserClient instance.
 *
 * @param url - The gRPC server endpoint URL.
 * @param accessToken - The access token required for authentication.
 * @param grpcOptions - Optional configuration options for the gRPC client
 * @returns A GeyserClient instance with the specified configuration.
 */
export declare const geyserClient: (url: string, accessToken: string, grpcOptions?: Partial<ChannelOptions>) => GeyserClient;
