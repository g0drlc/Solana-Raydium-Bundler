import {Connection, Keypair} from '@solana/web3.js';
import {SearcherClient} from '../../sdk/searcher';
export declare const onPendingTransactions: (
  c: SearcherClient,
  accounts: string[],
  bundleTransactionLimit: number,
  keypair: Keypair,
  conn: Connection
) => Promise<void>;
export declare const onBundleResult: (c: SearcherClient) => void;
