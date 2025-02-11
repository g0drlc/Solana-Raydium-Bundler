import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "solana.storage.TransactionByAddr";
export declare enum TransactionErrorType {
    ACCOUNT_IN_USE = 0,
    ACCOUNT_LOADED_TWICE = 1,
    ACCOUNT_NOT_FOUND = 2,
    PROGRAM_ACCOUNT_NOT_FOUND = 3,
    INSUFFICIENT_FUNDS_FOR_FEE = 4,
    INVALID_ACCOUNT_FOR_FEE = 5,
    ALREADY_PROCESSED = 6,
    BLOCKHASH_NOT_FOUND = 7,
    INSTRUCTION_ERROR = 8,
    CALL_CHAIN_TOO_DEEP = 9,
    MISSING_SIGNATURE_FOR_FEE = 10,
    INVALID_ACCOUNT_INDEX = 11,
    SIGNATURE_FAILURE = 12,
    INVALID_PROGRAM_FOR_EXECUTION = 13,
    SANITIZE_FAILURE = 14,
    CLUSTER_MAINTENANCE = 15,
    ACCOUNT_BORROW_OUTSTANDING_TX = 16,
    WOULD_EXCEED_MAX_BLOCK_COST_LIMIT = 17,
    UNSUPPORTED_VERSION = 18,
    INVALID_WRITABLE_ACCOUNT = 19,
    WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT = 20,
    WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT = 21,
    TOO_MANY_ACCOUNT_LOCKS = 22,
    ADDRESS_LOOKUP_TABLE_NOT_FOUND = 23,
    INVALID_ADDRESS_LOOKUP_TABLE_OWNER = 24,
    INVALID_ADDRESS_LOOKUP_TABLE_DATA = 25,
    INVALID_ADDRESS_LOOKUP_TABLE_INDEX = 26,
    INVALID_RENT_PAYING_ACCOUNT = 27,
    WOULD_EXCEED_MAX_VOTE_COST_LIMIT = 28,
    WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT = 29,
    DUPLICATE_INSTRUCTION = 30,
    INSUFFICIENT_FUNDS_FOR_RENT = 31,
    MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED = 32,
    INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT = 33,
    RESANITIZATION_NEEDED = 34,
    PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED = 35,
    UNBALANCED_TRANSACTION = 36,
    UNRECOGNIZED = -1
}
export declare function transactionErrorTypeFromJSON(object: any): TransactionErrorType;
export declare function transactionErrorTypeToJSON(object: TransactionErrorType): string;
export declare enum InstructionErrorType {
    GENERIC_ERROR = 0,
    INVALID_ARGUMENT = 1,
    INVALID_INSTRUCTION_DATA = 2,
    INVALID_ACCOUNT_DATA = 3,
    ACCOUNT_DATA_TOO_SMALL = 4,
    INSUFFICIENT_FUNDS = 5,
    INCORRECT_PROGRAM_ID = 6,
    MISSING_REQUIRED_SIGNATURE = 7,
    ACCOUNT_ALREADY_INITIALIZED = 8,
    UNINITIALIZED_ACCOUNT = 9,
    UNBALANCED_INSTRUCTION = 10,
    MODIFIED_PROGRAM_ID = 11,
    EXTERNAL_ACCOUNT_LAMPORT_SPEND = 12,
    EXTERNAL_ACCOUNT_DATA_MODIFIED = 13,
    READONLY_LAMPORT_CHANGE = 14,
    READONLY_DATA_MODIFIED = 15,
    DUPLICATE_ACCOUNT_INDEX = 16,
    EXECUTABLE_MODIFIED = 17,
    RENT_EPOCH_MODIFIED = 18,
    NOT_ENOUGH_ACCOUNT_KEYS = 19,
    ACCOUNT_DATA_SIZE_CHANGED = 20,
    ACCOUNT_NOT_EXECUTABLE = 21,
    ACCOUNT_BORROW_FAILED = 22,
    ACCOUNT_BORROW_OUTSTANDING = 23,
    DUPLICATE_ACCOUNT_OUT_OF_SYNC = 24,
    CUSTOM = 25,
    INVALID_ERROR = 26,
    EXECUTABLE_DATA_MODIFIED = 27,
    EXECUTABLE_LAMPORT_CHANGE = 28,
    EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT = 29,
    UNSUPPORTED_PROGRAM_ID = 30,
    CALL_DEPTH = 31,
    MISSING_ACCOUNT = 32,
    REENTRANCY_NOT_ALLOWED = 33,
    MAX_SEED_LENGTH_EXCEEDED = 34,
    INVALID_SEEDS = 35,
    INVALID_REALLOC = 36,
    COMPUTATIONAL_BUDGET_EXCEEDED = 37,
    PRIVILEGE_ESCALATION = 38,
    PROGRAM_ENVIRONMENT_SETUP_FAILURE = 39,
    PROGRAM_FAILED_TO_COMPLETE = 40,
    PROGRAM_FAILED_TO_COMPILE = 41,
    IMMUTABLE = 42,
    INCORRECT_AUTHORITY = 43,
    BORSH_IO_ERROR = 44,
    ACCOUNT_NOT_RENT_EXEMPT = 45,
    INVALID_ACCOUNT_OWNER = 46,
    ARITHMETIC_OVERFLOW = 47,
    UNSUPPORTED_SYSVAR = 48,
    ILLEGAL_OWNER = 49,
    MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED = 50,
    MAX_ACCOUNTS_EXCEEDED = 51,
    MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED = 52,
    BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS = 53,
    UNRECOGNIZED = -1
}
export declare function instructionErrorTypeFromJSON(object: any): InstructionErrorType;
export declare function instructionErrorTypeToJSON(object: InstructionErrorType): string;
export interface TransactionByAddr {
    txByAddrs: TransactionByAddrInfo[];
}
export interface TransactionByAddrInfo {
    signature: Uint8Array;
    err: TransactionError | undefined;
    index: number;
    memo: Memo | undefined;
    blockTime: UnixTimestamp | undefined;
}
export interface Memo {
    memo: string;
}
export interface TransactionError {
    transactionError: TransactionErrorType;
    instructionError: InstructionError | undefined;
    transactionDetails: TransactionDetails | undefined;
}
export interface InstructionError {
    index: number;
    error: InstructionErrorType;
    custom: CustomError | undefined;
}
export interface TransactionDetails {
    index: number;
}
export interface UnixTimestamp {
    timestamp: number;
}
export interface CustomError {
    custom: number;
}
export declare const TransactionByAddr: {
    encode(message: TransactionByAddr, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransactionByAddr;
    fromJSON(object: any): TransactionByAddr;
    toJSON(message: TransactionByAddr): unknown;
    create<I extends {
        txByAddrs?: {
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        txByAddrs?: ({
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        }[] & ({
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        } & {
            signature?: Uint8Array | undefined;
            err?: ({
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } & {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: ({
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } & {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: ({
                        custom?: number | undefined;
                    } & {
                        custom?: number | undefined;
                    } & { [K in Exclude<keyof I["txByAddrs"][number]["err"]["instructionError"]["custom"], "custom">]: never; }) | undefined;
                } & { [K_1 in Exclude<keyof I["txByAddrs"][number]["err"]["instructionError"], keyof InstructionError>]: never; }) | undefined;
                transactionDetails?: ({
                    index?: number | undefined;
                } & {
                    index?: number | undefined;
                } & { [K_2 in Exclude<keyof I["txByAddrs"][number]["err"]["transactionDetails"], "index">]: never; }) | undefined;
            } & { [K_3 in Exclude<keyof I["txByAddrs"][number]["err"], keyof TransactionError>]: never; }) | undefined;
            index?: number | undefined;
            memo?: ({
                memo?: string | undefined;
            } & {
                memo?: string | undefined;
            } & { [K_4 in Exclude<keyof I["txByAddrs"][number]["memo"], "memo">]: never; }) | undefined;
            blockTime?: ({
                timestamp?: number | undefined;
            } & {
                timestamp?: number | undefined;
            } & { [K_5 in Exclude<keyof I["txByAddrs"][number]["blockTime"], "timestamp">]: never; }) | undefined;
        } & { [K_6 in Exclude<keyof I["txByAddrs"][number], keyof TransactionByAddrInfo>]: never; })[] & { [K_7 in Exclude<keyof I["txByAddrs"], keyof {
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_8 in Exclude<keyof I, "txByAddrs">]: never; }>(base?: I | undefined): TransactionByAddr;
    fromPartial<I_1 extends {
        txByAddrs?: {
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        txByAddrs?: ({
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        }[] & ({
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        } & {
            signature?: Uint8Array | undefined;
            err?: ({
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } & {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: ({
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } & {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: ({
                        custom?: number | undefined;
                    } & {
                        custom?: number | undefined;
                    } & { [K_9 in Exclude<keyof I_1["txByAddrs"][number]["err"]["instructionError"]["custom"], "custom">]: never; }) | undefined;
                } & { [K_10 in Exclude<keyof I_1["txByAddrs"][number]["err"]["instructionError"], keyof InstructionError>]: never; }) | undefined;
                transactionDetails?: ({
                    index?: number | undefined;
                } & {
                    index?: number | undefined;
                } & { [K_11 in Exclude<keyof I_1["txByAddrs"][number]["err"]["transactionDetails"], "index">]: never; }) | undefined;
            } & { [K_12 in Exclude<keyof I_1["txByAddrs"][number]["err"], keyof TransactionError>]: never; }) | undefined;
            index?: number | undefined;
            memo?: ({
                memo?: string | undefined;
            } & {
                memo?: string | undefined;
            } & { [K_13 in Exclude<keyof I_1["txByAddrs"][number]["memo"], "memo">]: never; }) | undefined;
            blockTime?: ({
                timestamp?: number | undefined;
            } & {
                timestamp?: number | undefined;
            } & { [K_14 in Exclude<keyof I_1["txByAddrs"][number]["blockTime"], "timestamp">]: never; }) | undefined;
        } & { [K_15 in Exclude<keyof I_1["txByAddrs"][number], keyof TransactionByAddrInfo>]: never; })[] & { [K_16 in Exclude<keyof I_1["txByAddrs"], keyof {
            signature?: Uint8Array | undefined;
            err?: {
                transactionError?: TransactionErrorType | undefined;
                instructionError?: {
                    index?: number | undefined;
                    error?: InstructionErrorType | undefined;
                    custom?: {
                        custom?: number | undefined;
                    } | undefined;
                } | undefined;
                transactionDetails?: {
                    index?: number | undefined;
                } | undefined;
            } | undefined;
            index?: number | undefined;
            memo?: {
                memo?: string | undefined;
            } | undefined;
            blockTime?: {
                timestamp?: number | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_17 in Exclude<keyof I_1, "txByAddrs">]: never; }>(object: I_1): TransactionByAddr;
};
export declare const TransactionByAddrInfo: {
    encode(message: TransactionByAddrInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransactionByAddrInfo;
    fromJSON(object: any): TransactionByAddrInfo;
    toJSON(message: TransactionByAddrInfo): unknown;
    create<I extends {
        signature?: Uint8Array | undefined;
        err?: {
            transactionError?: TransactionErrorType | undefined;
            instructionError?: {
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: {
                    custom?: number | undefined;
                } | undefined;
            } | undefined;
            transactionDetails?: {
                index?: number | undefined;
            } | undefined;
        } | undefined;
        index?: number | undefined;
        memo?: {
            memo?: string | undefined;
        } | undefined;
        blockTime?: {
            timestamp?: number | undefined;
        } | undefined;
    } & {
        signature?: Uint8Array | undefined;
        err?: ({
            transactionError?: TransactionErrorType | undefined;
            instructionError?: {
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: {
                    custom?: number | undefined;
                } | undefined;
            } | undefined;
            transactionDetails?: {
                index?: number | undefined;
            } | undefined;
        } & {
            transactionError?: TransactionErrorType | undefined;
            instructionError?: ({
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: {
                    custom?: number | undefined;
                } | undefined;
            } & {
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: ({
                    custom?: number | undefined;
                } & {
                    custom?: number | undefined;
                } & { [K in Exclude<keyof I["err"]["instructionError"]["custom"], "custom">]: never; }) | undefined;
            } & { [K_1 in Exclude<keyof I["err"]["instructionError"], keyof InstructionError>]: never; }) | undefined;
            transactionDetails?: ({
                index?: number | undefined;
            } & {
                index?: number | undefined;
            } & { [K_2 in Exclude<keyof I["err"]["transactionDetails"], "index">]: never; }) | undefined;
        } & { [K_3 in Exclude<keyof I["err"], keyof TransactionError>]: never; }) | undefined;
        index?: number | undefined;
        memo?: ({
            memo?: string | undefined;
        } & {
            memo?: string | undefined;
        } & { [K_4 in Exclude<keyof I["memo"], "memo">]: never; }) | undefined;
        blockTime?: ({
            timestamp?: number | undefined;
        } & {
            timestamp?: number | undefined;
        } & { [K_5 in Exclude<keyof I["blockTime"], "timestamp">]: never; }) | undefined;
    } & { [K_6 in Exclude<keyof I, keyof TransactionByAddrInfo>]: never; }>(base?: I | undefined): TransactionByAddrInfo;
    fromPartial<I_1 extends {
        signature?: Uint8Array | undefined;
        err?: {
            transactionError?: TransactionErrorType | undefined;
            instructionError?: {
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: {
                    custom?: number | undefined;
                } | undefined;
            } | undefined;
            transactionDetails?: {
                index?: number | undefined;
            } | undefined;
        } | undefined;
        index?: number | undefined;
        memo?: {
            memo?: string | undefined;
        } | undefined;
        blockTime?: {
            timestamp?: number | undefined;
        } | undefined;
    } & {
        signature?: Uint8Array | undefined;
        err?: ({
            transactionError?: TransactionErrorType | undefined;
            instructionError?: {
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: {
                    custom?: number | undefined;
                } | undefined;
            } | undefined;
            transactionDetails?: {
                index?: number | undefined;
            } | undefined;
        } & {
            transactionError?: TransactionErrorType | undefined;
            instructionError?: ({
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: {
                    custom?: number | undefined;
                } | undefined;
            } & {
                index?: number | undefined;
                error?: InstructionErrorType | undefined;
                custom?: ({
                    custom?: number | undefined;
                } & {
                    custom?: number | undefined;
                } & { [K_7 in Exclude<keyof I_1["err"]["instructionError"]["custom"], "custom">]: never; }) | undefined;
            } & { [K_8 in Exclude<keyof I_1["err"]["instructionError"], keyof InstructionError>]: never; }) | undefined;
            transactionDetails?: ({
                index?: number | undefined;
            } & {
                index?: number | undefined;
            } & { [K_9 in Exclude<keyof I_1["err"]["transactionDetails"], "index">]: never; }) | undefined;
        } & { [K_10 in Exclude<keyof I_1["err"], keyof TransactionError>]: never; }) | undefined;
        index?: number | undefined;
        memo?: ({
            memo?: string | undefined;
        } & {
            memo?: string | undefined;
        } & { [K_11 in Exclude<keyof I_1["memo"], "memo">]: never; }) | undefined;
        blockTime?: ({
            timestamp?: number | undefined;
        } & {
            timestamp?: number | undefined;
        } & { [K_12 in Exclude<keyof I_1["blockTime"], "timestamp">]: never; }) | undefined;
    } & { [K_13 in Exclude<keyof I_1, keyof TransactionByAddrInfo>]: never; }>(object: I_1): TransactionByAddrInfo;
};
export declare const Memo: {
    encode(message: Memo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Memo;
    fromJSON(object: any): Memo;
    toJSON(message: Memo): unknown;
    create<I extends {
        memo?: string | undefined;
    } & {
        memo?: string | undefined;
    } & { [K in Exclude<keyof I, "memo">]: never; }>(base?: I | undefined): Memo;
    fromPartial<I_1 extends {
        memo?: string | undefined;
    } & {
        memo?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, "memo">]: never; }>(object: I_1): Memo;
};
export declare const TransactionError: {
    encode(message: TransactionError, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransactionError;
    fromJSON(object: any): TransactionError;
    toJSON(message: TransactionError): unknown;
    create<I extends {
        transactionError?: TransactionErrorType | undefined;
        instructionError?: {
            index?: number | undefined;
            error?: InstructionErrorType | undefined;
            custom?: {
                custom?: number | undefined;
            } | undefined;
        } | undefined;
        transactionDetails?: {
            index?: number | undefined;
        } | undefined;
    } & {
        transactionError?: TransactionErrorType | undefined;
        instructionError?: ({
            index?: number | undefined;
            error?: InstructionErrorType | undefined;
            custom?: {
                custom?: number | undefined;
            } | undefined;
        } & {
            index?: number | undefined;
            error?: InstructionErrorType | undefined;
            custom?: ({
                custom?: number | undefined;
            } & {
                custom?: number | undefined;
            } & { [K in Exclude<keyof I["instructionError"]["custom"], "custom">]: never; }) | undefined;
        } & { [K_1 in Exclude<keyof I["instructionError"], keyof InstructionError>]: never; }) | undefined;
        transactionDetails?: ({
            index?: number | undefined;
        } & {
            index?: number | undefined;
        } & { [K_2 in Exclude<keyof I["transactionDetails"], "index">]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof TransactionError>]: never; }>(base?: I | undefined): TransactionError;
    fromPartial<I_1 extends {
        transactionError?: TransactionErrorType | undefined;
        instructionError?: {
            index?: number | undefined;
            error?: InstructionErrorType | undefined;
            custom?: {
                custom?: number | undefined;
            } | undefined;
        } | undefined;
        transactionDetails?: {
            index?: number | undefined;
        } | undefined;
    } & {
        transactionError?: TransactionErrorType | undefined;
        instructionError?: ({
            index?: number | undefined;
            error?: InstructionErrorType | undefined;
            custom?: {
                custom?: number | undefined;
            } | undefined;
        } & {
            index?: number | undefined;
            error?: InstructionErrorType | undefined;
            custom?: ({
                custom?: number | undefined;
            } & {
                custom?: number | undefined;
            } & { [K_4 in Exclude<keyof I_1["instructionError"]["custom"], "custom">]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I_1["instructionError"], keyof InstructionError>]: never; }) | undefined;
        transactionDetails?: ({
            index?: number | undefined;
        } & {
            index?: number | undefined;
        } & { [K_6 in Exclude<keyof I_1["transactionDetails"], "index">]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof TransactionError>]: never; }>(object: I_1): TransactionError;
};
export declare const InstructionError: {
    encode(message: InstructionError, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InstructionError;
    fromJSON(object: any): InstructionError;
    toJSON(message: InstructionError): unknown;
    create<I extends {
        index?: number | undefined;
        error?: InstructionErrorType | undefined;
        custom?: {
            custom?: number | undefined;
        } | undefined;
    } & {
        index?: number | undefined;
        error?: InstructionErrorType | undefined;
        custom?: ({
            custom?: number | undefined;
        } & {
            custom?: number | undefined;
        } & { [K in Exclude<keyof I["custom"], "custom">]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof InstructionError>]: never; }>(base?: I | undefined): InstructionError;
    fromPartial<I_1 extends {
        index?: number | undefined;
        error?: InstructionErrorType | undefined;
        custom?: {
            custom?: number | undefined;
        } | undefined;
    } & {
        index?: number | undefined;
        error?: InstructionErrorType | undefined;
        custom?: ({
            custom?: number | undefined;
        } & {
            custom?: number | undefined;
        } & { [K_2 in Exclude<keyof I_1["custom"], "custom">]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof InstructionError>]: never; }>(object: I_1): InstructionError;
};
export declare const TransactionDetails: {
    encode(message: TransactionDetails, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransactionDetails;
    fromJSON(object: any): TransactionDetails;
    toJSON(message: TransactionDetails): unknown;
    create<I extends {
        index?: number | undefined;
    } & {
        index?: number | undefined;
    } & { [K in Exclude<keyof I, "index">]: never; }>(base?: I | undefined): TransactionDetails;
    fromPartial<I_1 extends {
        index?: number | undefined;
    } & {
        index?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "index">]: never; }>(object: I_1): TransactionDetails;
};
export declare const UnixTimestamp: {
    encode(message: UnixTimestamp, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): UnixTimestamp;
    fromJSON(object: any): UnixTimestamp;
    toJSON(message: UnixTimestamp): unknown;
    create<I extends {
        timestamp?: number | undefined;
    } & {
        timestamp?: number | undefined;
    } & { [K in Exclude<keyof I, "timestamp">]: never; }>(base?: I | undefined): UnixTimestamp;
    fromPartial<I_1 extends {
        timestamp?: number | undefined;
    } & {
        timestamp?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "timestamp">]: never; }>(object: I_1): UnixTimestamp;
};
export declare const CustomError: {
    encode(message: CustomError, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CustomError;
    fromJSON(object: any): CustomError;
    toJSON(message: CustomError): unknown;
    create<I extends {
        custom?: number | undefined;
    } & {
        custom?: number | undefined;
    } & { [K in Exclude<keyof I, "custom">]: never; }>(base?: I | undefined): CustomError;
    fromPartial<I_1 extends {
        custom?: number | undefined;
    } & {
        custom?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "custom">]: never; }>(object: I_1): CustomError;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
