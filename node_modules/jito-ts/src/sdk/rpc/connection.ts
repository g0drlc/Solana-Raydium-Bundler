// most stuff copied from @solana/web3.js 1.74.0 - see direct references in the comment of each snippet
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Commitment,
  Connection,
  ConnectionConfig,
  FetchFn,
  FetchMiddleware,
  HttpHeaders,
  RpcResponseAndContext,
  SendTransactionError,
  SimulatedTransactionAccountInfo,
  TransactionError,
  TransactionReturnData,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  type as pick,
  number,
  string,
  array,
  boolean,
  literal,
  union,
  optional,
  nullable,
  coerce,
  create,
  tuple,
  unknown,
  any,
  Struct,
} from 'superstruct';
import type {Agent as NodeHttpAgent} from 'http';
import {Agent as NodeHttpsAgent} from 'https';
import fetchImpl, {Response} from './fetch-impl';
import HttpKeepAliveAgent, {
  HttpsAgent as HttpsKeepAliveAgent,
} from 'agentkeepalive';

import RpcClient from 'jayson/lib/client/browser';
import {sleep} from './utils';

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

export type BundleSimulationSummary =
  | 'succeeded'
  | {
      failed: {
        error: BundleError;
        tx_signature: string;
      };
    };

export type SimulatedBundleResponse = {
  summary: BundleSimulationSummary;
  transactionResults: SimulatedBundleTransactionResult[];
};

// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L387
function createRpcResult<T, U>(result: Struct<T, U>) {
  return union([
    pick({
      jsonrpc: literal('2.0'),
      id: string(),
      result,
    }),
    pick({
      jsonrpc: literal('2.0'),
      id: string(),
      error: pick({
        code: unknown(),
        message: string(),
        data: optional(any()),
      }),
    }),
  ]);
}

// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L406
const UnknownRpcResult = createRpcResult(unknown());

// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L411
function jsonRpcResult<T, U>(schema: Struct<T, U>) {
  return coerce(createRpcResult(schema), UnknownRpcResult, value => {
    if ('error' in value) {
      return value;
    } else {
      return {
        ...value,
        result: create(value.result, schema),
      };
    }
  });
}

// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L427
function jsonRpcResultAndContext<T, U>(value: Struct<T, U>) {
  return jsonRpcResult(
    pick({
      context: pick({
        slot: number(),
      }),
      value,
    })
  );
}

const SimulatedBundleResponseStruct = jsonRpcResultAndContext(
  pick({
    summary: union([
      pick({
        failed: pick({
          error: union([pick({}), string()]),
          tx_signature: string(),
        }),
      }),
      literal('succeeded'),
    ]),
    transactionResults: array(
      pick({
        err: nullable(union([pick({}), string()])),
        logs: nullable(array(string())),
        preExecutionAccounts: optional(
          nullable(
            array(
              pick({
                executable: boolean(),
                owner: string(),
                lamports: number(),
                data: array(string()),
                rentEpoch: optional(number()),
              })
            )
          )
        ),
        postExecutionAccounts: optional(
          nullable(
            array(
              pick({
                executable: boolean(),
                owner: string(),
                lamports: number(),
                data: array(string()),
                rentEpoch: optional(number()),
              })
            )
          )
        ),
        unitsConsumed: optional(number()),
        returnData: optional(
          nullable(
            pick({
              programId: string(),
              data: tuple([string(), literal('base64')]),
            })
          )
        ),
      })
    ),
  })
);

// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L1489
function createRpcClient(
  url: string,
  httpHeaders?: HttpHeaders,
  customFetch?: FetchFn,
  fetchMiddleware?: FetchMiddleware,
  disableRetryOnRateLimit?: boolean,
  httpAgent?: NodeHttpAgent | NodeHttpsAgent | false
): RpcClient {
  const fetch = customFetch ? customFetch : fetchImpl;
  let agent: NodeHttpAgent | NodeHttpsAgent | undefined;
  if (process.env.BROWSER) {
    // eslint-disable-next-line eqeqeq
    if (httpAgent != null) {
      console.warn(
        'You have supplied an `httpAgent` when creating a `Connection` in a browser environment.' +
          'It has been ignored; `httpAgent` is only used in Node environments.'
      );
    }
  } else {
    // eslint-disable-next-line eqeqeq
    if (httpAgent == null) {
      if (process.env.NODE_ENV !== 'test') {
        const agentOptions = {
          // One second fewer than the Solana RPC's keepalive timeout.
          // Read more: https://github.com/solana-labs/solana/issues/27859#issuecomment-1340097889
          freeSocketTimeout: 19000,
          keepAlive: true,
          maxSockets: 25,
        };
        if (url.startsWith('https:')) {
          agent = new HttpsKeepAliveAgent(agentOptions);
        } else {
          agent = new HttpKeepAliveAgent(agentOptions);
        }
      }
    } else {
      if (httpAgent !== false) {
        const isHttps = url.startsWith('https:');
        if (isHttps && !(httpAgent instanceof NodeHttpsAgent)) {
          throw new Error(
            'The endpoint `' +
              url +
              '` can only be paired with an `https.Agent`. You have, instead, supplied an ' +
              '`http.Agent` through `httpAgent`.'
          );
        } else if (!isHttps && httpAgent instanceof NodeHttpsAgent) {
          throw new Error(
            'The endpoint `' +
              url +
              '` can only be paired with an `http.Agent`. You have, instead, supplied an ' +
              '`https.Agent` through `httpAgent`.'
          );
        }
        agent = httpAgent;
      }
    }
  }

  let fetchWithMiddleware: FetchFn | undefined;

  if (fetchMiddleware) {
    fetchWithMiddleware = async (info, init) => {
      const modifiedFetchArgs = await new Promise<Parameters<FetchFn>>(
        (resolve, reject) => {
          try {
            fetchMiddleware(info, init, (modifiedInfo, modifiedInit) =>
              resolve([modifiedInfo, modifiedInit])
            );
          } catch (error) {
            reject(error);
          }
        }
      );
      return await fetch(...modifiedFetchArgs);
    };
  }

  const clientBrowser = new RpcClient(async (request, callback) => {
    const options = {
      method: 'POST',
      body: request,
      agent,
      headers: Object.assign(
        {
          'Content-Type': 'application/json',
        },
        httpHeaders || {}
      ),
    };

    try {
      let too_many_requests_retries = 5;
      let res: Response;
      let waitTime = 500;
      for (;;) {
        if (fetchWithMiddleware) {
          res = await fetchWithMiddleware(url, options);
        } else {
          res = await fetch(url, options);
        }

        if (res.status !== 429 /* Too many requests */) {
          break;
        }
        if (disableRetryOnRateLimit === true) {
          break;
        }
        too_many_requests_retries -= 1;
        if (too_many_requests_retries === 0) {
          break;
        }
        console.log(
          `Server responded with ${res.status} ${res.statusText}.  Retrying after ${waitTime}ms delay...`
        );
        await sleep(waitTime);
        waitTime *= 2;
      }

      const text = await res.text();
      if (res.ok) {
        callback(null, text);
      } else {
        callback(new Error(`${res.status} ${res.statusText}: ${text}`));
      }
    } catch (err) {
      if (err instanceof Error) callback(err);
    }
  }, {});

  return clientBrowser;
}

// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L210
type RpcRequest = (methodName: string, args: Array<any>) => Promise<any>;

// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L1620
function createRpcRequest(client: RpcClient): RpcRequest {
  return (method, args) => {
    return new Promise((resolve, reject) => {
      client.request(method, args, (err: any, response: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  };
}

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
export class JitoRpcConnection extends Connection {
  /** @internal */ _commitment?: Commitment;
  /** @internal */ _confirmTransactionInitialTimeout?: number;
  /** @internal */ _rpcClient: RpcClient;
  /** @internal */ _rpcRequest: RpcRequest;

  // copied from here but removed unused fields
  // https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L3060
  constructor(
    endpoint: string,
    commitmentOrConfig?: Commitment | ConnectionConfig
  ) {
    super(endpoint, commitmentOrConfig);

    let httpHeaders;
    let fetch;
    let fetchMiddleware;
    let disableRetryOnRateLimit;
    let httpAgent;
    if (commitmentOrConfig && typeof commitmentOrConfig === 'string') {
      this._commitment = commitmentOrConfig;
    } else if (commitmentOrConfig) {
      this._commitment = commitmentOrConfig.commitment;
      this._confirmTransactionInitialTimeout =
        commitmentOrConfig.confirmTransactionInitialTimeout;
      httpHeaders = commitmentOrConfig.httpHeaders;
      fetch = commitmentOrConfig.fetch;
      fetchMiddleware = commitmentOrConfig.fetchMiddleware;
      disableRetryOnRateLimit = commitmentOrConfig.disableRetryOnRateLimit;
      httpAgent = commitmentOrConfig.httpAgent;
    }

    this._rpcClient = createRpcClient(
      endpoint,
      httpHeaders,
      fetch,
      fetchMiddleware,
      disableRetryOnRateLimit,
      httpAgent
    );
    this._rpcRequest = createRpcRequest(this._rpcClient);
  }

  /**
   * Simulate a bundle
   */
  async simulateBundle(
    bundle: VersionedTransaction[],
    config?: SimulateBundleConfig
  ): Promise<RpcResponseAndContext<SimulatedBundleResponse>> {
    if (
      config &&
      bundle.length !== config.preExecutionAccountsConfigs.length &&
      bundle.length !== config.postExecutionAccountsConfigs.length
    ) {
      throw new Error(
        'pre/post execution account config length must match bundle length'
      );
    }

    const encodedTransactions = bundle.map(versionedTx => {
      return Buffer.from(versionedTx.serialize()).toString('base64');
    });

    const simulationConfig: any = config || {};
    simulationConfig.transactionEncoding = 'base64';
    const args = [{encodedTransactions}, simulationConfig];
    const unsafeRes = await this._rpcRequest('simulateBundle', args);
    const res = create(unsafeRes, SimulatedBundleResponseStruct);

    if ('error' in res) {
      let logs;
      if ('data' in res.error) {
        logs = res.error.data.logs;
        if (logs && Array.isArray(logs)) {
          const traceIndent = '\n    ';
          const logTrace = traceIndent + logs.join(traceIndent);
          console.error(res.error.message, logTrace);
        }
      }
      throw new SendTransactionError(
        'failed to simulate bundle: ' + res.error.message,
        logs
      );
    }
    return res.result;
  }
}
