import {Keypair, Transaction} from '@solana/web3.js';
import {SearcherServiceClient, SlotList} from '../gen/block-engine/searcher';
import {Bundle} from './types';
import {BundleResult} from '../gen/block-engine/bundle';
export declare class SearcherClient {
  private client;
  constructor(client: SearcherServiceClient);
  sendBundle(bundle: Bundle): Promise<string>;
  getTipAccounts(): Promise<string[]>;
  getConnectedLeaders(): Promise<{
    [key: string]: SlotList;
  }>;
  getNextScheduledLeader(): Promise<{
    /** the current slot the backend is on */
    currentSlot: number;
    /** the slot and identity of the next leader */
    nextLeaderSlot: number;
    nextLeaderIdentity: string;
  }>;
  onPendingTransactions(
    accounts: string[],
    successCallback: (transactions: Transaction[]) => void,
    errorCallback: (e: Error) => void
  ): void;
  onBundleResult(
    successCallback: (bundleResult: BundleResult) => void,
    errorCallback: (e: Error) => void
  ): void;
}
export declare const searcherClient: (
  url: string,
  authKeypair: Keypair
) => SearcherClient;
