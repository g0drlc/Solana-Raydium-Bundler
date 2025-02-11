"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultipleAccounts = exports.invoke = void 0;
const assert_1 = __importDefault(require("assert"));
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("../program/common");
const provider_1 = require("../provider");
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
async function invoke(programId, accounts, data, provider) {
    programId = common_1.translateAddress(programId);
    if (!provider) {
        provider = provider_1.getProvider();
    }
    const tx = new web3_js_1.Transaction();
    tx.add(new web3_js_1.TransactionInstruction({
        programId,
        keys: accounts !== null && accounts !== void 0 ? accounts : [],
        data,
    }));
    return await provider.send(tx);
}
exports.invoke = invoke;
async function getMultipleAccounts(connection, publicKeys) {
    const args = [publicKeys.map((k) => k.toBase58()), { commitment: "recent" }];
    // @ts-ignore
    const res = await connection._rpcRequest("getMultipleAccounts", args);
    if (res.error) {
        throw new Error("failed to get info about accounts " +
            publicKeys.map((k) => k.toBase58()).join(", ") +
            ": " +
            res.error.message);
    }
    assert_1.default(typeof res.result !== "undefined");
    const accounts = [];
    for (const account of res.result.value) {
        let value = null;
        if (account === null) {
            accounts.push(null);
            continue;
        }
        if (res.result.value) {
            const { executable, owner, lamports, data } = account;
            assert_1.default(data[1] === "base64");
            value = {
                executable,
                owner: new web3_js_1.PublicKey(owner),
                lamports,
                data: Buffer.from(data[0], "base64"),
            };
        }
        if (value === null) {
            throw new Error("Invalid response");
        }
        accounts.push(value);
    }
    return accounts.map((account, idx) => {
        if (account === null) {
            return null;
        }
        return {
            publicKey: publicKeys[idx],
            account,
        };
    });
}
exports.getMultipleAccounts = getMultipleAccounts;
//# sourceMappingURL=rpc.js.map