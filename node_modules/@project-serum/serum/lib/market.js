"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMintDecimals = exports.Orderbook = exports.ORDERBOOK_LAYOUT = exports.OpenOrders = exports._OPEN_ORDERS_LAYOUT_V2 = exports._OPEN_ORDERS_LAYOUT_V1 = exports.Market = exports.MARKET_STATE_LAYOUT_V3 = exports.MARKET_STATE_LAYOUT_V2 = exports._MARKET_STAT_LAYOUT_V1 = void 0;
const buffer_layout_1 = require("buffer-layout");
const layout_1 = require("./layout");
const slab_1 = require("./slab");
const instructions_1 = require("./instructions");
const bn_js_1 = __importDefault(require("bn.js"));
const web3_js_1 = require("@solana/web3.js");
const queue_1 = require("./queue");
const buffer_1 = require("buffer");
const fees_1 = require("./fees");
const token_instructions_1 = require("./token-instructions");
const tokens_and_markets_1 = require("./tokens_and_markets");
exports._MARKET_STAT_LAYOUT_V1 = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    layout_1.publicKeyLayout('ownAddress'),
    layout_1.u64('vaultSignerNonce'),
    layout_1.publicKeyLayout('baseMint'),
    layout_1.publicKeyLayout('quoteMint'),
    layout_1.publicKeyLayout('baseVault'),
    layout_1.u64('baseDepositsTotal'),
    layout_1.u64('baseFeesAccrued'),
    layout_1.publicKeyLayout('quoteVault'),
    layout_1.u64('quoteDepositsTotal'),
    layout_1.u64('quoteFeesAccrued'),
    layout_1.u64('quoteDustThreshold'),
    layout_1.publicKeyLayout('requestQueue'),
    layout_1.publicKeyLayout('eventQueue'),
    layout_1.publicKeyLayout('bids'),
    layout_1.publicKeyLayout('asks'),
    layout_1.u64('baseLotSize'),
    layout_1.u64('quoteLotSize'),
    layout_1.u64('feeRateBps'),
    buffer_layout_1.blob(7),
]);
exports.MARKET_STATE_LAYOUT_V2 = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    layout_1.publicKeyLayout('ownAddress'),
    layout_1.u64('vaultSignerNonce'),
    layout_1.publicKeyLayout('baseMint'),
    layout_1.publicKeyLayout('quoteMint'),
    layout_1.publicKeyLayout('baseVault'),
    layout_1.u64('baseDepositsTotal'),
    layout_1.u64('baseFeesAccrued'),
    layout_1.publicKeyLayout('quoteVault'),
    layout_1.u64('quoteDepositsTotal'),
    layout_1.u64('quoteFeesAccrued'),
    layout_1.u64('quoteDustThreshold'),
    layout_1.publicKeyLayout('requestQueue'),
    layout_1.publicKeyLayout('eventQueue'),
    layout_1.publicKeyLayout('bids'),
    layout_1.publicKeyLayout('asks'),
    layout_1.u64('baseLotSize'),
    layout_1.u64('quoteLotSize'),
    layout_1.u64('feeRateBps'),
    layout_1.u64('referrerRebatesAccrued'),
    buffer_layout_1.blob(7),
]);
exports.MARKET_STATE_LAYOUT_V3 = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    layout_1.publicKeyLayout('ownAddress'),
    layout_1.u64('vaultSignerNonce'),
    layout_1.publicKeyLayout('baseMint'),
    layout_1.publicKeyLayout('quoteMint'),
    layout_1.publicKeyLayout('baseVault'),
    layout_1.u64('baseDepositsTotal'),
    layout_1.u64('baseFeesAccrued'),
    layout_1.publicKeyLayout('quoteVault'),
    layout_1.u64('quoteDepositsTotal'),
    layout_1.u64('quoteFeesAccrued'),
    layout_1.u64('quoteDustThreshold'),
    layout_1.publicKeyLayout('requestQueue'),
    layout_1.publicKeyLayout('eventQueue'),
    layout_1.publicKeyLayout('bids'),
    layout_1.publicKeyLayout('asks'),
    layout_1.u64('baseLotSize'),
    layout_1.u64('quoteLotSize'),
    layout_1.u64('feeRateBps'),
    layout_1.u64('referrerRebatesAccrued'),
    layout_1.publicKeyLayout('authority'),
    layout_1.publicKeyLayout('pruneAuthority'),
    layout_1.publicKeyLayout('consumeEventsAuthority'),
    buffer_layout_1.blob(992),
    buffer_layout_1.blob(7),
]);
class Market {
    constructor(decoded, baseMintDecimals, quoteMintDecimals, options = {}, programId, layoutOverride) {
        const { skipPreflight = false, commitment = 'recent' } = options;
        if (!decoded.accountFlags.initialized || !decoded.accountFlags.market) {
            throw new Error('Invalid market state');
        }
        this._decoded = decoded;
        this._baseSplTokenDecimals = baseMintDecimals;
        this._quoteSplTokenDecimals = quoteMintDecimals;
        this._skipPreflight = skipPreflight;
        this._commitment = commitment;
        this._programId = programId;
        this._openOrdersAccountsCache = {};
        this._feeDiscountKeysCache = {};
        this._layoutOverride = layoutOverride;
    }
    static getLayout(programId) {
        if (tokens_and_markets_1.getLayoutVersion(programId) === 1) {
            return exports._MARKET_STAT_LAYOUT_V1;
        }
        return exports.MARKET_STATE_LAYOUT_V2;
    }
    static async findAccountsByMints(connection, baseMintAddress, quoteMintAddress, programId) {
        const filters = [
            {
                memcmp: {
                    offset: this.getLayout(programId).offsetOf('baseMint'),
                    bytes: baseMintAddress.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: Market.getLayout(programId).offsetOf('quoteMint'),
                    bytes: quoteMintAddress.toBase58(),
                },
            },
        ];
        return getFilteredProgramAccounts(connection, programId, filters);
    }
    static async load(connection, address, options = {}, programId, layoutOverride) {
        const { owner, data } = throwIfNull(await connection.getAccountInfo(address), 'Market not found');
        if (!owner.equals(programId)) {
            throw new Error('Address not owned by program: ' + owner.toBase58());
        }
        const decoded = (layoutOverride !== null && layoutOverride !== void 0 ? layoutOverride : this.getLayout(programId)).decode(data);
        if (!decoded.accountFlags.initialized ||
            !decoded.accountFlags.market ||
            !decoded.ownAddress.equals(address)) {
            throw new Error('Invalid market');
        }
        const [baseMintDecimals, quoteMintDecimals] = await Promise.all([
            getMintDecimals(connection, decoded.baseMint),
            getMintDecimals(connection, decoded.quoteMint),
        ]);
        return new Market(decoded, baseMintDecimals, quoteMintDecimals, options, programId, layoutOverride);
    }
    get programId() {
        return this._programId;
    }
    get address() {
        return this._decoded.ownAddress;
    }
    get publicKey() {
        return this.address;
    }
    get baseMintAddress() {
        return this._decoded.baseMint;
    }
    get quoteMintAddress() {
        return this._decoded.quoteMint;
    }
    get bidsAddress() {
        return this._decoded.bids;
    }
    get asksAddress() {
        return this._decoded.asks;
    }
    get decoded() {
        return this._decoded;
    }
    async loadBids(connection) {
        const { data } = throwIfNull(await connection.getAccountInfo(this._decoded.bids));
        return Orderbook.decode(this, data);
    }
    async loadAsks(connection) {
        const { data } = throwIfNull(await connection.getAccountInfo(this._decoded.asks));
        return Orderbook.decode(this, data);
    }
    async loadOrdersForOwner(connection, ownerAddress, cacheDurationMs = 0) {
        const [bids, asks, openOrdersAccounts] = await Promise.all([
            this.loadBids(connection),
            this.loadAsks(connection),
            this.findOpenOrdersAccountsForOwner(connection, ownerAddress, cacheDurationMs),
        ]);
        return this.filterForOpenOrders(bids, asks, openOrdersAccounts);
    }
    filterForOpenOrders(bids, asks, openOrdersAccounts) {
        return [...bids, ...asks].filter((order) => openOrdersAccounts.some((openOrders) => order.openOrdersAddress.equals(openOrders.address)));
    }
    async findBaseTokenAccountsForOwner(connection, ownerAddress, includeUnwrappedSol = false) {
        if (this.baseMintAddress.equals(token_instructions_1.WRAPPED_SOL_MINT) && includeUnwrappedSol) {
            const [wrapped, unwrapped] = await Promise.all([
                this.findBaseTokenAccountsForOwner(connection, ownerAddress, false),
                connection.getAccountInfo(ownerAddress),
            ]);
            if (unwrapped !== null) {
                return [{ pubkey: ownerAddress, account: unwrapped }, ...wrapped];
            }
            return wrapped;
        }
        return await this.getTokenAccountsByOwnerForMint(connection, ownerAddress, this.baseMintAddress);
    }
    async getTokenAccountsByOwnerForMint(connection, ownerAddress, mintAddress) {
        return (await connection.getTokenAccountsByOwner(ownerAddress, {
            mint: mintAddress,
        })).value;
    }
    async findQuoteTokenAccountsForOwner(connection, ownerAddress, includeUnwrappedSol = false) {
        if (this.quoteMintAddress.equals(token_instructions_1.WRAPPED_SOL_MINT) && includeUnwrappedSol) {
            const [wrapped, unwrapped] = await Promise.all([
                this.findQuoteTokenAccountsForOwner(connection, ownerAddress, false),
                connection.getAccountInfo(ownerAddress),
            ]);
            if (unwrapped !== null) {
                return [{ pubkey: ownerAddress, account: unwrapped }, ...wrapped];
            }
            return wrapped;
        }
        return await this.getTokenAccountsByOwnerForMint(connection, ownerAddress, this.quoteMintAddress);
    }
    async findOpenOrdersAccountsForOwner(connection, ownerAddress, cacheDurationMs = 0) {
        const strOwner = ownerAddress.toBase58();
        const now = new Date().getTime();
        if (strOwner in this._openOrdersAccountsCache &&
            now - this._openOrdersAccountsCache[strOwner].ts < cacheDurationMs) {
            return this._openOrdersAccountsCache[strOwner].accounts;
        }
        const openOrdersAccountsForOwner = await OpenOrders.findForMarketAndOwner(connection, this.address, ownerAddress, this._programId);
        this._openOrdersAccountsCache[strOwner] = {
            accounts: openOrdersAccountsForOwner,
            ts: now,
        };
        return openOrdersAccountsForOwner;
    }
    async replaceOrders(connection, accounts, orders, cacheDurationMs = 0) {
        var _a;
        if (!accounts.openOrdersAccount && !accounts.openOrdersAddressKey) {
            const ownerAddress = (_a = accounts.owner.publicKey) !== null && _a !== void 0 ? _a : accounts.owner;
            const openOrdersAccounts = await this.findOpenOrdersAccountsForOwner(connection, ownerAddress, cacheDurationMs);
            accounts.openOrdersAddressKey = openOrdersAccounts[0].address;
        }
        const transaction = new web3_js_1.Transaction();
        transaction.add(this.makeReplaceOrdersByClientIdsInstruction(accounts, orders));
        return await this._sendTransaction(connection, transaction, [
            accounts.owner,
        ]);
    }
    async placeOrder(connection, { owner, payer, side, price, size, orderType = 'limit', clientId, openOrdersAddressKey, openOrdersAccount, feeDiscountPubkey, maxTs, replaceIfExists = false, }) {
        const { transaction, signers } = await this.makePlaceOrderTransaction(connection, {
            owner,
            payer,
            side,
            price,
            size,
            orderType,
            clientId,
            openOrdersAddressKey,
            openOrdersAccount,
            feeDiscountPubkey,
            maxTs,
            replaceIfExists,
        });
        return await this._sendTransaction(connection, transaction, [
            owner,
            ...signers,
        ]);
    }
    getSplTokenBalanceFromAccountInfo(accountInfo, decimals) {
        return divideBnToNumber(new bn_js_1.default(accountInfo.data.slice(64, 72), 10, 'le'), new bn_js_1.default(10).pow(new bn_js_1.default(decimals)));
    }
    get supportsSrmFeeDiscounts() {
        return fees_1.supportsSrmFeeDiscounts(this._programId);
    }
    get supportsReferralFees() {
        return tokens_and_markets_1.getLayoutVersion(this._programId) > 1;
    }
    get usesRequestQueue() {
        return tokens_and_markets_1.getLayoutVersion(this._programId) <= 2;
    }
    async findFeeDiscountKeys(connection, ownerAddress, cacheDurationMs = 0) {
        let sortedAccounts = [];
        const now = new Date().getTime();
        const strOwner = ownerAddress.toBase58();
        if (strOwner in this._feeDiscountKeysCache &&
            now - this._feeDiscountKeysCache[strOwner].ts < cacheDurationMs) {
            return this._feeDiscountKeysCache[strOwner].accounts;
        }
        if (this.supportsSrmFeeDiscounts) {
            // Fee discounts based on (M)SRM holdings supported in newer versions
            const msrmAccounts = (await this.getTokenAccountsByOwnerForMint(connection, ownerAddress, token_instructions_1.MSRM_MINT)).map(({ pubkey, account }) => {
                const balance = this.getSplTokenBalanceFromAccountInfo(account, token_instructions_1.MSRM_DECIMALS);
                return {
                    pubkey,
                    mint: token_instructions_1.MSRM_MINT,
                    balance,
                    feeTier: fees_1.getFeeTier(balance, 0),
                };
            });
            const srmAccounts = (await this.getTokenAccountsByOwnerForMint(connection, ownerAddress, token_instructions_1.SRM_MINT)).map(({ pubkey, account }) => {
                const balance = this.getSplTokenBalanceFromAccountInfo(account, token_instructions_1.SRM_DECIMALS);
                return {
                    pubkey,
                    mint: token_instructions_1.SRM_MINT,
                    balance,
                    feeTier: fees_1.getFeeTier(0, balance),
                };
            });
            sortedAccounts = msrmAccounts.concat(srmAccounts).sort((a, b) => {
                if (a.feeTier > b.feeTier) {
                    return -1;
                }
                else if (a.feeTier < b.feeTier) {
                    return 1;
                }
                else {
                    if (a.balance > b.balance) {
                        return -1;
                    }
                    else if (a.balance < b.balance) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            });
        }
        this._feeDiscountKeysCache[strOwner] = {
            accounts: sortedAccounts,
            ts: now,
        };
        return sortedAccounts;
    }
    async findBestFeeDiscountKey(connection, ownerAddress, cacheDurationMs = 30000) {
        const accounts = await this.findFeeDiscountKeys(connection, ownerAddress, cacheDurationMs);
        if (accounts.length > 0) {
            return {
                pubkey: accounts[0].pubkey,
                feeTier: accounts[0].feeTier,
            };
        }
        return {
            pubkey: null,
            feeTier: 0,
        };
    }
    async makePlaceOrderTransaction(connection, { owner, payer, side, price, size, orderType = 'limit', clientId, openOrdersAddressKey, openOrdersAccount, feeDiscountPubkey = undefined, selfTradeBehavior = 'decrementTake', maxTs, replaceIfExists = false, }, cacheDurationMs = 0, feeDiscountPubkeyCacheDurationMs = 0) {
        var _a, _b;
        // @ts-ignore
        const ownerAddress = (_a = owner.publicKey) !== null && _a !== void 0 ? _a : owner;
        const openOrdersAccounts = await this.findOpenOrdersAccountsForOwner(connection, ownerAddress, cacheDurationMs);
        const transaction = new web3_js_1.Transaction();
        const signers = [];
        // Fetch an SRM fee discount key if the market supports discounts and it is not supplied
        let useFeeDiscountPubkey;
        if (feeDiscountPubkey) {
            useFeeDiscountPubkey = feeDiscountPubkey;
        }
        else if (feeDiscountPubkey === undefined &&
            this.supportsSrmFeeDiscounts) {
            useFeeDiscountPubkey = (await this.findBestFeeDiscountKey(connection, ownerAddress, feeDiscountPubkeyCacheDurationMs)).pubkey;
        }
        else {
            useFeeDiscountPubkey = null;
        }
        let openOrdersAddress;
        if (openOrdersAccounts.length === 0) {
            let account;
            if (openOrdersAccount) {
                account = openOrdersAccount;
            }
            else {
                account = new web3_js_1.Account();
            }
            transaction.add(await OpenOrders.makeCreateAccountTransaction(connection, this.address, ownerAddress, account.publicKey, this._programId));
            openOrdersAddress = account.publicKey;
            signers.push(account);
            // refresh the cache of open order accounts on next fetch
            this._openOrdersAccountsCache[ownerAddress.toBase58()].ts = 0;
        }
        else if (openOrdersAccount) {
            openOrdersAddress = openOrdersAccount.publicKey;
        }
        else if (openOrdersAddressKey) {
            openOrdersAddress = openOrdersAddressKey;
        }
        else {
            openOrdersAddress = openOrdersAccounts[0].address;
        }
        let wrappedSolAccount = null;
        if (payer.equals(ownerAddress)) {
            if ((side === 'buy' && this.quoteMintAddress.equals(token_instructions_1.WRAPPED_SOL_MINT)) ||
                (side === 'sell' && this.baseMintAddress.equals(token_instructions_1.WRAPPED_SOL_MINT))) {
                wrappedSolAccount = new web3_js_1.Account();
                let lamports;
                if (side === 'buy') {
                    lamports = Math.round(price * size * 1.01 * web3_js_1.LAMPORTS_PER_SOL);
                    if (openOrdersAccounts.length > 0) {
                        lamports -= openOrdersAccounts[0].quoteTokenFree.toNumber();
                    }
                }
                else {
                    lamports = Math.round(size * web3_js_1.LAMPORTS_PER_SOL);
                    if (openOrdersAccounts.length > 0) {
                        lamports -= openOrdersAccounts[0].baseTokenFree.toNumber();
                    }
                }
                lamports = Math.max(lamports, 0) + 1e7;
                transaction.add(web3_js_1.SystemProgram.createAccount({
                    fromPubkey: ownerAddress,
                    newAccountPubkey: wrappedSolAccount.publicKey,
                    lamports,
                    space: 165,
                    programId: token_instructions_1.TOKEN_PROGRAM_ID,
                }));
                transaction.add(token_instructions_1.initializeAccount({
                    account: wrappedSolAccount.publicKey,
                    mint: token_instructions_1.WRAPPED_SOL_MINT,
                    owner: ownerAddress,
                }));
                signers.push(wrappedSolAccount);
            }
            else {
                throw new Error('Invalid payer account');
            }
        }
        const placeOrderInstruction = this.makePlaceOrderInstruction(connection, {
            owner,
            payer: (_b = wrappedSolAccount === null || wrappedSolAccount === void 0 ? void 0 : wrappedSolAccount.publicKey) !== null && _b !== void 0 ? _b : payer,
            side,
            price,
            size,
            orderType,
            clientId,
            openOrdersAddressKey: openOrdersAddress,
            feeDiscountPubkey: useFeeDiscountPubkey,
            selfTradeBehavior,
            maxTs,
            replaceIfExists,
        });
        transaction.add(placeOrderInstruction);
        if (wrappedSolAccount) {
            transaction.add(token_instructions_1.closeAccount({
                source: wrappedSolAccount.publicKey,
                destination: ownerAddress,
                owner: ownerAddress,
            }));
        }
        return { transaction, signers, payer: owner };
    }
    makePlaceOrderInstruction(connection, params) {
        var _a;
        const { owner, payer, side, price, size, orderType = 'limit', clientId, openOrdersAddressKey, openOrdersAccount, feeDiscountPubkey = null, } = params;
        // @ts-ignore
        const ownerAddress = (_a = owner.publicKey) !== null && _a !== void 0 ? _a : owner;
        if (this.baseSizeNumberToLots(size).lte(new bn_js_1.default(0))) {
            throw new Error('size too small');
        }
        if (this.priceNumberToLots(price).lte(new bn_js_1.default(0))) {
            throw new Error('invalid price');
        }
        if (this.usesRequestQueue) {
            return instructions_1.DexInstructions.newOrder({
                market: this.address,
                requestQueue: this._decoded.requestQueue,
                baseVault: this._decoded.baseVault,
                quoteVault: this._decoded.quoteVault,
                openOrders: openOrdersAccount
                    ? openOrdersAccount.publicKey
                    : openOrdersAddressKey,
                owner: ownerAddress,
                payer,
                side,
                limitPrice: this.priceNumberToLots(price),
                maxQuantity: this.baseSizeNumberToLots(size),
                orderType,
                clientId,
                programId: this._programId,
                // @ts-ignore
                feeDiscountPubkey: this.supportsSrmFeeDiscounts
                    ? feeDiscountPubkey
                    : null,
            });
        }
        else {
            return this.makeNewOrderV3Instruction(params);
        }
    }
    makeNewOrderV3Instruction(params) {
        var _a;
        const { owner, payer, side, price, size, orderType = 'limit', clientId, openOrdersAddressKey, openOrdersAccount, feeDiscountPubkey = null, selfTradeBehavior = 'decrementTake', programId, maxTs, replaceIfExists, } = params;
        // @ts-ignore
        const ownerAddress = (_a = owner.publicKey) !== null && _a !== void 0 ? _a : owner;
        return instructions_1.DexInstructions.newOrderV3({
            market: this.address,
            bids: this._decoded.bids,
            asks: this._decoded.asks,
            requestQueue: this._decoded.requestQueue,
            eventQueue: this._decoded.eventQueue,
            baseVault: this._decoded.baseVault,
            quoteVault: this._decoded.quoteVault,
            openOrders: openOrdersAccount
                ? openOrdersAccount.publicKey
                : openOrdersAddressKey,
            owner: ownerAddress,
            payer,
            side,
            limitPrice: this.priceNumberToLots(price),
            maxBaseQuantity: this.baseSizeNumberToLots(size),
            maxQuoteQuantity: new bn_js_1.default(this._decoded.quoteLotSize.toNumber()).mul(this.baseSizeNumberToLots(size).mul(this.priceNumberToLots(price))),
            orderType,
            clientId,
            programId: programId !== null && programId !== void 0 ? programId : this._programId,
            selfTradeBehavior,
            // @ts-ignore
            feeDiscountPubkey: this.supportsSrmFeeDiscounts
                ? feeDiscountPubkey
                : null,
            // @ts-ignore
            maxTs,
            replaceIfExists,
        });
    }
    makeReplaceOrdersByClientIdsInstruction(accounts, orders) {
        var _a, _b;
        // @ts-ignore
        const ownerAddress = (_a = accounts.owner.publicKey) !== null && _a !== void 0 ? _a : accounts.owner;
        return instructions_1.DexInstructions.replaceOrdersByClientIds({
            market: this.address,
            bids: this._decoded.bids,
            asks: this._decoded.asks,
            requestQueue: this._decoded.requestQueue,
            eventQueue: this._decoded.eventQueue,
            baseVault: this._decoded.baseVault,
            quoteVault: this._decoded.quoteVault,
            openOrders: accounts.openOrdersAccount
                ? accounts.openOrdersAccount.publicKey
                : accounts.openOrdersAddressKey,
            owner: ownerAddress,
            payer: accounts.payer,
            programId: (_b = accounts.programId) !== null && _b !== void 0 ? _b : this._programId,
            // @ts-ignore
            feeDiscountPubkey: this.supportsSrmFeeDiscounts
                ? accounts.feeDiscountPubkey
                : null,
            orders: orders.map(order => {
                var _a;
                return ({
                    side: order.side,
                    limitPrice: this.priceNumberToLots(order.price),
                    maxBaseQuantity: this.baseSizeNumberToLots(order.size),
                    maxQuoteQuantity: new bn_js_1.default(this._decoded.quoteLotSize.toNumber()).mul(this.baseSizeNumberToLots(order.size).mul(this.priceNumberToLots(order.price))),
                    orderType: order.orderType,
                    clientId: order.clientId,
                    programId: (_a = accounts.programId) !== null && _a !== void 0 ? _a : this._programId,
                    selfTradeBehavior: order.selfTradeBehavior,
                    // @ts-ignore
                    maxTs: order.maxTs,
                });
            })
        });
    }
    async _sendTransaction(connection, transaction, signers) {
        const signature = await connection.sendTransaction(transaction, signers, {
            skipPreflight: this._skipPreflight,
        });
        const { value } = await connection.confirmTransaction(signature, this._commitment);
        if (value === null || value === void 0 ? void 0 : value.err) {
            throw new Error(JSON.stringify(value.err));
        }
        return signature;
    }
    async cancelOrderByClientId(connection, owner, openOrders, clientId) {
        const transaction = await this.makeCancelOrderByClientIdTransaction(connection, owner.publicKey, openOrders, clientId);
        return await this._sendTransaction(connection, transaction, [owner]);
    }
    async cancelOrdersByClientIds(connection, owner, openOrders, clientIds) {
        const transaction = await this.makeCancelOrdersByClientIdsTransaction(connection, owner.publicKey, openOrders, clientIds);
        return await this._sendTransaction(connection, transaction, [owner]);
    }
    async makeCancelOrderByClientIdTransaction(connection, owner, openOrders, clientId) {
        const transaction = new web3_js_1.Transaction();
        if (this.usesRequestQueue) {
            transaction.add(instructions_1.DexInstructions.cancelOrderByClientId({
                market: this.address,
                owner,
                openOrders,
                requestQueue: this._decoded.requestQueue,
                clientId,
                programId: this._programId,
            }));
        }
        else {
            transaction.add(instructions_1.DexInstructions.cancelOrderByClientIdV2({
                market: this.address,
                openOrders,
                owner,
                bids: this._decoded.bids,
                asks: this._decoded.asks,
                eventQueue: this._decoded.eventQueue,
                clientId,
                programId: this._programId,
            }));
        }
        return transaction;
    }
    async makeCancelOrdersByClientIdsTransaction(connection, owner, openOrders, clientIds) {
        const transaction = new web3_js_1.Transaction();
        transaction.add(instructions_1.DexInstructions.cancelOrdersByClientIds({
            market: this.address,
            openOrders,
            owner,
            bids: this._decoded.bids,
            asks: this._decoded.asks,
            eventQueue: this._decoded.eventQueue,
            clientIds,
            programId: this._programId,
        }));
        return transaction;
    }
    async cancelOrder(connection, owner, order) {
        const transaction = await this.makeCancelOrderTransaction(connection, owner.publicKey, order);
        return await this._sendTransaction(connection, transaction, [owner]);
    }
    async makeCancelOrderTransaction(connection, owner, order) {
        const transaction = new web3_js_1.Transaction();
        transaction.add(this.makeCancelOrderInstruction(connection, owner, order));
        return transaction;
    }
    makeCancelOrderInstruction(connection, owner, order) {
        if (this.usesRequestQueue) {
            return instructions_1.DexInstructions.cancelOrder({
                market: this.address,
                owner,
                openOrders: order.openOrdersAddress,
                requestQueue: this._decoded.requestQueue,
                side: order.side,
                orderId: order.orderId,
                openOrdersSlot: order.openOrdersSlot,
                programId: this._programId,
            });
        }
        else {
            return instructions_1.DexInstructions.cancelOrderV2({
                market: this.address,
                owner,
                openOrders: order.openOrdersAddress,
                bids: this._decoded.bids,
                asks: this._decoded.asks,
                eventQueue: this._decoded.eventQueue,
                side: order.side,
                orderId: order.orderId,
                openOrdersSlot: order.openOrdersSlot,
                programId: this._programId,
            });
        }
    }
    makeConsumeEventsInstruction(openOrdersAccounts, limit) {
        return instructions_1.DexInstructions.consumeEvents({
            market: this.address,
            eventQueue: this._decoded.eventQueue,
            coinFee: this._decoded.eventQueue,
            pcFee: this._decoded.eventQueue,
            openOrdersAccounts,
            limit,
            programId: this._programId,
        });
    }
    makeConsumeEventsPermissionedInstruction(openOrdersAccounts, limit) {
        return instructions_1.DexInstructions.consumeEventsPermissioned({
            market: this.address,
            eventQueue: this._decoded.eventQueue,
            crankAuthority: this._decoded.consumeEventsAuthority,
            openOrdersAccounts,
            limit,
            programId: this._programId,
        });
    }
    async settleFunds(connection, owner, openOrders, baseWallet, quoteWallet, referrerQuoteWallet = null) {
        if (!openOrders.owner.equals(owner.publicKey)) {
            throw new Error('Invalid open orders account');
        }
        if (referrerQuoteWallet && !this.supportsReferralFees) {
            throw new Error('This program ID does not support referrerQuoteWallet');
        }
        const { transaction, signers } = await this.makeSettleFundsTransaction(connection, openOrders, baseWallet, quoteWallet, referrerQuoteWallet);
        return await this._sendTransaction(connection, transaction, [
            owner,
            ...signers,
        ]);
    }
    async makeSettleFundsTransaction(connection, openOrders, baseWallet, quoteWallet, referrerQuoteWallet = null) {
        // @ts-ignore
        const vaultSigner = await web3_js_1.PublicKey.createProgramAddress([
            this.address.toBuffer(),
            this._decoded.vaultSignerNonce.toArrayLike(buffer_1.Buffer, 'le', 8),
        ], this._programId);
        const transaction = new web3_js_1.Transaction();
        const signers = [];
        let wrappedSolAccount = null;
        if ((this.baseMintAddress.equals(token_instructions_1.WRAPPED_SOL_MINT) &&
            baseWallet.equals(openOrders.owner)) ||
            (this.quoteMintAddress.equals(token_instructions_1.WRAPPED_SOL_MINT) &&
                quoteWallet.equals(openOrders.owner))) {
            wrappedSolAccount = new web3_js_1.Account();
            transaction.add(web3_js_1.SystemProgram.createAccount({
                fromPubkey: openOrders.owner,
                newAccountPubkey: wrappedSolAccount.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(165),
                space: 165,
                programId: token_instructions_1.TOKEN_PROGRAM_ID,
            }));
            transaction.add(token_instructions_1.initializeAccount({
                account: wrappedSolAccount.publicKey,
                mint: token_instructions_1.WRAPPED_SOL_MINT,
                owner: openOrders.owner,
            }));
            signers.push(wrappedSolAccount);
        }
        transaction.add(instructions_1.DexInstructions.settleFunds({
            market: this.address,
            openOrders: openOrders.address,
            owner: openOrders.owner,
            baseVault: this._decoded.baseVault,
            quoteVault: this._decoded.quoteVault,
            baseWallet: baseWallet.equals(openOrders.owner) && wrappedSolAccount
                ? wrappedSolAccount.publicKey
                : baseWallet,
            quoteWallet: quoteWallet.equals(openOrders.owner) && wrappedSolAccount
                ? wrappedSolAccount.publicKey
                : quoteWallet,
            vaultSigner,
            programId: this._programId,
            referrerQuoteWallet,
        }));
        if (wrappedSolAccount) {
            transaction.add(token_instructions_1.closeAccount({
                source: wrappedSolAccount.publicKey,
                destination: openOrders.owner,
                owner: openOrders.owner,
            }));
        }
        return { transaction, signers, payer: openOrders.owner };
    }
    async matchOrders(connection, feePayer, limit) {
        const tx = this.makeMatchOrdersTransaction(limit);
        return await this._sendTransaction(connection, tx, [feePayer]);
    }
    makeMatchOrdersTransaction(limit) {
        const tx = new web3_js_1.Transaction();
        tx.add(instructions_1.DexInstructions.matchOrders({
            market: this.address,
            requestQueue: this._decoded.requestQueue,
            eventQueue: this._decoded.eventQueue,
            bids: this._decoded.bids,
            asks: this._decoded.asks,
            baseVault: this._decoded.baseVault,
            quoteVault: this._decoded.quoteVault,
            limit,
            programId: this._programId,
        }));
        return tx;
    }
    async loadRequestQueue(connection) {
        const { data } = throwIfNull(await connection.getAccountInfo(this._decoded.requestQueue));
        return queue_1.decodeRequestQueue(data);
    }
    async loadEventQueue(connection) {
        const { data } = throwIfNull(await connection.getAccountInfo(this._decoded.eventQueue));
        return queue_1.decodeEventQueue(data);
    }
    async loadFills(connection, limit = 100) {
        // TODO: once there's a separate source of fills use that instead
        const { data } = throwIfNull(await connection.getAccountInfo(this._decoded.eventQueue));
        const events = queue_1.decodeEventQueue(data, limit);
        return events
            .filter((event) => event.eventFlags.fill && event.nativeQuantityPaid.gtn(0))
            .map(this.parseFillEvent.bind(this));
    }
    parseFillEvent(event) {
        let size, price, side, priceBeforeFees;
        if (event.eventFlags.bid) {
            side = 'buy';
            priceBeforeFees = event.eventFlags.maker
                ? event.nativeQuantityPaid.add(event.nativeFeeOrRebate)
                : event.nativeQuantityPaid.sub(event.nativeFeeOrRebate);
            price = divideBnToNumber(priceBeforeFees.mul(this._baseSplTokenMultiplier), this._quoteSplTokenMultiplier.mul(event.nativeQuantityReleased));
            size = divideBnToNumber(event.nativeQuantityReleased, this._baseSplTokenMultiplier);
        }
        else {
            side = 'sell';
            priceBeforeFees = event.eventFlags.maker
                ? event.nativeQuantityReleased.sub(event.nativeFeeOrRebate)
                : event.nativeQuantityReleased.add(event.nativeFeeOrRebate);
            price = divideBnToNumber(priceBeforeFees.mul(this._baseSplTokenMultiplier), this._quoteSplTokenMultiplier.mul(event.nativeQuantityPaid));
            size = divideBnToNumber(event.nativeQuantityPaid, this._baseSplTokenMultiplier);
        }
        return {
            ...event,
            side,
            price,
            feeCost: this.quoteSplSizeToNumber(event.nativeFeeOrRebate) *
                (event.eventFlags.maker ? -1 : 1),
            size,
        };
    }
    get _baseSplTokenMultiplier() {
        return new bn_js_1.default(10).pow(new bn_js_1.default(this._baseSplTokenDecimals));
    }
    get _quoteSplTokenMultiplier() {
        return new bn_js_1.default(10).pow(new bn_js_1.default(this._quoteSplTokenDecimals));
    }
    priceLotsToNumber(price) {
        return divideBnToNumber(price.mul(this._decoded.quoteLotSize).mul(this._baseSplTokenMultiplier), this._decoded.baseLotSize.mul(this._quoteSplTokenMultiplier));
    }
    priceNumberToLots(price) {
        return new bn_js_1.default(Math.round((price *
            Math.pow(10, this._quoteSplTokenDecimals) *
            this._decoded.baseLotSize.toNumber()) /
            (Math.pow(10, this._baseSplTokenDecimals) *
                this._decoded.quoteLotSize.toNumber())));
    }
    baseSplSizeToNumber(size) {
        return divideBnToNumber(size, this._baseSplTokenMultiplier);
    }
    quoteSplSizeToNumber(size) {
        return divideBnToNumber(size, this._quoteSplTokenMultiplier);
    }
    baseSizeLotsToNumber(size) {
        return divideBnToNumber(size.mul(this._decoded.baseLotSize), this._baseSplTokenMultiplier);
    }
    baseSizeNumberToLots(size) {
        const native = new bn_js_1.default(Math.round(size * Math.pow(10, this._baseSplTokenDecimals)));
        // rounds down to the nearest lot size
        return native.div(this._decoded.baseLotSize);
    }
    quoteSizeLotsToNumber(size) {
        return divideBnToNumber(size.mul(this._decoded.quoteLotSize), this._quoteSplTokenMultiplier);
    }
    quoteSizeNumberToLots(size) {
        const native = new bn_js_1.default(Math.round(size * Math.pow(10, this._quoteSplTokenDecimals)));
        // rounds down to the nearest lot size
        return native.div(this._decoded.quoteLotSize);
    }
    get minOrderSize() {
        return this.baseSizeLotsToNumber(new bn_js_1.default(1));
    }
    get tickSize() {
        return this.priceLotsToNumber(new bn_js_1.default(1));
    }
}
exports.Market = Market;
exports._OPEN_ORDERS_LAYOUT_V1 = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    layout_1.publicKeyLayout('market'),
    layout_1.publicKeyLayout('owner'),
    // These are in spl-token (i.e. not lot) units
    layout_1.u64('baseTokenFree'),
    layout_1.u64('baseTokenTotal'),
    layout_1.u64('quoteTokenFree'),
    layout_1.u64('quoteTokenTotal'),
    layout_1.u128('freeSlotBits'),
    layout_1.u128('isBidBits'),
    buffer_layout_1.seq(layout_1.u128(), 128, 'orders'),
    buffer_layout_1.seq(layout_1.u64(), 128, 'clientIds'),
    buffer_layout_1.blob(7),
]);
exports._OPEN_ORDERS_LAYOUT_V2 = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    layout_1.publicKeyLayout('market'),
    layout_1.publicKeyLayout('owner'),
    // These are in spl-token (i.e. not lot) units
    layout_1.u64('baseTokenFree'),
    layout_1.u64('baseTokenTotal'),
    layout_1.u64('quoteTokenFree'),
    layout_1.u64('quoteTokenTotal'),
    layout_1.u128('freeSlotBits'),
    layout_1.u128('isBidBits'),
    buffer_layout_1.seq(layout_1.u128(), 128, 'orders'),
    buffer_layout_1.seq(layout_1.u64(), 128, 'clientIds'),
    layout_1.u64('referrerRebatesAccrued'),
    buffer_layout_1.blob(7),
]);
class OpenOrders {
    constructor(address, decoded, programId) {
        this.address = address;
        this._programId = programId;
        Object.assign(this, decoded);
    }
    static getLayout(programId) {
        if (tokens_and_markets_1.getLayoutVersion(programId) === 1) {
            return exports._OPEN_ORDERS_LAYOUT_V1;
        }
        return exports._OPEN_ORDERS_LAYOUT_V2;
    }
    static async findForOwner(connection, ownerAddress, programId) {
        const filters = [
            {
                memcmp: {
                    offset: this.getLayout(programId).offsetOf('owner'),
                    bytes: ownerAddress.toBase58(),
                },
            },
            {
                dataSize: this.getLayout(programId).span,
            },
        ];
        const accounts = await getFilteredProgramAccounts(connection, programId, filters);
        return accounts.map(({ publicKey, accountInfo }) => OpenOrders.fromAccountInfo(publicKey, accountInfo, programId));
    }
    static async findForMarketAndOwner(connection, marketAddress, ownerAddress, programId) {
        const filters = [
            {
                memcmp: {
                    offset: this.getLayout(programId).offsetOf('market'),
                    bytes: marketAddress.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: this.getLayout(programId).offsetOf('owner'),
                    bytes: ownerAddress.toBase58(),
                },
            },
            {
                dataSize: this.getLayout(programId).span,
            },
        ];
        const accounts = await getFilteredProgramAccounts(connection, programId, filters);
        return accounts.map(({ publicKey, accountInfo }) => OpenOrders.fromAccountInfo(publicKey, accountInfo, programId));
    }
    static async load(connection, address, programId) {
        const accountInfo = await connection.getAccountInfo(address);
        if (accountInfo === null) {
            throw new Error('Open orders account not found');
        }
        return OpenOrders.fromAccountInfo(address, accountInfo, programId);
    }
    static fromAccountInfo(address, accountInfo, programId) {
        const { owner, data } = accountInfo;
        if (!owner.equals(programId)) {
            throw new Error('Address not owned by program');
        }
        const decoded = this.getLayout(programId).decode(data);
        if (!decoded.accountFlags.initialized || !decoded.accountFlags.openOrders) {
            throw new Error('Invalid open orders account');
        }
        return new OpenOrders(address, decoded, programId);
    }
    static async makeCreateAccountTransaction(connection, marketAddress, ownerAddress, newAccountAddress, programId) {
        return web3_js_1.SystemProgram.createAccount({
            fromPubkey: ownerAddress,
            newAccountPubkey: newAccountAddress,
            lamports: await connection.getMinimumBalanceForRentExemption(this.getLayout(programId).span),
            space: this.getLayout(programId).span,
            programId,
        });
    }
    get publicKey() {
        return this.address;
    }
}
exports.OpenOrders = OpenOrders;
exports.ORDERBOOK_LAYOUT = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    slab_1.SLAB_LAYOUT.replicate('slab'),
    buffer_layout_1.blob(7),
]);
class Orderbook {
    constructor(market, accountFlags, slab) {
        if (!accountFlags.initialized || !(accountFlags.bids ^ accountFlags.asks)) {
            throw new Error('Invalid orderbook');
        }
        this.market = market;
        this.isBids = accountFlags.bids;
        this.slab = slab;
    }
    static get LAYOUT() {
        return exports.ORDERBOOK_LAYOUT;
    }
    static decode(market, buffer) {
        const { accountFlags, slab } = exports.ORDERBOOK_LAYOUT.decode(buffer);
        return new Orderbook(market, accountFlags, slab);
    }
    getL2(depth) {
        const descending = this.isBids;
        const levels = []; // (price, size)
        for (const { key, quantity } of this.slab.items(descending)) {
            const price = getPriceFromKey(key);
            if (levels.length > 0 && levels[levels.length - 1][0].eq(price)) {
                levels[levels.length - 1][1] = levels[levels.length - 1][1].add(quantity);
            }
            else if (levels.length === depth) {
                break;
            }
            else {
                levels.push([price, quantity]);
            }
        }
        return levels.map(([priceLots, sizeLots]) => [
            this.market.priceLotsToNumber(priceLots),
            this.market.baseSizeLotsToNumber(sizeLots),
            priceLots,
            sizeLots,
        ]);
    }
    [Symbol.iterator]() {
        return this.items(false);
    }
    *items(descending = false) {
        for (const { key, ownerSlot, owner, quantity, feeTier, clientOrderId, } of this.slab.items(descending)) {
            const price = getPriceFromKey(key);
            yield {
                orderId: key,
                clientId: clientOrderId,
                openOrdersAddress: owner,
                openOrdersSlot: ownerSlot,
                feeTier,
                price: this.market.priceLotsToNumber(price),
                priceLots: price,
                size: this.market.baseSizeLotsToNumber(quantity),
                sizeLots: quantity,
                side: (this.isBids ? 'buy' : 'sell'),
            };
        }
    }
}
exports.Orderbook = Orderbook;
function getPriceFromKey(key) {
    return key.ushrn(64);
}
function divideBnToNumber(numerator, denominator) {
    const quotient = numerator.div(denominator).toNumber();
    const rem = numerator.umod(denominator);
    const gcd = rem.gcd(denominator);
    return quotient + rem.div(gcd).toNumber() / denominator.div(gcd).toNumber();
}
const MINT_LAYOUT = buffer_layout_1.struct([buffer_layout_1.blob(44), buffer_layout_1.u8('decimals'), buffer_layout_1.blob(37)]);
async function getMintDecimals(connection, mint) {
    if (mint.equals(token_instructions_1.WRAPPED_SOL_MINT)) {
        return 9;
    }
    const { data } = throwIfNull(await connection.getAccountInfo(mint), 'mint not found');
    const { decimals } = MINT_LAYOUT.decode(data);
    return decimals;
}
exports.getMintDecimals = getMintDecimals;
async function getFilteredProgramAccounts(connection, programId, filters) {
    // @ts-ignore
    const resp = await connection._rpcRequest('getProgramAccounts', [
        programId.toBase58(),
        {
            commitment: connection.commitment,
            filters,
            encoding: 'base64',
        },
    ]);
    if (resp.error) {
        throw new Error(resp.error.message);
    }
    return resp.result.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
        publicKey: new web3_js_1.PublicKey(pubkey),
        accountInfo: {
            data: buffer_1.Buffer.from(data[0], 'base64'),
            executable,
            owner: new web3_js_1.PublicKey(owner),
            lamports,
        },
    }));
}
function throwIfNull(value, message = 'account not found') {
    if (value === null) {
        throw new Error(message);
    }
    return value;
}
//# sourceMappingURL=market.js.map