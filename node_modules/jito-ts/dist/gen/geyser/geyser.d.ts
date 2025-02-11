import { CallOptions, ChannelCredentials, Client, ClientOptions, ClientReadableStream, ClientUnaryCall, handleServerStreamingCall, handleUnaryCall, Metadata, ServiceError, UntypedServiceImplementation } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { ConfirmedTransaction, Reward } from "./confirmed_block";
export declare const protobufPackage = "solana.geyser";
export declare enum SlotUpdateStatus {
    CONFIRMED = 0,
    PROCESSED = 1,
    ROOTED = 2,
    UNRECOGNIZED = -1
}
export declare function slotUpdateStatusFromJSON(object: any): SlotUpdateStatus;
export declare function slotUpdateStatusToJSON(object: SlotUpdateStatus): string;
export interface PartialAccountUpdate {
    /** Slot this update occurred. */
    slot: number;
    /** Account's pubkey. */
    pubkey: Uint8Array;
    /** Account's owner. */
    owner: Uint8Array;
    /** Flags whether this update was streamed as part of startup, hence not a realtime update. */
    isStartup: boolean;
    /**
     * A monotonically increasing number specifying the order of this update.
     * Can be used to determine what the latest update for an account was at
     * a given slot, assuming there were multiple updates.
     */
    seq: number;
    /** Transaction signature that caused this update. */
    txSignature?: string | undefined;
    /** AccountReplica version. */
    replicaVersion: number;
}
export interface AccountUpdate {
    /** Slot this update occurred. */
    slot: number;
    /** Account's pubkey. */
    pubkey: Uint8Array;
    /** Account's lamports post update. */
    lamports: number;
    /** Account's owner. */
    owner: Uint8Array;
    /** Flags whether an account is executable. */
    isExecutable: boolean;
    /** The epoch at which this account will next owe rent. */
    rentEpoch: number;
    /** Account's data post update. */
    data: Uint8Array;
    /**
     * A monotonically increasing number specifying the order of this update.
     * Can be used to determine what the latest update for an account was at
     * a given slot, assuming there were multiple updates.
     */
    seq: number;
    /** Flags whether this update was streamed as part of startup i.e. not a real-time update. */
    isStartup: boolean;
    /** Transaction signature that caused this update. */
    txSignature?: string | undefined;
    /** AccountReplica version. */
    replicaVersion: number;
}
export interface SlotUpdate {
    slot: number;
    parentSlot?: number | undefined;
    status: SlotUpdateStatus;
}
export interface TimestampedSlotUpdate {
    /** Time at which the message was generated */
    ts: Date | undefined;
    /** Slot update */
    slotUpdate: SlotUpdate | undefined;
}
export interface TimestampedAccountUpdate {
    /** Time at which the message was generated */
    ts: Date | undefined;
    /** Account update */
    accountUpdate: AccountUpdate | undefined;
}
export interface SubscribeTransactionUpdatesRequest {
}
export interface SubscribeBlockUpdatesRequest {
}
export interface MaybePartialAccountUpdate {
    partialAccountUpdate?: PartialAccountUpdate | undefined;
    hb?: Heartbeat | undefined;
}
export interface Heartbeat {
}
export interface EmptyRequest {
}
export interface BlockUpdate {
    slot: number;
    blockhash: string;
    rewards: Reward[];
    blockTime: Date | undefined;
    blockHeight?: number | undefined;
    executedTransactionCount?: number | undefined;
    entryCount?: number | undefined;
}
export interface TimestampedBlockUpdate {
    /** Time at which the message was generated */
    ts: Date | undefined;
    /** Block contents */
    blockUpdate: BlockUpdate | undefined;
}
export interface TransactionUpdate {
    slot: number;
    signature: string;
    isVote: boolean;
    txIdx: number;
    tx: ConfirmedTransaction | undefined;
}
export interface TimestampedTransactionUpdate {
    ts: Date | undefined;
    transaction: TransactionUpdate | undefined;
}
export interface SubscribeSlotUpdateRequest {
}
export interface SubscribeAccountUpdatesRequest {
    accounts: Uint8Array[];
}
export interface SubscribeProgramsUpdatesRequest {
    programs: Uint8Array[];
}
export interface SubscribePartialAccountUpdatesRequest {
    /** If true, will not stream vote account updates. */
    skipVoteAccounts: boolean;
}
export interface GetHeartbeatIntervalResponse {
    heartbeatIntervalMs: number;
}
export declare const PartialAccountUpdate: {
    encode(message: PartialAccountUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PartialAccountUpdate;
    fromJSON(object: any): PartialAccountUpdate;
    toJSON(message: PartialAccountUpdate): unknown;
    create<I extends {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        owner?: Uint8Array | undefined;
        isStartup?: boolean | undefined;
        seq?: number | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        owner?: Uint8Array | undefined;
        isStartup?: boolean | undefined;
        seq?: number | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & { [K in Exclude<keyof I, keyof PartialAccountUpdate>]: never; }>(base?: I | undefined): PartialAccountUpdate;
    fromPartial<I_1 extends {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        owner?: Uint8Array | undefined;
        isStartup?: boolean | undefined;
        seq?: number | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        owner?: Uint8Array | undefined;
        isStartup?: boolean | undefined;
        seq?: number | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof PartialAccountUpdate>]: never; }>(object: I_1): PartialAccountUpdate;
};
export declare const AccountUpdate: {
    encode(message: AccountUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AccountUpdate;
    fromJSON(object: any): AccountUpdate;
    toJSON(message: AccountUpdate): unknown;
    create<I extends {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        lamports?: number | undefined;
        owner?: Uint8Array | undefined;
        isExecutable?: boolean | undefined;
        rentEpoch?: number | undefined;
        data?: Uint8Array | undefined;
        seq?: number | undefined;
        isStartup?: boolean | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        lamports?: number | undefined;
        owner?: Uint8Array | undefined;
        isExecutable?: boolean | undefined;
        rentEpoch?: number | undefined;
        data?: Uint8Array | undefined;
        seq?: number | undefined;
        isStartup?: boolean | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & { [K in Exclude<keyof I, keyof AccountUpdate>]: never; }>(base?: I | undefined): AccountUpdate;
    fromPartial<I_1 extends {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        lamports?: number | undefined;
        owner?: Uint8Array | undefined;
        isExecutable?: boolean | undefined;
        rentEpoch?: number | undefined;
        data?: Uint8Array | undefined;
        seq?: number | undefined;
        isStartup?: boolean | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & {
        slot?: number | undefined;
        pubkey?: Uint8Array | undefined;
        lamports?: number | undefined;
        owner?: Uint8Array | undefined;
        isExecutable?: boolean | undefined;
        rentEpoch?: number | undefined;
        data?: Uint8Array | undefined;
        seq?: number | undefined;
        isStartup?: boolean | undefined;
        txSignature?: string | undefined;
        replicaVersion?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof AccountUpdate>]: never; }>(object: I_1): AccountUpdate;
};
export declare const SlotUpdate: {
    encode(message: SlotUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SlotUpdate;
    fromJSON(object: any): SlotUpdate;
    toJSON(message: SlotUpdate): unknown;
    create<I extends {
        slot?: number | undefined;
        parentSlot?: number | undefined;
        status?: SlotUpdateStatus | undefined;
    } & {
        slot?: number | undefined;
        parentSlot?: number | undefined;
        status?: SlotUpdateStatus | undefined;
    } & { [K in Exclude<keyof I, keyof SlotUpdate>]: never; }>(base?: I | undefined): SlotUpdate;
    fromPartial<I_1 extends {
        slot?: number | undefined;
        parentSlot?: number | undefined;
        status?: SlotUpdateStatus | undefined;
    } & {
        slot?: number | undefined;
        parentSlot?: number | undefined;
        status?: SlotUpdateStatus | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof SlotUpdate>]: never; }>(object: I_1): SlotUpdate;
};
export declare const TimestampedSlotUpdate: {
    encode(message: TimestampedSlotUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedSlotUpdate;
    fromJSON(object: any): TimestampedSlotUpdate;
    toJSON(message: TimestampedSlotUpdate): unknown;
    create<I extends {
        ts?: Date | undefined;
        slotUpdate?: {
            slot?: number | undefined;
            parentSlot?: number | undefined;
            status?: SlotUpdateStatus | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        slotUpdate?: ({
            slot?: number | undefined;
            parentSlot?: number | undefined;
            status?: SlotUpdateStatus | undefined;
        } & {
            slot?: number | undefined;
            parentSlot?: number | undefined;
            status?: SlotUpdateStatus | undefined;
        } & { [K in Exclude<keyof I["slotUpdate"], keyof SlotUpdate>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof TimestampedSlotUpdate>]: never; }>(base?: I | undefined): TimestampedSlotUpdate;
    fromPartial<I_1 extends {
        ts?: Date | undefined;
        slotUpdate?: {
            slot?: number | undefined;
            parentSlot?: number | undefined;
            status?: SlotUpdateStatus | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        slotUpdate?: ({
            slot?: number | undefined;
            parentSlot?: number | undefined;
            status?: SlotUpdateStatus | undefined;
        } & {
            slot?: number | undefined;
            parentSlot?: number | undefined;
            status?: SlotUpdateStatus | undefined;
        } & { [K_2 in Exclude<keyof I_1["slotUpdate"], keyof SlotUpdate>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof TimestampedSlotUpdate>]: never; }>(object: I_1): TimestampedSlotUpdate;
};
export declare const TimestampedAccountUpdate: {
    encode(message: TimestampedAccountUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedAccountUpdate;
    fromJSON(object: any): TimestampedAccountUpdate;
    toJSON(message: TimestampedAccountUpdate): unknown;
    create<I extends {
        ts?: Date | undefined;
        accountUpdate?: {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            lamports?: number | undefined;
            owner?: Uint8Array | undefined;
            isExecutable?: boolean | undefined;
            rentEpoch?: number | undefined;
            data?: Uint8Array | undefined;
            seq?: number | undefined;
            isStartup?: boolean | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        accountUpdate?: ({
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            lamports?: number | undefined;
            owner?: Uint8Array | undefined;
            isExecutable?: boolean | undefined;
            rentEpoch?: number | undefined;
            data?: Uint8Array | undefined;
            seq?: number | undefined;
            isStartup?: boolean | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            lamports?: number | undefined;
            owner?: Uint8Array | undefined;
            isExecutable?: boolean | undefined;
            rentEpoch?: number | undefined;
            data?: Uint8Array | undefined;
            seq?: number | undefined;
            isStartup?: boolean | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & { [K in Exclude<keyof I["accountUpdate"], keyof AccountUpdate>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof TimestampedAccountUpdate>]: never; }>(base?: I | undefined): TimestampedAccountUpdate;
    fromPartial<I_1 extends {
        ts?: Date | undefined;
        accountUpdate?: {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            lamports?: number | undefined;
            owner?: Uint8Array | undefined;
            isExecutable?: boolean | undefined;
            rentEpoch?: number | undefined;
            data?: Uint8Array | undefined;
            seq?: number | undefined;
            isStartup?: boolean | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        accountUpdate?: ({
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            lamports?: number | undefined;
            owner?: Uint8Array | undefined;
            isExecutable?: boolean | undefined;
            rentEpoch?: number | undefined;
            data?: Uint8Array | undefined;
            seq?: number | undefined;
            isStartup?: boolean | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            lamports?: number | undefined;
            owner?: Uint8Array | undefined;
            isExecutable?: boolean | undefined;
            rentEpoch?: number | undefined;
            data?: Uint8Array | undefined;
            seq?: number | undefined;
            isStartup?: boolean | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & { [K_2 in Exclude<keyof I_1["accountUpdate"], keyof AccountUpdate>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof TimestampedAccountUpdate>]: never; }>(object: I_1): TimestampedAccountUpdate;
};
export declare const SubscribeTransactionUpdatesRequest: {
    encode(_: SubscribeTransactionUpdatesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeTransactionUpdatesRequest;
    fromJSON(_: any): SubscribeTransactionUpdatesRequest;
    toJSON(_: SubscribeTransactionUpdatesRequest): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): SubscribeTransactionUpdatesRequest;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): SubscribeTransactionUpdatesRequest;
};
export declare const SubscribeBlockUpdatesRequest: {
    encode(_: SubscribeBlockUpdatesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeBlockUpdatesRequest;
    fromJSON(_: any): SubscribeBlockUpdatesRequest;
    toJSON(_: SubscribeBlockUpdatesRequest): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): SubscribeBlockUpdatesRequest;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): SubscribeBlockUpdatesRequest;
};
export declare const MaybePartialAccountUpdate: {
    encode(message: MaybePartialAccountUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MaybePartialAccountUpdate;
    fromJSON(object: any): MaybePartialAccountUpdate;
    toJSON(message: MaybePartialAccountUpdate): unknown;
    create<I extends {
        partialAccountUpdate?: {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            owner?: Uint8Array | undefined;
            isStartup?: boolean | undefined;
            seq?: number | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } | undefined;
        hb?: {} | undefined;
    } & {
        partialAccountUpdate?: ({
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            owner?: Uint8Array | undefined;
            isStartup?: boolean | undefined;
            seq?: number | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            owner?: Uint8Array | undefined;
            isStartup?: boolean | undefined;
            seq?: number | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & { [K in Exclude<keyof I["partialAccountUpdate"], keyof PartialAccountUpdate>]: never; }) | undefined;
        hb?: ({} & {} & { [K_1 in Exclude<keyof I["hb"], never>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof MaybePartialAccountUpdate>]: never; }>(base?: I | undefined): MaybePartialAccountUpdate;
    fromPartial<I_1 extends {
        partialAccountUpdate?: {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            owner?: Uint8Array | undefined;
            isStartup?: boolean | undefined;
            seq?: number | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } | undefined;
        hb?: {} | undefined;
    } & {
        partialAccountUpdate?: ({
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            owner?: Uint8Array | undefined;
            isStartup?: boolean | undefined;
            seq?: number | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & {
            slot?: number | undefined;
            pubkey?: Uint8Array | undefined;
            owner?: Uint8Array | undefined;
            isStartup?: boolean | undefined;
            seq?: number | undefined;
            txSignature?: string | undefined;
            replicaVersion?: number | undefined;
        } & { [K_3 in Exclude<keyof I_1["partialAccountUpdate"], keyof PartialAccountUpdate>]: never; }) | undefined;
        hb?: ({} & {} & { [K_4 in Exclude<keyof I_1["hb"], never>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof MaybePartialAccountUpdate>]: never; }>(object: I_1): MaybePartialAccountUpdate;
};
export declare const Heartbeat: {
    encode(_: Heartbeat, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Heartbeat;
    fromJSON(_: any): Heartbeat;
    toJSON(_: Heartbeat): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): Heartbeat;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): Heartbeat;
};
export declare const EmptyRequest: {
    encode(_: EmptyRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EmptyRequest;
    fromJSON(_: any): EmptyRequest;
    toJSON(_: EmptyRequest): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): EmptyRequest;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): EmptyRequest;
};
export declare const BlockUpdate: {
    encode(message: BlockUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): BlockUpdate;
    fromJSON(object: any): BlockUpdate;
    toJSON(message: BlockUpdate): unknown;
    create<I extends {
        slot?: number | undefined;
        blockhash?: string | undefined;
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
        blockTime?: Date | undefined;
        blockHeight?: number | undefined;
        executedTransactionCount?: number | undefined;
        entryCount?: number | undefined;
    } & {
        slot?: number | undefined;
        blockhash?: string | undefined;
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        } & { [K in Exclude<keyof I["rewards"][number], keyof Reward>]: never; })[] & { [K_1 in Exclude<keyof I["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
        blockTime?: Date | undefined;
        blockHeight?: number | undefined;
        executedTransactionCount?: number | undefined;
        entryCount?: number | undefined;
    } & { [K_2 in Exclude<keyof I, keyof BlockUpdate>]: never; }>(base?: I | undefined): BlockUpdate;
    fromPartial<I_1 extends {
        slot?: number | undefined;
        blockhash?: string | undefined;
        rewards?: {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        }[] | undefined;
        blockTime?: Date | undefined;
        blockHeight?: number | undefined;
        executedTransactionCount?: number | undefined;
        entryCount?: number | undefined;
    } & {
        slot?: number | undefined;
        blockhash?: string | undefined;
        rewards?: ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        }[] & ({
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        } & {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["rewards"][number], keyof Reward>]: never; })[] & { [K_4 in Exclude<keyof I_1["rewards"], keyof {
            pubkey?: string | undefined;
            lamports?: number | undefined;
            postBalance?: number | undefined;
            rewardType?: import("./confirmed_block").RewardType | undefined;
            commission?: string | undefined;
        }[]>]: never; }) | undefined;
        blockTime?: Date | undefined;
        blockHeight?: number | undefined;
        executedTransactionCount?: number | undefined;
        entryCount?: number | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof BlockUpdate>]: never; }>(object: I_1): BlockUpdate;
};
export declare const TimestampedBlockUpdate: {
    encode(message: TimestampedBlockUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedBlockUpdate;
    fromJSON(object: any): TimestampedBlockUpdate;
    toJSON(message: TimestampedBlockUpdate): unknown;
    create<I extends {
        ts?: Date | undefined;
        blockUpdate?: {
            slot?: number | undefined;
            blockhash?: string | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            blockTime?: Date | undefined;
            blockHeight?: number | undefined;
            executedTransactionCount?: number | undefined;
            entryCount?: number | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        blockUpdate?: ({
            slot?: number | undefined;
            blockhash?: string | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            blockTime?: Date | undefined;
            blockHeight?: number | undefined;
            executedTransactionCount?: number | undefined;
            entryCount?: number | undefined;
        } & {
            slot?: number | undefined;
            blockhash?: string | undefined;
            rewards?: ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[] & ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            } & {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            } & { [K in Exclude<keyof I["blockUpdate"]["rewards"][number], keyof Reward>]: never; })[] & { [K_1 in Exclude<keyof I["blockUpdate"]["rewards"], keyof {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[]>]: never; }) | undefined;
            blockTime?: Date | undefined;
            blockHeight?: number | undefined;
            executedTransactionCount?: number | undefined;
            entryCount?: number | undefined;
        } & { [K_2 in Exclude<keyof I["blockUpdate"], keyof BlockUpdate>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof TimestampedBlockUpdate>]: never; }>(base?: I | undefined): TimestampedBlockUpdate;
    fromPartial<I_1 extends {
        ts?: Date | undefined;
        blockUpdate?: {
            slot?: number | undefined;
            blockhash?: string | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            blockTime?: Date | undefined;
            blockHeight?: number | undefined;
            executedTransactionCount?: number | undefined;
            entryCount?: number | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        blockUpdate?: ({
            slot?: number | undefined;
            blockhash?: string | undefined;
            rewards?: {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[] | undefined;
            blockTime?: Date | undefined;
            blockHeight?: number | undefined;
            executedTransactionCount?: number | undefined;
            entryCount?: number | undefined;
        } & {
            slot?: number | undefined;
            blockhash?: string | undefined;
            rewards?: ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[] & ({
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            } & {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            } & { [K_4 in Exclude<keyof I_1["blockUpdate"]["rewards"][number], keyof Reward>]: never; })[] & { [K_5 in Exclude<keyof I_1["blockUpdate"]["rewards"], keyof {
                pubkey?: string | undefined;
                lamports?: number | undefined;
                postBalance?: number | undefined;
                rewardType?: import("./confirmed_block").RewardType | undefined;
                commission?: string | undefined;
            }[]>]: never; }) | undefined;
            blockTime?: Date | undefined;
            blockHeight?: number | undefined;
            executedTransactionCount?: number | undefined;
            entryCount?: number | undefined;
        } & { [K_6 in Exclude<keyof I_1["blockUpdate"], keyof BlockUpdate>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof TimestampedBlockUpdate>]: never; }>(object: I_1): TimestampedBlockUpdate;
};
export declare const TransactionUpdate: {
    encode(message: TransactionUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransactionUpdate;
    fromJSON(object: any): TransactionUpdate;
    toJSON(message: TransactionUpdate): unknown;
    create<I extends {
        slot?: number | undefined;
        signature?: string | undefined;
        isVote?: boolean | undefined;
        txIdx?: number | undefined;
        tx?: {
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
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
        } | undefined;
    } & {
        slot?: number | undefined;
        signature?: string | undefined;
        isVote?: boolean | undefined;
        txIdx?: number | undefined;
        tx?: ({
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
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
                signatures?: (Uint8Array[] & Uint8Array[] & { [K in Exclude<keyof I["tx"]["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
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
                    } & { [K_1 in Exclude<keyof I["tx"]["transaction"]["message"]["header"], keyof import("./confirmed_block").MessageHeader>]: never; }) | undefined;
                    accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_2 in Exclude<keyof I["tx"]["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
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
                    } & { [K_3 in Exclude<keyof I["tx"]["transaction"]["message"]["instructions"][number], keyof import("./confirmed_block").CompiledInstruction>]: never; })[] & { [K_4 in Exclude<keyof I["tx"]["transaction"]["message"]["instructions"], keyof {
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
                    } & { [K_5 in Exclude<keyof I["tx"]["transaction"]["message"]["addressTableLookups"][number], keyof import("./confirmed_block").MessageAddressTableLookup>]: never; })[] & { [K_6 in Exclude<keyof I["tx"]["transaction"]["message"]["addressTableLookups"], keyof {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_7 in Exclude<keyof I["tx"]["transaction"]["message"], keyof import("./confirmed_block").Message>]: never; }) | undefined;
            } & { [K_8 in Exclude<keyof I["tx"]["transaction"], keyof import("./confirmed_block").Transaction>]: never; }) | undefined;
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
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
                } & { [K_9 in Exclude<keyof I["tx"]["meta"]["err"], "err">]: never; }) | undefined;
                fee?: number | undefined;
                preBalances?: (number[] & number[] & { [K_10 in Exclude<keyof I["tx"]["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
                postBalances?: (number[] & number[] & { [K_11 in Exclude<keyof I["tx"]["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
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
                    } & { [K_12 in Exclude<keyof I["tx"]["meta"]["innerInstructions"][number]["instructions"][number], keyof import("./confirmed_block").InnerInstruction>]: never; })[] & { [K_13 in Exclude<keyof I["tx"]["meta"]["innerInstructions"][number]["instructions"], keyof {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_14 in Exclude<keyof I["tx"]["meta"]["innerInstructions"][number], keyof import("./confirmed_block").InnerInstructions>]: never; })[] & { [K_15 in Exclude<keyof I["tx"]["meta"]["innerInstructions"], keyof {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[]>]: never; }) | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: (string[] & string[] & { [K_16 in Exclude<keyof I["tx"]["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
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
                    } & { [K_17 in Exclude<keyof I["tx"]["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_18 in Exclude<keyof I["tx"]["meta"]["preTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_19 in Exclude<keyof I["tx"]["meta"]["preTokenBalances"], keyof {
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
                    } & { [K_20 in Exclude<keyof I["tx"]["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_21 in Exclude<keyof I["tx"]["meta"]["postTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_22 in Exclude<keyof I["tx"]["meta"]["postTokenBalances"], keyof {
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                }[] & ({
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                } & {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                } & { [K_23 in Exclude<keyof I["tx"]["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_24 in Exclude<keyof I["tx"]["meta"]["rewards"], keyof {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                }[]>]: never; }) | undefined;
                loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_25 in Exclude<keyof I["tx"]["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_26 in Exclude<keyof I["tx"]["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                returnData?: ({
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & { [K_27 in Exclude<keyof I["tx"]["meta"]["returnData"], keyof import("./confirmed_block").ReturnData>]: never; }) | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } & { [K_28 in Exclude<keyof I["tx"]["meta"], keyof import("./confirmed_block").TransactionStatusMeta>]: never; }) | undefined;
        } & { [K_29 in Exclude<keyof I["tx"], keyof ConfirmedTransaction>]: never; }) | undefined;
    } & { [K_30 in Exclude<keyof I, keyof TransactionUpdate>]: never; }>(base?: I | undefined): TransactionUpdate;
    fromPartial<I_1 extends {
        slot?: number | undefined;
        signature?: string | undefined;
        isVote?: boolean | undefined;
        txIdx?: number | undefined;
        tx?: {
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
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
        } | undefined;
    } & {
        slot?: number | undefined;
        signature?: string | undefined;
        isVote?: boolean | undefined;
        txIdx?: number | undefined;
        tx?: ({
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
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
                signatures?: (Uint8Array[] & Uint8Array[] & { [K_31 in Exclude<keyof I_1["tx"]["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
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
                    } & { [K_32 in Exclude<keyof I_1["tx"]["transaction"]["message"]["header"], keyof import("./confirmed_block").MessageHeader>]: never; }) | undefined;
                    accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_33 in Exclude<keyof I_1["tx"]["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
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
                    } & { [K_34 in Exclude<keyof I_1["tx"]["transaction"]["message"]["instructions"][number], keyof import("./confirmed_block").CompiledInstruction>]: never; })[] & { [K_35 in Exclude<keyof I_1["tx"]["transaction"]["message"]["instructions"], keyof {
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
                    } & { [K_36 in Exclude<keyof I_1["tx"]["transaction"]["message"]["addressTableLookups"][number], keyof import("./confirmed_block").MessageAddressTableLookup>]: never; })[] & { [K_37 in Exclude<keyof I_1["tx"]["transaction"]["message"]["addressTableLookups"], keyof {
                        accountKey?: Uint8Array | undefined;
                        writableIndexes?: Uint8Array | undefined;
                        readonlyIndexes?: Uint8Array | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_38 in Exclude<keyof I_1["tx"]["transaction"]["message"], keyof import("./confirmed_block").Message>]: never; }) | undefined;
            } & { [K_39 in Exclude<keyof I_1["tx"]["transaction"], keyof import("./confirmed_block").Transaction>]: never; }) | undefined;
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
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
                } & { [K_40 in Exclude<keyof I_1["tx"]["meta"]["err"], "err">]: never; }) | undefined;
                fee?: number | undefined;
                preBalances?: (number[] & number[] & { [K_41 in Exclude<keyof I_1["tx"]["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
                postBalances?: (number[] & number[] & { [K_42 in Exclude<keyof I_1["tx"]["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
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
                    } & { [K_43 in Exclude<keyof I_1["tx"]["meta"]["innerInstructions"][number]["instructions"][number], keyof import("./confirmed_block").InnerInstruction>]: never; })[] & { [K_44 in Exclude<keyof I_1["tx"]["meta"]["innerInstructions"][number]["instructions"], keyof {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_45 in Exclude<keyof I_1["tx"]["meta"]["innerInstructions"][number], keyof import("./confirmed_block").InnerInstructions>]: never; })[] & { [K_46 in Exclude<keyof I_1["tx"]["meta"]["innerInstructions"], keyof {
                    index?: number | undefined;
                    instructions?: {
                        programIdIndex?: number | undefined;
                        accounts?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                        stackHeight?: number | undefined;
                    }[] | undefined;
                }[]>]: never; }) | undefined;
                innerInstructionsNone?: boolean | undefined;
                logMessages?: (string[] & string[] & { [K_47 in Exclude<keyof I_1["tx"]["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
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
                    } & { [K_48 in Exclude<keyof I_1["tx"]["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_49 in Exclude<keyof I_1["tx"]["meta"]["preTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_50 in Exclude<keyof I_1["tx"]["meta"]["preTokenBalances"], keyof {
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
                    } & { [K_51 in Exclude<keyof I_1["tx"]["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                    owner?: string | undefined;
                    programId?: string | undefined;
                } & { [K_52 in Exclude<keyof I_1["tx"]["meta"]["postTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_53 in Exclude<keyof I_1["tx"]["meta"]["postTokenBalances"], keyof {
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
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                }[] & ({
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                } & {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                } & { [K_54 in Exclude<keyof I_1["tx"]["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_55 in Exclude<keyof I_1["tx"]["meta"]["rewards"], keyof {
                    pubkey?: string | undefined;
                    lamports?: number | undefined;
                    postBalance?: number | undefined;
                    rewardType?: import("./confirmed_block").RewardType | undefined;
                    commission?: string | undefined;
                }[]>]: never; }) | undefined;
                loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_56 in Exclude<keyof I_1["tx"]["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_57 in Exclude<keyof I_1["tx"]["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                returnData?: ({
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & {
                    programId?: Uint8Array | undefined;
                    data?: Uint8Array | undefined;
                } & { [K_58 in Exclude<keyof I_1["tx"]["meta"]["returnData"], keyof import("./confirmed_block").ReturnData>]: never; }) | undefined;
                returnDataNone?: boolean | undefined;
                computeUnitsConsumed?: number | undefined;
            } & { [K_59 in Exclude<keyof I_1["tx"]["meta"], keyof import("./confirmed_block").TransactionStatusMeta>]: never; }) | undefined;
        } & { [K_60 in Exclude<keyof I_1["tx"], keyof ConfirmedTransaction>]: never; }) | undefined;
    } & { [K_61 in Exclude<keyof I_1, keyof TransactionUpdate>]: never; }>(object: I_1): TransactionUpdate;
};
export declare const TimestampedTransactionUpdate: {
    encode(message: TimestampedTransactionUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedTransactionUpdate;
    fromJSON(object: any): TimestampedTransactionUpdate;
    toJSON(message: TimestampedTransactionUpdate): unknown;
    create<I extends {
        ts?: Date | undefined;
        transaction?: {
            slot?: number | undefined;
            signature?: string | undefined;
            isVote?: boolean | undefined;
            txIdx?: number | undefined;
            tx?: {
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
            } | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        transaction?: ({
            slot?: number | undefined;
            signature?: string | undefined;
            isVote?: boolean | undefined;
            txIdx?: number | undefined;
            tx?: {
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
            } | undefined;
        } & {
            slot?: number | undefined;
            signature?: string | undefined;
            isVote?: boolean | undefined;
            txIdx?: number | undefined;
            tx?: ({
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
                    signatures?: (Uint8Array[] & Uint8Array[] & { [K in Exclude<keyof I["transaction"]["tx"]["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
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
                        } & { [K_1 in Exclude<keyof I["transaction"]["tx"]["transaction"]["message"]["header"], keyof import("./confirmed_block").MessageHeader>]: never; }) | undefined;
                        accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_2 in Exclude<keyof I["transaction"]["tx"]["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
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
                        } & { [K_3 in Exclude<keyof I["transaction"]["tx"]["transaction"]["message"]["instructions"][number], keyof import("./confirmed_block").CompiledInstruction>]: never; })[] & { [K_4 in Exclude<keyof I["transaction"]["tx"]["transaction"]["message"]["instructions"], keyof {
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
                        } & { [K_5 in Exclude<keyof I["transaction"]["tx"]["transaction"]["message"]["addressTableLookups"][number], keyof import("./confirmed_block").MessageAddressTableLookup>]: never; })[] & { [K_6 in Exclude<keyof I["transaction"]["tx"]["transaction"]["message"]["addressTableLookups"], keyof {
                            accountKey?: Uint8Array | undefined;
                            writableIndexes?: Uint8Array | undefined;
                            readonlyIndexes?: Uint8Array | undefined;
                        }[]>]: never; }) | undefined;
                    } & { [K_7 in Exclude<keyof I["transaction"]["tx"]["transaction"]["message"], keyof import("./confirmed_block").Message>]: never; }) | undefined;
                } & { [K_8 in Exclude<keyof I["transaction"]["tx"]["transaction"], keyof import("./confirmed_block").Transaction>]: never; }) | undefined;
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
                    } & { [K_9 in Exclude<keyof I["transaction"]["tx"]["meta"]["err"], "err">]: never; }) | undefined;
                    fee?: number | undefined;
                    preBalances?: (number[] & number[] & { [K_10 in Exclude<keyof I["transaction"]["tx"]["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
                    postBalances?: (number[] & number[] & { [K_11 in Exclude<keyof I["transaction"]["tx"]["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
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
                        } & { [K_12 in Exclude<keyof I["transaction"]["tx"]["meta"]["innerInstructions"][number]["instructions"][number], keyof import("./confirmed_block").InnerInstruction>]: never; })[] & { [K_13 in Exclude<keyof I["transaction"]["tx"]["meta"]["innerInstructions"][number]["instructions"], keyof {
                            programIdIndex?: number | undefined;
                            accounts?: Uint8Array | undefined;
                            data?: Uint8Array | undefined;
                            stackHeight?: number | undefined;
                        }[]>]: never; }) | undefined;
                    } & { [K_14 in Exclude<keyof I["transaction"]["tx"]["meta"]["innerInstructions"][number], keyof import("./confirmed_block").InnerInstructions>]: never; })[] & { [K_15 in Exclude<keyof I["transaction"]["tx"]["meta"]["innerInstructions"], keyof {
                        index?: number | undefined;
                        instructions?: {
                            programIdIndex?: number | undefined;
                            accounts?: Uint8Array | undefined;
                            data?: Uint8Array | undefined;
                            stackHeight?: number | undefined;
                        }[] | undefined;
                    }[]>]: never; }) | undefined;
                    innerInstructionsNone?: boolean | undefined;
                    logMessages?: (string[] & string[] & { [K_16 in Exclude<keyof I["transaction"]["tx"]["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
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
                        } & { [K_17 in Exclude<keyof I["transaction"]["tx"]["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                        owner?: string | undefined;
                        programId?: string | undefined;
                    } & { [K_18 in Exclude<keyof I["transaction"]["tx"]["meta"]["preTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_19 in Exclude<keyof I["transaction"]["tx"]["meta"]["preTokenBalances"], keyof {
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
                        } & { [K_20 in Exclude<keyof I["transaction"]["tx"]["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                        owner?: string | undefined;
                        programId?: string | undefined;
                    } & { [K_21 in Exclude<keyof I["transaction"]["tx"]["meta"]["postTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_22 in Exclude<keyof I["transaction"]["tx"]["meta"]["postTokenBalances"], keyof {
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    }[] & ({
                        pubkey?: string | undefined;
                        lamports?: number | undefined;
                        postBalance?: number | undefined;
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    } & {
                        pubkey?: string | undefined;
                        lamports?: number | undefined;
                        postBalance?: number | undefined;
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    } & { [K_23 in Exclude<keyof I["transaction"]["tx"]["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_24 in Exclude<keyof I["transaction"]["tx"]["meta"]["rewards"], keyof {
                        pubkey?: string | undefined;
                        lamports?: number | undefined;
                        postBalance?: number | undefined;
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    }[]>]: never; }) | undefined;
                    loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_25 in Exclude<keyof I["transaction"]["tx"]["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                    loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_26 in Exclude<keyof I["transaction"]["tx"]["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                    returnData?: ({
                        programId?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & {
                        programId?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & { [K_27 in Exclude<keyof I["transaction"]["tx"]["meta"]["returnData"], keyof import("./confirmed_block").ReturnData>]: never; }) | undefined;
                    returnDataNone?: boolean | undefined;
                    computeUnitsConsumed?: number | undefined;
                } & { [K_28 in Exclude<keyof I["transaction"]["tx"]["meta"], keyof import("./confirmed_block").TransactionStatusMeta>]: never; }) | undefined;
            } & { [K_29 in Exclude<keyof I["transaction"]["tx"], keyof ConfirmedTransaction>]: never; }) | undefined;
        } & { [K_30 in Exclude<keyof I["transaction"], keyof TransactionUpdate>]: never; }) | undefined;
    } & { [K_31 in Exclude<keyof I, keyof TimestampedTransactionUpdate>]: never; }>(base?: I | undefined): TimestampedTransactionUpdate;
    fromPartial<I_1 extends {
        ts?: Date | undefined;
        transaction?: {
            slot?: number | undefined;
            signature?: string | undefined;
            isVote?: boolean | undefined;
            txIdx?: number | undefined;
            tx?: {
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
            } | undefined;
        } | undefined;
    } & {
        ts?: Date | undefined;
        transaction?: ({
            slot?: number | undefined;
            signature?: string | undefined;
            isVote?: boolean | undefined;
            txIdx?: number | undefined;
            tx?: {
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
            } | undefined;
        } & {
            slot?: number | undefined;
            signature?: string | undefined;
            isVote?: boolean | undefined;
            txIdx?: number | undefined;
            tx?: ({
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
                    signatures?: (Uint8Array[] & Uint8Array[] & { [K_32 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["signatures"], keyof Uint8Array[]>]: never; }) | undefined;
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
                        } & { [K_33 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["message"]["header"], keyof import("./confirmed_block").MessageHeader>]: never; }) | undefined;
                        accountKeys?: (Uint8Array[] & Uint8Array[] & { [K_34 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["message"]["accountKeys"], keyof Uint8Array[]>]: never; }) | undefined;
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
                        } & { [K_35 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["message"]["instructions"][number], keyof import("./confirmed_block").CompiledInstruction>]: never; })[] & { [K_36 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["message"]["instructions"], keyof {
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
                        } & { [K_37 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["message"]["addressTableLookups"][number], keyof import("./confirmed_block").MessageAddressTableLookup>]: never; })[] & { [K_38 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["message"]["addressTableLookups"], keyof {
                            accountKey?: Uint8Array | undefined;
                            writableIndexes?: Uint8Array | undefined;
                            readonlyIndexes?: Uint8Array | undefined;
                        }[]>]: never; }) | undefined;
                    } & { [K_39 in Exclude<keyof I_1["transaction"]["tx"]["transaction"]["message"], keyof import("./confirmed_block").Message>]: never; }) | undefined;
                } & { [K_40 in Exclude<keyof I_1["transaction"]["tx"]["transaction"], keyof import("./confirmed_block").Transaction>]: never; }) | undefined;
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
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
                    } & { [K_41 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["err"], "err">]: never; }) | undefined;
                    fee?: number | undefined;
                    preBalances?: (number[] & number[] & { [K_42 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["preBalances"], keyof number[]>]: never; }) | undefined;
                    postBalances?: (number[] & number[] & { [K_43 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["postBalances"], keyof number[]>]: never; }) | undefined;
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
                        } & { [K_44 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["innerInstructions"][number]["instructions"][number], keyof import("./confirmed_block").InnerInstruction>]: never; })[] & { [K_45 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["innerInstructions"][number]["instructions"], keyof {
                            programIdIndex?: number | undefined;
                            accounts?: Uint8Array | undefined;
                            data?: Uint8Array | undefined;
                            stackHeight?: number | undefined;
                        }[]>]: never; }) | undefined;
                    } & { [K_46 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["innerInstructions"][number], keyof import("./confirmed_block").InnerInstructions>]: never; })[] & { [K_47 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["innerInstructions"], keyof {
                        index?: number | undefined;
                        instructions?: {
                            programIdIndex?: number | undefined;
                            accounts?: Uint8Array | undefined;
                            data?: Uint8Array | undefined;
                            stackHeight?: number | undefined;
                        }[] | undefined;
                    }[]>]: never; }) | undefined;
                    innerInstructionsNone?: boolean | undefined;
                    logMessages?: (string[] & string[] & { [K_48 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["logMessages"], keyof string[]>]: never; }) | undefined;
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
                        } & { [K_49 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["preTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                        owner?: string | undefined;
                        programId?: string | undefined;
                    } & { [K_50 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["preTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_51 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["preTokenBalances"], keyof {
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
                        } & { [K_52 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["postTokenBalances"][number]["uiTokenAmount"], keyof import("./confirmed_block").UiTokenAmount>]: never; }) | undefined;
                        owner?: string | undefined;
                        programId?: string | undefined;
                    } & { [K_53 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["postTokenBalances"][number], keyof import("./confirmed_block").TokenBalance>]: never; })[] & { [K_54 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["postTokenBalances"], keyof {
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
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    }[] & ({
                        pubkey?: string | undefined;
                        lamports?: number | undefined;
                        postBalance?: number | undefined;
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    } & {
                        pubkey?: string | undefined;
                        lamports?: number | undefined;
                        postBalance?: number | undefined;
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    } & { [K_55 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["rewards"][number], keyof Reward>]: never; })[] & { [K_56 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["rewards"], keyof {
                        pubkey?: string | undefined;
                        lamports?: number | undefined;
                        postBalance?: number | undefined;
                        rewardType?: import("./confirmed_block").RewardType | undefined;
                        commission?: string | undefined;
                    }[]>]: never; }) | undefined;
                    loadedWritableAddresses?: (Uint8Array[] & Uint8Array[] & { [K_57 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["loadedWritableAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                    loadedReadonlyAddresses?: (Uint8Array[] & Uint8Array[] & { [K_58 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["loadedReadonlyAddresses"], keyof Uint8Array[]>]: never; }) | undefined;
                    returnData?: ({
                        programId?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & {
                        programId?: Uint8Array | undefined;
                        data?: Uint8Array | undefined;
                    } & { [K_59 in Exclude<keyof I_1["transaction"]["tx"]["meta"]["returnData"], keyof import("./confirmed_block").ReturnData>]: never; }) | undefined;
                    returnDataNone?: boolean | undefined;
                    computeUnitsConsumed?: number | undefined;
                } & { [K_60 in Exclude<keyof I_1["transaction"]["tx"]["meta"], keyof import("./confirmed_block").TransactionStatusMeta>]: never; }) | undefined;
            } & { [K_61 in Exclude<keyof I_1["transaction"]["tx"], keyof ConfirmedTransaction>]: never; }) | undefined;
        } & { [K_62 in Exclude<keyof I_1["transaction"], keyof TransactionUpdate>]: never; }) | undefined;
    } & { [K_63 in Exclude<keyof I_1, keyof TimestampedTransactionUpdate>]: never; }>(object: I_1): TimestampedTransactionUpdate;
};
export declare const SubscribeSlotUpdateRequest: {
    encode(_: SubscribeSlotUpdateRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeSlotUpdateRequest;
    fromJSON(_: any): SubscribeSlotUpdateRequest;
    toJSON(_: SubscribeSlotUpdateRequest): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): SubscribeSlotUpdateRequest;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): SubscribeSlotUpdateRequest;
};
export declare const SubscribeAccountUpdatesRequest: {
    encode(message: SubscribeAccountUpdatesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeAccountUpdatesRequest;
    fromJSON(object: any): SubscribeAccountUpdatesRequest;
    toJSON(message: SubscribeAccountUpdatesRequest): unknown;
    create<I extends {
        accounts?: Uint8Array[] | undefined;
    } & {
        accounts?: (Uint8Array[] & Uint8Array[] & { [K in Exclude<keyof I["accounts"], keyof Uint8Array[]>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, "accounts">]: never; }>(base?: I | undefined): SubscribeAccountUpdatesRequest;
    fromPartial<I_1 extends {
        accounts?: Uint8Array[] | undefined;
    } & {
        accounts?: (Uint8Array[] & Uint8Array[] & { [K_2 in Exclude<keyof I_1["accounts"], keyof Uint8Array[]>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, "accounts">]: never; }>(object: I_1): SubscribeAccountUpdatesRequest;
};
export declare const SubscribeProgramsUpdatesRequest: {
    encode(message: SubscribeProgramsUpdatesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeProgramsUpdatesRequest;
    fromJSON(object: any): SubscribeProgramsUpdatesRequest;
    toJSON(message: SubscribeProgramsUpdatesRequest): unknown;
    create<I extends {
        programs?: Uint8Array[] | undefined;
    } & {
        programs?: (Uint8Array[] & Uint8Array[] & { [K in Exclude<keyof I["programs"], keyof Uint8Array[]>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, "programs">]: never; }>(base?: I | undefined): SubscribeProgramsUpdatesRequest;
    fromPartial<I_1 extends {
        programs?: Uint8Array[] | undefined;
    } & {
        programs?: (Uint8Array[] & Uint8Array[] & { [K_2 in Exclude<keyof I_1["programs"], keyof Uint8Array[]>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, "programs">]: never; }>(object: I_1): SubscribeProgramsUpdatesRequest;
};
export declare const SubscribePartialAccountUpdatesRequest: {
    encode(message: SubscribePartialAccountUpdatesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubscribePartialAccountUpdatesRequest;
    fromJSON(object: any): SubscribePartialAccountUpdatesRequest;
    toJSON(message: SubscribePartialAccountUpdatesRequest): unknown;
    create<I extends {
        skipVoteAccounts?: boolean | undefined;
    } & {
        skipVoteAccounts?: boolean | undefined;
    } & { [K in Exclude<keyof I, "skipVoteAccounts">]: never; }>(base?: I | undefined): SubscribePartialAccountUpdatesRequest;
    fromPartial<I_1 extends {
        skipVoteAccounts?: boolean | undefined;
    } & {
        skipVoteAccounts?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I_1, "skipVoteAccounts">]: never; }>(object: I_1): SubscribePartialAccountUpdatesRequest;
};
export declare const GetHeartbeatIntervalResponse: {
    encode(message: GetHeartbeatIntervalResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetHeartbeatIntervalResponse;
    fromJSON(object: any): GetHeartbeatIntervalResponse;
    toJSON(message: GetHeartbeatIntervalResponse): unknown;
    create<I extends {
        heartbeatIntervalMs?: number | undefined;
    } & {
        heartbeatIntervalMs?: number | undefined;
    } & { [K in Exclude<keyof I, "heartbeatIntervalMs">]: never; }>(base?: I | undefined): GetHeartbeatIntervalResponse;
    fromPartial<I_1 extends {
        heartbeatIntervalMs?: number | undefined;
    } & {
        heartbeatIntervalMs?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "heartbeatIntervalMs">]: never; }>(object: I_1): GetHeartbeatIntervalResponse;
};
/**
 * The following __must__ be assumed:
 *    - Clients may receive data for slots out of order.
 *    - Clients may receive account updates for a given slot out of order.
 */
export type GeyserService = typeof GeyserService;
export declare const GeyserService: {
    /** Invoke to get the expected heartbeat interval. */
    readonly getHeartbeatInterval: {
        readonly path: "/solana.geyser.Geyser/GetHeartbeatInterval";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: EmptyRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => EmptyRequest;
        readonly responseSerialize: (value: GetHeartbeatIntervalResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => GetHeartbeatIntervalResponse;
    };
    /**
     * Subscribes to account updates in the accounts database; additionally pings clients with empty heartbeats.
     * Upon initially connecting the client can expect a `highest_write_slot` set in the http headers.
     * Subscribe to account updates
     */
    readonly subscribeAccountUpdates: {
        readonly path: "/solana.geyser.Geyser/SubscribeAccountUpdates";
        readonly requestStream: false;
        readonly responseStream: true;
        readonly requestSerialize: (value: SubscribeAccountUpdatesRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => SubscribeAccountUpdatesRequest;
        readonly responseSerialize: (value: TimestampedAccountUpdate) => Buffer;
        readonly responseDeserialize: (value: Buffer) => TimestampedAccountUpdate;
    };
    /**
     * Subscribes to updates given a list of program IDs. When an account update comes in that's owned by a provided
     * program id, one will receive an update
     */
    readonly subscribeProgramUpdates: {
        readonly path: "/solana.geyser.Geyser/SubscribeProgramUpdates";
        readonly requestStream: false;
        readonly responseStream: true;
        readonly requestSerialize: (value: SubscribeProgramsUpdatesRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => SubscribeProgramsUpdatesRequest;
        readonly responseSerialize: (value: TimestampedAccountUpdate) => Buffer;
        readonly responseDeserialize: (value: Buffer) => TimestampedAccountUpdate;
    };
    /**
     * Functions similarly to `SubscribeAccountUpdates`, but consumes less bandwidth.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    readonly subscribePartialAccountUpdates: {
        readonly path: "/solana.geyser.Geyser/SubscribePartialAccountUpdates";
        readonly requestStream: false;
        readonly responseStream: true;
        readonly requestSerialize: (value: SubscribePartialAccountUpdatesRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => SubscribePartialAccountUpdatesRequest;
        readonly responseSerialize: (value: MaybePartialAccountUpdate) => Buffer;
        readonly responseDeserialize: (value: Buffer) => MaybePartialAccountUpdate;
    };
    /**
     * Subscribes to slot updates.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    readonly subscribeSlotUpdates: {
        readonly path: "/solana.geyser.Geyser/SubscribeSlotUpdates";
        readonly requestStream: false;
        readonly responseStream: true;
        readonly requestSerialize: (value: SubscribeSlotUpdateRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => SubscribeSlotUpdateRequest;
        readonly responseSerialize: (value: TimestampedSlotUpdate) => Buffer;
        readonly responseDeserialize: (value: Buffer) => TimestampedSlotUpdate;
    };
    /** Subscribes to transaction updates. */
    readonly subscribeTransactionUpdates: {
        readonly path: "/solana.geyser.Geyser/SubscribeTransactionUpdates";
        readonly requestStream: false;
        readonly responseStream: true;
        readonly requestSerialize: (value: SubscribeTransactionUpdatesRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => SubscribeTransactionUpdatesRequest;
        readonly responseSerialize: (value: TimestampedTransactionUpdate) => Buffer;
        readonly responseDeserialize: (value: Buffer) => TimestampedTransactionUpdate;
    };
    /** Subscribes to block updates. */
    readonly subscribeBlockUpdates: {
        readonly path: "/solana.geyser.Geyser/SubscribeBlockUpdates";
        readonly requestStream: false;
        readonly responseStream: true;
        readonly requestSerialize: (value: SubscribeBlockUpdatesRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => SubscribeBlockUpdatesRequest;
        readonly responseSerialize: (value: TimestampedBlockUpdate) => Buffer;
        readonly responseDeserialize: (value: Buffer) => TimestampedBlockUpdate;
    };
};
export interface GeyserServer extends UntypedServiceImplementation {
    /** Invoke to get the expected heartbeat interval. */
    getHeartbeatInterval: handleUnaryCall<EmptyRequest, GetHeartbeatIntervalResponse>;
    /**
     * Subscribes to account updates in the accounts database; additionally pings clients with empty heartbeats.
     * Upon initially connecting the client can expect a `highest_write_slot` set in the http headers.
     * Subscribe to account updates
     */
    subscribeAccountUpdates: handleServerStreamingCall<SubscribeAccountUpdatesRequest, TimestampedAccountUpdate>;
    /**
     * Subscribes to updates given a list of program IDs. When an account update comes in that's owned by a provided
     * program id, one will receive an update
     */
    subscribeProgramUpdates: handleServerStreamingCall<SubscribeProgramsUpdatesRequest, TimestampedAccountUpdate>;
    /**
     * Functions similarly to `SubscribeAccountUpdates`, but consumes less bandwidth.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    subscribePartialAccountUpdates: handleServerStreamingCall<SubscribePartialAccountUpdatesRequest, MaybePartialAccountUpdate>;
    /**
     * Subscribes to slot updates.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    subscribeSlotUpdates: handleServerStreamingCall<SubscribeSlotUpdateRequest, TimestampedSlotUpdate>;
    /** Subscribes to transaction updates. */
    subscribeTransactionUpdates: handleServerStreamingCall<SubscribeTransactionUpdatesRequest, TimestampedTransactionUpdate>;
    /** Subscribes to block updates. */
    subscribeBlockUpdates: handleServerStreamingCall<SubscribeBlockUpdatesRequest, TimestampedBlockUpdate>;
}
export interface GeyserClient extends Client {
    /** Invoke to get the expected heartbeat interval. */
    getHeartbeatInterval(request: EmptyRequest, callback: (error: ServiceError | null, response: GetHeartbeatIntervalResponse) => void): ClientUnaryCall;
    getHeartbeatInterval(request: EmptyRequest, metadata: Metadata, callback: (error: ServiceError | null, response: GetHeartbeatIntervalResponse) => void): ClientUnaryCall;
    getHeartbeatInterval(request: EmptyRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GetHeartbeatIntervalResponse) => void): ClientUnaryCall;
    /**
     * Subscribes to account updates in the accounts database; additionally pings clients with empty heartbeats.
     * Upon initially connecting the client can expect a `highest_write_slot` set in the http headers.
     * Subscribe to account updates
     */
    subscribeAccountUpdates(request: SubscribeAccountUpdatesRequest, options?: Partial<CallOptions>): ClientReadableStream<TimestampedAccountUpdate>;
    subscribeAccountUpdates(request: SubscribeAccountUpdatesRequest, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<TimestampedAccountUpdate>;
    /**
     * Subscribes to updates given a list of program IDs. When an account update comes in that's owned by a provided
     * program id, one will receive an update
     */
    subscribeProgramUpdates(request: SubscribeProgramsUpdatesRequest, options?: Partial<CallOptions>): ClientReadableStream<TimestampedAccountUpdate>;
    subscribeProgramUpdates(request: SubscribeProgramsUpdatesRequest, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<TimestampedAccountUpdate>;
    /**
     * Functions similarly to `SubscribeAccountUpdates`, but consumes less bandwidth.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    subscribePartialAccountUpdates(request: SubscribePartialAccountUpdatesRequest, options?: Partial<CallOptions>): ClientReadableStream<MaybePartialAccountUpdate>;
    subscribePartialAccountUpdates(request: SubscribePartialAccountUpdatesRequest, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<MaybePartialAccountUpdate>;
    /**
     * Subscribes to slot updates.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    subscribeSlotUpdates(request: SubscribeSlotUpdateRequest, options?: Partial<CallOptions>): ClientReadableStream<TimestampedSlotUpdate>;
    subscribeSlotUpdates(request: SubscribeSlotUpdateRequest, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<TimestampedSlotUpdate>;
    /** Subscribes to transaction updates. */
    subscribeTransactionUpdates(request: SubscribeTransactionUpdatesRequest, options?: Partial<CallOptions>): ClientReadableStream<TimestampedTransactionUpdate>;
    subscribeTransactionUpdates(request: SubscribeTransactionUpdatesRequest, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<TimestampedTransactionUpdate>;
    /** Subscribes to block updates. */
    subscribeBlockUpdates(request: SubscribeBlockUpdatesRequest, options?: Partial<CallOptions>): ClientReadableStream<TimestampedBlockUpdate>;
    subscribeBlockUpdates(request: SubscribeBlockUpdatesRequest, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<TimestampedBlockUpdate>;
}
export declare const GeyserClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): GeyserClient;
    service: typeof GeyserService;
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
