import { Transaction } from '@solana/web3.js';
export declare enum DexError {
    InvalidMarketFlags = 0,
    InvalidAskFlags = 1,
    InvalidBidFlags = 2,
    InvalidQueueLength = 3,
    OwnerAccountNotProvided = 4,
    ConsumeEventsQueueFailure = 5,
    WrongCoinVault = 6,
    WrongPcVault = 7,
    WrongCoinMint = 8,
    WrongPcMint = 9,
    CoinVaultProgramId = 10,
    PcVaultProgramId = 11,
    CoinMintProgramId = 12,
    PcMintProgramId = 13,
    WrongCoinMintSize = 14,
    WrongPcMintSize = 15,
    WrongCoinVaultSize = 16,
    WrongPcVaultSize = 17,
    UninitializedVault = 18,
    UninitializedMint = 19,
    CoinMintUninitialized = 20,
    PcMintUninitialized = 21,
    WrongMint = 22,
    WrongVaultOwner = 23,
    VaultHasDelegate = 24,
    AlreadyInitialized = 25,
    WrongAccountDataAlignment = 26,
    WrongAccountDataPaddingLength = 27,
    WrongAccountHeadPadding = 28,
    WrongAccountTailPadding = 29,
    RequestQueueEmpty = 30,
    EventQueueTooSmall = 31,
    SlabTooSmall = 32,
    BadVaultSignerNonce = 33,
    InsufficientFunds = 34,
    SplAccountProgramId = 35,
    SplAccountLen = 36,
    WrongFeeDiscountAccountOwner = 37,
    WrongFeeDiscountMint = 38,
    CoinPayerProgramId = 39,
    PcPayerProgramId = 40,
    ClientIdNotFound = 41,
    TooManyOpenOrders = 42,
    FakeErrorSoWeDontChangeNumbers = 43,
    BorrowError = 44,
    WrongOrdersAccount = 45,
    WrongBidsAccount = 46,
    WrongAsksAccount = 47,
    WrongRequestQueueAccount = 48,
    WrongEventQueueAccount = 49,
    RequestQueueFull = 50,
    EventQueueFull = 51,
    MarketIsDisabled = 52,
    WrongSigner = 53,
    TransferFailed = 54,
    ClientOrderIdIsZero = 55,
    WrongRentSysvarAccount = 56,
    RentNotProvided = 57,
    OrdersNotRentExempt = 58,
    OrderNotFound = 59,
    OrderNotYours = 60,
    WouldSelfTrade = 61,
    Unknown = 1000
}
export declare const KNOWN_PROGRAMS: {
    [x: string]: string;
};
declare type CustomError = {
    Custom: number;
};
declare type InstructionError = [number, CustomError];
export declare function parseInstructionErrorResponse(transaction: Transaction, errorResponse: InstructionError): {
    failedInstructionIndex: number;
    error: string;
    failedProgram: string;
};
export {};
//# sourceMappingURL=error.d.ts.map