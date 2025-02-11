/// <reference types="node" />
import { Slab } from './slab';
import BN from 'bn.js';
import { Account, AccountInfo, Commitment, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
export declare const _MARKET_STAT_LAYOUT_V1: any;
export declare const MARKET_STATE_LAYOUT_V2: any;
export declare const MARKET_STATE_LAYOUT_V3: any;
export declare class Market {
    private _decoded;
    private _baseSplTokenDecimals;
    private _quoteSplTokenDecimals;
    private _skipPreflight;
    private _commitment;
    private _programId;
    private _openOrdersAccountsCache;
    private _layoutOverride?;
    private _feeDiscountKeysCache;
    constructor(decoded: any, baseMintDecimals: number, quoteMintDecimals: number, options: MarketOptions | undefined, programId: PublicKey, layoutOverride?: any);
    static getLayout(programId: PublicKey): any;
    static findAccountsByMints(connection: Connection, baseMintAddress: PublicKey, quoteMintAddress: PublicKey, programId: PublicKey): Promise<{
        publicKey: PublicKey;
        accountInfo: AccountInfo<Buffer>;
    }[]>;
    static load(connection: Connection, address: PublicKey, options: MarketOptions | undefined, programId: PublicKey, layoutOverride?: any): Promise<Market>;
    get programId(): PublicKey;
    get address(): PublicKey;
    get publicKey(): PublicKey;
    get baseMintAddress(): PublicKey;
    get quoteMintAddress(): PublicKey;
    get bidsAddress(): PublicKey;
    get asksAddress(): PublicKey;
    get decoded(): any;
    loadBids(connection: Connection): Promise<Orderbook>;
    loadAsks(connection: Connection): Promise<Orderbook>;
    loadOrdersForOwner(connection: Connection, ownerAddress: PublicKey, cacheDurationMs?: number): Promise<Order[]>;
    filterForOpenOrders(bids: Orderbook, asks: Orderbook, openOrdersAccounts: OpenOrders[]): Order[];
    findBaseTokenAccountsForOwner(connection: Connection, ownerAddress: PublicKey, includeUnwrappedSol?: boolean): Promise<Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
    }>>;
    getTokenAccountsByOwnerForMint(connection: Connection, ownerAddress: PublicKey, mintAddress: PublicKey): Promise<Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
    }>>;
    findQuoteTokenAccountsForOwner(connection: Connection, ownerAddress: PublicKey, includeUnwrappedSol?: boolean): Promise<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
    }[]>;
    findOpenOrdersAccountsForOwner(connection: Connection, ownerAddress: PublicKey, cacheDurationMs?: number): Promise<OpenOrders[]>;
    replaceOrders(connection: Connection, accounts: OrderParamsAccounts, orders: OrderParamsBase[], cacheDurationMs?: number): Promise<string>;
    placeOrder(connection: Connection, { owner, payer, side, price, size, orderType, clientId, openOrdersAddressKey, openOrdersAccount, feeDiscountPubkey, maxTs, replaceIfExists, }: OrderParams): Promise<string>;
    getSplTokenBalanceFromAccountInfo(accountInfo: AccountInfo<Buffer>, decimals: number): number;
    get supportsSrmFeeDiscounts(): boolean;
    get supportsReferralFees(): boolean;
    get usesRequestQueue(): boolean;
    findFeeDiscountKeys(connection: Connection, ownerAddress: PublicKey, cacheDurationMs?: number): Promise<Array<{
        pubkey: PublicKey;
        feeTier: number;
        balance: number;
        mint: PublicKey;
    }>>;
    findBestFeeDiscountKey(connection: Connection, ownerAddress: PublicKey, cacheDurationMs?: number): Promise<{
        pubkey: PublicKey | null;
        feeTier: number;
    }>;
    makePlaceOrderTransaction<T extends PublicKey | Account>(connection: Connection, { owner, payer, side, price, size, orderType, clientId, openOrdersAddressKey, openOrdersAccount, feeDiscountPubkey, selfTradeBehavior, maxTs, replaceIfExists, }: OrderParams<T>, cacheDurationMs?: number, feeDiscountPubkeyCacheDurationMs?: number): Promise<{
        transaction: Transaction;
        signers: Account[];
        payer: T;
    }>;
    makePlaceOrderInstruction<T extends PublicKey | Account>(connection: Connection, params: OrderParams<T>): TransactionInstruction;
    makeNewOrderV3Instruction<T extends PublicKey | Account>(params: OrderParams<T>): TransactionInstruction;
    makeReplaceOrdersByClientIdsInstruction<T extends PublicKey | Account>(accounts: OrderParamsAccounts<T>, orders: OrderParamsBase<T>[]): TransactionInstruction;
    private _sendTransaction;
    cancelOrderByClientId(connection: Connection, owner: Account, openOrders: PublicKey, clientId: BN): Promise<string>;
    cancelOrdersByClientIds(connection: Connection, owner: Account, openOrders: PublicKey, clientIds: BN[]): Promise<string>;
    makeCancelOrderByClientIdTransaction(connection: Connection, owner: PublicKey, openOrders: PublicKey, clientId: BN): Promise<Transaction>;
    makeCancelOrdersByClientIdsTransaction(connection: Connection, owner: PublicKey, openOrders: PublicKey, clientIds: BN[]): Promise<Transaction>;
    cancelOrder(connection: Connection, owner: Account, order: Order): Promise<string>;
    makeCancelOrderTransaction(connection: Connection, owner: PublicKey, order: Order): Promise<Transaction>;
    makeCancelOrderInstruction(connection: Connection, owner: PublicKey, order: Order): TransactionInstruction;
    makeConsumeEventsInstruction(openOrdersAccounts: Array<PublicKey>, limit: number): TransactionInstruction;
    makeConsumeEventsPermissionedInstruction(openOrdersAccounts: Array<PublicKey>, limit: number): TransactionInstruction;
    settleFunds(connection: Connection, owner: Account, openOrders: OpenOrders, baseWallet: PublicKey, quoteWallet: PublicKey, referrerQuoteWallet?: PublicKey | null): Promise<string>;
    makeSettleFundsTransaction(connection: Connection, openOrders: OpenOrders, baseWallet: PublicKey, quoteWallet: PublicKey, referrerQuoteWallet?: PublicKey | null): Promise<{
        transaction: Transaction;
        signers: Account[];
        payer: PublicKey;
    }>;
    matchOrders(connection: Connection, feePayer: Account, limit: number): Promise<string>;
    makeMatchOrdersTransaction(limit: number): Transaction;
    loadRequestQueue(connection: Connection): Promise<any[]>;
    loadEventQueue(connection: Connection): Promise<import("./queue").Event[]>;
    loadFills(connection: Connection, limit?: number): Promise<any[]>;
    parseFillEvent(event: any): any;
    private get _baseSplTokenMultiplier();
    private get _quoteSplTokenMultiplier();
    priceLotsToNumber(price: BN): number;
    priceNumberToLots(price: number): BN;
    baseSplSizeToNumber(size: BN): number;
    quoteSplSizeToNumber(size: BN): number;
    baseSizeLotsToNumber(size: BN): number;
    baseSizeNumberToLots(size: number): BN;
    quoteSizeLotsToNumber(size: BN): number;
    quoteSizeNumberToLots(size: number): BN;
    get minOrderSize(): number;
    get tickSize(): number;
}
export interface MarketOptions {
    skipPreflight?: boolean;
    commitment?: Commitment;
}
export interface OrderParamsBase<T = Account> {
    side: 'buy' | 'sell';
    price: number;
    size: number;
    orderType?: 'limit' | 'ioc' | 'postOnly';
    clientId?: BN;
    selfTradeBehavior?: 'decrementTake' | 'cancelProvide' | 'abortTransaction' | undefined;
    maxTs?: number | null;
}
export interface OrderParamsAccounts<T = Account> {
    owner: T;
    payer: PublicKey;
    openOrdersAddressKey?: PublicKey;
    openOrdersAccount?: Account;
    feeDiscountPubkey?: PublicKey | null;
    programId?: PublicKey;
}
export interface OrderParams<T = Account> extends OrderParamsBase<T>, OrderParamsAccounts<T> {
    replaceIfExists?: boolean;
}
export declare const _OPEN_ORDERS_LAYOUT_V1: any;
export declare const _OPEN_ORDERS_LAYOUT_V2: any;
export declare class OpenOrders {
    private _programId;
    address: PublicKey;
    market: PublicKey;
    owner: PublicKey;
    baseTokenFree: BN;
    baseTokenTotal: BN;
    quoteTokenFree: BN;
    quoteTokenTotal: BN;
    freeSlotBits: BN;
    isBidBits: BN;
    orders: BN[];
    clientIds: BN[];
    constructor(address: PublicKey, decoded: any, programId: PublicKey);
    static getLayout(programId: PublicKey): any;
    static findForOwner(connection: Connection, ownerAddress: PublicKey, programId: PublicKey): Promise<OpenOrders[]>;
    static findForMarketAndOwner(connection: Connection, marketAddress: PublicKey, ownerAddress: PublicKey, programId: PublicKey): Promise<OpenOrders[]>;
    static load(connection: Connection, address: PublicKey, programId: PublicKey): Promise<OpenOrders>;
    static fromAccountInfo(address: PublicKey, accountInfo: AccountInfo<Buffer>, programId: PublicKey): OpenOrders;
    static makeCreateAccountTransaction(connection: Connection, marketAddress: PublicKey, ownerAddress: PublicKey, newAccountAddress: PublicKey, programId: PublicKey): Promise<TransactionInstruction>;
    get publicKey(): PublicKey;
}
export declare const ORDERBOOK_LAYOUT: any;
export declare class Orderbook {
    market: Market;
    isBids: boolean;
    slab: Slab;
    constructor(market: Market, accountFlags: any, slab: Slab);
    static get LAYOUT(): any;
    static decode(market: Market, buffer: Buffer): Orderbook;
    getL2(depth: number): [number, number, BN, BN][];
    [Symbol.iterator](): Generator<Order, any, unknown>;
    items(descending?: boolean): Generator<Order>;
}
export interface Order {
    orderId: BN;
    openOrdersAddress: PublicKey;
    openOrdersSlot: number;
    price: number;
    priceLots: BN;
    size: number;
    feeTier: number;
    sizeLots: BN;
    side: 'buy' | 'sell';
    clientId?: BN;
}
export declare function getMintDecimals(connection: Connection, mint: PublicKey): Promise<number>;
//# sourceMappingURL=market.d.ts.map