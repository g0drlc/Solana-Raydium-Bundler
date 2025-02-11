"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateTransaction = exports.getMultipleAccountsAndContext = exports.getMultipleAccounts = exports.invoke = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_js_1 = require("../utils/common.js");
const common_js_2 = require("../program/common.js");
const provider_js_1 = require("../provider.js");
const superstruct_1 = require("superstruct");
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
async function invoke(programId, accounts, data, provider) {
    programId = (0, common_js_2.translateAddress)(programId);
    if (!provider) {
        provider = (0, provider_js_1.getProvider)();
    }
    const tx = new web3_js_1.Transaction();
    tx.add(new web3_js_1.TransactionInstruction({
        programId,
        keys: accounts !== null && accounts !== void 0 ? accounts : [],
        data,
    }));
    if (provider.sendAndConfirm === undefined) {
        throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
    }
    return await provider.sendAndConfirm(tx, []);
}
exports.invoke = invoke;
const GET_MULTIPLE_ACCOUNTS_LIMIT = 99;
async function getMultipleAccounts(connection, publicKeys, commitment) {
    const results = await getMultipleAccountsAndContext(connection, publicKeys, commitment);
    return results.map((result) => {
        return result
            ? { publicKey: result.publicKey, account: result.account }
            : null;
    });
}
exports.getMultipleAccounts = getMultipleAccounts;
async function getMultipleAccountsAndContext(connection, publicKeys, commitment) {
    if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
        return await getMultipleAccountsAndContextCore(connection, publicKeys, commitment);
    }
    else {
        const batches = (0, common_js_1.chunks)(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT);
        const results = await Promise.all(batches.map((batch) => getMultipleAccountsAndContextCore(connection, batch, commitment)));
        return results.flat();
    }
}
exports.getMultipleAccountsAndContext = getMultipleAccountsAndContext;
async function getMultipleAccountsAndContextCore(connection, publicKeys, commitmentOverride) {
    const commitment = commitmentOverride !== null && commitmentOverride !== void 0 ? commitmentOverride : connection.commitment;
    const { value: accountInfos, context } = await connection.getMultipleAccountsInfoAndContext(publicKeys, commitment);
    const accounts = accountInfos.map((account, idx) => {
        if (account === null) {
            return null;
        }
        return {
            publicKey: publicKeys[idx],
            account,
            context,
        };
    });
    return accounts;
}
// copy from @solana/web3.js that has a commitment param
async function simulateTransaction(connection, transaction, signers, commitment, includeAccounts) {
    var _a;
    if (signers && signers.length > 0) {
        transaction.sign(...signers);
    }
    // @ts-expect-error
    const message = transaction._compile();
    const signData = message.serialize();
    // @ts-expect-error
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = {
        encoding: "base64",
        commitment: commitment !== null && commitment !== void 0 ? commitment : connection.commitment,
    };
    if (includeAccounts) {
        const addresses = (Array.isArray(includeAccounts) ? includeAccounts : message.nonProgramIds()).map((key) => key.toBase58());
        config["accounts"] = {
            encoding: "base64",
            addresses,
        };
    }
    if (signers) {
        config.sigVerify = true;
    }
    const args = [encodedTransaction, config];
    // @ts-expect-error
    const unsafeRes = await connection._rpcRequest("simulateTransaction", args);
    const res = (0, superstruct_1.create)(unsafeRes, SimulatedTransactionResponseStruct);
    if ("error" in res) {
        let logs;
        if ("data" in res.error) {
            logs = (_a = res.error.data) === null || _a === void 0 ? void 0 : _a.logs;
            if (logs && Array.isArray(logs)) {
                const traceIndent = "\n    ";
                const logTrace = traceIndent + logs.join(traceIndent);
                console.error(res.error.message, logTrace);
            }
        }
        throw new web3_js_1.SendTransactionError("failed to simulate transaction: " + res.error.message, logs);
    }
    return res.result;
}
exports.simulateTransaction = simulateTransaction;
// copy from @solana/web3.js
function jsonRpcResult(schema) {
    return (0, superstruct_1.coerce)(createRpcResult(schema), UnknownRpcResult, (value) => {
        if ("error" in value) {
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
// copy from @solana/web3.js
const UnknownRpcResult = createRpcResult((0, superstruct_1.unknown)());
// copy from @solana/web3.js
function createRpcResult(result) {
    return (0, superstruct_1.union)([
        (0, superstruct_1.type)({
            jsonrpc: (0, superstruct_1.literal)("2.0"),
            id: (0, superstruct_1.string)(),
            result,
        }),
        (0, superstruct_1.type)({
            jsonrpc: (0, superstruct_1.literal)("2.0"),
            id: (0, superstruct_1.string)(),
            error: (0, superstruct_1.type)({
                code: (0, superstruct_1.unknown)(),
                message: (0, superstruct_1.string)(),
                data: (0, superstruct_1.optional)((0, superstruct_1.any)()),
            }),
        }),
    ]);
}
// copy from @solana/web3.js
function jsonRpcResultAndContext(value) {
    return jsonRpcResult((0, superstruct_1.type)({
        context: (0, superstruct_1.type)({
            slot: (0, superstruct_1.number)(),
        }),
        value,
    }));
}
// copy from @solana/web3.js
const SimulatedTransactionResponseStruct = jsonRpcResultAndContext((0, superstruct_1.type)({
    err: (0, superstruct_1.nullable)((0, superstruct_1.union)([(0, superstruct_1.type)({}), (0, superstruct_1.string)()])),
    logs: (0, superstruct_1.nullable)((0, superstruct_1.array)((0, superstruct_1.string)())),
    accounts: (0, superstruct_1.optional)((0, superstruct_1.nullable)((0, superstruct_1.array)((0, superstruct_1.nullable)((0, superstruct_1.type)({
        executable: (0, superstruct_1.boolean)(),
        owner: (0, superstruct_1.string)(),
        lamports: (0, superstruct_1.number)(),
        data: (0, superstruct_1.array)((0, superstruct_1.string)()),
        rentEpoch: (0, superstruct_1.optional)((0, superstruct_1.number)()),
    }))))),
    unitsConsumed: (0, superstruct_1.optional)((0, superstruct_1.number)()),
}));
//# sourceMappingURL=rpc.js.map