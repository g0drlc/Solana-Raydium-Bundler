"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geyserClient = exports.GeyserClient = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
const auth_1 = require("./auth");
const geyser_1 = require("../../gen/geyser/geyser");
class GeyserClient {
    constructor(client) {
        this.client = client;
    }
    /**
     * Retrieves the heartbeat interval in milliseconds from the server.
     *
     * @returns A Promise that resolves to a number representing the heartbeat interval in milliseconds.
     * @throws A ServiceError if there's an issue with the server while fetching the heartbeat interval.
  
     */
    async getHeartbeatIntervalMillis() {
        return new Promise((resolve, reject) => {
            this.client.getHeartbeatInterval({}, async (e, resp) => {
                if (e) {
                    reject(e);
                }
                else {
                    resolve(resp.heartbeatIntervalMs);
                }
            });
        });
    }
    /**
     * Triggers the supplied callback on an update of the provided accounts of interest.
     *
     * @param accountsOfInterest - An array of PublicKeys of the accounts to subscribe for updates.
     * @param successCallback - A callback function that receives a TimestampedAccountUpdate object whenever updates are available.
     * @param errorCallback - A callback function that is triggered whenever an error occurs during the subscription process.
     * @returns A function that can be called to cancel the subscription.
     */
    onAccountUpdate(accountsOfInterest, successCallback, errorCallback) {
        const accounts = accountsOfInterest.map(a => a.toBytes());
        const stream = this.client.subscribeAccountUpdates({ accounts });
        stream.on('readable', () => {
            const msg = stream.read(1);
            if (msg) {
                successCallback(msg);
            }
        });
        stream.on('error', e => errorCallback(new Error(`Stream error: ${e.message}`)));
        return stream.cancel;
    }
    /**
     * Triggers the supplied callback on an account update owned by the provided programs of interest.
     *
     * @param programsOfInterest - An array of PublicKeys of the programs to subscribe for updates.
     * @param successCallback - A callback function that receives a TimestampedAccountUpdate object whenever updates are available.
     * @param errorCallback - A callback function that is triggered whenever an error occurs during the subscription process.
     * @returns A function that can be called to cancel the subscription.
     */
    onProgramUpdate(programsOfInterest, successCallback, errorCallback) {
        const programs = programsOfInterest.map(a => a.toBytes());
        const stream = this.client.subscribeProgramUpdates({ programs });
        stream.on('readable', () => {
            const msg = stream.read(1);
            if (msg) {
                successCallback(msg);
            }
        });
        stream.on('error', e => errorCallback(new Error(`Stream error: ${e.message}`)));
        return stream.cancel;
    }
    /**
     * Triggers the supplied callback for every processed block.
     *
     * @param successCallback - A callback function that receives a TimestampedBlockUpdate object whenever a block update is available.
     * @param errorCallback - A callback function that is triggered whenever an error occurs during the subscription process.
     * @returns A function that can be called to cancel the subscription.
     */
    onProcessedBlock(successCallback, errorCallback) {
        const stream = this.client.subscribeBlockUpdates({});
        stream.on('readable', () => {
            const msg = stream.read(1);
            if (msg) {
                successCallback(msg);
            }
        });
        stream.on('error', e => errorCallback(new Error(`Stream error: ${e.message}`)));
        return stream.cancel;
    }
}
exports.GeyserClient = GeyserClient;
/**
 * Creates and returns a new GeyserClient instance.
 *
 * @param url - The gRPC server endpoint URL.
 * @param accessToken - The access token required for authentication.
 * @param grpcOptions - Optional configuration options for the gRPC client
 * @returns A GeyserClient instance with the specified configuration.
 */
const geyserClient = (url, accessToken, grpcOptions) => {
    const client = new geyser_1.GeyserClient(url, grpc_js_1.ChannelCredentials.createSsl(), {
        interceptors: [(0, auth_1.authInterceptor)(accessToken)],
        ...grpcOptions,
    });
    return new GeyserClient(client);
};
exports.geyserClient = geyserClient;
//# sourceMappingURL=geyser.js.map