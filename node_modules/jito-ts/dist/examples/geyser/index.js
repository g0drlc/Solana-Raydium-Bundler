"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = require("../../sdk");
const main = async () => {
    const geyserUrl = process.env.GEYSER_URL || '';
    const geyserAccessToken = process.env.GEYSER_ACCESS_TOKEN || '';
    console.log(`GEYSER_URL: ${geyserUrl}`);
    const _accounts = (process.env.ACCOUNTS_OF_INTEREST || '').split(',');
    console.log(`ACCOUNTS_OF_INTEREST: ${_accounts}`);
    const accounts = _accounts.map(a => new web3_js_1.PublicKey(a));
    const _programs = (process.env.PROGRAMS_OF_INTEREST || '').split(',');
    console.log(`PROGRAMS_OF_INTEREST: ${_programs}`);
    const programs = _programs.map(p => new web3_js_1.PublicKey(p));
    const c = (0, sdk_1.geyserClient)(geyserUrl, geyserAccessToken);
    const heartbeatMs = await c.getHeartbeatIntervalMillis();
    console.log(`Heartbeat Millis: ${heartbeatMs}`);
    c.onAccountUpdate(accounts, resp => {
        var _a;
        console.log(`received account update: ${(_a = resp.accountUpdate) === null || _a === void 0 ? void 0 : _a.seq}`);
    }, e => {
        console.error(`received account update error: ${e}`);
        throw e;
    });
    c.onProgramUpdate(programs, resp => {
        var _a;
        console.log(`received program update: ${(_a = resp.accountUpdate) === null || _a === void 0 ? void 0 : _a.seq}`);
    }, e => {
        console.error(`received program update error: ${e}`);
        throw e;
    });
    c.onProcessedBlock(resp => {
        var _a;
        console.log(`received processed block: ${(_a = resp.blockUpdate) === null || _a === void 0 ? void 0 : _a.slot}`);
    }, e => {
        console.error(`block update stream error: ${e}`);
        throw e;
    });
};
main()
    .then(() => console.log('running geyser example'))
    .catch(e => {
    console.error(`error: ${e}`);
});
//# sourceMappingURL=index.js.map