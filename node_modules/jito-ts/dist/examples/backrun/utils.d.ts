import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { SearcherClient } from '../../sdk/block-engine/searcher';
export declare const onAccountUpdates: (c: SearcherClient, accounts: PublicKey[], regions: string[], bundleTransactionLimit: number, keypair: Keypair, conn: Connection) => Promise<void>;
export declare const onBundleResult: (c: SearcherClient) => void;
