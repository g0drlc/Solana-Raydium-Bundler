"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.PermissionedCrank = exports.ReferralFees = exports.OpenOrdersPda = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
class OpenOrdersPda {
    constructor({ proxyProgramId, dexProgramId, }) {
        this._proxyProgramId = proxyProgramId;
        this._dexProgramId = dexProgramId;
    }
    // PDA authorized to create open orders accounts.
    static async marketAuthority(market, dexProgramId, proxyProgramId) {
        // b"open-orders-init"
        const openOrdersStr = Buffer.from([
            111,
            112,
            101,
            110,
            45,
            111,
            114,
            100,
            101,
            114,
            115,
            45,
            105,
            110,
            105,
            116,
        ]);
        const [addr] = await web3_js_1.PublicKey.findProgramAddress([openOrdersStr, dexProgramId.toBuffer(), market.toBuffer()], proxyProgramId);
        return addr;
    }
    static async openOrdersAddress(market, owner, dexProgramId, proxyProgramId) {
        // b"open-orders".
        const openOrdersStr = Buffer.from([
            111,
            112,
            101,
            110,
            45,
            111,
            114,
            100,
            101,
            114,
            115,
        ]);
        const [addr] = await web3_js_1.PublicKey.findProgramAddress([
            openOrdersStr,
            dexProgramId.toBuffer(),
            market.toBuffer(),
            owner.toBuffer(),
        ], proxyProgramId);
        return addr;
    }
    initOpenOrders(ix) {
        const market = ix.keys[2].pubkey;
        const owner = ix.keys[1].pubkey;
        // b"open-orders"
        const openOrdersSeed = Buffer.from([
            111,
            112,
            101,
            110,
            45,
            111,
            114,
            100,
            101,
            114,
            115,
        ]);
        // b"open-orders-init"
        const openOrdersInitSeed = Buffer.from([
            111,
            112,
            101,
            110,
            45,
            111,
            114,
            100,
            101,
            114,
            115,
            45,
            105,
            110,
            105,
            116,
        ]);
        const [openOrders, bump] = anchor_1.utils.publicKey.findProgramAddressSync([
            openOrdersSeed,
            this._dexProgramId.toBuffer(),
            market.toBuffer(),
            owner.toBuffer(),
        ], this._proxyProgramId);
        const [marketAuthority, bumpInit] = anchor_1.utils.publicKey.findProgramAddressSync([openOrdersInitSeed, this._dexProgramId.toBuffer(), market.toBuffer()], this._proxyProgramId);
        // Override the open orders account and market authority.
        ix.keys[0].pubkey = openOrders;
        ix.keys[4].pubkey = marketAuthority;
        // Writable because it must pay for the PDA initialization.
        ix.keys[1].isWritable = true;
        // Prepend to the account list extra accounts needed for PDA initialization.
        ix.keys = [
            { pubkey: this._dexProgramId, isSigner: false, isWritable: false },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
            ...ix.keys,
        ];
        // Prepend the ix discriminator, bump, and bumpInit to the instruction data,
        // which saves the program compute by avoiding recalculating them in the
        // program.
        ix.data = Buffer.concat([Buffer.from([0, bump, bumpInit]), ix.data]);
    }
    newOrderV3(ix) {
        ix.data = Buffer.concat([Buffer.from([1]), ix.data]);
    }
    cancelOrderV2(ix) {
        ix.data = Buffer.concat([Buffer.from([2]), ix.data]);
    }
    cancelOrderByClientIdV2(ix) {
        ix.data = Buffer.concat([Buffer.from([3]), ix.data]);
    }
    settleFunds(ix) {
        ix.data = Buffer.concat([Buffer.from([4]), ix.data]);
    }
    closeOpenOrders(ix) {
        ix.data = Buffer.concat([Buffer.from([5]), ix.data]);
    }
    prune(ix) {
        ix.data = Buffer.concat([Buffer.from([6]), ix.data]);
    }
    consumeEvents(ix) {
        ix.data = Buffer.concat([Buffer.from([7]), ix.data]);
    }
    consumeEventsPermissioned(ix) {
        ix.data = Buffer.concat([Buffer.from([8]), ix.data]);
    }
}
exports.OpenOrdersPda = OpenOrdersPda;
class ReferralFees {
    // eslint-disable-next-line
    initOpenOrders(_ix) { }
    // eslint-disable-next-line
    newOrderV3(_ix) { }
    // eslint-disable-next-line
    cancelOrderV2(_ix) { }
    // eslint-disable-next-line
    cancelOrderByClientIdV2(_ix) { }
    // eslint-disable-next-line
    settleFunds(_ix) { }
    // eslint-disable-next-line
    closeOpenOrders(_ix) { }
    // eslint-disable-next-line
    prune(_ix) { }
    // eslint-disable-next-line
    consumeEvents(_ix) { }
    // eslint-disable-next-line
    consumeEventsPermissioned(_ix) { }
}
exports.ReferralFees = ReferralFees;
class PermissionedCrank {
    // eslint-disable-next-line
    initOpenOrders(_ix) { }
    // eslint-disable-next-line
    newOrderV3(_ix) { }
    // eslint-disable-next-line
    cancelOrderV2(_ix) { }
    // eslint-disable-next-line
    cancelOrderByClientIdV2(_ix) { }
    // eslint-disable-next-line
    settleFunds(_ix) { }
    // eslint-disable-next-line
    closeOpenOrders(_ix) { }
    // eslint-disable-next-line
    prune(_ix) { }
    // eslint-disable-next-line
    consumeEvents(_ix) { }
    // eslint-disable-next-line
    consumeEventsPermissioned(ix) {
        ix.keys[ix.keys.length - 1].isSigner = false;
    }
}
exports.PermissionedCrank = PermissionedCrank;
class Logger {
    initOpenOrders(ix) {
        console.log('Proxying initOpenOrders', this.ixToDisplay(ix));
    }
    newOrderV3(ix) {
        console.log('Proxying newOrderV3', this.ixToDisplay(ix));
    }
    cancelOrderV2(ix) {
        console.log('Proxying cancelOrderV2', this.ixToDisplay(ix));
    }
    cancelOrderByClientIdV2(ix) {
        console.log('Proxying cancelOrderByClientIdV2', this.ixToDisplay(ix));
    }
    settleFunds(ix) {
        console.log('Proxying settleFunds', this.ixToDisplay(ix));
    }
    closeOpenOrders(ix) {
        console.log('Proxying closeOpenOrders', this.ixToDisplay(ix));
    }
    prune(ix) {
        console.log('Proxying prune', this.ixToDisplay(ix));
    }
    consumeEvents(ix) {
        console.log('Proxying consumeEvents', this.ixToDisplay(ix));
    }
    consumeEventsPermissioned(ix) {
        console.log('Proxying consumeEventsPermissioned', this.ixToDisplay(ix));
    }
    ixToDisplay(ix) {
        const keys = ix.keys.map((i) => {
            return { ...i, pubkey: i.pubkey.toString() };
        });
        const programId = ix.programId.toString();
        const data = new Uint8Array(ix.data);
        return { keys, programId, data };
    }
}
exports.Logger = Logger;
//# sourceMappingURL=middleware.js.map