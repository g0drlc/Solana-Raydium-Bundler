import assert from "assert";
import { PublicKey, Transaction, TransactionInstruction, } from "@solana/web3.js";
import { translateAddress } from "../program/common";
import { getProvider } from "../provider";
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
    return await provider.send(tx);
}
export async function getMultipleAccounts(connection, publicKeys) {
    const args = [publicKeys.map((k) => k.toBase58()), { commitment: "recent" }];
    // @ts-ignore
    const res = await connection._rpcRequest("getMultipleAccounts", args);
    if (res.error) {
        throw new Error("failed to get info about accounts " +
            publicKeys.map((k) => k.toBase58()).join(", ") +
            ": " +
            res.error.message);
    }
    assert(typeof res.result !== "undefined");
    const accounts = [];
    for (const account of res.result.value) {
        let value = null;
        if (account === null) {
            accounts.push(null);
            continue;
        }
        if (res.result.value) {
            const { executable, owner, lamports, data } = account;
            assert(data[1] === "base64");
            value = {
                executable,
                owner: new PublicKey(owner),
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
//# sourceMappingURL=rpc.js.map