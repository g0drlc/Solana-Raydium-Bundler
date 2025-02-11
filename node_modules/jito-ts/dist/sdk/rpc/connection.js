"use strict";
// most stuff copied from @solana/web3.js 1.74.0 - see direct references in the comment of each snippet
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitoRpcConnection = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const web3_js_1 = require("@solana/web3.js");
const superstruct_1 = require("superstruct");
const https_1 = require("https");
const fetch_impl_1 = __importDefault(require("./fetch-impl"));
const agentkeepalive_1 = __importStar(require("agentkeepalive"));
const browser_1 = __importDefault(require("jayson/lib/client/browser"));
const utils_1 = require("./utils");
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L387
function createRpcResult(result) {
    return (0, superstruct_1.union)([
        (0, superstruct_1.type)({
            jsonrpc: (0, superstruct_1.literal)('2.0'),
            id: (0, superstruct_1.string)(),
            result,
        }),
        (0, superstruct_1.type)({
            jsonrpc: (0, superstruct_1.literal)('2.0'),
            id: (0, superstruct_1.string)(),
            error: (0, superstruct_1.type)({
                code: (0, superstruct_1.unknown)(),
                message: (0, superstruct_1.string)(),
                data: (0, superstruct_1.optional)((0, superstruct_1.any)()),
            }),
        }),
    ]);
}
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L406
const UnknownRpcResult = createRpcResult((0, superstruct_1.unknown)());
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L411
function jsonRpcResult(schema) {
    return (0, superstruct_1.coerce)(createRpcResult(schema), UnknownRpcResult, value => {
        if ('error' in value) {
            return value;
        }
        else {
            return {
                ...value,
                result: (0, superstruct_1.create)(value.result, schema),
            };
        }
    });
}
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L427
function jsonRpcResultAndContext(value) {
    return jsonRpcResult((0, superstruct_1.type)({
        context: (0, superstruct_1.type)({
            slot: (0, superstruct_1.number)(),
        }),
        value,
    }));
}
const SimulatedBundleResponseStruct = jsonRpcResultAndContext((0, superstruct_1.type)({
    summary: (0, superstruct_1.union)([
        (0, superstruct_1.type)({
            failed: (0, superstruct_1.type)({
                error: (0, superstruct_1.union)([(0, superstruct_1.type)({}), (0, superstruct_1.string)()]),
                tx_signature: (0, superstruct_1.string)(),
            }),
        }),
        (0, superstruct_1.literal)('succeeded'),
    ]),
    transactionResults: (0, superstruct_1.array)((0, superstruct_1.type)({
        err: (0, superstruct_1.nullable)((0, superstruct_1.union)([(0, superstruct_1.type)({}), (0, superstruct_1.string)()])),
        logs: (0, superstruct_1.nullable)((0, superstruct_1.array)((0, superstruct_1.string)())),
        preExecutionAccounts: (0, superstruct_1.optional)((0, superstruct_1.nullable)((0, superstruct_1.array)((0, superstruct_1.type)({
            executable: (0, superstruct_1.boolean)(),
            owner: (0, superstruct_1.string)(),
            lamports: (0, superstruct_1.number)(),
            data: (0, superstruct_1.array)((0, superstruct_1.string)()),
            rentEpoch: (0, superstruct_1.optional)((0, superstruct_1.number)()),
        })))),
        postExecutionAccounts: (0, superstruct_1.optional)((0, superstruct_1.nullable)((0, superstruct_1.array)((0, superstruct_1.type)({
            executable: (0, superstruct_1.boolean)(),
            owner: (0, superstruct_1.string)(),
            lamports: (0, superstruct_1.number)(),
            data: (0, superstruct_1.array)((0, superstruct_1.string)()),
            rentEpoch: (0, superstruct_1.optional)((0, superstruct_1.number)()),
        })))),
        unitsConsumed: (0, superstruct_1.optional)((0, superstruct_1.number)()),
        returnData: (0, superstruct_1.optional)((0, superstruct_1.nullable)((0, superstruct_1.type)({
            programId: (0, superstruct_1.string)(),
            data: (0, superstruct_1.tuple)([(0, superstruct_1.string)(), (0, superstruct_1.literal)('base64')]),
        }))),
    })),
}));
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L1489
function createRpcClient(url, httpHeaders, customFetch, fetchMiddleware, disableRetryOnRateLimit, httpAgent) {
    const fetch = customFetch ? customFetch : fetch_impl_1.default;
    let agent;
    if (process.env.BROWSER) {
        // eslint-disable-next-line eqeqeq
        if (httpAgent != null) {
            console.warn('You have supplied an `httpAgent` when creating a `Connection` in a browser environment.' +
                'It has been ignored; `httpAgent` is only used in Node environments.');
        }
    }
    else {
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
                    agent = new agentkeepalive_1.HttpsAgent(agentOptions);
                }
                else {
                    agent = new agentkeepalive_1.default(agentOptions);
                }
            }
        }
        else {
            if (httpAgent !== false) {
                const isHttps = url.startsWith('https:');
                if (isHttps && !(httpAgent instanceof https_1.Agent)) {
                    throw new Error('The endpoint `' +
                        url +
                        '` can only be paired with an `https.Agent`. You have, instead, supplied an ' +
                        '`http.Agent` through `httpAgent`.');
                }
                else if (!isHttps && httpAgent instanceof https_1.Agent) {
                    throw new Error('The endpoint `' +
                        url +
                        '` can only be paired with an `http.Agent`. You have, instead, supplied an ' +
                        '`https.Agent` through `httpAgent`.');
                }
                agent = httpAgent;
            }
        }
    }
    let fetchWithMiddleware;
    if (fetchMiddleware) {
        fetchWithMiddleware = async (info, init) => {
            const modifiedFetchArgs = await new Promise((resolve, reject) => {
                try {
                    fetchMiddleware(info, init, (modifiedInfo, modifiedInit) => resolve([modifiedInfo, modifiedInit]));
                }
                catch (error) {
                    reject(error);
                }
            });
            return await fetch(...modifiedFetchArgs);
        };
    }
    const clientBrowser = new browser_1.default(async (request, callback) => {
        const options = {
            method: 'POST',
            body: request,
            agent,
            headers: Object.assign({
                'Content-Type': 'application/json',
            }, httpHeaders || {}),
        };
        try {
            let too_many_requests_retries = 5;
            let res;
            let waitTime = 500;
            for (;;) {
                if (fetchWithMiddleware) {
                    res = await fetchWithMiddleware(url, options);
                }
                else {
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
                console.log(`Server responded with ${res.status} ${res.statusText}.  Retrying after ${waitTime}ms delay...`);
                await (0, utils_1.sleep)(waitTime);
                waitTime *= 2;
            }
            const text = await res.text();
            if (res.ok) {
                callback(null, text);
            }
            else {
                callback(new Error(`${res.status} ${res.statusText}: ${text}`));
            }
        }
        catch (err) {
            if (err instanceof Error)
                callback(err);
        }
    }, {});
    return clientBrowser;
}
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L1620
function createRpcRequest(client) {
    return (method, args) => {
        return new Promise((resolve, reject) => {
            client.request(method, args, (err, response) => {
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
class JitoRpcConnection extends web3_js_1.Connection {
    // copied from here but removed unused fields
    // https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/connection.ts#L3060
    constructor(endpoint, commitmentOrConfig) {
        super(endpoint, commitmentOrConfig);
        let httpHeaders;
        let fetch;
        let fetchMiddleware;
        let disableRetryOnRateLimit;
        let httpAgent;
        if (commitmentOrConfig && typeof commitmentOrConfig === 'string') {
            this._commitment = commitmentOrConfig;
        }
        else if (commitmentOrConfig) {
            this._commitment = commitmentOrConfig.commitment;
            this._confirmTransactionInitialTimeout =
                commitmentOrConfig.confirmTransactionInitialTimeout;
            httpHeaders = commitmentOrConfig.httpHeaders;
            fetch = commitmentOrConfig.fetch;
            fetchMiddleware = commitmentOrConfig.fetchMiddleware;
            disableRetryOnRateLimit = commitmentOrConfig.disableRetryOnRateLimit;
            httpAgent = commitmentOrConfig.httpAgent;
        }
        this._rpcClient = createRpcClient(endpoint, httpHeaders, fetch, fetchMiddleware, disableRetryOnRateLimit, httpAgent);
        this._rpcRequest = createRpcRequest(this._rpcClient);
    }
    /**
     * Simulate a bundle
     */
    async simulateBundle(bundle, config) {
        if (config &&
            bundle.length !== config.preExecutionAccountsConfigs.length &&
            bundle.length !== config.postExecutionAccountsConfigs.length) {
            throw new Error('pre/post execution account config length must match bundle length');
        }
        const encodedTransactions = bundle.map(versionedTx => {
            return Buffer.from(versionedTx.serialize()).toString('base64');
        });
        const simulationConfig = config || {};
        simulationConfig.transactionEncoding = 'base64';
        const args = [{ encodedTransactions }, simulationConfig];
        const unsafeRes = await this._rpcRequest('simulateBundle', args);
        const res = (0, superstruct_1.create)(unsafeRes, SimulatedBundleResponseStruct);
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
            throw new web3_js_1.SendTransactionError('failed to simulate bundle: ' + res.error.message, logs);
        }
        return res.result;
    }
}
exports.JitoRpcConnection = JitoRpcConnection;
//# sourceMappingURL=connection.js.map