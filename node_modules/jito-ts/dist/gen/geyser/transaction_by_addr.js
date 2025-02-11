"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.UnixTimestamp = exports.TransactionDetails = exports.InstructionError = exports.TransactionError = exports.Memo = exports.TransactionByAddrInfo = exports.TransactionByAddr = exports.instructionErrorTypeToJSON = exports.instructionErrorTypeFromJSON = exports.InstructionErrorType = exports.transactionErrorTypeToJSON = exports.transactionErrorTypeFromJSON = exports.TransactionErrorType = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "solana.storage.TransactionByAddr";
var TransactionErrorType;
(function (TransactionErrorType) {
    TransactionErrorType[TransactionErrorType["ACCOUNT_IN_USE"] = 0] = "ACCOUNT_IN_USE";
    TransactionErrorType[TransactionErrorType["ACCOUNT_LOADED_TWICE"] = 1] = "ACCOUNT_LOADED_TWICE";
    TransactionErrorType[TransactionErrorType["ACCOUNT_NOT_FOUND"] = 2] = "ACCOUNT_NOT_FOUND";
    TransactionErrorType[TransactionErrorType["PROGRAM_ACCOUNT_NOT_FOUND"] = 3] = "PROGRAM_ACCOUNT_NOT_FOUND";
    TransactionErrorType[TransactionErrorType["INSUFFICIENT_FUNDS_FOR_FEE"] = 4] = "INSUFFICIENT_FUNDS_FOR_FEE";
    TransactionErrorType[TransactionErrorType["INVALID_ACCOUNT_FOR_FEE"] = 5] = "INVALID_ACCOUNT_FOR_FEE";
    TransactionErrorType[TransactionErrorType["ALREADY_PROCESSED"] = 6] = "ALREADY_PROCESSED";
    TransactionErrorType[TransactionErrorType["BLOCKHASH_NOT_FOUND"] = 7] = "BLOCKHASH_NOT_FOUND";
    TransactionErrorType[TransactionErrorType["INSTRUCTION_ERROR"] = 8] = "INSTRUCTION_ERROR";
    TransactionErrorType[TransactionErrorType["CALL_CHAIN_TOO_DEEP"] = 9] = "CALL_CHAIN_TOO_DEEP";
    TransactionErrorType[TransactionErrorType["MISSING_SIGNATURE_FOR_FEE"] = 10] = "MISSING_SIGNATURE_FOR_FEE";
    TransactionErrorType[TransactionErrorType["INVALID_ACCOUNT_INDEX"] = 11] = "INVALID_ACCOUNT_INDEX";
    TransactionErrorType[TransactionErrorType["SIGNATURE_FAILURE"] = 12] = "SIGNATURE_FAILURE";
    TransactionErrorType[TransactionErrorType["INVALID_PROGRAM_FOR_EXECUTION"] = 13] = "INVALID_PROGRAM_FOR_EXECUTION";
    TransactionErrorType[TransactionErrorType["SANITIZE_FAILURE"] = 14] = "SANITIZE_FAILURE";
    TransactionErrorType[TransactionErrorType["CLUSTER_MAINTENANCE"] = 15] = "CLUSTER_MAINTENANCE";
    TransactionErrorType[TransactionErrorType["ACCOUNT_BORROW_OUTSTANDING_TX"] = 16] = "ACCOUNT_BORROW_OUTSTANDING_TX";
    TransactionErrorType[TransactionErrorType["WOULD_EXCEED_MAX_BLOCK_COST_LIMIT"] = 17] = "WOULD_EXCEED_MAX_BLOCK_COST_LIMIT";
    TransactionErrorType[TransactionErrorType["UNSUPPORTED_VERSION"] = 18] = "UNSUPPORTED_VERSION";
    TransactionErrorType[TransactionErrorType["INVALID_WRITABLE_ACCOUNT"] = 19] = "INVALID_WRITABLE_ACCOUNT";
    TransactionErrorType[TransactionErrorType["WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT"] = 20] = "WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT";
    TransactionErrorType[TransactionErrorType["WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT"] = 21] = "WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT";
    TransactionErrorType[TransactionErrorType["TOO_MANY_ACCOUNT_LOCKS"] = 22] = "TOO_MANY_ACCOUNT_LOCKS";
    TransactionErrorType[TransactionErrorType["ADDRESS_LOOKUP_TABLE_NOT_FOUND"] = 23] = "ADDRESS_LOOKUP_TABLE_NOT_FOUND";
    TransactionErrorType[TransactionErrorType["INVALID_ADDRESS_LOOKUP_TABLE_OWNER"] = 24] = "INVALID_ADDRESS_LOOKUP_TABLE_OWNER";
    TransactionErrorType[TransactionErrorType["INVALID_ADDRESS_LOOKUP_TABLE_DATA"] = 25] = "INVALID_ADDRESS_LOOKUP_TABLE_DATA";
    TransactionErrorType[TransactionErrorType["INVALID_ADDRESS_LOOKUP_TABLE_INDEX"] = 26] = "INVALID_ADDRESS_LOOKUP_TABLE_INDEX";
    TransactionErrorType[TransactionErrorType["INVALID_RENT_PAYING_ACCOUNT"] = 27] = "INVALID_RENT_PAYING_ACCOUNT";
    TransactionErrorType[TransactionErrorType["WOULD_EXCEED_MAX_VOTE_COST_LIMIT"] = 28] = "WOULD_EXCEED_MAX_VOTE_COST_LIMIT";
    TransactionErrorType[TransactionErrorType["WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT"] = 29] = "WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT";
    TransactionErrorType[TransactionErrorType["DUPLICATE_INSTRUCTION"] = 30] = "DUPLICATE_INSTRUCTION";
    TransactionErrorType[TransactionErrorType["INSUFFICIENT_FUNDS_FOR_RENT"] = 31] = "INSUFFICIENT_FUNDS_FOR_RENT";
    TransactionErrorType[TransactionErrorType["MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED"] = 32] = "MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED";
    TransactionErrorType[TransactionErrorType["INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT"] = 33] = "INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT";
    TransactionErrorType[TransactionErrorType["RESANITIZATION_NEEDED"] = 34] = "RESANITIZATION_NEEDED";
    TransactionErrorType[TransactionErrorType["PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED"] = 35] = "PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED";
    TransactionErrorType[TransactionErrorType["UNBALANCED_TRANSACTION"] = 36] = "UNBALANCED_TRANSACTION";
    TransactionErrorType[TransactionErrorType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TransactionErrorType = exports.TransactionErrorType || (exports.TransactionErrorType = {}));
function transactionErrorTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "ACCOUNT_IN_USE":
            return TransactionErrorType.ACCOUNT_IN_USE;
        case 1:
        case "ACCOUNT_LOADED_TWICE":
            return TransactionErrorType.ACCOUNT_LOADED_TWICE;
        case 2:
        case "ACCOUNT_NOT_FOUND":
            return TransactionErrorType.ACCOUNT_NOT_FOUND;
        case 3:
        case "PROGRAM_ACCOUNT_NOT_FOUND":
            return TransactionErrorType.PROGRAM_ACCOUNT_NOT_FOUND;
        case 4:
        case "INSUFFICIENT_FUNDS_FOR_FEE":
            return TransactionErrorType.INSUFFICIENT_FUNDS_FOR_FEE;
        case 5:
        case "INVALID_ACCOUNT_FOR_FEE":
            return TransactionErrorType.INVALID_ACCOUNT_FOR_FEE;
        case 6:
        case "ALREADY_PROCESSED":
            return TransactionErrorType.ALREADY_PROCESSED;
        case 7:
        case "BLOCKHASH_NOT_FOUND":
            return TransactionErrorType.BLOCKHASH_NOT_FOUND;
        case 8:
        case "INSTRUCTION_ERROR":
            return TransactionErrorType.INSTRUCTION_ERROR;
        case 9:
        case "CALL_CHAIN_TOO_DEEP":
            return TransactionErrorType.CALL_CHAIN_TOO_DEEP;
        case 10:
        case "MISSING_SIGNATURE_FOR_FEE":
            return TransactionErrorType.MISSING_SIGNATURE_FOR_FEE;
        case 11:
        case "INVALID_ACCOUNT_INDEX":
            return TransactionErrorType.INVALID_ACCOUNT_INDEX;
        case 12:
        case "SIGNATURE_FAILURE":
            return TransactionErrorType.SIGNATURE_FAILURE;
        case 13:
        case "INVALID_PROGRAM_FOR_EXECUTION":
            return TransactionErrorType.INVALID_PROGRAM_FOR_EXECUTION;
        case 14:
        case "SANITIZE_FAILURE":
            return TransactionErrorType.SANITIZE_FAILURE;
        case 15:
        case "CLUSTER_MAINTENANCE":
            return TransactionErrorType.CLUSTER_MAINTENANCE;
        case 16:
        case "ACCOUNT_BORROW_OUTSTANDING_TX":
            return TransactionErrorType.ACCOUNT_BORROW_OUTSTANDING_TX;
        case 17:
        case "WOULD_EXCEED_MAX_BLOCK_COST_LIMIT":
            return TransactionErrorType.WOULD_EXCEED_MAX_BLOCK_COST_LIMIT;
        case 18:
        case "UNSUPPORTED_VERSION":
            return TransactionErrorType.UNSUPPORTED_VERSION;
        case 19:
        case "INVALID_WRITABLE_ACCOUNT":
            return TransactionErrorType.INVALID_WRITABLE_ACCOUNT;
        case 20:
        case "WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT":
            return TransactionErrorType.WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT;
        case 21:
        case "WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT":
            return TransactionErrorType.WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT;
        case 22:
        case "TOO_MANY_ACCOUNT_LOCKS":
            return TransactionErrorType.TOO_MANY_ACCOUNT_LOCKS;
        case 23:
        case "ADDRESS_LOOKUP_TABLE_NOT_FOUND":
            return TransactionErrorType.ADDRESS_LOOKUP_TABLE_NOT_FOUND;
        case 24:
        case "INVALID_ADDRESS_LOOKUP_TABLE_OWNER":
            return TransactionErrorType.INVALID_ADDRESS_LOOKUP_TABLE_OWNER;
        case 25:
        case "INVALID_ADDRESS_LOOKUP_TABLE_DATA":
            return TransactionErrorType.INVALID_ADDRESS_LOOKUP_TABLE_DATA;
        case 26:
        case "INVALID_ADDRESS_LOOKUP_TABLE_INDEX":
            return TransactionErrorType.INVALID_ADDRESS_LOOKUP_TABLE_INDEX;
        case 27:
        case "INVALID_RENT_PAYING_ACCOUNT":
            return TransactionErrorType.INVALID_RENT_PAYING_ACCOUNT;
        case 28:
        case "WOULD_EXCEED_MAX_VOTE_COST_LIMIT":
            return TransactionErrorType.WOULD_EXCEED_MAX_VOTE_COST_LIMIT;
        case 29:
        case "WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT":
            return TransactionErrorType.WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT;
        case 30:
        case "DUPLICATE_INSTRUCTION":
            return TransactionErrorType.DUPLICATE_INSTRUCTION;
        case 31:
        case "INSUFFICIENT_FUNDS_FOR_RENT":
            return TransactionErrorType.INSUFFICIENT_FUNDS_FOR_RENT;
        case 32:
        case "MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED":
            return TransactionErrorType.MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED;
        case 33:
        case "INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT":
            return TransactionErrorType.INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT;
        case 34:
        case "RESANITIZATION_NEEDED":
            return TransactionErrorType.RESANITIZATION_NEEDED;
        case 35:
        case "PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED":
            return TransactionErrorType.PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED;
        case 36:
        case "UNBALANCED_TRANSACTION":
            return TransactionErrorType.UNBALANCED_TRANSACTION;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TransactionErrorType.UNRECOGNIZED;
    }
}
exports.transactionErrorTypeFromJSON = transactionErrorTypeFromJSON;
function transactionErrorTypeToJSON(object) {
    switch (object) {
        case TransactionErrorType.ACCOUNT_IN_USE:
            return "ACCOUNT_IN_USE";
        case TransactionErrorType.ACCOUNT_LOADED_TWICE:
            return "ACCOUNT_LOADED_TWICE";
        case TransactionErrorType.ACCOUNT_NOT_FOUND:
            return "ACCOUNT_NOT_FOUND";
        case TransactionErrorType.PROGRAM_ACCOUNT_NOT_FOUND:
            return "PROGRAM_ACCOUNT_NOT_FOUND";
        case TransactionErrorType.INSUFFICIENT_FUNDS_FOR_FEE:
            return "INSUFFICIENT_FUNDS_FOR_FEE";
        case TransactionErrorType.INVALID_ACCOUNT_FOR_FEE:
            return "INVALID_ACCOUNT_FOR_FEE";
        case TransactionErrorType.ALREADY_PROCESSED:
            return "ALREADY_PROCESSED";
        case TransactionErrorType.BLOCKHASH_NOT_FOUND:
            return "BLOCKHASH_NOT_FOUND";
        case TransactionErrorType.INSTRUCTION_ERROR:
            return "INSTRUCTION_ERROR";
        case TransactionErrorType.CALL_CHAIN_TOO_DEEP:
            return "CALL_CHAIN_TOO_DEEP";
        case TransactionErrorType.MISSING_SIGNATURE_FOR_FEE:
            return "MISSING_SIGNATURE_FOR_FEE";
        case TransactionErrorType.INVALID_ACCOUNT_INDEX:
            return "INVALID_ACCOUNT_INDEX";
        case TransactionErrorType.SIGNATURE_FAILURE:
            return "SIGNATURE_FAILURE";
        case TransactionErrorType.INVALID_PROGRAM_FOR_EXECUTION:
            return "INVALID_PROGRAM_FOR_EXECUTION";
        case TransactionErrorType.SANITIZE_FAILURE:
            return "SANITIZE_FAILURE";
        case TransactionErrorType.CLUSTER_MAINTENANCE:
            return "CLUSTER_MAINTENANCE";
        case TransactionErrorType.ACCOUNT_BORROW_OUTSTANDING_TX:
            return "ACCOUNT_BORROW_OUTSTANDING_TX";
        case TransactionErrorType.WOULD_EXCEED_MAX_BLOCK_COST_LIMIT:
            return "WOULD_EXCEED_MAX_BLOCK_COST_LIMIT";
        case TransactionErrorType.UNSUPPORTED_VERSION:
            return "UNSUPPORTED_VERSION";
        case TransactionErrorType.INVALID_WRITABLE_ACCOUNT:
            return "INVALID_WRITABLE_ACCOUNT";
        case TransactionErrorType.WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT:
            return "WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT";
        case TransactionErrorType.WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT:
            return "WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT";
        case TransactionErrorType.TOO_MANY_ACCOUNT_LOCKS:
            return "TOO_MANY_ACCOUNT_LOCKS";
        case TransactionErrorType.ADDRESS_LOOKUP_TABLE_NOT_FOUND:
            return "ADDRESS_LOOKUP_TABLE_NOT_FOUND";
        case TransactionErrorType.INVALID_ADDRESS_LOOKUP_TABLE_OWNER:
            return "INVALID_ADDRESS_LOOKUP_TABLE_OWNER";
        case TransactionErrorType.INVALID_ADDRESS_LOOKUP_TABLE_DATA:
            return "INVALID_ADDRESS_LOOKUP_TABLE_DATA";
        case TransactionErrorType.INVALID_ADDRESS_LOOKUP_TABLE_INDEX:
            return "INVALID_ADDRESS_LOOKUP_TABLE_INDEX";
        case TransactionErrorType.INVALID_RENT_PAYING_ACCOUNT:
            return "INVALID_RENT_PAYING_ACCOUNT";
        case TransactionErrorType.WOULD_EXCEED_MAX_VOTE_COST_LIMIT:
            return "WOULD_EXCEED_MAX_VOTE_COST_LIMIT";
        case TransactionErrorType.WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT:
            return "WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT";
        case TransactionErrorType.DUPLICATE_INSTRUCTION:
            return "DUPLICATE_INSTRUCTION";
        case TransactionErrorType.INSUFFICIENT_FUNDS_FOR_RENT:
            return "INSUFFICIENT_FUNDS_FOR_RENT";
        case TransactionErrorType.MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED:
            return "MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED";
        case TransactionErrorType.INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT:
            return "INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT";
        case TransactionErrorType.RESANITIZATION_NEEDED:
            return "RESANITIZATION_NEEDED";
        case TransactionErrorType.PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED:
            return "PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED";
        case TransactionErrorType.UNBALANCED_TRANSACTION:
            return "UNBALANCED_TRANSACTION";
        case TransactionErrorType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.transactionErrorTypeToJSON = transactionErrorTypeToJSON;
var InstructionErrorType;
(function (InstructionErrorType) {
    InstructionErrorType[InstructionErrorType["GENERIC_ERROR"] = 0] = "GENERIC_ERROR";
    InstructionErrorType[InstructionErrorType["INVALID_ARGUMENT"] = 1] = "INVALID_ARGUMENT";
    InstructionErrorType[InstructionErrorType["INVALID_INSTRUCTION_DATA"] = 2] = "INVALID_INSTRUCTION_DATA";
    InstructionErrorType[InstructionErrorType["INVALID_ACCOUNT_DATA"] = 3] = "INVALID_ACCOUNT_DATA";
    InstructionErrorType[InstructionErrorType["ACCOUNT_DATA_TOO_SMALL"] = 4] = "ACCOUNT_DATA_TOO_SMALL";
    InstructionErrorType[InstructionErrorType["INSUFFICIENT_FUNDS"] = 5] = "INSUFFICIENT_FUNDS";
    InstructionErrorType[InstructionErrorType["INCORRECT_PROGRAM_ID"] = 6] = "INCORRECT_PROGRAM_ID";
    InstructionErrorType[InstructionErrorType["MISSING_REQUIRED_SIGNATURE"] = 7] = "MISSING_REQUIRED_SIGNATURE";
    InstructionErrorType[InstructionErrorType["ACCOUNT_ALREADY_INITIALIZED"] = 8] = "ACCOUNT_ALREADY_INITIALIZED";
    InstructionErrorType[InstructionErrorType["UNINITIALIZED_ACCOUNT"] = 9] = "UNINITIALIZED_ACCOUNT";
    InstructionErrorType[InstructionErrorType["UNBALANCED_INSTRUCTION"] = 10] = "UNBALANCED_INSTRUCTION";
    InstructionErrorType[InstructionErrorType["MODIFIED_PROGRAM_ID"] = 11] = "MODIFIED_PROGRAM_ID";
    InstructionErrorType[InstructionErrorType["EXTERNAL_ACCOUNT_LAMPORT_SPEND"] = 12] = "EXTERNAL_ACCOUNT_LAMPORT_SPEND";
    InstructionErrorType[InstructionErrorType["EXTERNAL_ACCOUNT_DATA_MODIFIED"] = 13] = "EXTERNAL_ACCOUNT_DATA_MODIFIED";
    InstructionErrorType[InstructionErrorType["READONLY_LAMPORT_CHANGE"] = 14] = "READONLY_LAMPORT_CHANGE";
    InstructionErrorType[InstructionErrorType["READONLY_DATA_MODIFIED"] = 15] = "READONLY_DATA_MODIFIED";
    InstructionErrorType[InstructionErrorType["DUPLICATE_ACCOUNT_INDEX"] = 16] = "DUPLICATE_ACCOUNT_INDEX";
    InstructionErrorType[InstructionErrorType["EXECUTABLE_MODIFIED"] = 17] = "EXECUTABLE_MODIFIED";
    InstructionErrorType[InstructionErrorType["RENT_EPOCH_MODIFIED"] = 18] = "RENT_EPOCH_MODIFIED";
    InstructionErrorType[InstructionErrorType["NOT_ENOUGH_ACCOUNT_KEYS"] = 19] = "NOT_ENOUGH_ACCOUNT_KEYS";
    InstructionErrorType[InstructionErrorType["ACCOUNT_DATA_SIZE_CHANGED"] = 20] = "ACCOUNT_DATA_SIZE_CHANGED";
    InstructionErrorType[InstructionErrorType["ACCOUNT_NOT_EXECUTABLE"] = 21] = "ACCOUNT_NOT_EXECUTABLE";
    InstructionErrorType[InstructionErrorType["ACCOUNT_BORROW_FAILED"] = 22] = "ACCOUNT_BORROW_FAILED";
    InstructionErrorType[InstructionErrorType["ACCOUNT_BORROW_OUTSTANDING"] = 23] = "ACCOUNT_BORROW_OUTSTANDING";
    InstructionErrorType[InstructionErrorType["DUPLICATE_ACCOUNT_OUT_OF_SYNC"] = 24] = "DUPLICATE_ACCOUNT_OUT_OF_SYNC";
    InstructionErrorType[InstructionErrorType["CUSTOM"] = 25] = "CUSTOM";
    InstructionErrorType[InstructionErrorType["INVALID_ERROR"] = 26] = "INVALID_ERROR";
    InstructionErrorType[InstructionErrorType["EXECUTABLE_DATA_MODIFIED"] = 27] = "EXECUTABLE_DATA_MODIFIED";
    InstructionErrorType[InstructionErrorType["EXECUTABLE_LAMPORT_CHANGE"] = 28] = "EXECUTABLE_LAMPORT_CHANGE";
    InstructionErrorType[InstructionErrorType["EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT"] = 29] = "EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT";
    InstructionErrorType[InstructionErrorType["UNSUPPORTED_PROGRAM_ID"] = 30] = "UNSUPPORTED_PROGRAM_ID";
    InstructionErrorType[InstructionErrorType["CALL_DEPTH"] = 31] = "CALL_DEPTH";
    InstructionErrorType[InstructionErrorType["MISSING_ACCOUNT"] = 32] = "MISSING_ACCOUNT";
    InstructionErrorType[InstructionErrorType["REENTRANCY_NOT_ALLOWED"] = 33] = "REENTRANCY_NOT_ALLOWED";
    InstructionErrorType[InstructionErrorType["MAX_SEED_LENGTH_EXCEEDED"] = 34] = "MAX_SEED_LENGTH_EXCEEDED";
    InstructionErrorType[InstructionErrorType["INVALID_SEEDS"] = 35] = "INVALID_SEEDS";
    InstructionErrorType[InstructionErrorType["INVALID_REALLOC"] = 36] = "INVALID_REALLOC";
    InstructionErrorType[InstructionErrorType["COMPUTATIONAL_BUDGET_EXCEEDED"] = 37] = "COMPUTATIONAL_BUDGET_EXCEEDED";
    InstructionErrorType[InstructionErrorType["PRIVILEGE_ESCALATION"] = 38] = "PRIVILEGE_ESCALATION";
    InstructionErrorType[InstructionErrorType["PROGRAM_ENVIRONMENT_SETUP_FAILURE"] = 39] = "PROGRAM_ENVIRONMENT_SETUP_FAILURE";
    InstructionErrorType[InstructionErrorType["PROGRAM_FAILED_TO_COMPLETE"] = 40] = "PROGRAM_FAILED_TO_COMPLETE";
    InstructionErrorType[InstructionErrorType["PROGRAM_FAILED_TO_COMPILE"] = 41] = "PROGRAM_FAILED_TO_COMPILE";
    InstructionErrorType[InstructionErrorType["IMMUTABLE"] = 42] = "IMMUTABLE";
    InstructionErrorType[InstructionErrorType["INCORRECT_AUTHORITY"] = 43] = "INCORRECT_AUTHORITY";
    InstructionErrorType[InstructionErrorType["BORSH_IO_ERROR"] = 44] = "BORSH_IO_ERROR";
    InstructionErrorType[InstructionErrorType["ACCOUNT_NOT_RENT_EXEMPT"] = 45] = "ACCOUNT_NOT_RENT_EXEMPT";
    InstructionErrorType[InstructionErrorType["INVALID_ACCOUNT_OWNER"] = 46] = "INVALID_ACCOUNT_OWNER";
    InstructionErrorType[InstructionErrorType["ARITHMETIC_OVERFLOW"] = 47] = "ARITHMETIC_OVERFLOW";
    InstructionErrorType[InstructionErrorType["UNSUPPORTED_SYSVAR"] = 48] = "UNSUPPORTED_SYSVAR";
    InstructionErrorType[InstructionErrorType["ILLEGAL_OWNER"] = 49] = "ILLEGAL_OWNER";
    InstructionErrorType[InstructionErrorType["MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED"] = 50] = "MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED";
    InstructionErrorType[InstructionErrorType["MAX_ACCOUNTS_EXCEEDED"] = 51] = "MAX_ACCOUNTS_EXCEEDED";
    InstructionErrorType[InstructionErrorType["MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED"] = 52] = "MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED";
    InstructionErrorType[InstructionErrorType["BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS"] = 53] = "BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS";
    InstructionErrorType[InstructionErrorType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(InstructionErrorType = exports.InstructionErrorType || (exports.InstructionErrorType = {}));
function instructionErrorTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "GENERIC_ERROR":
            return InstructionErrorType.GENERIC_ERROR;
        case 1:
        case "INVALID_ARGUMENT":
            return InstructionErrorType.INVALID_ARGUMENT;
        case 2:
        case "INVALID_INSTRUCTION_DATA":
            return InstructionErrorType.INVALID_INSTRUCTION_DATA;
        case 3:
        case "INVALID_ACCOUNT_DATA":
            return InstructionErrorType.INVALID_ACCOUNT_DATA;
        case 4:
        case "ACCOUNT_DATA_TOO_SMALL":
            return InstructionErrorType.ACCOUNT_DATA_TOO_SMALL;
        case 5:
        case "INSUFFICIENT_FUNDS":
            return InstructionErrorType.INSUFFICIENT_FUNDS;
        case 6:
        case "INCORRECT_PROGRAM_ID":
            return InstructionErrorType.INCORRECT_PROGRAM_ID;
        case 7:
        case "MISSING_REQUIRED_SIGNATURE":
            return InstructionErrorType.MISSING_REQUIRED_SIGNATURE;
        case 8:
        case "ACCOUNT_ALREADY_INITIALIZED":
            return InstructionErrorType.ACCOUNT_ALREADY_INITIALIZED;
        case 9:
        case "UNINITIALIZED_ACCOUNT":
            return InstructionErrorType.UNINITIALIZED_ACCOUNT;
        case 10:
        case "UNBALANCED_INSTRUCTION":
            return InstructionErrorType.UNBALANCED_INSTRUCTION;
        case 11:
        case "MODIFIED_PROGRAM_ID":
            return InstructionErrorType.MODIFIED_PROGRAM_ID;
        case 12:
        case "EXTERNAL_ACCOUNT_LAMPORT_SPEND":
            return InstructionErrorType.EXTERNAL_ACCOUNT_LAMPORT_SPEND;
        case 13:
        case "EXTERNAL_ACCOUNT_DATA_MODIFIED":
            return InstructionErrorType.EXTERNAL_ACCOUNT_DATA_MODIFIED;
        case 14:
        case "READONLY_LAMPORT_CHANGE":
            return InstructionErrorType.READONLY_LAMPORT_CHANGE;
        case 15:
        case "READONLY_DATA_MODIFIED":
            return InstructionErrorType.READONLY_DATA_MODIFIED;
        case 16:
        case "DUPLICATE_ACCOUNT_INDEX":
            return InstructionErrorType.DUPLICATE_ACCOUNT_INDEX;
        case 17:
        case "EXECUTABLE_MODIFIED":
            return InstructionErrorType.EXECUTABLE_MODIFIED;
        case 18:
        case "RENT_EPOCH_MODIFIED":
            return InstructionErrorType.RENT_EPOCH_MODIFIED;
        case 19:
        case "NOT_ENOUGH_ACCOUNT_KEYS":
            return InstructionErrorType.NOT_ENOUGH_ACCOUNT_KEYS;
        case 20:
        case "ACCOUNT_DATA_SIZE_CHANGED":
            return InstructionErrorType.ACCOUNT_DATA_SIZE_CHANGED;
        case 21:
        case "ACCOUNT_NOT_EXECUTABLE":
            return InstructionErrorType.ACCOUNT_NOT_EXECUTABLE;
        case 22:
        case "ACCOUNT_BORROW_FAILED":
            return InstructionErrorType.ACCOUNT_BORROW_FAILED;
        case 23:
        case "ACCOUNT_BORROW_OUTSTANDING":
            return InstructionErrorType.ACCOUNT_BORROW_OUTSTANDING;
        case 24:
        case "DUPLICATE_ACCOUNT_OUT_OF_SYNC":
            return InstructionErrorType.DUPLICATE_ACCOUNT_OUT_OF_SYNC;
        case 25:
        case "CUSTOM":
            return InstructionErrorType.CUSTOM;
        case 26:
        case "INVALID_ERROR":
            return InstructionErrorType.INVALID_ERROR;
        case 27:
        case "EXECUTABLE_DATA_MODIFIED":
            return InstructionErrorType.EXECUTABLE_DATA_MODIFIED;
        case 28:
        case "EXECUTABLE_LAMPORT_CHANGE":
            return InstructionErrorType.EXECUTABLE_LAMPORT_CHANGE;
        case 29:
        case "EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT":
            return InstructionErrorType.EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT;
        case 30:
        case "UNSUPPORTED_PROGRAM_ID":
            return InstructionErrorType.UNSUPPORTED_PROGRAM_ID;
        case 31:
        case "CALL_DEPTH":
            return InstructionErrorType.CALL_DEPTH;
        case 32:
        case "MISSING_ACCOUNT":
            return InstructionErrorType.MISSING_ACCOUNT;
        case 33:
        case "REENTRANCY_NOT_ALLOWED":
            return InstructionErrorType.REENTRANCY_NOT_ALLOWED;
        case 34:
        case "MAX_SEED_LENGTH_EXCEEDED":
            return InstructionErrorType.MAX_SEED_LENGTH_EXCEEDED;
        case 35:
        case "INVALID_SEEDS":
            return InstructionErrorType.INVALID_SEEDS;
        case 36:
        case "INVALID_REALLOC":
            return InstructionErrorType.INVALID_REALLOC;
        case 37:
        case "COMPUTATIONAL_BUDGET_EXCEEDED":
            return InstructionErrorType.COMPUTATIONAL_BUDGET_EXCEEDED;
        case 38:
        case "PRIVILEGE_ESCALATION":
            return InstructionErrorType.PRIVILEGE_ESCALATION;
        case 39:
        case "PROGRAM_ENVIRONMENT_SETUP_FAILURE":
            return InstructionErrorType.PROGRAM_ENVIRONMENT_SETUP_FAILURE;
        case 40:
        case "PROGRAM_FAILED_TO_COMPLETE":
            return InstructionErrorType.PROGRAM_FAILED_TO_COMPLETE;
        case 41:
        case "PROGRAM_FAILED_TO_COMPILE":
            return InstructionErrorType.PROGRAM_FAILED_TO_COMPILE;
        case 42:
        case "IMMUTABLE":
            return InstructionErrorType.IMMUTABLE;
        case 43:
        case "INCORRECT_AUTHORITY":
            return InstructionErrorType.INCORRECT_AUTHORITY;
        case 44:
        case "BORSH_IO_ERROR":
            return InstructionErrorType.BORSH_IO_ERROR;
        case 45:
        case "ACCOUNT_NOT_RENT_EXEMPT":
            return InstructionErrorType.ACCOUNT_NOT_RENT_EXEMPT;
        case 46:
        case "INVALID_ACCOUNT_OWNER":
            return InstructionErrorType.INVALID_ACCOUNT_OWNER;
        case 47:
        case "ARITHMETIC_OVERFLOW":
            return InstructionErrorType.ARITHMETIC_OVERFLOW;
        case 48:
        case "UNSUPPORTED_SYSVAR":
            return InstructionErrorType.UNSUPPORTED_SYSVAR;
        case 49:
        case "ILLEGAL_OWNER":
            return InstructionErrorType.ILLEGAL_OWNER;
        case 50:
        case "MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED":
            return InstructionErrorType.MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED;
        case 51:
        case "MAX_ACCOUNTS_EXCEEDED":
            return InstructionErrorType.MAX_ACCOUNTS_EXCEEDED;
        case 52:
        case "MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED":
            return InstructionErrorType.MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED;
        case 53:
        case "BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS":
            return InstructionErrorType.BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS;
        case -1:
        case "UNRECOGNIZED":
        default:
            return InstructionErrorType.UNRECOGNIZED;
    }
}
exports.instructionErrorTypeFromJSON = instructionErrorTypeFromJSON;
function instructionErrorTypeToJSON(object) {
    switch (object) {
        case InstructionErrorType.GENERIC_ERROR:
            return "GENERIC_ERROR";
        case InstructionErrorType.INVALID_ARGUMENT:
            return "INVALID_ARGUMENT";
        case InstructionErrorType.INVALID_INSTRUCTION_DATA:
            return "INVALID_INSTRUCTION_DATA";
        case InstructionErrorType.INVALID_ACCOUNT_DATA:
            return "INVALID_ACCOUNT_DATA";
        case InstructionErrorType.ACCOUNT_DATA_TOO_SMALL:
            return "ACCOUNT_DATA_TOO_SMALL";
        case InstructionErrorType.INSUFFICIENT_FUNDS:
            return "INSUFFICIENT_FUNDS";
        case InstructionErrorType.INCORRECT_PROGRAM_ID:
            return "INCORRECT_PROGRAM_ID";
        case InstructionErrorType.MISSING_REQUIRED_SIGNATURE:
            return "MISSING_REQUIRED_SIGNATURE";
        case InstructionErrorType.ACCOUNT_ALREADY_INITIALIZED:
            return "ACCOUNT_ALREADY_INITIALIZED";
        case InstructionErrorType.UNINITIALIZED_ACCOUNT:
            return "UNINITIALIZED_ACCOUNT";
        case InstructionErrorType.UNBALANCED_INSTRUCTION:
            return "UNBALANCED_INSTRUCTION";
        case InstructionErrorType.MODIFIED_PROGRAM_ID:
            return "MODIFIED_PROGRAM_ID";
        case InstructionErrorType.EXTERNAL_ACCOUNT_LAMPORT_SPEND:
            return "EXTERNAL_ACCOUNT_LAMPORT_SPEND";
        case InstructionErrorType.EXTERNAL_ACCOUNT_DATA_MODIFIED:
            return "EXTERNAL_ACCOUNT_DATA_MODIFIED";
        case InstructionErrorType.READONLY_LAMPORT_CHANGE:
            return "READONLY_LAMPORT_CHANGE";
        case InstructionErrorType.READONLY_DATA_MODIFIED:
            return "READONLY_DATA_MODIFIED";
        case InstructionErrorType.DUPLICATE_ACCOUNT_INDEX:
            return "DUPLICATE_ACCOUNT_INDEX";
        case InstructionErrorType.EXECUTABLE_MODIFIED:
            return "EXECUTABLE_MODIFIED";
        case InstructionErrorType.RENT_EPOCH_MODIFIED:
            return "RENT_EPOCH_MODIFIED";
        case InstructionErrorType.NOT_ENOUGH_ACCOUNT_KEYS:
            return "NOT_ENOUGH_ACCOUNT_KEYS";
        case InstructionErrorType.ACCOUNT_DATA_SIZE_CHANGED:
            return "ACCOUNT_DATA_SIZE_CHANGED";
        case InstructionErrorType.ACCOUNT_NOT_EXECUTABLE:
            return "ACCOUNT_NOT_EXECUTABLE";
        case InstructionErrorType.ACCOUNT_BORROW_FAILED:
            return "ACCOUNT_BORROW_FAILED";
        case InstructionErrorType.ACCOUNT_BORROW_OUTSTANDING:
            return "ACCOUNT_BORROW_OUTSTANDING";
        case InstructionErrorType.DUPLICATE_ACCOUNT_OUT_OF_SYNC:
            return "DUPLICATE_ACCOUNT_OUT_OF_SYNC";
        case InstructionErrorType.CUSTOM:
            return "CUSTOM";
        case InstructionErrorType.INVALID_ERROR:
            return "INVALID_ERROR";
        case InstructionErrorType.EXECUTABLE_DATA_MODIFIED:
            return "EXECUTABLE_DATA_MODIFIED";
        case InstructionErrorType.EXECUTABLE_LAMPORT_CHANGE:
            return "EXECUTABLE_LAMPORT_CHANGE";
        case InstructionErrorType.EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT:
            return "EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT";
        case InstructionErrorType.UNSUPPORTED_PROGRAM_ID:
            return "UNSUPPORTED_PROGRAM_ID";
        case InstructionErrorType.CALL_DEPTH:
            return "CALL_DEPTH";
        case InstructionErrorType.MISSING_ACCOUNT:
            return "MISSING_ACCOUNT";
        case InstructionErrorType.REENTRANCY_NOT_ALLOWED:
            return "REENTRANCY_NOT_ALLOWED";
        case InstructionErrorType.MAX_SEED_LENGTH_EXCEEDED:
            return "MAX_SEED_LENGTH_EXCEEDED";
        case InstructionErrorType.INVALID_SEEDS:
            return "INVALID_SEEDS";
        case InstructionErrorType.INVALID_REALLOC:
            return "INVALID_REALLOC";
        case InstructionErrorType.COMPUTATIONAL_BUDGET_EXCEEDED:
            return "COMPUTATIONAL_BUDGET_EXCEEDED";
        case InstructionErrorType.PRIVILEGE_ESCALATION:
            return "PRIVILEGE_ESCALATION";
        case InstructionErrorType.PROGRAM_ENVIRONMENT_SETUP_FAILURE:
            return "PROGRAM_ENVIRONMENT_SETUP_FAILURE";
        case InstructionErrorType.PROGRAM_FAILED_TO_COMPLETE:
            return "PROGRAM_FAILED_TO_COMPLETE";
        case InstructionErrorType.PROGRAM_FAILED_TO_COMPILE:
            return "PROGRAM_FAILED_TO_COMPILE";
        case InstructionErrorType.IMMUTABLE:
            return "IMMUTABLE";
        case InstructionErrorType.INCORRECT_AUTHORITY:
            return "INCORRECT_AUTHORITY";
        case InstructionErrorType.BORSH_IO_ERROR:
            return "BORSH_IO_ERROR";
        case InstructionErrorType.ACCOUNT_NOT_RENT_EXEMPT:
            return "ACCOUNT_NOT_RENT_EXEMPT";
        case InstructionErrorType.INVALID_ACCOUNT_OWNER:
            return "INVALID_ACCOUNT_OWNER";
        case InstructionErrorType.ARITHMETIC_OVERFLOW:
            return "ARITHMETIC_OVERFLOW";
        case InstructionErrorType.UNSUPPORTED_SYSVAR:
            return "UNSUPPORTED_SYSVAR";
        case InstructionErrorType.ILLEGAL_OWNER:
            return "ILLEGAL_OWNER";
        case InstructionErrorType.MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED:
            return "MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED";
        case InstructionErrorType.MAX_ACCOUNTS_EXCEEDED:
            return "MAX_ACCOUNTS_EXCEEDED";
        case InstructionErrorType.MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED:
            return "MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED";
        case InstructionErrorType.BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS:
            return "BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS";
        case InstructionErrorType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.instructionErrorTypeToJSON = instructionErrorTypeToJSON;
function createBaseTransactionByAddr() {
    return { txByAddrs: [] };
}
exports.TransactionByAddr = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.txByAddrs) {
            exports.TransactionByAddrInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionByAddr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.txByAddrs.push(exports.TransactionByAddrInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            txByAddrs: Array.isArray(object === null || object === void 0 ? void 0 : object.txByAddrs)
                ? object.txByAddrs.map((e) => exports.TransactionByAddrInfo.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.txByAddrs) {
            obj.txByAddrs = message.txByAddrs.map((e) => e ? exports.TransactionByAddrInfo.toJSON(e) : undefined);
        }
        else {
            obj.txByAddrs = [];
        }
        return obj;
    },
    create(base) {
        return exports.TransactionByAddr.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTransactionByAddr();
        message.txByAddrs = ((_a = object.txByAddrs) === null || _a === void 0 ? void 0 : _a.map((e) => exports.TransactionByAddrInfo.fromPartial(e))) || [];
        return message;
    },
};
function createBaseTransactionByAddrInfo() {
    return { signature: new Uint8Array(), err: undefined, index: 0, memo: undefined, blockTime: undefined };
}
exports.TransactionByAddrInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.signature.length !== 0) {
            writer.uint32(10).bytes(message.signature);
        }
        if (message.err !== undefined) {
            exports.TransactionError.encode(message.err, writer.uint32(18).fork()).ldelim();
        }
        if (message.index !== 0) {
            writer.uint32(24).uint32(message.index);
        }
        if (message.memo !== undefined) {
            exports.Memo.encode(message.memo, writer.uint32(34).fork()).ldelim();
        }
        if (message.blockTime !== undefined) {
            exports.UnixTimestamp.encode(message.blockTime, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionByAddrInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signature = reader.bytes();
                    break;
                case 2:
                    message.err = exports.TransactionError.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.index = reader.uint32();
                    break;
                case 4:
                    message.memo = exports.Memo.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.blockTime = exports.UnixTimestamp.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
            err: isSet(object.err) ? exports.TransactionError.fromJSON(object.err) : undefined,
            index: isSet(object.index) ? Number(object.index) : 0,
            memo: isSet(object.memo) ? exports.Memo.fromJSON(object.memo) : undefined,
            blockTime: isSet(object.blockTime) ? exports.UnixTimestamp.fromJSON(object.blockTime) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
        message.err !== undefined && (obj.err = message.err ? exports.TransactionError.toJSON(message.err) : undefined);
        message.index !== undefined && (obj.index = Math.round(message.index));
        message.memo !== undefined && (obj.memo = message.memo ? exports.Memo.toJSON(message.memo) : undefined);
        message.blockTime !== undefined &&
            (obj.blockTime = message.blockTime ? exports.UnixTimestamp.toJSON(message.blockTime) : undefined);
        return obj;
    },
    create(base) {
        return exports.TransactionByAddrInfo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseTransactionByAddrInfo();
        message.signature = (_a = object.signature) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.err = (object.err !== undefined && object.err !== null)
            ? exports.TransactionError.fromPartial(object.err)
            : undefined;
        message.index = (_b = object.index) !== null && _b !== void 0 ? _b : 0;
        message.memo = (object.memo !== undefined && object.memo !== null) ? exports.Memo.fromPartial(object.memo) : undefined;
        message.blockTime = (object.blockTime !== undefined && object.blockTime !== null)
            ? exports.UnixTimestamp.fromPartial(object.blockTime)
            : undefined;
        return message;
    },
};
function createBaseMemo() {
    return { memo: "" };
}
exports.Memo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.memo !== "") {
            writer.uint32(10).string(message.memo);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMemo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.memo = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { memo: isSet(object.memo) ? String(object.memo) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.memo !== undefined && (obj.memo = message.memo);
        return obj;
    },
    create(base) {
        return exports.Memo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMemo();
        message.memo = (_a = object.memo) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseTransactionError() {
    return { transactionError: 0, instructionError: undefined, transactionDetails: undefined };
}
exports.TransactionError = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.transactionError !== 0) {
            writer.uint32(8).int32(message.transactionError);
        }
        if (message.instructionError !== undefined) {
            exports.InstructionError.encode(message.instructionError, writer.uint32(18).fork()).ldelim();
        }
        if (message.transactionDetails !== undefined) {
            exports.TransactionDetails.encode(message.transactionDetails, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionError();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.transactionError = reader.int32();
                    break;
                case 2:
                    message.instructionError = exports.InstructionError.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.transactionDetails = exports.TransactionDetails.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            transactionError: isSet(object.transactionError) ? transactionErrorTypeFromJSON(object.transactionError) : 0,
            instructionError: isSet(object.instructionError) ? exports.InstructionError.fromJSON(object.instructionError) : undefined,
            transactionDetails: isSet(object.transactionDetails)
                ? exports.TransactionDetails.fromJSON(object.transactionDetails)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.transactionError !== undefined &&
            (obj.transactionError = transactionErrorTypeToJSON(message.transactionError));
        message.instructionError !== undefined &&
            (obj.instructionError = message.instructionError ? exports.InstructionError.toJSON(message.instructionError) : undefined);
        message.transactionDetails !== undefined && (obj.transactionDetails = message.transactionDetails
            ? exports.TransactionDetails.toJSON(message.transactionDetails)
            : undefined);
        return obj;
    },
    create(base) {
        return exports.TransactionError.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTransactionError();
        message.transactionError = (_a = object.transactionError) !== null && _a !== void 0 ? _a : 0;
        message.instructionError = (object.instructionError !== undefined && object.instructionError !== null)
            ? exports.InstructionError.fromPartial(object.instructionError)
            : undefined;
        message.transactionDetails = (object.transactionDetails !== undefined && object.transactionDetails !== null)
            ? exports.TransactionDetails.fromPartial(object.transactionDetails)
            : undefined;
        return message;
    },
};
function createBaseInstructionError() {
    return { index: 0, error: 0, custom: undefined };
}
exports.InstructionError = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.index !== 0) {
            writer.uint32(8).uint32(message.index);
        }
        if (message.error !== 0) {
            writer.uint32(16).int32(message.error);
        }
        if (message.custom !== undefined) {
            exports.CustomError.encode(message.custom, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInstructionError();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.index = reader.uint32();
                    break;
                case 2:
                    message.error = reader.int32();
                    break;
                case 3:
                    message.custom = exports.CustomError.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            index: isSet(object.index) ? Number(object.index) : 0,
            error: isSet(object.error) ? instructionErrorTypeFromJSON(object.error) : 0,
            custom: isSet(object.custom) ? exports.CustomError.fromJSON(object.custom) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.index !== undefined && (obj.index = Math.round(message.index));
        message.error !== undefined && (obj.error = instructionErrorTypeToJSON(message.error));
        message.custom !== undefined && (obj.custom = message.custom ? exports.CustomError.toJSON(message.custom) : undefined);
        return obj;
    },
    create(base) {
        return exports.InstructionError.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseInstructionError();
        message.index = (_a = object.index) !== null && _a !== void 0 ? _a : 0;
        message.error = (_b = object.error) !== null && _b !== void 0 ? _b : 0;
        message.custom = (object.custom !== undefined && object.custom !== null)
            ? exports.CustomError.fromPartial(object.custom)
            : undefined;
        return message;
    },
};
function createBaseTransactionDetails() {
    return { index: 0 };
}
exports.TransactionDetails = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.index !== 0) {
            writer.uint32(8).uint32(message.index);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionDetails();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.index = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { index: isSet(object.index) ? Number(object.index) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.index !== undefined && (obj.index = Math.round(message.index));
        return obj;
    },
    create(base) {
        return exports.TransactionDetails.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTransactionDetails();
        message.index = (_a = object.index) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseUnixTimestamp() {
    return { timestamp: 0 };
}
exports.UnixTimestamp = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.timestamp !== 0) {
            writer.uint32(8).int64(message.timestamp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUnixTimestamp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.timestamp = longToNumber(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
        return obj;
    },
    create(base) {
        return exports.UnixTimestamp.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseUnixTimestamp();
        message.timestamp = (_a = object.timestamp) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseCustomError() {
    return { custom: 0 };
}
exports.CustomError = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.custom !== 0) {
            writer.uint32(8).uint32(message.custom);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCustomError();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.custom = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { custom: isSet(object.custom) ? Number(object.custom) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.custom !== undefined && (obj.custom = Math.round(message.custom));
        return obj;
    },
    create(base) {
        return exports.CustomError.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseCustomError();
        message.custom = (_a = object.custom) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
var tsProtoGlobalThis = (() => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
    if (tsProtoGlobalThis.Buffer) {
        return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = tsProtoGlobalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (tsProtoGlobalThis.Buffer) {
        return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(String.fromCharCode(byte));
        });
        return tsProtoGlobalThis.btoa(bin.join(""));
    }
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=transaction_by_addr.js.map