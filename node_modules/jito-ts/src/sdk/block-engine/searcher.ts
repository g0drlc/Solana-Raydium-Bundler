import {Keypair, PublicKey, VersionedTransaction} from '@solana/web3.js';
import {
  ChannelCredentials,
  ChannelOptions,
  ClientReadableStream,
  ServiceError,
} from '@grpc/grpc-js';

import {AuthServiceClient} from '../../gen/block-engine/auth';
import {BundleResult} from '../../gen/block-engine/bundle';
import {
  ConnectedLeadersResponse,
  GetTipAccountsResponse,
  NextScheduledLeaderResponse,
  PendingTxNotification,
  SearcherServiceClient,
  SendBundleRequest,
  SendBundleResponse,
  SlotList,
} from '../../gen/block-engine/searcher';
import {authInterceptor, AuthProvider} from './auth';
import {Bundle} from './types';
import {deserializeTransactions} from './utils';

export class SearcherClient {
  private client: SearcherServiceClient;

  constructor(client: SearcherServiceClient) {
    this.client = client;
  }

  /**
   * Submits a bundle to the block-engine.
   *
   * @param bundle - The Bundle object to be sent.
   * @returns A Promise that resolves to the bundle's UUID (string) on successful submission.
   * @throws A ServiceError if there's an issue with the server while sending the bundle.
   */
  async sendBundle(bundle: Bundle): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.sendBundle(
        {
          bundle,
        } as SendBundleRequest,
        async (e: ServiceError | null, resp: SendBundleResponse) => {
          if (e) {
            reject(e);
          } else {
            resolve(resp.uuid);
          }
        }
      );
    });
  }

  /**
   * Retrieves tip accounts from the server.
   *
   * @returns A Promise that resolves to an array of account strings (usually public keys).
   * @throws A ServiceError if there's an issue with the server while fetching tip accounts.
   */
  async getTipAccounts(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.client.getTipAccounts(
        {},
        async (e: ServiceError | null, resp: GetTipAccountsResponse) => {
          if (e) {
            reject(e);
          } else {
            resolve(resp.accounts);
          }
        }
      );
    });
  }

  /**
   * Retrieves connected leaders (validators) from the server.
   *
   * @returns A Promise that resolves to a map, where keys are validator identity keys (usually public keys), and values are SlotList objects.
   * @throws A ServiceError if there's an issue with the server while fetching connected leaders.
   */
  async getConnectedLeaders(): Promise<{[key: string]: SlotList}> {
    return new Promise((resolve, reject) => {
      this.client.getConnectedLeaders(
        {},
        async (e: ServiceError | null, resp: ConnectedLeadersResponse) => {
          if (e) {
            reject(e);
          } else {
            resolve(resp.connectedValidators);
          }
        }
      );
    });
  }

  /**
   * Returns the next scheduled leader connected to the block-engine.
   *
   * @returns A Promise that resolves with an object containing:
   *        - currentSlot: The current slot number the backend is on
   *        - nextLeaderSlot: The slot number of the next scheduled leader
   *        - nextLeaderIdentity: The identity of the next scheduled leader
   * @throws A ServiceError if there's an issue with the server while fetching the next scheduled leader.
   */
  async getNextScheduledLeader(): Promise<{
    currentSlot: number;
    nextLeaderSlot: number;
    nextLeaderIdentity: string;
  }> {
    return new Promise((resolve, reject) => {
      this.client.getNextScheduledLeader(
        {},
        async (e: ServiceError | null, resp: NextScheduledLeaderResponse) => {
          if (e) {
            reject(e);
          } else {
            resolve(resp);
          }
        }
      );
    });
  }

  /**
   * Triggers the provided callback on account updates owned by the provided list of programs.
   *
   * @param programs - An array of program PublicKeys
   * @param successCallback - A callback function that receives the updated transactions (VersionedTransaction[])
   * @param errorCallback - A callback function that receives the stream error (Error)
   * @returns A function to cancel the subscription
   */
  onProgramUpdate(
    programs: PublicKey[],
    regions: string[],
    successCallback: (transactions: VersionedTransaction[]) => void,
    errorCallback: (e: Error) => void
  ): () => void {
    const stream: ClientReadableStream<PendingTxNotification> =
      this.client.subscribeMempool({
        programV0Sub: {
          programs: programs.map(p => p.toString()),
        },
        regions,
      });

    stream.on('readable', () => {
      const msg = stream.read(1);
      if (msg) {
        successCallback(deserializeTransactions(msg.transactions));
      }
    });
    stream.on('error', e => {
      errorCallback(new Error(`Stream error: ${e.message}`));
    });

    return stream.cancel;
  }

  /**
   * Yields on account updates owned by the provided list of programs.
   *
   * @param programs - An array of program PublicKeys
   * @param onError - A callback function that receives the stream error (Error)
   * @returns An async generator that yields transactions (VersionedTransaction[]) that use the provided programs
   */
  async *programUpdates(
    programs: PublicKey[],
    regions: string[],
    onError: (e: Error) => void
  ): AsyncGenerator<VersionedTransaction[]> {
    const stream: ClientReadableStream<PendingTxNotification> =
      this.client.subscribeMempool({
        programV0Sub: {
          programs: programs.map(p => p.toString()),
        },
        regions,
      });

    stream.on('error', e => {
      onError(e);
    });

    for await (const pendingTxNotification of stream) {
      try {
        yield deserializeTransactions(pendingTxNotification.transactions);
      } catch (e) {
        console.log('Deserialization error: ', e);
        if (e instanceof Error) {
          onError(e);
        } else {
          onError(new Error('Deserialization error'));
        }
      }
    }
  }

  /**
   * Triggers the provided callback on updates to the provided accounts.
   *
   * @param accounts - An array of account PublicKeys
   * @param successCallback - A callback function that receives the updated transactions (VersionedTransaction[])
   * @param errorCallback - A callback function that receives the stream error (Error)
   * @returns A function to cancel the subscription
   */
  onAccountUpdate(
    accounts: PublicKey[],
    regions: string[],
    successCallback: (transactions: VersionedTransaction[]) => void,
    errorCallback: (e: Error) => void
  ): () => void {
    const stream: ClientReadableStream<PendingTxNotification> =
      this.client.subscribeMempool({
        wlaV0Sub: {
          accounts: accounts.map(a => a.toString()),
        },
        regions,
      });

    stream.on('readable', () => {
      const msg = stream.read(1);
      if (msg) {
        successCallback(deserializeTransactions(msg.transactions));
      }
    });
    stream.on('error', e => {
      errorCallback(new Error(`Stream error: ${e.message}`));
    });

    return stream.cancel;
  }

  /**
   * Yields on updates to the provided accounts.
   *
   * @param accounts - An array of account PublicKeys
   * @param onError - A callback function that receives the stream error (Error)
   * @returns An async generator that yields updated transactions (VersionedTransaction[]) on account updates
   */
  async *accountUpdates(
    accounts: PublicKey[],
    regions: string[],
    onError: (e: Error) => void
  ): AsyncGenerator<VersionedTransaction[]> {
    const stream: ClientReadableStream<PendingTxNotification> =
      this.client.subscribeMempool({
        wlaV0Sub: {
          accounts: accounts.map(a => a.toString()),
        },
        regions,
      });

    stream.on('error', e => {
      onError(e);
    });

    for await (const pendingTxNotification of stream) {
      try {
        yield deserializeTransactions(pendingTxNotification.transactions);
      } catch (e) {
        console.log('Deserialization error: ', e);
        if (e instanceof Error) {
          onError(e);
        } else {
          onError(new Error('Deserialization error'));
        }
      }
    }
  }

  /**
   * Triggers the provided callback on BundleResult updates.
   *
   * @param successCallback - A callback function that receives the BundleResult updates
   * @param errorCallback - A callback function that receives the stream error (Error)
   * @returns A function to cancel the subscription
   */
  onBundleResult(
    successCallback: (bundleResult: BundleResult) => void,
    errorCallback: (e: Error) => void
  ): () => void {
    const stream: ClientReadableStream<BundleResult> =
      this.client.subscribeBundleResults({});

    stream.on('readable', () => {
      const msg = stream.read(1);
      if (msg) {
        successCallback(msg);
      }
    });
    stream.on('error', e => {
      errorCallback(new Error(`Stream error: ${e.message}`));
    });

    return stream.cancel;
  }

  /**
   * Yields on bundle results.
   *
   * @param onError - A callback function that receives the stream error (Error)
   * @returns An async generator that yields BundleResult updates
   */
  async *bundleResults(
    onError: (e: Error) => void
  ): AsyncGenerator<BundleResult> {
    const stream: ClientReadableStream<BundleResult> =
      this.client.subscribeBundleResults({});

    stream.on('error', e => {
      onError(e);
    });

    for await (const bundleResult of stream) {
      yield bundleResult;
    }
  }
}

/**
 * Creates and returns a SearcherClient instance.
 *
 * @param url - The URL of the SearcherService
 * @param authKeypair - Keypair authorized for the block engine
 * @param grpcOptions - Optional configuration options for the gRPC client
 * @returns SearcherClient - An instance of the SearcherClient
 */
export const searcherClient = (
  url: string,
  authKeypair: Keypair,
  grpcOptions?: Partial<ChannelOptions>
): SearcherClient => {
  const authProvider = new AuthProvider(
    new AuthServiceClient(url, ChannelCredentials.createSsl()),
    authKeypair
  );
  const client = new SearcherServiceClient(
    url,
    ChannelCredentials.createSsl(),
    {interceptors: [authInterceptor(authProvider)], ...grpcOptions}
  );

  return new SearcherClient(client);
};
