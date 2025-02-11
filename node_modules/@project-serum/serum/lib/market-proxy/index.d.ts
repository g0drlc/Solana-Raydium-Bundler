import BN from 'bn.js';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Market, MarketOptions, OrderParams, Order } from '../market';
import { Middleware } from './middleware';
export declare class MarketProxy {
    get market(): Market;
    private _market;
    get instruction(): MarketProxyInstruction;
    private _instruction;
    get dexProgramId(): PublicKey;
    get proxyProgramId(): PublicKey;
    constructor(market: Market, instruction: MarketProxyInstruction);
}
export declare class MarketProxyInstruction {
    get proxyProgramId(): PublicKey;
    private _proxyProgramId;
    private _dexProgramId;
    private _market;
    private _middlewares;
    constructor(proxyProgramId: PublicKey, dexProgramId: PublicKey, market: Market, middlewares: Middleware[]);
    newOrderV3(params: OrderParams<PublicKey>): TransactionInstruction;
    initOpenOrders(owner: PublicKey, market: PublicKey, openOrders: PublicKey, marketAuthority: PublicKey): TransactionInstruction;
    cancelOrder(owner: PublicKey, order: Order): TransactionInstruction;
    cancelOrderByClientId(owner: PublicKey, openOrders: PublicKey, clientId: BN): TransactionInstruction;
    settleFunds(openOrders: PublicKey, owner: PublicKey, baseWallet: PublicKey, quoteWallet: PublicKey, referrerQuoteWallet: PublicKey): TransactionInstruction;
    closeOpenOrders(openOrders: PublicKey, owner: PublicKey, solWallet: PublicKey): TransactionInstruction;
    prune(openOrders: PublicKey, openOrdersOwner: PublicKey, limit?: number): TransactionInstruction;
    consumeEvents(openOrdersAccounts: Array<PublicKey>, limit: number): TransactionInstruction;
    consumeEventsPermissioned(openOrdersAccounts: Array<PublicKey>, limit: number): TransactionInstruction;
    private proxy;
}
export declare class MarketProxyBuilder {
    private _middlewares;
    constructor();
    middleware(mw: Middleware): MarketProxyBuilder;
    load({ connection, market, options, dexProgramId, proxyProgramId, }: {
        connection: Connection;
        market: PublicKey;
        options: MarketOptions;
        dexProgramId: PublicKey;
        proxyProgramId: PublicKey;
    }): Promise<MarketProxy>;
}
//# sourceMappingURL=index.d.ts.map