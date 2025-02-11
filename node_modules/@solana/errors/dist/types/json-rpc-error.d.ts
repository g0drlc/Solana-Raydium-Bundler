import { SolanaError } from './error';
interface RpcErrorResponse {
    code: number;
    data?: unknown;
    message: string;
}
type TransactionError = string | {
    [key: string]: unknown;
};
export interface RpcSimulateTransactionResult {
    accounts: ({
        data: string | {
            parsed: unknown;
            program: string;
            space: number;
        } | [encodedBytes: string, encoding: 'base58' | 'base64' | 'base64+zstd' | 'binary' | 'jsonParsed'];
        executable: boolean;
        lamports: number;
        owner: string;
        rentEpoch: number;
        space?: number;
    } | null)[] | null;
    err: TransactionError | null;
    innerInstructions?: {
        index: number;
        instructions: ({
            accounts: number[];
            data: string;
            programIdIndex: number;
            stackHeight?: number;
        } | {
            parsed: unknown;
            program: string;
            programId: string;
            stackHeight?: number;
        } | {
            accounts: string[];
            data: string;
            programId: string;
            stackHeight?: number;
        })[];
    }[] | null;
    logs: string[] | null;
    returnData: {
        data: [string, 'base64'];
        programId: string;
    } | null;
    unitsConsumed: number | null;
}
export declare function getSolanaErrorFromJsonRpcError({ code, data, message }: RpcErrorResponse): SolanaError;
export {};
//# sourceMappingURL=json-rpc-error.d.ts.map