import { Transaction, TransactionInstruction, SendTransactionError, } from "@solana/web3.js";
import { chunks } from "../utils/common.js";
import { translateAddress } from "../program/common.js";
import { getProvider } from "../provider.js";
import { type as pick, number, string, array, boolean, literal, union, optional, nullable, coerce, create, unknown, any, } from "superstruct";
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
export async function invoke(programId, accounts, data, provider) {
    programId = translateAddress(programId);
    if (!provider) {
        provider = getProvider();
    }
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        programId,
        keys: accounts !== null && accounts !== void 0 ? accounts : [],
        data,
    }));
    if (provider.sendAndConfirm === undefined) {
        throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
    }
    return await provider.sendAndConfirm(tx, []);
}
const GET_MULTIPLE_ACCOUNTS_LIMIT = 99;
export async function getMultipleAccounts(connection, publicKeys, commitment) {
    const results = await getMultipleAccountsAndContext(connection, publicKeys, commitment);
    return results.map((result) => {
        return result
            ? { publicKey: result.publicKey, account: result.account }
            : null;
    });
}
export async function getMultipleAccountsAndContext(connection, publicKeys, commitment) {
    if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
        return await getMultipleAccountsAndContextCore(connection, publicKeys, commitment);
    }
    else {
        const batches = chunks(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT);
        const results = await Promise.all(batches.map((batch) => getMultipleAccountsAndContextCore(connection, batch, commitment)));
        return results.flat();
    }
}
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
export async function simulateTransaction(connection, transaction, signers, commitment, includeAccounts) {
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
    const res = create(unsafeRes, SimulatedTransactionResponseStruct);
    if ("error" in res) {
        let logs;
        if ("data" in res.error) {
            logs = res.error.data.logs;
            if (logs && Array.isArray(logs)) {
                const traceIndent = "\n    ";
                const logTrace = traceIndent + logs.join(traceIndent);
                console.error(res.error.message, logTrace);
            }
        }
        throw new SendTransactionError("failed to simulate transaction: " + res.error.message, logs);
    }
    return res.result;
}
// copy from @solana/web3.js
function jsonRpcResult(schema) {
    return coerce(createRpcResult(schema), UnknownRpcResult, (value) => {
        if ("error" in value) {
            return value;
        }
        else {
            return {
                ...value,
                result: create(value.result, schema),
            };
        }
    });
}
// copy from @solana/web3.js
const UnknownRpcResult = createRpcResult(unknown());
// copy from @solana/web3.js
function createRpcResult(result) {
    return union([
        pick({
            jsonrpc: literal("2.0"),
            id: string(),
            result,
        }),
        pick({
            jsonrpc: literal("2.0"),
            id: string(),
            error: pick({
                code: unknown(),
                message: string(),
                data: optional(any()),
            }),
        }),
    ]);
}
// copy from @solana/web3.js
function jsonRpcResultAndContext(value) {
    return jsonRpcResult(pick({
        context: pick({
            slot: number(),
        }),
        value,
    }));
}
// copy from @solana/web3.js
const SimulatedTransactionResponseStruct = jsonRpcResultAndContext(pick({
    err: nullable(union([pick({}), string()])),
    logs: nullable(array(string())),
    accounts: optional(nullable(array(nullable(pick({
        executable: boolean(),
        owner: string(),
        lamports: number(),
        data: array(string()),
        rentEpoch: optional(number()),
    }))))),
    unitsConsumed: optional(number()),
}));
//# sourceMappingURL=rpc.js.map