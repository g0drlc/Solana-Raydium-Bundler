"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketProxyBuilder = exports.MarketProxyInstruction = exports.MarketProxy = void 0;
const anchor_1 = require("@project-serum/anchor");
const market_1 = require("../market");
const instructions_1 = require("../instructions");
// MarketProxy provides an API for constructing transactions to an on-chain
// DEX proxy, which relays all instructions to the orderbook. Minimally, this
// requires two modifications for DEX instructions.
//
// 1. Transasctions are sent to the proxy program--not the DEX.
// 2. The DEX program ID must be inserted as the first account in instructions
//    using the proxy relay, so that the proxy can use the account for CPI.
//    The program is responsible for removing this account before relaying to
//    the dex.
//
// Additionally, a middleware abstraction is provided so that one can configure
// both the client and the smart contract with the ability to send and processs
// arbitrary accounts and instruction data *in addition* to what the Serum DEX
// expects.
//
// Similar to the layers of an onion, each middleware wraps a transaction
// request with additional accounts and instruction data before sending it to
// the program. Upon receiving the request, the program--with its own set of
// middleware-- unwraps and processes each layer. The process ends with all
// layers being unwrapped and the proxy relaying the transaction to the DEX.
//
// As a result, the order of the middleware matters and the client should
// process middleware in the *reverse* order of the proxy smart contract.
class MarketProxy {
    // Ctor.
    constructor(market, instruction) {
        this._market = market;
        this._instruction = instruction;
    }
    // DEX market being proxied.
    get market() {
        return this._market;
    }
    // Instruction namespace.
    get instruction() {
        return this._instruction;
    }
    // Serum DEX program ID.
    get dexProgramId() {
        return this._market.programId;
    }
    // Proxy program ID.
    get proxyProgramId() {
        return this._instruction.proxyProgramId;
    }
}
exports.MarketProxy = MarketProxy;
// Instruction builder for the market proxy.
class MarketProxyInstruction {
    constructor(proxyProgramId, dexProgramId, market, middlewares) {
        this._proxyProgramId = proxyProgramId;
        this._dexProgramId = dexProgramId;
        this._market = market;
        this._middlewares = middlewares;
    }
    // Program ID of the permissioning proxy program.
    get proxyProgramId() {
        return this._proxyProgramId;
    }
    newOrderV3(params) {
        const tradeIx = this._market.makeNewOrderV3Instruction({
            ...params,
            programId: this._proxyProgramId,
        });
        this._middlewares.forEach((mw) => mw.newOrderV3(tradeIx));
        return this.proxy(tradeIx);
    }
    initOpenOrders(owner, market, openOrders, marketAuthority) {
        const ix = instructions_1.DexInstructions.initOpenOrders({
            market,
            openOrders,
            owner,
            programId: this._proxyProgramId,
            marketAuthority,
        });
        this._middlewares.forEach((mw) => mw.initOpenOrders(ix));
        return this.proxy(ix);
    }
    cancelOrder(owner, order) {
        const ix = instructions_1.DexInstructions.cancelOrderV2({
            market: this._market.address,
            owner,
            openOrders: order.openOrdersAddress,
            bids: this._market.decoded.bids,
            asks: this._market.decoded.asks,
            eventQueue: this._market.decoded.eventQueue,
            side: order.side,
            orderId: order.orderId,
            openOrdersSlot: order.openOrdersSlot,
            programId: this._proxyProgramId,
        });
        this._middlewares.forEach((mw) => mw.cancelOrderV2(ix));
        return this.proxy(ix);
    }
    cancelOrderByClientId(owner, openOrders, clientId) {
        const ix = instructions_1.DexInstructions.cancelOrderByClientIdV2({
            market: this._market.address,
            openOrders,
            owner,
            bids: this._market.decoded.bids,
            asks: this._market.decoded.asks,
            eventQueue: this._market.decoded.eventQueue,
            clientId,
            programId: this._proxyProgramId,
        });
        this._middlewares.forEach((mw) => mw.cancelOrderByClientIdV2(ix));
        return this.proxy(ix);
    }
    settleFunds(openOrders, owner, baseWallet, quoteWallet, referrerQuoteWallet) {
        const ix = instructions_1.DexInstructions.settleFunds({
            market: this._market.address,
            openOrders,
            owner,
            baseVault: this._market.decoded.baseVault,
            quoteVault: this._market.decoded.quoteVault,
            baseWallet,
            quoteWallet,
            vaultSigner: anchor_1.utils.publicKey.createProgramAddressSync([
                this._market.address.toBuffer(),
                this._market.decoded.vaultSignerNonce.toArrayLike(Buffer, 'le', 8),
            ], this._dexProgramId),
            programId: this._proxyProgramId,
            referrerQuoteWallet,
        });
        this._middlewares.forEach((mw) => mw.settleFunds(ix));
        return this.proxy(ix);
    }
    closeOpenOrders(openOrders, owner, solWallet) {
        const ix = instructions_1.DexInstructions.closeOpenOrders({
            market: this._market.address,
            openOrders,
            owner,
            solWallet,
            programId: this._proxyProgramId,
        });
        this._middlewares.forEach((mw) => mw.closeOpenOrders(ix));
        return this.proxy(ix);
    }
    prune(openOrders, openOrdersOwner, limit) {
        if (!limit) {
            limit = 65535;
        }
        const ix = instructions_1.DexInstructions.prune({
            market: this._market.address,
            bids: this._market.decoded.bids,
            asks: this._market.decoded.asks,
            eventQueue: this._market.decoded.eventQueue,
            pruneAuthority: this._market.decoded.pruneAuthority,
            openOrders,
            openOrdersOwner,
            programId: this._proxyProgramId,
            limit,
        });
        this._middlewares.forEach((mw) => mw.prune(ix));
        return this.proxy(ix);
    }
    consumeEvents(openOrdersAccounts, limit) {
        const ix = instructions_1.DexInstructions.consumeEvents({
            market: this._market.address,
            eventQueue: this._market.decoded.eventQueue,
            coinFee: this._market.decoded.eventQueue,
            pcFee: this._market.decoded.eventQueue,
            openOrdersAccounts,
            limit,
            programId: this._proxyProgramId,
        });
        this._middlewares.forEach((mw) => mw.consumeEvents(ix));
        return this.proxy(ix);
    }
    consumeEventsPermissioned(openOrdersAccounts, limit) {
        const ix = instructions_1.DexInstructions.consumeEventsPermissioned({
            market: this._market.address,
            eventQueue: this._market.decoded.eventQueue,
            crankAuthority: this._market.decoded.consumeEventsAuthority,
            openOrdersAccounts,
            limit,
            programId: this._proxyProgramId,
        });
        this._middlewares.forEach((mw) => mw.consumeEventsPermissioned(ix));
        return this.proxy(ix);
    }
    // Adds the serum dex account to the instruction so that proxies can
    // relay (CPI requires the executable account).
    proxy(ix) {
        ix.keys = [
            { pubkey: this._dexProgramId, isWritable: false, isSigner: false },
            ...ix.keys,
        ];
        return ix;
    }
}
exports.MarketProxyInstruction = MarketProxyInstruction;
class MarketProxyBuilder {
    constructor() {
        this._middlewares = [];
    }
    middleware(mw) {
        this._middlewares.push(mw);
        return this;
    }
    async load({ connection, market, options = {}, dexProgramId, proxyProgramId, }) {
        const marketClient = await market_1.Market.load(connection, market, options, dexProgramId, market_1.MARKET_STATE_LAYOUT_V3);
        const instruction = new MarketProxyInstruction(proxyProgramId, dexProgramId, marketClient, this._middlewares);
        return new MarketProxy(marketClient, instruction);
    }
}
exports.MarketProxyBuilder = MarketProxyBuilder;
//# sourceMappingURL=index.js.map