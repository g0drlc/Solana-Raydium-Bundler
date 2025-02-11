import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "solana.storage.ConfirmedBlock";
export declare enum RewardType {
    Unspecified = 0,
    Fee = 1,
    Rent = 2,
    Staking = 3,
    Voting = 4,
    UNRECOGNIZED = -1
}
export declare function rewardTypeFromJSON(object: any): RewardType;
export declare function rewardTypeToJSON(object: RewardType): string;
export interface ConfirmedBlock {
    previousBlockhash: string;
    blockhash: string;
    parentSlot: number;
    transactions: ConfirmedTransaction[];
    rewards: Reward[];
    blockTime: UnixTimestamp | undefined;
    blockHeight: BlockHeight | undefined;
}
export interface ConfirmedTransaction {
    transaction: Transaction | undefined;
    meta: TransactionStatusMeta | undefined;
}
export interface Transaction {
    signatures: Uint8Array[];
    message: Message | undefined;
}
export interface Message {
    header: MessageHeader | undefined;
    accountKeys: Uint8Array[];
    recentBlockhash: Uint8Array;
    instructions: CompiledInstruction[];
    versioned: boolean;
    addressTableLookups: MessageAddressTableLookup[];
}
export interface MessageHeader {
    numRequiredSignatures: number;
    numReadonlySignedAccounts: number;
    numReadonlyUnsignedAccounts: number;
}
export interface MessageAddressTableLookup {
    accountKey: Uint8Array;
    writableIndexes: Uint8Array;
    readonlyIndexes: Uint8Array;
}
export interface TransactionStatusMeta {
    err: TransactionError | undefined;
    fee: number;
    preBalances: number[];
    postBalances: number[];
    innerInstructions: InnerInstructions[];
    innerInstructionsNone: boolean;
    logMessages: string[];
    logMessagesNone: boolean;
    preTokenBalances: TokenBalance[];
    postTokenBalances: TokenBalance[];
    rewards: Reward[];
    loadedWritableAddresses: Uint8Array[];
    loadedReadonlyAddresses: Uint8Array[];
    returnData: ReturnData | undefined;
    returnDataNone: boolean;
    /**
     * Sum of compute units consumed by all instructions.
     * Available since Solana v1.10.35 / v1.11.6.
     * Set to `None` for txs executed on earlier versions.
     */
    computeUnitsConsumed?: number | undefined;
}
export interface TransactionError {
    err: Uint8Array;
}
export interface InnerInstructions {
    index: number;
    instructions: InnerInstruction[];
}
export interface InnerInstruction {
    programIdIndex: number;
    accounts: Uint8Array;
    data: Uint8Array;
    /**
     * Invocation stack height of an inner instruction.
     * Available since Solana v1.14.6
     * Set to `None` for txs executed on earlier versions.
     */
    stackHeight?: number | undefined;
}
export interface CompiledInstruction {
    programIdIndex: number;
    accounts: Uint8Array;
    data: Uint8Array;
}
export interface TokenBalance {
    accountIndex: number;
    mint: string;
    uiTokenAmount: UiTokenAmount | undefined;
    owner: string;
    programId: string;
}
export interface UiTokenAmount {
    uiAmount: number;
    decimals: number;
    amount: string;
    uiAmountString: string;
}
export interface ReturnData {
    programId: Uint8Array;
    data: Uint8Array;
}
export interface Reward {
    pubkey: string;
    lamports: number;
    postBalance: number;
    rewardType: RewardType;
    commission: string;
}
export interface Rewards {
    rewards: Reward[];
}
export interface UnixTimestamp {
    timestamp: number;
}
export interface BlockHeight {
    blockHeight: number;
}
export declare const ConfirmedBlock: {
    encode(message: ConfirmedBlock, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmedBlock;
    fromJSON(object: any): ConfirmedBlock;
    toJSON(message: ConfirmedBlock): unknown;
    create<I extends {
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        transactions?: {
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        }[] | undefined;
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
        blockTime?: {
            timestamp?: number | undefined;
        } | undefined;
        blockHeight?: {
            blockHeight?: number | undefined;
        } | undefined;
    } & {
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        transactions?: ({
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        }[] & ({
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        } & {
            transaction?: ({
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } & {
                signatures?: (Uint8Array[] & Uint8Array[] & { [K in Exclude<keyof I["transactions"][number]["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
                message?: ({
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } & {
                    header?: ({
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } & {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } & { [K_1 in Exclude<keyof I["transactions"][number]["transaction"]["message"]["header"], keyof MessageHeader>]: never; }) | undefined;
                    accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_2 in Exclude<keyof I["transactions"][number]["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] & ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & { [K_3 in Exclude<keyof I["transactions"][number]["transaction"]["message"]["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_4 in Exclude<keyof I["transactions"][number]["transaction"]["message"]["instructions"], keyof {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[]>]: never; }) | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: ({
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] & ({
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    } & {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    } & { [K_5 in Exclude<keyof I["transactions"][number]["transaction"]["message"]["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_6 in Exclude<keyof I["transactions"][number]["transaction"]["message"]["addressTableLookups"], keyof {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_7 in Exclude<keyof I["transactions"][number]["transaction"]["message"], keyof Message>]: never; }) | undefined;
            } & { [K_8 in Exclude<keyof I["transactions"][number]["transaction"], keyof Transaction>]: never; }) | undefined;
            meta?: ({
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } & {
                err?: ({
                    err?: Uint8Array | undefined;
                } & {
                    err?: Uint8Array | undefined;
                } & { [K_9 in Exclude<keyof I["transactions"][number]["meta"]["err"], "err">]: never; }) | undefined;
                fee?: number | undefined;
                preBalances?: (number[] & number[] & { [K_10 in Exclude<keyof I["transactions"][number]["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
                postBalances?: (number[] & number[] & { [K_11 in Exclude<keyof I["transactions"][number]["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
                innerInstructions?: ({
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] & ({
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                } & {
                    index?: number | undefined;
                    instructions?: ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] & ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    } & {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    } & { [K_12 in Exclude<keyof I["transactions"][number]["meta"]["innerInstructions"][number]["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_13 in Exclude<keyof I["transactions"][number]["meta"]["innerInstructions"][number]["instructions"], keyof {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_14 in Exclude<keyof I["transactions"][number]["meta"]["innerInstructions"][number], keyof InnerInstructions>]: never; })[] & { [K_15 in Exclude<keyof I["transactions"][number]["meta"]["innerInstructions"], keyof {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[]>]: never; }) | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: (string[] & string[] & { [K_16 in Exclude<keyof I["transactions"][number]["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] & ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: ({
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & { [K_17 in Exclude<keyof I["transactions"][number]["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_18 in Exclude<keyof I["transactions"][number]["meta"]["preTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_19 in Exclude<keyof I["transactions"][number]["meta"]["preTokenBalances"], keyof {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[]>]: never; }) | undefined;
                postTokenBalances?: ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] & ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: ({
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & { [K_20 in Exclude<keyof I["transactions"][number]["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_21 in Exclude<keyof I["transactions"][number]["meta"]["postTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_22 in Exclude<keyof I["transactions"][number]["meta"]["postTokenBalances"], keyof {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[]>]: never; }) | undefined;
                rewards?: ({
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] & ({
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                } & {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                } & { [K_23 in Exclude<keyof I["transactions"][number]["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_24 in Exclude<keyof I["transactions"][number]["meta"]["rewards"], keyof {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[]>]: never; }) | undefined;
                loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_25 in Exclude<keyof I["transactions"][number]["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_26 in Exclude<keyof I["transactions"][number]["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                returnData?: ({
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & { [K_27 in Exclude<keyof I["transactions"][number]["meta"]["returnData"], keyof ReturnData>]: never; }) | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } & { [K_28 in Exclude<keyof I["transactions"][number]["meta"], keyof TransactionStatusMeta>]: never; }) | undefined;
        } & { [K_29 in Exclude<keyof I["transactions"][number], keyof ConfirmedTransaction>]: never; })[] & { [K_30 in Exclude<keyof I["transactions"], keyof {
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & { [K_31 in Exclude<keyof I["rewards"][number], keyof Reward>]: never; })[] & { [K_32 in Exclude<keyof I["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
        blockTime?: ({
            timestamp?: number | undefined;
        } & {
            timestamp?: number | undefined;
        } & { [K_33 in Exclude<keyof I["blockTime"], "timestamp">]: never; }) | undefined;
        blockHeight?: ({
            blockHeight?: number | undefined;
        } & {
            blockHeight?: number | undefined;
        } & { [K_34 in Exclude<keyof I["blockHeight"], "blockHeight">]: never; }) | undefined;
    } & { [K_35 in Exclude<keyof I, keyof ConfirmedBlock>]: never; }>(base?: I | undefined): ConfirmedBlock;
    fromPartial<I_1 extends {
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        transactions?: {
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        }[] | undefined;
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
        blockTime?: {
            timestamp?: number | undefined;
        } | undefined;
        blockHeight?: {
            blockHeight?: number | undefined;
        } | undefined;
    } & {
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        transactions?: ({
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        }[] & ({
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        } & {
            transaction?: ({
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } & {
                signatures?: (Uint8Array[] & Uint8Array[] & { [K_36 in Exclude<keyof I_1["transactions"][number]["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
                message?: ({
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } & {
                    header?: ({
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } & {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } & { [K_37 in Exclude<keyof I_1["transactions"][number]["transaction"]["message"]["header"], keyof MessageHeader>]: never; }) | undefined;
                    accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_38 in Exclude<keyof I_1["transactions"][number]["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] & ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & { [K_39 in Exclude<keyof I_1["transactions"][number]["transaction"]["message"]["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_40 in Exclude<keyof I_1["transactions"][number]["transaction"]["message"]["instructions"], keyof {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[]>]: never; }) | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: ({
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] & ({
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    } & {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    } & { [K_41 in Exclude<keyof I_1["transactions"][number]["transaction"]["message"]["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_42 in Exclude<keyof I_1["transactions"][number]["transaction"]["message"]["addressTableLookups"], keyof {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_43 in Exclude<keyof I_1["transactions"][number]["transaction"]["message"], keyof Message>]: never; }) | undefined;
            } & { [K_44 in Exclude<keyof I_1["transactions"][number]["transaction"], keyof Transaction>]: never; }) | undefined;
            meta?: ({
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } & {
                err?: ({
                    err?: Uint8Array | undefined;
                } & {
                    err?: Uint8Array | undefined;
                } & { [K_45 in Exclude<keyof I_1["transactions"][number]["meta"]["err"], "err">]: never; }) | undefined;
                fee?: number | undefined;
                preBalances?: (number[] & number[] & { [K_46 in Exclude<keyof I_1["transactions"][number]["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
                postBalances?: (number[] & number[] & { [K_47 in Exclude<keyof I_1["transactions"][number]["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
                innerInstructions?: ({
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] & ({
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                } & {
                    index?: number | undefined;
                    instructions?: ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] & ({
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    } & {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    } & { [K_48 in Exclude<keyof I_1["transactions"][number]["meta"]["innerInstructions"][number]["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_49 in Exclude<keyof I_1["transactions"][number]["meta"]["innerInstructions"][number]["instructions"], keyof {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_50 in Exclude<keyof I_1["transactions"][number]["meta"]["innerInstructions"][number], keyof InnerInstructions>]: never; })[] & { [K_51 in Exclude<keyof I_1["transactions"][number]["meta"]["innerInstructions"], keyof {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[]>]: never; }) | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: (string[] & string[] & { [K_52 in Exclude<keyof I_1["transactions"][number]["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] & ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: ({
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & { [K_53 in Exclude<keyof I_1["transactions"][number]["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_54 in Exclude<keyof I_1["transactions"][number]["meta"]["preTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_55 in Exclude<keyof I_1["transactions"][number]["meta"]["preTokenBalances"], keyof {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[]>]: never; }) | undefined;
                postTokenBalances?: ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] & ({
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: ({
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } & { [K_56 in Exclude<keyof I_1["transactions"][number]["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_57 in Exclude<keyof I_1["transactions"][number]["meta"]["postTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_58 in Exclude<keyof I_1["transactions"][number]["meta"]["postTokenBalances"], keyof {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[]>]: never; }) | undefined;
                rewards?: ({
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] & ({
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                } & {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                } & { [K_59 in Exclude<keyof I_1["transactions"][number]["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_60 in Exclude<keyof I_1["transactions"][number]["meta"]["rewards"], keyof {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[]>]: never; }) | undefined;
                loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_61 in Exclude<keyof I_1["transactions"][number]["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_62 in Exclude<keyof I_1["transactions"][number]["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                returnData?: ({
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & { [K_63 in Exclude<keyof I_1["transactions"][number]["meta"]["returnData"], keyof ReturnData>]: never; }) | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } & { [K_64 in Exclude<keyof I_1["transactions"][number]["meta"], keyof TransactionStatusMeta>]: never; }) | undefined;
        } & { [K_65 in Exclude<keyof I_1["transactions"][number], keyof ConfirmedTransaction>]: never; })[] & { [K_66 in Exclude<keyof I_1["transactions"], keyof {
            transaction?: {
                signatures?: Uint8Array[] | undefined;
                message?: {
                    header?: {
                        numRequiredSignatures?: number | undefined;
                        numReadonlySignedAccounts?: number | undefined;
                        numReadonlyUnsignedAccounts?: number | undefined;
                    } | undefined;
                    accountKeys?: Uint8Array[] | undefined;
                    recentBlockhash?: Uint8Array | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    }[] | undefined;
                    versioned?: boolean | undefined;
                    addressTableLookups?: {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[] | undefined;
                } | undefined;
            } | undefined;
            meta?: {
                err?: {
                    err?: Uint8Array | undefined;
                } | undefined;
                fee?: number | undefined;
                preBalances?: number[] | undefined;
                postBalances?: number[] | undefined;
                innerInstructions?: {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: string[] | undefined;
                logMessagesNone?: boolean | undefined;
                preTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                postTokenBalances?: {
                    accountIndex?: number | undefined;
                    mint?: string | undefined;
                    uiTokenAmount?: {
                        uiAmount?: number | undefined;
                        decimals?: number | undefined;
                        amount?: string | undefined;
                        uiAmountString?: string | undefined;
                    } | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                }[] | undefined;
                rewards?: {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: RewardType | undefined;
                    commission?: string | undefined;
                }[] | undefined;
                loadedWritableAddresses?: Uint8Array[] | undefined;
                loadedReadonlyAddresses?: Uint8Array[] | undefined;
                returnData?: {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & { [K_67 in Exclude<keyof I_1["rewards"][number], keyof Reward>]: never; })[] & { [K_68 in Exclude<keyof I_1["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
        blockTime?: ({
            timestamp?: number | undefined;
        } & {
            timestamp?: number | undefined;
        } & { [K_69 in Exclude<keyof I_1["blockTime"], "timestamp">]: never; }) | undefined;
        blockHeight?: ({
            blockHeight?: number | undefined;
        } & {
            blockHeight?: number | undefined;
        } & { [K_70 in Exclude<keyof I_1["blockHeight"], "blockHeight">]: never; }) | undefined;
    } & { [K_71 in Exclude<keyof I_1, keyof ConfirmedBlock>]: never; }>(object: I_1): ConfirmedBlock;
};
export declare const ConfirmedTransaction: {
    encode(message: ConfirmedTransaction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmedTransaction;
    fromJSON(object: any): ConfirmedTransaction;
    toJSON(message: ConfirmedTransaction): unknown;
    create<I extends {
        transaction?: {
            signatures?: Uint8Array[] | undefined;
            message?: {
                header?: {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } | undefined;
                accountKeys?: Uint8Array[] | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] | undefined;
            } | undefined;
        } | undefined;
        meta?: {
            err?: {
                err?: Uint8Array | undefined;
            } | undefined;
            fee?: number | undefined;
            preBalances?: number[] | undefined;
            postBalances?: number[] | undefined;
            innerInstructions?: {
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
            innerInstructionsNone?: boolean | undefined;
            logMessages?: string[] | undefined;
            logMessagesNone?: boolean | undefined;
            preTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            postTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            loadedWritableAddresses?: Uint8Array[] | undefined;
            loadedReadonlyAddresses?: Uint8Array[] | undefined;
            returnData?: {
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } | undefined;
            returnDataNone?: boolean | undefined;
            computeUnitsConsumed?: number | undefined;
        } | undefined;
    } & {
        transaction?: ({
            signatures?: Uint8Array[] | undefined;
            message?: {
                header?: {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } | undefined;
                accountKeys?: Uint8Array[] | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] | undefined;
            } | undefined;
        } & {
            signatures?: (Uint8Array[] & Uint8Array[] & { [K in Exclude<keyof I["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
            message?: ({
                header?: {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } | undefined;
                accountKeys?: Uint8Array[] | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] | undefined;
            } & {
                header?: ({
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } & {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } & { [K_1 in Exclude<keyof I["transaction"]["message"]["header"], keyof MessageHeader>]: never; }) | undefined;
                accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_2 in Exclude<keyof I["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] & ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & { [K_3 in Exclude<keyof I["transaction"]["message"]["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_4 in Exclude<keyof I["transaction"]["message"]["instructions"], keyof {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[]>]: never; }) | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: ({
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] & ({
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                } & {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                } & { [K_5 in Exclude<keyof I["transaction"]["message"]["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_6 in Exclude<keyof I["transaction"]["message"]["addressTableLookups"], keyof {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_7 in Exclude<keyof I["transaction"]["message"], keyof Message>]: never; }) | undefined;
        } & { [K_8 in Exclude<keyof I["transaction"], keyof Transaction>]: never; }) | undefined;
        meta?: ({
            err?: {
                err?: Uint8Array | undefined;
            } | undefined;
            fee?: number | undefined;
            preBalances?: number[] | undefined;
            postBalances?: number[] | undefined;
            innerInstructions?: {
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
            innerInstructionsNone?: boolean | undefined;
            logMessages?: string[] | undefined;
            logMessagesNone?: boolean | undefined;
            preTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            postTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            loadedWritableAddresses?: Uint8Array[] | undefined;
            loadedReadonlyAddresses?: Uint8Array[] | undefined;
            returnData?: {
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } | undefined;
            returnDataNone?: boolean | undefined;
            computeUnitsConsumed?: number | undefined;
        } & {
            err?: ({
                err?: Uint8Array | undefined;
            } & {
                err?: Uint8Array | undefined;
            } & { [K_9 in Exclude<keyof I["meta"]["err"], "err">]: never; }) | undefined;
            fee?: number | undefined;
            preBalances?: (number[] & number[] & { [K_10 in Exclude<keyof I["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
            postBalances?: (number[] & number[] & { [K_11 in Exclude<keyof I["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
            innerInstructions?: ({
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[] & ({
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            } & {
                index?: number | undefined;
                instructions?: ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] & ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                } & {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                } & { [K_12 in Exclude<keyof I["meta"]["innerInstructions"][number]["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_13 in Exclude<keyof I["meta"]["innerInstructions"][number]["instructions"], keyof {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_14 in Exclude<keyof I["meta"]["innerInstructions"][number], keyof InnerInstructions>]: never; })[] & { [K_15 in Exclude<keyof I["meta"]["innerInstructions"], keyof {
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[]>]: never; }) | undefined;
            innerInstructionsNone?: boolean | undefined;
            logMessages?: (string[] & string[] & { [K_16 in Exclude<keyof I["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
            logMessagesNone?: boolean | undefined;
            preTokenBalances?: ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] & ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: ({
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & { [K_17 in Exclude<keyof I["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & { [K_18 in Exclude<keyof I["meta"]["preTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_19 in Exclude<keyof I["meta"]["preTokenBalances"], keyof {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[]>]: never; }) | undefined;
            postTokenBalances?: ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] & ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: ({
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & { [K_20 in Exclude<keyof I["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & { [K_21 in Exclude<keyof I["meta"]["postTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_22 in Exclude<keyof I["meta"]["postTokenBalances"], keyof {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[]>]: never; }) | undefined;
            rewards?: ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[] & ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            } & {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            } & { [K_23 in Exclude<keyof I["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_24 in Exclude<keyof I["meta"]["rewards"], keyof {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[]>]: never; }) | undefined;
            loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_25 in Exclude<keyof I["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
            loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_26 in Exclude<keyof I["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
            returnData?: ({
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & {
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & { [K_27 in Exclude<keyof I["meta"]["returnData"], keyof ReturnData>]: never; }) | undefined;
            returnDataNone?: boolean | undefined;
            computeUnitsConsumed?: number | undefined;
        } & { [K_28 in Exclude<keyof I["meta"], keyof TransactionStatusMeta>]: never; }) | undefined;
    } & { [K_29 in Exclude<keyof I, keyof ConfirmedTransaction>]: never; }>(base?: I | undefined): ConfirmedTransaction;
    fromPartial<I_1 extends {
        transaction?: {
            signatures?: Uint8Array[] | undefined;
            message?: {
                header?: {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } | undefined;
                accountKeys?: Uint8Array[] | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] | undefined;
            } | undefined;
        } | undefined;
        meta?: {
            err?: {
                err?: Uint8Array | undefined;
            } | undefined;
            fee?: number | undefined;
            preBalances?: number[] | undefined;
            postBalances?: number[] | undefined;
            innerInstructions?: {
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
            innerInstructionsNone?: boolean | undefined;
            logMessages?: string[] | undefined;
            logMessagesNone?: boolean | undefined;
            preTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            postTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            loadedWritableAddresses?: Uint8Array[] | undefined;
            loadedReadonlyAddresses?: Uint8Array[] | undefined;
            returnData?: {
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } | undefined;
            returnDataNone?: boolean | undefined;
            computeUnitsConsumed?: number | undefined;
        } | undefined;
    } & {
        transaction?: ({
            signatures?: Uint8Array[] | undefined;
            message?: {
                header?: {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } | undefined;
                accountKeys?: Uint8Array[] | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] | undefined;
            } | undefined;
        } & {
            signatures?: (Uint8Array[] & Uint8Array[] & { [K_30 in Exclude<keyof I_1["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
            message?: ({
                header?: {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } | undefined;
                accountKeys?: Uint8Array[] | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] | undefined;
            } & {
                header?: ({
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } & {
                    numRequiredSignatures?: number | undefined;
                    numReadonlySignedAccounts?: number | undefined;
                    numReadonlyUnsignedAccounts?: number | undefined;
                } & { [K_31 in Exclude<keyof I_1["transaction"]["message"]["header"], keyof MessageHeader>]: never; }) | undefined;
                accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_32 in Exclude<keyof I_1["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
                recentBlockhash?: Uint8Array | undefined;
                instructions?: ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[] & ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & { [K_33 in Exclude<keyof I_1["transaction"]["message"]["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_34 in Exclude<keyof I_1["transaction"]["message"]["instructions"], keyof {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                }[]>]: never; }) | undefined;
                versioned?: boolean | undefined;
                addressTableLookups?: ({
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[] & ({
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                } & {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                } & { [K_35 in Exclude<keyof I_1["transaction"]["message"]["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_36 in Exclude<keyof I_1["transaction"]["message"]["addressTableLookups"], keyof {
                    accountKey?: Uint8Array | undefined;
                    writableIndexes?: Uint8Array | undefined;
                    readonlyIndexes?: Uint8Array | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_37 in Exclude<keyof I_1["transaction"]["message"], keyof Message>]: never; }) | undefined;
        } & { [K_38 in Exclude<keyof I_1["transaction"], keyof Transaction>]: never; }) | undefined;
        meta?: ({
            err?: {
                err?: Uint8Array | undefined;
            } | undefined;
            fee?: number | undefined;
            preBalances?: number[] | undefined;
            postBalances?: number[] | undefined;
            innerInstructions?: {
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
            innerInstructionsNone?: boolean | undefined;
            logMessages?: string[] | undefined;
            logMessagesNone?: boolean | undefined;
            preTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            postTokenBalances?: {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            loadedWritableAddresses?: Uint8Array[] | undefined;
            loadedReadonlyAddresses?: Uint8Array[] | undefined;
            returnData?: {
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } | undefined;
            returnDataNone?: boolean | undefined;
            computeUnitsConsumed?: number | undefined;
        } & {
            err?: ({
                err?: Uint8Array | undefined;
            } & {
                err?: Uint8Array | undefined;
            } & { [K_39 in Exclude<keyof I_1["meta"]["err"], "err">]: never; }) | undefined;
            fee?: number | undefined;
            preBalances?: (number[] & number[] & { [K_40 in Exclude<keyof I_1["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
            postBalances?: (number[] & number[] & { [K_41 in Exclude<keyof I_1["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
            innerInstructions?: ({
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[] & ({
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            } & {
                index?: number | undefined;
                instructions?: ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] & ({
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                } & {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                } & { [K_42 in Exclude<keyof I_1["meta"]["innerInstructions"][number]["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_43 in Exclude<keyof I_1["meta"]["innerInstructions"][number]["instructions"], keyof {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_44 in Exclude<keyof I_1["meta"]["innerInstructions"][number], keyof InnerInstructions>]: never; })[] & { [K_45 in Exclude<keyof I_1["meta"]["innerInstructions"], keyof {
                index?: number | undefined;
                instructions?: {
                    programIdIndex?: number | undefined;
                    accounts?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                    stackHeight?: number | undefined;
                }[] | undefined;
            }[]>]: never; }) | undefined;
            innerInstructionsNone?: boolean | undefined;
            logMessages?: (string[] & string[] & { [K_46 in Exclude<keyof I_1["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
            logMessagesNone?: boolean | undefined;
            preTokenBalances?: ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] & ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: ({
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & { [K_47 in Exclude<keyof I_1["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & { [K_48 in Exclude<keyof I_1["meta"]["preTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_49 in Exclude<keyof I_1["meta"]["preTokenBalances"], keyof {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[]>]: never; }) | undefined;
            postTokenBalances?: ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[] & ({
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: ({
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } & { [K_50 in Exclude<keyof I_1["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            } & { [K_51 in Exclude<keyof I_1["meta"]["postTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_52 in Exclude<keyof I_1["meta"]["postTokenBalances"], keyof {
                accountIndex?: number | undefined;
                mint?: string | undefined;
                uiTokenAmount?: {
                    uiAmount?: number | undefined;
                    decimals?: number | undefined;
                    amount?: string | undefined;
                    uiAmountString?: string | undefined;
                } | undefined;
                owner?: string | undefined;
                programId?: string | undefined;
            }[]>]: never; }) | undefined;
            rewards?: ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[] & ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            } & {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            } & { [K_53 in Exclude<keyof I_1["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_54 in Exclude<keyof I_1["meta"]["rewards"], keyof {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: RewardType | undefined;
                commission?: string | undefined;
            }[]>]: never; }) | undefined;
            loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_55 in Exclude<keyof I_1["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
            loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_56 in Exclude<keyof I_1["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
            returnData?: ({
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & {
                programId?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & { [K_57 in Exclude<keyof I_1["meta"]["returnData"], keyof ReturnData>]: never; }) | undefined;
            returnDataNone?: boolean | undefined;
            computeUnitsConsumed?: number | undefined;
        } & { [K_58 in Exclude<keyof I_1["meta"], keyof TransactionStatusMeta>]: never; }) | undefined;
    } & { [K_59 in Exclude<keyof I_1, keyof ConfirmedTransaction>]: never; }>(object: I_1): ConfirmedTransaction;
};
export declare const Transaction: {
    encode(message: Transaction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Transaction;
    fromJSON(object: any): Transaction;
    toJSON(message: Transaction): unknown;
    create<I extends {
        signatures?: Uint8Array[] | undefined;
        message?: {
            header?: {
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } | undefined;
            accountKeys?: Uint8Array[] | undefined;
            recentBlockhash?: Uint8Array | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[] | undefined;
            versioned?: boolean | undefined;
            addressTableLookups?: {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[] | undefined;
        } | undefined;
    } & {
        signatures?: (Uint8Array[] & Uint8Array[] & { [K in Exclude<keyof I["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
        message?: ({
            header?: {
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } | undefined;
            accountKeys?: Uint8Array[] | undefined;
            recentBlockhash?: Uint8Array | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[] | undefined;
            versioned?: boolean | undefined;
            addressTableLookups?: {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[] | undefined;
        } & {
            header?: ({
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } & {
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } & { [K_1 in Exclude<keyof I["message"]["header"], keyof MessageHeader>]: never; }) | undefined;
            accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_2 in Exclude<keyof I["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
            recentBlockhash?: Uint8Array | undefined;
            instructions?: ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[] & ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & { [K_3 in Exclude<keyof I["message"]["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_4 in Exclude<keyof I["message"]["instructions"], keyof {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[]>]: never; }) | undefined;
            versioned?: boolean | undefined;
            addressTableLookups?: ({
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[] & ({
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            } & {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            } & { [K_5 in Exclude<keyof I["message"]["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_6 in Exclude<keyof I["message"]["addressTableLookups"], keyof {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I["message"], keyof Message>]: never; }) | undefined;
    } & { [K_8 in Exclude<keyof I, keyof Transaction>]: never; }>(base?: I | undefined): Transaction;
    fromPartial<I_1 extends {
        signatures?: Uint8Array[] | undefined;
        message?: {
            header?: {
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } | undefined;
            accountKeys?: Uint8Array[] | undefined;
            recentBlockhash?: Uint8Array | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[] | undefined;
            versioned?: boolean | undefined;
            addressTableLookups?: {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[] | undefined;
        } | undefined;
    } & {
        signatures?: (Uint8Array[] & Uint8Array[] & { [K_9 in Exclude<keyof I_1["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
        message?: ({
            header?: {
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } | undefined;
            accountKeys?: Uint8Array[] | undefined;
            recentBlockhash?: Uint8Array | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[] | undefined;
            versioned?: boolean | undefined;
            addressTableLookups?: {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[] | undefined;
        } & {
            header?: ({
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } & {
                numRequiredSignatures?: number | undefined;
                numReadonlySignedAccounts?: number | undefined;
                numReadonlyUnsignedAccounts?: number | undefined;
            } & { [K_10 in Exclude<keyof I_1["message"]["header"], keyof MessageHeader>]: never; }) | undefined;
            accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_11 in Exclude<keyof I_1["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
            recentBlockhash?: Uint8Array | undefined;
            instructions?: ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[] & ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            } & { [K_12 in Exclude<keyof I_1["message"]["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_13 in Exclude<keyof I_1["message"]["instructions"], keyof {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
            }[]>]: never; }) | undefined;
            versioned?: boolean | undefined;
            addressTableLookups?: ({
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[] & ({
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            } & {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            } & { [K_14 in Exclude<keyof I_1["message"]["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_15 in Exclude<keyof I_1["message"]["addressTableLookups"], keyof {
                accountKey?: Uint8Array | undefined;
                writableIndexes?: Uint8Array | undefined;
                readonlyIndexes?: Uint8Array | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_16 in Exclude<keyof I_1["message"], keyof Message>]: never; }) | undefined;
    } & { [K_17 in Exclude<keyof I_1, keyof Transaction>]: never; }>(object: I_1): Transaction;
};
export declare const Message: {
    encode(message: Message, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Message;
    fromJSON(object: any): Message;
    toJSON(message: Message): unknown;
    create<I extends {
        header?: {
            numRequiredSignatures?: number | undefined;
            numReadonlySignedAccounts?: number | undefined;
            numReadonlyUnsignedAccounts?: number | undefined;
        } | undefined;
        accountKeys?: Uint8Array[] | undefined;
        recentBlockhash?: Uint8Array | undefined;
        instructions?: {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        }[] | undefined;
        versioned?: boolean | undefined;
        addressTableLookups?: {
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        }[] | undefined;
    } & {
        header?: ({
            numRequiredSignatures?: number | undefined;
            numReadonlySignedAccounts?: number | undefined;
            numReadonlyUnsignedAccounts?: number | undefined;
        } & {
            numRequiredSignatures?: number | undefined;
            numReadonlySignedAccounts?: number | undefined;
            numReadonlyUnsignedAccounts?: number | undefined;
        } & { [K in Exclude<keyof I["header"], keyof MessageHeader>]: never; }) | undefined;
        accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_1 in Exclude<keyof I["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
        recentBlockhash?: Uint8Array | undefined;
        instructions?: ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        }[] & ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & { [K_2 in Exclude<keyof I["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_3 in Exclude<keyof I["instructions"], keyof {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        }[]>]: never; }) | undefined;
        versioned?: boolean | undefined;
        addressTableLookups?: ({
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        }[] & ({
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        } & {
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        } & { [K_4 in Exclude<keyof I["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_5 in Exclude<keyof I["addressTableLookups"], keyof {
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_6 in Exclude<keyof I, keyof Message>]: never; }>(base?: I | undefined): Message;
    fromPartial<I_1 extends {
        header?: {
            numRequiredSignatures?: number | undefined;
            numReadonlySignedAccounts?: number | undefined;
            numReadonlyUnsignedAccounts?: number | undefined;
        } | undefined;
        accountKeys?: Uint8Array[] | undefined;
        recentBlockhash?: Uint8Array | undefined;
        instructions?: {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        }[] | undefined;
        versioned?: boolean | undefined;
        addressTableLookups?: {
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        }[] | undefined;
    } & {
        header?: ({
            numRequiredSignatures?: number | undefined;
            numReadonlySignedAccounts?: number | undefined;
            numReadonlyUnsignedAccounts?: number | undefined;
        } & {
            numRequiredSignatures?: number | undefined;
            numReadonlySignedAccounts?: number | undefined;
            numReadonlyUnsignedAccounts?: number | undefined;
        } & { [K_7 in Exclude<keyof I_1["header"], keyof MessageHeader>]: never; }) | undefined;
        accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_8 in Exclude<keyof I_1["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
        recentBlockhash?: Uint8Array | undefined;
        instructions?: ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        }[] & ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & { [K_9 in Exclude<keyof I_1["instructions"][number], keyof CompiledInstruction>]: never; })[] & { [K_10 in Exclude<keyof I_1["instructions"], keyof {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        }[]>]: never; }) | undefined;
        versioned?: boolean | undefined;
        addressTableLookups?: ({
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        }[] & ({
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        } & {
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        } & { [K_11 in Exclude<keyof I_1["addressTableLookups"][number], keyof MessageAddressTableLookup>]: never; })[] & { [K_12 in Exclude<keyof I_1["addressTableLookups"], keyof {
            accountKey?: Uint8Array | undefined;
            writableIndexes?: Uint8Array | undefined;
            readonlyIndexes?: Uint8Array | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_13 in Exclude<keyof I_1, keyof Message>]: never; }>(object: I_1): Message;
};
export declare const MessageHeader: {
    encode(message: MessageHeader, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MessageHeader;
    fromJSON(object: any): MessageHeader;
    toJSON(message: MessageHeader): unknown;
    create<I extends {
        numRequiredSignatures?: number | undefined;
        numReadonlySignedAccounts?: number | undefined;
        numReadonlyUnsignedAccounts?: number | undefined;
    } & {
        numRequiredSignatures?: number | undefined;
        numReadonlySignedAccounts?: number | undefined;
        numReadonlyUnsignedAccounts?: number | undefined;
    } & { [K in Exclude<keyof I, keyof MessageHeader>]: never; }>(base?: I | undefined): MessageHeader;
    fromPartial<I_1 extends {
        numRequiredSignatures?: number | undefined;
        numReadonlySignedAccounts?: number | undefined;
        numReadonlyUnsignedAccounts?: number | undefined;
    } & {
        numRequiredSignatures?: number | undefined;
        numReadonlySignedAccounts?: number | undefined;
        numReadonlyUnsignedAccounts?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof MessageHeader>]: never; }>(object: I_1): MessageHeader;
};
export declare const MessageAddressTableLookup: {
    encode(message: MessageAddressTableLookup, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MessageAddressTableLookup;
    fromJSON(object: any): MessageAddressTableLookup;
    toJSON(message: MessageAddressTableLookup): unknown;
    create<I extends {
        accountKey?: Uint8Array | undefined;
        writableIndexes?: Uint8Array | undefined;
        readonlyIndexes?: Uint8Array | undefined;
    } & {
        accountKey?: Uint8Array | undefined;
        writableIndexes?: Uint8Array | undefined;
        readonlyIndexes?: Uint8Array | undefined;
    } & { [K in Exclude<keyof I, keyof MessageAddressTableLookup>]: never; }>(base?: I | undefined): MessageAddressTableLookup;
    fromPartial<I_1 extends {
        accountKey?: Uint8Array | undefined;
        writableIndexes?: Uint8Array | undefined;
        readonlyIndexes?: Uint8Array | undefined;
    } & {
        accountKey?: Uint8Array | undefined;
        writableIndexes?: Uint8Array | undefined;
        readonlyIndexes?: Uint8Array | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof MessageAddressTableLookup>]: never; }>(object: I_1): MessageAddressTableLookup;
};
export declare const TransactionStatusMeta: {
    encode(message: TransactionStatusMeta, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransactionStatusMeta;
    fromJSON(object: any): TransactionStatusMeta;
    toJSON(message: TransactionStatusMeta): unknown;
    create<I extends {
        err?: {
            err?: Uint8Array | undefined;
        } | undefined;
        fee?: number | undefined;
        preBalances?: number[] | undefined;
        postBalances?: number[] | undefined;
        innerInstructions?: {
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        }[] | undefined;
        innerInstructionsNone?: boolean | undefined;
        logMessages?: string[] | undefined;
        logMessagesNone?: boolean | undefined;
        preTokenBalances?: {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] | undefined;
        postTokenBalances?: {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] | undefined;
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
        loadedWritableAddresses?: Uint8Array[] | undefined;
        loadedReadonlyAddresses?: Uint8Array[] | undefined;
        returnData?: {
            programId?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } | undefined;
        returnDataNone?: boolean | undefined;
        computeUnitsConsumed?: number | undefined;
    } & {
        err?: ({
            err?: Uint8Array | undefined;
        } & {
            err?: Uint8Array | undefined;
        } & { [K in Exclude<keyof I["err"], "err">]: never; }) | undefined;
        fee?: number | undefined;
        preBalances?: (number[] & number[] & { [K_1 in Exclude<keyof I["preBalances"], keyof number[]>]: never; }) | undefined;
        postBalances?: (number[] & number[] & { [K_2 in Exclude<keyof I["postBalances"], keyof number[]>]: never; }) | undefined;
        innerInstructions?: ({
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        }[] & ({
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        } & {
            index?: number | undefined;
            instructions?: ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] & ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            } & {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            } & { [K_3 in Exclude<keyof I["innerInstructions"][number]["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_4 in Exclude<keyof I["innerInstructions"][number]["instructions"], keyof {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I["innerInstructions"][number], keyof InnerInstructions>]: never; })[] & { [K_6 in Exclude<keyof I["innerInstructions"], keyof {
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        }[]>]: never; }) | undefined;
        innerInstructionsNone?: boolean | undefined;
        logMessages?: (string[] & string[] & { [K_7 in Exclude<keyof I["logMessages"], keyof string[]>]: never; }) | undefined;
        logMessagesNone?: boolean | undefined;
        preTokenBalances?: ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] & ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: ({
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & { [K_8 in Exclude<keyof I["preTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & { [K_9 in Exclude<keyof I["preTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_10 in Exclude<keyof I["preTokenBalances"], keyof {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[]>]: never; }) | undefined;
        postTokenBalances?: ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] & ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: ({
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & { [K_11 in Exclude<keyof I["postTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & { [K_12 in Exclude<keyof I["postTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_13 in Exclude<keyof I["postTokenBalances"], keyof {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[]>]: never; }) | undefined;
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & { [K_14 in Exclude<keyof I["rewards"][number], keyof Reward>]: never; })[] & { [K_15 in Exclude<keyof I["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
        loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_16 in Exclude<keyof I["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
        loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_17 in Exclude<keyof I["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
        returnData?: ({
            programId?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & {
            programId?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & { [K_18 in Exclude<keyof I["returnData"], keyof ReturnData>]: never; }) | undefined;
        returnDataNone?: boolean | undefined;
        computeUnitsConsumed?: number | undefined;
    } & { [K_19 in Exclude<keyof I, keyof TransactionStatusMeta>]: never; }>(base?: I | undefined): TransactionStatusMeta;
    fromPartial<I_1 extends {
        err?: {
            err?: Uint8Array | undefined;
        } | undefined;
        fee?: number | undefined;
        preBalances?: number[] | undefined;
        postBalances?: number[] | undefined;
        innerInstructions?: {
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        }[] | undefined;
        innerInstructionsNone?: boolean | undefined;
        logMessages?: string[] | undefined;
        logMessagesNone?: boolean | undefined;
        preTokenBalances?: {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] | undefined;
        postTokenBalances?: {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] | undefined;
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
        loadedWritableAddresses?: Uint8Array[] | undefined;
        loadedReadonlyAddresses?: Uint8Array[] | undefined;
        returnData?: {
            programId?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } | undefined;
        returnDataNone?: boolean | undefined;
        computeUnitsConsumed?: number | undefined;
    } & {
        err?: ({
            err?: Uint8Array | undefined;
        } & {
            err?: Uint8Array | undefined;
        } & { [K_20 in Exclude<keyof I_1["err"], "err">]: never; }) | undefined;
        fee?: number | undefined;
        preBalances?: (number[] & number[] & { [K_21 in Exclude<keyof I_1["preBalances"], keyof number[]>]: never; }) | undefined;
        postBalances?: (number[] & number[] & { [K_22 in Exclude<keyof I_1["postBalances"], keyof number[]>]: never; }) | undefined;
        innerInstructions?: ({
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        }[] & ({
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        } & {
            index?: number | undefined;
            instructions?: ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] & ({
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            } & {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            } & { [K_23 in Exclude<keyof I_1["innerInstructions"][number]["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_24 in Exclude<keyof I_1["innerInstructions"][number]["instructions"], keyof {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_25 in Exclude<keyof I_1["innerInstructions"][number], keyof InnerInstructions>]: never; })[] & { [K_26 in Exclude<keyof I_1["innerInstructions"], keyof {
            index?: number | undefined;
            instructions?: {
                programIdIndex?: number | undefined;
                accounts?: Uint8Array | undefined;
                data?: Uint8Array | undefined;
                stackHeight?: number | undefined;
            }[] | undefined;
        }[]>]: never; }) | undefined;
        innerInstructionsNone?: boolean | undefined;
        logMessages?: (string[] & string[] & { [K_27 in Exclude<keyof I_1["logMessages"], keyof string[]>]: never; }) | undefined;
        logMessagesNone?: boolean | undefined;
        preTokenBalances?: ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] & ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: ({
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & { [K_28 in Exclude<keyof I_1["preTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & { [K_29 in Exclude<keyof I_1["preTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_30 in Exclude<keyof I_1["preTokenBalances"], keyof {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[]>]: never; }) | undefined;
        postTokenBalances?: ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[] & ({
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: ({
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } & { [K_31 in Exclude<keyof I_1["postTokenBalances"][number]["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        } & { [K_32 in Exclude<keyof I_1["postTokenBalances"][number], keyof TokenBalance>]: never; })[] & { [K_33 in Exclude<keyof I_1["postTokenBalances"], keyof {
            accountIndex?: number | undefined;
            mint?: string | undefined;
            uiTokenAmount?: {
                uiAmount?: number | undefined;
                decimals?: number | undefined;
                amount?: string | undefined;
                uiAmountString?: string | undefined;
            } | undefined;
            owner?: string | undefined;
            programId?: string | undefined;
        }[]>]: never; }) | undefined;
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & { [K_34 in Exclude<keyof I_1["rewards"][number], keyof Reward>]: never; })[] & { [K_35 in Exclude<keyof I_1["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
        loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_36 in Exclude<keyof I_1["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
        loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_37 in Exclude<keyof I_1["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
        returnData?: ({
            programId?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & {
            programId?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
        } & { [K_38 in Exclude<keyof I_1["returnData"], keyof ReturnData>]: never; }) | undefined;
        returnDataNone?: boolean | undefined;
        computeUnitsConsumed?: number | undefined;
    } & { [K_39 in Exclude<keyof I_1, keyof TransactionStatusMeta>]: never; }>(object: I_1): TransactionStatusMeta;
};
export declare const TransactionError: {
    encode(message: TransactionError, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransactionError;
    fromJSON(object: any): TransactionError;
    toJSON(message: TransactionError): unknown;
    create<I extends {
        err?: Uint8Array | undefined;
    } & {
        err?: Uint8Array | undefined;
    } & { [K in Exclude<keyof I, "err">]: never; }>(base?: I | undefined): TransactionError;
    fromPartial<I_1 extends {
        err?: Uint8Array | undefined;
    } & {
        err?: Uint8Array | undefined;
    } & { [K_1 in Exclude<keyof I_1, "err">]: never; }>(object: I_1): TransactionError;
};
export declare const InnerInstructions: {
    encode(message: InnerInstructions, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InnerInstructions;
    fromJSON(object: any): InnerInstructions;
    toJSON(message: InnerInstructions): unknown;
    create<I extends {
        index?: number | undefined;
        instructions?: {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        }[] | undefined;
    } & {
        index?: number | undefined;
        instructions?: ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        }[] & ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        } & {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        } & { [K in Exclude<keyof I["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_1 in Exclude<keyof I["instructions"], keyof {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof InnerInstructions>]: never; }>(base?: I | undefined): InnerInstructions;
    fromPartial<I_1 extends {
        index?: number | undefined;
        instructions?: {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        }[] | undefined;
    } & {
        index?: number | undefined;
        instructions?: ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        }[] & ({
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        } & {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        } & { [K_3 in Exclude<keyof I_1["instructions"][number], keyof InnerInstruction>]: never; })[] & { [K_4 in Exclude<keyof I_1["instructions"], keyof {
            programIdIndex?: number | undefined;
            accounts?: Uint8Array | undefined;
            data?: Uint8Array | undefined;
            stackHeight?: number | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof InnerInstructions>]: never; }>(object: I_1): InnerInstructions;
};
export declare const InnerInstruction: {
    encode(message: InnerInstruction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InnerInstruction;
    fromJSON(object: any): InnerInstruction;
    toJSON(message: InnerInstruction): unknown;
    create<I extends {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
        stackHeight?: number | undefined;
    } & {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
        stackHeight?: number | undefined;
    } & { [K in Exclude<keyof I, keyof InnerInstruction>]: never; }>(base?: I | undefined): InnerInstruction;
    fromPartial<I_1 extends {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
        stackHeight?: number | undefined;
    } & {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
        stackHeight?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof InnerInstruction>]: never; }>(object: I_1): InnerInstruction;
};
export declare const CompiledInstruction: {
    encode(message: CompiledInstruction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CompiledInstruction;
    fromJSON(object: any): CompiledInstruction;
    toJSON(message: CompiledInstruction): unknown;
    create<I extends {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & { [K in Exclude<keyof I, keyof CompiledInstruction>]: never; }>(base?: I | undefined): CompiledInstruction;
    fromPartial<I_1 extends {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & {
        programIdIndex?: number | undefined;
        accounts?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof CompiledInstruction>]: never; }>(object: I_1): CompiledInstruction;
};
export declare const TokenBalance: {
    encode(message: TokenBalance, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TokenBalance;
    fromJSON(object: any): TokenBalance;
    toJSON(message: TokenBalance): unknown;
    create<I extends {
        accountIndex?: number | undefined;
        mint?: string | undefined;
        uiTokenAmount?: {
            uiAmount?: number | undefined;
            decimals?: number | undefined;
            amount?: string | undefined;
            uiAmountString?: string | undefined;
        } | undefined;
        owner?: string | undefined;
        programId?: string | undefined;
    } & {
        accountIndex?: number | undefined;
        mint?: string | undefined;
        uiTokenAmount?: ({
            uiAmount?: number | undefined;
            decimals?: number | undefined;
            amount?: string | undefined;
            uiAmountString?: string | undefined;
        } & {
            uiAmount?: number | undefined;
            decimals?: number | undefined;
            amount?: string | undefined;
            uiAmountString?: string | undefined;
        } & { [K in Exclude<keyof I["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
        owner?: string | undefined;
        programId?: string | undefined;
    } & { [K_1 in Exclude<keyof I, keyof TokenBalance>]: never; }>(base?: I | undefined): TokenBalance;
    fromPartial<I_1 extends {
        accountIndex?: number | undefined;
        mint?: string | undefined;
        uiTokenAmount?: {
            uiAmount?: number | undefined;
            decimals?: number | undefined;
            amount?: string | undefined;
            uiAmountString?: string | undefined;
        } | undefined;
        owner?: string | undefined;
        programId?: string | undefined;
    } & {
        accountIndex?: number | undefined;
        mint?: string | undefined;
        uiTokenAmount?: ({
            uiAmount?: number | undefined;
            decimals?: number | undefined;
            amount?: string | undefined;
            uiAmountString?: string | undefined;
        } & {
            uiAmount?: number | undefined;
            decimals?: number | undefined;
            amount?: string | undefined;
            uiAmountString?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["uiTokenAmount"], keyof UiTokenAmount>]: never; }) | undefined;
        owner?: string | undefined;
        programId?: string | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof TokenBalance>]: never; }>(object: I_1): TokenBalance;
};
export declare const UiTokenAmount: {
    encode(message: UiTokenAmount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): UiTokenAmount;
    fromJSON(object: any): UiTokenAmount;
    toJSON(message: UiTokenAmount): unknown;
    create<I extends {
        uiAmount?: number | undefined;
        decimals?: number | undefined;
        amount?: string | undefined;
        uiAmountString?: string | undefined;
    } & {
        uiAmount?: number | undefined;
        decimals?: number | undefined;
        amount?: string | undefined;
        uiAmountString?: string | undefined;
    } & { [K in Exclude<keyof I, keyof UiTokenAmount>]: never; }>(base?: I | undefined): UiTokenAmount;
    fromPartial<I_1 extends {
        uiAmount?: number | undefined;
        decimals?: number | undefined;
        amount?: string | undefined;
        uiAmountString?: string | undefined;
    } & {
        uiAmount?: number | undefined;
        decimals?: number | undefined;
        amount?: string | undefined;
        uiAmountString?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof UiTokenAmount>]: never; }>(object: I_1): UiTokenAmount;
};
export declare const ReturnData: {
    encode(message: ReturnData, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ReturnData;
    fromJSON(object: any): ReturnData;
    toJSON(message: ReturnData): unknown;
    create<I extends {
        programId?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & {
        programId?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & { [K in Exclude<keyof I, keyof ReturnData>]: never; }>(base?: I | undefined): ReturnData;
    fromPartial<I_1 extends {
        programId?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & {
        programId?: Uint8Array | undefined;
        data?: Uint8Array | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof ReturnData>]: never; }>(object: I_1): ReturnData;
};
export declare const Reward: {
    encode(message: Reward, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Reward;
    fromJSON(object: any): Reward;
    toJSON(message: Reward): unknown;
    create<I extends {
        pubkey?: string | undefined;
        lamports?: number | undefined;
        postBalance?: number | undefined;
        rewardType?: RewardType | undefined;
        commission?: string | undefined;
    } & {
        pubkey?: string | undefined;
        lamports?: number | undefined;
        postBalance?: number | undefined;
        rewardType?: RewardType | undefined;
        commission?: string | undefined;
    } & { [K in Exclude<keyof I, keyof Reward>]: never; }>(base?: I | undefined): Reward;
    fromPartial<I_1 extends {
        pubkey?: string | undefined;
        lamports?: number | undefined;
        postBalance?: number | undefined;
        rewardType?: RewardType | undefined;
        commission?: string | undefined;
    } & {
        pubkey?: string | undefined;
        lamports?: number | undefined;
        postBalance?: number | undefined;
        rewardType?: RewardType | undefined;
        commission?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof Reward>]: never; }>(object: I_1): Reward;
};
export declare const Rewards: {
    encode(message: Rewards, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Rewards;
    fromJSON(object: any): Rewards;
    toJSON(message: Rewards): unknown;
    create<I extends {
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
    } & {
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & { [K in Exclude<keyof I["rewards"][number], keyof Reward>]: never; })[] & { [K_1 in Exclude<keyof I["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, "rewards">]: never; }>(base?: I | undefined): Rewards;
    fromPartial<I_1 extends {
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
    } & {
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["rewards"][number], keyof Reward>]: never; })[] & { [K_4 in Exclude<keyof I_1["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, "rewards">]: never; }>(object: I_1): Rewards;
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
export declare const BlockHeight: {
    encode(message: BlockHeight, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): BlockHeight;
    fromJSON(object: any): BlockHeight;
    toJSON(message: BlockHeight): unknown;
    create<I extends {
        blockHeight?: number | undefined;
    } & {
        blockHeight?: number | undefined;
    } & { [K in Exclude<keyof I, "blockHeight">]: never; }>(base?: I | undefined): BlockHeight;
    fromPartial<I_1 extends {
        blockHeight?: number | undefined;
    } & {
        blockHeight?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "blockHeight">]: never; }>(object: I_1): BlockHeight;
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
