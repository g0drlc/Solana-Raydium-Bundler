"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInstructionErrorResponse = exports.KNOWN_PROGRAMS = exports.DexError = void 0;
const web3_js_1 = require("@solana/web3.js");
const tokens_and_markets_1 = require("./tokens_and_markets");
const token_instructions_1 = require("./token-instructions");
var DexError;
(function (DexError) {
    DexError[DexError["InvalidMarketFlags"] = 0] = "InvalidMarketFlags";
    DexError[DexError["InvalidAskFlags"] = 1] = "InvalidAskFlags";
    DexError[DexError["InvalidBidFlags"] = 2] = "InvalidBidFlags";
    DexError[DexError["InvalidQueueLength"] = 3] = "InvalidQueueLength";
    DexError[DexError["OwnerAccountNotProvided"] = 4] = "OwnerAccountNotProvided";
    DexError[DexError["ConsumeEventsQueueFailure"] = 5] = "ConsumeEventsQueueFailure";
    DexError[DexError["WrongCoinVault"] = 6] = "WrongCoinVault";
    DexError[DexError["WrongPcVault"] = 7] = "WrongPcVault";
    DexError[DexError["WrongCoinMint"] = 8] = "WrongCoinMint";
    DexError[DexError["WrongPcMint"] = 9] = "WrongPcMint";
    DexError[DexError["CoinVaultProgramId"] = 10] = "CoinVaultProgramId";
    DexError[DexError["PcVaultProgramId"] = 11] = "PcVaultProgramId";
    DexError[DexError["CoinMintProgramId"] = 12] = "CoinMintProgramId";
    DexError[DexError["PcMintProgramId"] = 13] = "PcMintProgramId";
    DexError[DexError["WrongCoinMintSize"] = 14] = "WrongCoinMintSize";
    DexError[DexError["WrongPcMintSize"] = 15] = "WrongPcMintSize";
    DexError[DexError["WrongCoinVaultSize"] = 16] = "WrongCoinVaultSize";
    DexError[DexError["WrongPcVaultSize"] = 17] = "WrongPcVaultSize";
    DexError[DexError["UninitializedVault"] = 18] = "UninitializedVault";
    DexError[DexError["UninitializedMint"] = 19] = "UninitializedMint";
    DexError[DexError["CoinMintUninitialized"] = 20] = "CoinMintUninitialized";
    DexError[DexError["PcMintUninitialized"] = 21] = "PcMintUninitialized";
    DexError[DexError["WrongMint"] = 22] = "WrongMint";
    DexError[DexError["WrongVaultOwner"] = 23] = "WrongVaultOwner";
    DexError[DexError["VaultHasDelegate"] = 24] = "VaultHasDelegate";
    DexError[DexError["AlreadyInitialized"] = 25] = "AlreadyInitialized";
    DexError[DexError["WrongAccountDataAlignment"] = 26] = "WrongAccountDataAlignment";
    DexError[DexError["WrongAccountDataPaddingLength"] = 27] = "WrongAccountDataPaddingLength";
    DexError[DexError["WrongAccountHeadPadding"] = 28] = "WrongAccountHeadPadding";
    DexError[DexError["WrongAccountTailPadding"] = 29] = "WrongAccountTailPadding";
    DexError[DexError["RequestQueueEmpty"] = 30] = "RequestQueueEmpty";
    DexError[DexError["EventQueueTooSmall"] = 31] = "EventQueueTooSmall";
    DexError[DexError["SlabTooSmall"] = 32] = "SlabTooSmall";
    DexError[DexError["BadVaultSignerNonce"] = 33] = "BadVaultSignerNonce";
    DexError[DexError["InsufficientFunds"] = 34] = "InsufficientFunds";
    DexError[DexError["SplAccountProgramId"] = 35] = "SplAccountProgramId";
    DexError[DexError["SplAccountLen"] = 36] = "SplAccountLen";
    DexError[DexError["WrongFeeDiscountAccountOwner"] = 37] = "WrongFeeDiscountAccountOwner";
    DexError[DexError["WrongFeeDiscountMint"] = 38] = "WrongFeeDiscountMint";
    DexError[DexError["CoinPayerProgramId"] = 39] = "CoinPayerProgramId";
    DexError[DexError["PcPayerProgramId"] = 40] = "PcPayerProgramId";
    DexError[DexError["ClientIdNotFound"] = 41] = "ClientIdNotFound";
    DexError[DexError["TooManyOpenOrders"] = 42] = "TooManyOpenOrders";
    DexError[DexError["FakeErrorSoWeDontChangeNumbers"] = 43] = "FakeErrorSoWeDontChangeNumbers";
    DexError[DexError["BorrowError"] = 44] = "BorrowError";
    DexError[DexError["WrongOrdersAccount"] = 45] = "WrongOrdersAccount";
    DexError[DexError["WrongBidsAccount"] = 46] = "WrongBidsAccount";
    DexError[DexError["WrongAsksAccount"] = 47] = "WrongAsksAccount";
    DexError[DexError["WrongRequestQueueAccount"] = 48] = "WrongRequestQueueAccount";
    DexError[DexError["WrongEventQueueAccount"] = 49] = "WrongEventQueueAccount";
    DexError[DexError["RequestQueueFull"] = 50] = "RequestQueueFull";
    DexError[DexError["EventQueueFull"] = 51] = "EventQueueFull";
    DexError[DexError["MarketIsDisabled"] = 52] = "MarketIsDisabled";
    DexError[DexError["WrongSigner"] = 53] = "WrongSigner";
    DexError[DexError["TransferFailed"] = 54] = "TransferFailed";
    DexError[DexError["ClientOrderIdIsZero"] = 55] = "ClientOrderIdIsZero";
    DexError[DexError["WrongRentSysvarAccount"] = 56] = "WrongRentSysvarAccount";
    DexError[DexError["RentNotProvided"] = 57] = "RentNotProvided";
    DexError[DexError["OrdersNotRentExempt"] = 58] = "OrdersNotRentExempt";
    DexError[DexError["OrderNotFound"] = 59] = "OrderNotFound";
    DexError[DexError["OrderNotYours"] = 60] = "OrderNotYours";
    DexError[DexError["WouldSelfTrade"] = 61] = "WouldSelfTrade";
    DexError[DexError["Unknown"] = 1000] = "Unknown";
})(DexError = exports.DexError || (exports.DexError = {}));
exports.KNOWN_PROGRAMS = {
    [token_instructions_1.TOKEN_PROGRAM_ID.toString()]: 'Token program',
    [web3_js_1.SystemProgram.programId.toString()]: 'System program',
};
function parseInstructionErrorResponse(transaction, errorResponse) {
    const [failedInstructionIndex, customError] = errorResponse;
    const failedInstruction = transaction.instructions[failedInstructionIndex];
    let parsedError;
    if (failedInstruction.programId.toString() in tokens_and_markets_1.PROGRAM_LAYOUT_VERSIONS) {
        parsedError = DexError[customError['Custom']];
    }
    else if (failedInstruction.programId.toString() in exports.KNOWN_PROGRAMS) {
        const program = exports.KNOWN_PROGRAMS[failedInstruction.programId.toString()];
        parsedError = `${program} error ${customError['Custom']}`;
    }
    else {
        parsedError = `Unknown program ${failedInstruction.programId.toString()} custom error: ${customError['Custom']}`;
    }
    return {
        failedInstructionIndex,
        error: parsedError,
        failedProgram: failedInstruction.programId.toString(),
    };
}
exports.parseInstructionErrorResponse = parseInstructionErrorResponse;
//# sourceMappingURL=error.js.map