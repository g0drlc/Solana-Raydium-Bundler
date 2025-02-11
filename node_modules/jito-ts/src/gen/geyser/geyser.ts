/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientReadableStream,
  ClientUnaryCall,
  handleServerStreamingCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { ConfirmedTransaction, Reward } from "./confirmed_block";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "solana.geyser";

export enum SlotUpdateStatus {
  CONFIRMED = 0,
  PROCESSED = 1,
  ROOTED = 2,
  UNRECOGNIZED = -1,
}

export function slotUpdateStatusFromJSON(object: any): SlotUpdateStatus {
  switch (object) {
    case 0:
    case "CONFIRMED":
      return SlotUpdateStatus.CONFIRMED;
    case 1:
    case "PROCESSED":
      return SlotUpdateStatus.PROCESSED;
    case 2:
    case "ROOTED":
      return SlotUpdateStatus.ROOTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SlotUpdateStatus.UNRECOGNIZED;
  }
}

export function slotUpdateStatusToJSON(object: SlotUpdateStatus): string {
  switch (object) {
    case SlotUpdateStatus.CONFIRMED:
      return "CONFIRMED";
    case SlotUpdateStatus.PROCESSED:
      return "PROCESSED";
    case SlotUpdateStatus.ROOTED:
      return "ROOTED";
    case SlotUpdateStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

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
  txSignature?:
    | string
    | undefined;
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
  txSignature?:
    | string
    | undefined;
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
  ts:
    | Date
    | undefined;
  /** Slot update */
  slotUpdate: SlotUpdate | undefined;
}

export interface TimestampedAccountUpdate {
  /** Time at which the message was generated */
  ts:
    | Date
    | undefined;
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
  ts:
    | Date
    | undefined;
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

function createBasePartialAccountUpdate(): PartialAccountUpdate {
  return {
    slot: 0,
    pubkey: new Uint8Array(),
    owner: new Uint8Array(),
    isStartup: false,
    seq: 0,
    txSignature: undefined,
    replicaVersion: 0,
  };
}

export const PartialAccountUpdate = {
  encode(message: PartialAccountUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.slot !== 0) {
      writer.uint32(8).uint64(message.slot);
    }
    if (message.pubkey.length !== 0) {
      writer.uint32(18).bytes(message.pubkey);
    }
    if (message.owner.length !== 0) {
      writer.uint32(26).bytes(message.owner);
    }
    if (message.isStartup === true) {
      writer.uint32(32).bool(message.isStartup);
    }
    if (message.seq !== 0) {
      writer.uint32(40).uint64(message.seq);
    }
    if (message.txSignature !== undefined) {
      writer.uint32(50).string(message.txSignature);
    }
    if (message.replicaVersion !== 0) {
      writer.uint32(56).uint32(message.replicaVersion);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PartialAccountUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePartialAccountUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.pubkey = reader.bytes();
          break;
        case 3:
          message.owner = reader.bytes();
          break;
        case 4:
          message.isStartup = reader.bool();
          break;
        case 5:
          message.seq = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.txSignature = reader.string();
          break;
        case 7:
          message.replicaVersion = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PartialAccountUpdate {
    return {
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      pubkey: isSet(object.pubkey) ? bytesFromBase64(object.pubkey) : new Uint8Array(),
      owner: isSet(object.owner) ? bytesFromBase64(object.owner) : new Uint8Array(),
      isStartup: isSet(object.isStartup) ? Boolean(object.isStartup) : false,
      seq: isSet(object.seq) ? Number(object.seq) : 0,
      txSignature: isSet(object.txSignature) ? String(object.txSignature) : undefined,
      replicaVersion: isSet(object.replicaVersion) ? Number(object.replicaVersion) : 0,
    };
  },

  toJSON(message: PartialAccountUpdate): unknown {
    const obj: any = {};
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.pubkey !== undefined &&
      (obj.pubkey = base64FromBytes(message.pubkey !== undefined ? message.pubkey : new Uint8Array()));
    message.owner !== undefined &&
      (obj.owner = base64FromBytes(message.owner !== undefined ? message.owner : new Uint8Array()));
    message.isStartup !== undefined && (obj.isStartup = message.isStartup);
    message.seq !== undefined && (obj.seq = Math.round(message.seq));
    message.txSignature !== undefined && (obj.txSignature = message.txSignature);
    message.replicaVersion !== undefined && (obj.replicaVersion = Math.round(message.replicaVersion));
    return obj;
  },

  create<I extends Exact<DeepPartial<PartialAccountUpdate>, I>>(base?: I): PartialAccountUpdate {
    return PartialAccountUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PartialAccountUpdate>, I>>(object: I): PartialAccountUpdate {
    const message = createBasePartialAccountUpdate();
    message.slot = object.slot ?? 0;
    message.pubkey = object.pubkey ?? new Uint8Array();
    message.owner = object.owner ?? new Uint8Array();
    message.isStartup = object.isStartup ?? false;
    message.seq = object.seq ?? 0;
    message.txSignature = object.txSignature ?? undefined;
    message.replicaVersion = object.replicaVersion ?? 0;
    return message;
  },
};

function createBaseAccountUpdate(): AccountUpdate {
  return {
    slot: 0,
    pubkey: new Uint8Array(),
    lamports: 0,
    owner: new Uint8Array(),
    isExecutable: false,
    rentEpoch: 0,
    data: new Uint8Array(),
    seq: 0,
    isStartup: false,
    txSignature: undefined,
    replicaVersion: 0,
  };
}

export const AccountUpdate = {
  encode(message: AccountUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.slot !== 0) {
      writer.uint32(8).uint64(message.slot);
    }
    if (message.pubkey.length !== 0) {
      writer.uint32(18).bytes(message.pubkey);
    }
    if (message.lamports !== 0) {
      writer.uint32(24).uint64(message.lamports);
    }
    if (message.owner.length !== 0) {
      writer.uint32(34).bytes(message.owner);
    }
    if (message.isExecutable === true) {
      writer.uint32(40).bool(message.isExecutable);
    }
    if (message.rentEpoch !== 0) {
      writer.uint32(48).uint64(message.rentEpoch);
    }
    if (message.data.length !== 0) {
      writer.uint32(58).bytes(message.data);
    }
    if (message.seq !== 0) {
      writer.uint32(64).uint64(message.seq);
    }
    if (message.isStartup === true) {
      writer.uint32(72).bool(message.isStartup);
    }
    if (message.txSignature !== undefined) {
      writer.uint32(82).string(message.txSignature);
    }
    if (message.replicaVersion !== 0) {
      writer.uint32(88).uint32(message.replicaVersion);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.pubkey = reader.bytes();
          break;
        case 3:
          message.lamports = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.owner = reader.bytes();
          break;
        case 5:
          message.isExecutable = reader.bool();
          break;
        case 6:
          message.rentEpoch = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.data = reader.bytes();
          break;
        case 8:
          message.seq = longToNumber(reader.uint64() as Long);
          break;
        case 9:
          message.isStartup = reader.bool();
          break;
        case 10:
          message.txSignature = reader.string();
          break;
        case 11:
          message.replicaVersion = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AccountUpdate {
    return {
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      pubkey: isSet(object.pubkey) ? bytesFromBase64(object.pubkey) : new Uint8Array(),
      lamports: isSet(object.lamports) ? Number(object.lamports) : 0,
      owner: isSet(object.owner) ? bytesFromBase64(object.owner) : new Uint8Array(),
      isExecutable: isSet(object.isExecutable) ? Boolean(object.isExecutable) : false,
      rentEpoch: isSet(object.rentEpoch) ? Number(object.rentEpoch) : 0,
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
      seq: isSet(object.seq) ? Number(object.seq) : 0,
      isStartup: isSet(object.isStartup) ? Boolean(object.isStartup) : false,
      txSignature: isSet(object.txSignature) ? String(object.txSignature) : undefined,
      replicaVersion: isSet(object.replicaVersion) ? Number(object.replicaVersion) : 0,
    };
  },

  toJSON(message: AccountUpdate): unknown {
    const obj: any = {};
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.pubkey !== undefined &&
      (obj.pubkey = base64FromBytes(message.pubkey !== undefined ? message.pubkey : new Uint8Array()));
    message.lamports !== undefined && (obj.lamports = Math.round(message.lamports));
    message.owner !== undefined &&
      (obj.owner = base64FromBytes(message.owner !== undefined ? message.owner : new Uint8Array()));
    message.isExecutable !== undefined && (obj.isExecutable = message.isExecutable);
    message.rentEpoch !== undefined && (obj.rentEpoch = Math.round(message.rentEpoch));
    message.data !== undefined &&
      (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
    message.seq !== undefined && (obj.seq = Math.round(message.seq));
    message.isStartup !== undefined && (obj.isStartup = message.isStartup);
    message.txSignature !== undefined && (obj.txSignature = message.txSignature);
    message.replicaVersion !== undefined && (obj.replicaVersion = Math.round(message.replicaVersion));
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountUpdate>, I>>(base?: I): AccountUpdate {
    return AccountUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AccountUpdate>, I>>(object: I): AccountUpdate {
    const message = createBaseAccountUpdate();
    message.slot = object.slot ?? 0;
    message.pubkey = object.pubkey ?? new Uint8Array();
    message.lamports = object.lamports ?? 0;
    message.owner = object.owner ?? new Uint8Array();
    message.isExecutable = object.isExecutable ?? false;
    message.rentEpoch = object.rentEpoch ?? 0;
    message.data = object.data ?? new Uint8Array();
    message.seq = object.seq ?? 0;
    message.isStartup = object.isStartup ?? false;
    message.txSignature = object.txSignature ?? undefined;
    message.replicaVersion = object.replicaVersion ?? 0;
    return message;
  },
};

function createBaseSlotUpdate(): SlotUpdate {
  return { slot: 0, parentSlot: undefined, status: 0 };
}

export const SlotUpdate = {
  encode(message: SlotUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.slot !== 0) {
      writer.uint32(8).uint64(message.slot);
    }
    if (message.parentSlot !== undefined) {
      writer.uint32(16).uint64(message.parentSlot);
    }
    if (message.status !== 0) {
      writer.uint32(24).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SlotUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSlotUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.parentSlot = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.status = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SlotUpdate {
    return {
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      parentSlot: isSet(object.parentSlot) ? Number(object.parentSlot) : undefined,
      status: isSet(object.status) ? slotUpdateStatusFromJSON(object.status) : 0,
    };
  },

  toJSON(message: SlotUpdate): unknown {
    const obj: any = {};
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.parentSlot !== undefined && (obj.parentSlot = Math.round(message.parentSlot));
    message.status !== undefined && (obj.status = slotUpdateStatusToJSON(message.status));
    return obj;
  },

  create<I extends Exact<DeepPartial<SlotUpdate>, I>>(base?: I): SlotUpdate {
    return SlotUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SlotUpdate>, I>>(object: I): SlotUpdate {
    const message = createBaseSlotUpdate();
    message.slot = object.slot ?? 0;
    message.parentSlot = object.parentSlot ?? undefined;
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseTimestampedSlotUpdate(): TimestampedSlotUpdate {
  return { ts: undefined, slotUpdate: undefined };
}

export const TimestampedSlotUpdate = {
  encode(message: TimestampedSlotUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ts !== undefined) {
      Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
    }
    if (message.slotUpdate !== undefined) {
      SlotUpdate.encode(message.slotUpdate, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedSlotUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestampedSlotUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ts = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 2:
          message.slotUpdate = SlotUpdate.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TimestampedSlotUpdate {
    return {
      ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
      slotUpdate: isSet(object.slotUpdate) ? SlotUpdate.fromJSON(object.slotUpdate) : undefined,
    };
  },

  toJSON(message: TimestampedSlotUpdate): unknown {
    const obj: any = {};
    message.ts !== undefined && (obj.ts = message.ts.toISOString());
    message.slotUpdate !== undefined &&
      (obj.slotUpdate = message.slotUpdate ? SlotUpdate.toJSON(message.slotUpdate) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TimestampedSlotUpdate>, I>>(base?: I): TimestampedSlotUpdate {
    return TimestampedSlotUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TimestampedSlotUpdate>, I>>(object: I): TimestampedSlotUpdate {
    const message = createBaseTimestampedSlotUpdate();
    message.ts = object.ts ?? undefined;
    message.slotUpdate = (object.slotUpdate !== undefined && object.slotUpdate !== null)
      ? SlotUpdate.fromPartial(object.slotUpdate)
      : undefined;
    return message;
  },
};

function createBaseTimestampedAccountUpdate(): TimestampedAccountUpdate {
  return { ts: undefined, accountUpdate: undefined };
}

export const TimestampedAccountUpdate = {
  encode(message: TimestampedAccountUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ts !== undefined) {
      Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
    }
    if (message.accountUpdate !== undefined) {
      AccountUpdate.encode(message.accountUpdate, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedAccountUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestampedAccountUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ts = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 2:
          message.accountUpdate = AccountUpdate.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TimestampedAccountUpdate {
    return {
      ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
      accountUpdate: isSet(object.accountUpdate) ? AccountUpdate.fromJSON(object.accountUpdate) : undefined,
    };
  },

  toJSON(message: TimestampedAccountUpdate): unknown {
    const obj: any = {};
    message.ts !== undefined && (obj.ts = message.ts.toISOString());
    message.accountUpdate !== undefined &&
      (obj.accountUpdate = message.accountUpdate ? AccountUpdate.toJSON(message.accountUpdate) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TimestampedAccountUpdate>, I>>(base?: I): TimestampedAccountUpdate {
    return TimestampedAccountUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TimestampedAccountUpdate>, I>>(object: I): TimestampedAccountUpdate {
    const message = createBaseTimestampedAccountUpdate();
    message.ts = object.ts ?? undefined;
    message.accountUpdate = (object.accountUpdate !== undefined && object.accountUpdate !== null)
      ? AccountUpdate.fromPartial(object.accountUpdate)
      : undefined;
    return message;
  },
};

function createBaseSubscribeTransactionUpdatesRequest(): SubscribeTransactionUpdatesRequest {
  return {};
}

export const SubscribeTransactionUpdatesRequest = {
  encode(_: SubscribeTransactionUpdatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeTransactionUpdatesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeTransactionUpdatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): SubscribeTransactionUpdatesRequest {
    return {};
  },

  toJSON(_: SubscribeTransactionUpdatesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeTransactionUpdatesRequest>, I>>(
    base?: I,
  ): SubscribeTransactionUpdatesRequest {
    return SubscribeTransactionUpdatesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeTransactionUpdatesRequest>, I>>(
    _: I,
  ): SubscribeTransactionUpdatesRequest {
    const message = createBaseSubscribeTransactionUpdatesRequest();
    return message;
  },
};

function createBaseSubscribeBlockUpdatesRequest(): SubscribeBlockUpdatesRequest {
  return {};
}

export const SubscribeBlockUpdatesRequest = {
  encode(_: SubscribeBlockUpdatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeBlockUpdatesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeBlockUpdatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): SubscribeBlockUpdatesRequest {
    return {};
  },

  toJSON(_: SubscribeBlockUpdatesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeBlockUpdatesRequest>, I>>(base?: I): SubscribeBlockUpdatesRequest {
    return SubscribeBlockUpdatesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeBlockUpdatesRequest>, I>>(_: I): SubscribeBlockUpdatesRequest {
    const message = createBaseSubscribeBlockUpdatesRequest();
    return message;
  },
};

function createBaseMaybePartialAccountUpdate(): MaybePartialAccountUpdate {
  return { partialAccountUpdate: undefined, hb: undefined };
}

export const MaybePartialAccountUpdate = {
  encode(message: MaybePartialAccountUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.partialAccountUpdate !== undefined) {
      PartialAccountUpdate.encode(message.partialAccountUpdate, writer.uint32(10).fork()).ldelim();
    }
    if (message.hb !== undefined) {
      Heartbeat.encode(message.hb, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MaybePartialAccountUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMaybePartialAccountUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.partialAccountUpdate = PartialAccountUpdate.decode(reader, reader.uint32());
          break;
        case 2:
          message.hb = Heartbeat.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MaybePartialAccountUpdate {
    return {
      partialAccountUpdate: isSet(object.partialAccountUpdate)
        ? PartialAccountUpdate.fromJSON(object.partialAccountUpdate)
        : undefined,
      hb: isSet(object.hb) ? Heartbeat.fromJSON(object.hb) : undefined,
    };
  },

  toJSON(message: MaybePartialAccountUpdate): unknown {
    const obj: any = {};
    message.partialAccountUpdate !== undefined && (obj.partialAccountUpdate = message.partialAccountUpdate
      ? PartialAccountUpdate.toJSON(message.partialAccountUpdate)
      : undefined);
    message.hb !== undefined && (obj.hb = message.hb ? Heartbeat.toJSON(message.hb) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<MaybePartialAccountUpdate>, I>>(base?: I): MaybePartialAccountUpdate {
    return MaybePartialAccountUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MaybePartialAccountUpdate>, I>>(object: I): MaybePartialAccountUpdate {
    const message = createBaseMaybePartialAccountUpdate();
    message.partialAccountUpdate = (object.partialAccountUpdate !== undefined && object.partialAccountUpdate !== null)
      ? PartialAccountUpdate.fromPartial(object.partialAccountUpdate)
      : undefined;
    message.hb = (object.hb !== undefined && object.hb !== null) ? Heartbeat.fromPartial(object.hb) : undefined;
    return message;
  },
};

function createBaseHeartbeat(): Heartbeat {
  return {};
}

export const Heartbeat = {
  encode(_: Heartbeat, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Heartbeat {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartbeat();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): Heartbeat {
    return {};
  },

  toJSON(_: Heartbeat): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Heartbeat>, I>>(base?: I): Heartbeat {
    return Heartbeat.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Heartbeat>, I>>(_: I): Heartbeat {
    const message = createBaseHeartbeat();
    return message;
  },
};

function createBaseEmptyRequest(): EmptyRequest {
  return {};
}

export const EmptyRequest = {
  encode(_: EmptyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EmptyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmptyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): EmptyRequest {
    return {};
  },

  toJSON(_: EmptyRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<EmptyRequest>, I>>(base?: I): EmptyRequest {
    return EmptyRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EmptyRequest>, I>>(_: I): EmptyRequest {
    const message = createBaseEmptyRequest();
    return message;
  },
};

function createBaseBlockUpdate(): BlockUpdate {
  return {
    slot: 0,
    blockhash: "",
    rewards: [],
    blockTime: undefined,
    blockHeight: undefined,
    executedTransactionCount: undefined,
    entryCount: undefined,
  };
}

export const BlockUpdate = {
  encode(message: BlockUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.slot !== 0) {
      writer.uint32(8).uint64(message.slot);
    }
    if (message.blockhash !== "") {
      writer.uint32(18).string(message.blockhash);
    }
    for (const v of message.rewards) {
      Reward.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.blockTime !== undefined) {
      Timestamp.encode(toTimestamp(message.blockTime), writer.uint32(34).fork()).ldelim();
    }
    if (message.blockHeight !== undefined) {
      writer.uint32(40).uint64(message.blockHeight);
    }
    if (message.executedTransactionCount !== undefined) {
      writer.uint32(48).uint64(message.executedTransactionCount);
    }
    if (message.entryCount !== undefined) {
      writer.uint32(56).uint64(message.entryCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BlockUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlockUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.blockhash = reader.string();
          break;
        case 3:
          message.rewards.push(Reward.decode(reader, reader.uint32()));
          break;
        case 4:
          message.blockTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 5:
          message.blockHeight = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.executedTransactionCount = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.entryCount = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BlockUpdate {
    return {
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      blockhash: isSet(object.blockhash) ? String(object.blockhash) : "",
      rewards: Array.isArray(object?.rewards) ? object.rewards.map((e: any) => Reward.fromJSON(e)) : [],
      blockTime: isSet(object.blockTime) ? fromJsonTimestamp(object.blockTime) : undefined,
      blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : undefined,
      executedTransactionCount: isSet(object.executedTransactionCount)
        ? Number(object.executedTransactionCount)
        : undefined,
      entryCount: isSet(object.entryCount) ? Number(object.entryCount) : undefined,
    };
  },

  toJSON(message: BlockUpdate): unknown {
    const obj: any = {};
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.blockhash !== undefined && (obj.blockhash = message.blockhash);
    if (message.rewards) {
      obj.rewards = message.rewards.map((e) => e ? Reward.toJSON(e) : undefined);
    } else {
      obj.rewards = [];
    }
    message.blockTime !== undefined && (obj.blockTime = message.blockTime.toISOString());
    message.blockHeight !== undefined && (obj.blockHeight = Math.round(message.blockHeight));
    message.executedTransactionCount !== undefined &&
      (obj.executedTransactionCount = Math.round(message.executedTransactionCount));
    message.entryCount !== undefined && (obj.entryCount = Math.round(message.entryCount));
    return obj;
  },

  create<I extends Exact<DeepPartial<BlockUpdate>, I>>(base?: I): BlockUpdate {
    return BlockUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BlockUpdate>, I>>(object: I): BlockUpdate {
    const message = createBaseBlockUpdate();
    message.slot = object.slot ?? 0;
    message.blockhash = object.blockhash ?? "";
    message.rewards = object.rewards?.map((e) => Reward.fromPartial(e)) || [];
    message.blockTime = object.blockTime ?? undefined;
    message.blockHeight = object.blockHeight ?? undefined;
    message.executedTransactionCount = object.executedTransactionCount ?? undefined;
    message.entryCount = object.entryCount ?? undefined;
    return message;
  },
};

function createBaseTimestampedBlockUpdate(): TimestampedBlockUpdate {
  return { ts: undefined, blockUpdate: undefined };
}

export const TimestampedBlockUpdate = {
  encode(message: TimestampedBlockUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ts !== undefined) {
      Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
    }
    if (message.blockUpdate !== undefined) {
      BlockUpdate.encode(message.blockUpdate, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedBlockUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestampedBlockUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ts = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 2:
          message.blockUpdate = BlockUpdate.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TimestampedBlockUpdate {
    return {
      ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
      blockUpdate: isSet(object.blockUpdate) ? BlockUpdate.fromJSON(object.blockUpdate) : undefined,
    };
  },

  toJSON(message: TimestampedBlockUpdate): unknown {
    const obj: any = {};
    message.ts !== undefined && (obj.ts = message.ts.toISOString());
    message.blockUpdate !== undefined &&
      (obj.blockUpdate = message.blockUpdate ? BlockUpdate.toJSON(message.blockUpdate) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TimestampedBlockUpdate>, I>>(base?: I): TimestampedBlockUpdate {
    return TimestampedBlockUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TimestampedBlockUpdate>, I>>(object: I): TimestampedBlockUpdate {
    const message = createBaseTimestampedBlockUpdate();
    message.ts = object.ts ?? undefined;
    message.blockUpdate = (object.blockUpdate !== undefined && object.blockUpdate !== null)
      ? BlockUpdate.fromPartial(object.blockUpdate)
      : undefined;
    return message;
  },
};

function createBaseTransactionUpdate(): TransactionUpdate {
  return { slot: 0, signature: "", isVote: false, txIdx: 0, tx: undefined };
}

export const TransactionUpdate = {
  encode(message: TransactionUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.slot !== 0) {
      writer.uint32(8).uint64(message.slot);
    }
    if (message.signature !== "") {
      writer.uint32(18).string(message.signature);
    }
    if (message.isVote === true) {
      writer.uint32(24).bool(message.isVote);
    }
    if (message.txIdx !== 0) {
      writer.uint32(32).uint64(message.txIdx);
    }
    if (message.tx !== undefined) {
      ConfirmedTransaction.encode(message.tx, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.signature = reader.string();
          break;
        case 3:
          message.isVote = reader.bool();
          break;
        case 4:
          message.txIdx = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.tx = ConfirmedTransaction.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionUpdate {
    return {
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      signature: isSet(object.signature) ? String(object.signature) : "",
      isVote: isSet(object.isVote) ? Boolean(object.isVote) : false,
      txIdx: isSet(object.txIdx) ? Number(object.txIdx) : 0,
      tx: isSet(object.tx) ? ConfirmedTransaction.fromJSON(object.tx) : undefined,
    };
  },

  toJSON(message: TransactionUpdate): unknown {
    const obj: any = {};
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.signature !== undefined && (obj.signature = message.signature);
    message.isVote !== undefined && (obj.isVote = message.isVote);
    message.txIdx !== undefined && (obj.txIdx = Math.round(message.txIdx));
    message.tx !== undefined && (obj.tx = message.tx ? ConfirmedTransaction.toJSON(message.tx) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionUpdate>, I>>(base?: I): TransactionUpdate {
    return TransactionUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TransactionUpdate>, I>>(object: I): TransactionUpdate {
    const message = createBaseTransactionUpdate();
    message.slot = object.slot ?? 0;
    message.signature = object.signature ?? "";
    message.isVote = object.isVote ?? false;
    message.txIdx = object.txIdx ?? 0;
    message.tx = (object.tx !== undefined && object.tx !== null)
      ? ConfirmedTransaction.fromPartial(object.tx)
      : undefined;
    return message;
  },
};

function createBaseTimestampedTransactionUpdate(): TimestampedTransactionUpdate {
  return { ts: undefined, transaction: undefined };
}

export const TimestampedTransactionUpdate = {
  encode(message: TimestampedTransactionUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ts !== undefined) {
      Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
    }
    if (message.transaction !== undefined) {
      TransactionUpdate.encode(message.transaction, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimestampedTransactionUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestampedTransactionUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ts = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 2:
          message.transaction = TransactionUpdate.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TimestampedTransactionUpdate {
    return {
      ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
      transaction: isSet(object.transaction) ? TransactionUpdate.fromJSON(object.transaction) : undefined,
    };
  },

  toJSON(message: TimestampedTransactionUpdate): unknown {
    const obj: any = {};
    message.ts !== undefined && (obj.ts = message.ts.toISOString());
    message.transaction !== undefined &&
      (obj.transaction = message.transaction ? TransactionUpdate.toJSON(message.transaction) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TimestampedTransactionUpdate>, I>>(base?: I): TimestampedTransactionUpdate {
    return TimestampedTransactionUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TimestampedTransactionUpdate>, I>>(object: I): TimestampedTransactionUpdate {
    const message = createBaseTimestampedTransactionUpdate();
    message.ts = object.ts ?? undefined;
    message.transaction = (object.transaction !== undefined && object.transaction !== null)
      ? TransactionUpdate.fromPartial(object.transaction)
      : undefined;
    return message;
  },
};

function createBaseSubscribeSlotUpdateRequest(): SubscribeSlotUpdateRequest {
  return {};
}

export const SubscribeSlotUpdateRequest = {
  encode(_: SubscribeSlotUpdateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeSlotUpdateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeSlotUpdateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): SubscribeSlotUpdateRequest {
    return {};
  },

  toJSON(_: SubscribeSlotUpdateRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeSlotUpdateRequest>, I>>(base?: I): SubscribeSlotUpdateRequest {
    return SubscribeSlotUpdateRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeSlotUpdateRequest>, I>>(_: I): SubscribeSlotUpdateRequest {
    const message = createBaseSubscribeSlotUpdateRequest();
    return message;
  },
};

function createBaseSubscribeAccountUpdatesRequest(): SubscribeAccountUpdatesRequest {
  return { accounts: [] };
}

export const SubscribeAccountUpdatesRequest = {
  encode(message: SubscribeAccountUpdatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.accounts) {
      writer.uint32(10).bytes(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeAccountUpdatesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeAccountUpdatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(reader.bytes());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubscribeAccountUpdatesRequest {
    return { accounts: Array.isArray(object?.accounts) ? object.accounts.map((e: any) => bytesFromBase64(e)) : [] };
  },

  toJSON(message: SubscribeAccountUpdatesRequest): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
    } else {
      obj.accounts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeAccountUpdatesRequest>, I>>(base?: I): SubscribeAccountUpdatesRequest {
    return SubscribeAccountUpdatesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeAccountUpdatesRequest>, I>>(
    object: I,
  ): SubscribeAccountUpdatesRequest {
    const message = createBaseSubscribeAccountUpdatesRequest();
    message.accounts = object.accounts?.map((e) => e) || [];
    return message;
  },
};

function createBaseSubscribeProgramsUpdatesRequest(): SubscribeProgramsUpdatesRequest {
  return { programs: [] };
}

export const SubscribeProgramsUpdatesRequest = {
  encode(message: SubscribeProgramsUpdatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.programs) {
      writer.uint32(10).bytes(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeProgramsUpdatesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeProgramsUpdatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.programs.push(reader.bytes());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubscribeProgramsUpdatesRequest {
    return { programs: Array.isArray(object?.programs) ? object.programs.map((e: any) => bytesFromBase64(e)) : [] };
  },

  toJSON(message: SubscribeProgramsUpdatesRequest): unknown {
    const obj: any = {};
    if (message.programs) {
      obj.programs = message.programs.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
    } else {
      obj.programs = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeProgramsUpdatesRequest>, I>>(base?: I): SubscribeProgramsUpdatesRequest {
    return SubscribeProgramsUpdatesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeProgramsUpdatesRequest>, I>>(
    object: I,
  ): SubscribeProgramsUpdatesRequest {
    const message = createBaseSubscribeProgramsUpdatesRequest();
    message.programs = object.programs?.map((e) => e) || [];
    return message;
  },
};

function createBaseSubscribePartialAccountUpdatesRequest(): SubscribePartialAccountUpdatesRequest {
  return { skipVoteAccounts: false };
}

export const SubscribePartialAccountUpdatesRequest = {
  encode(message: SubscribePartialAccountUpdatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.skipVoteAccounts === true) {
      writer.uint32(8).bool(message.skipVoteAccounts);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribePartialAccountUpdatesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribePartialAccountUpdatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.skipVoteAccounts = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubscribePartialAccountUpdatesRequest {
    return { skipVoteAccounts: isSet(object.skipVoteAccounts) ? Boolean(object.skipVoteAccounts) : false };
  },

  toJSON(message: SubscribePartialAccountUpdatesRequest): unknown {
    const obj: any = {};
    message.skipVoteAccounts !== undefined && (obj.skipVoteAccounts = message.skipVoteAccounts);
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribePartialAccountUpdatesRequest>, I>>(
    base?: I,
  ): SubscribePartialAccountUpdatesRequest {
    return SubscribePartialAccountUpdatesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribePartialAccountUpdatesRequest>, I>>(
    object: I,
  ): SubscribePartialAccountUpdatesRequest {
    const message = createBaseSubscribePartialAccountUpdatesRequest();
    message.skipVoteAccounts = object.skipVoteAccounts ?? false;
    return message;
  },
};

function createBaseGetHeartbeatIntervalResponse(): GetHeartbeatIntervalResponse {
  return { heartbeatIntervalMs: 0 };
}

export const GetHeartbeatIntervalResponse = {
  encode(message: GetHeartbeatIntervalResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.heartbeatIntervalMs !== 0) {
      writer.uint32(8).uint64(message.heartbeatIntervalMs);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetHeartbeatIntervalResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetHeartbeatIntervalResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.heartbeatIntervalMs = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetHeartbeatIntervalResponse {
    return { heartbeatIntervalMs: isSet(object.heartbeatIntervalMs) ? Number(object.heartbeatIntervalMs) : 0 };
  },

  toJSON(message: GetHeartbeatIntervalResponse): unknown {
    const obj: any = {};
    message.heartbeatIntervalMs !== undefined && (obj.heartbeatIntervalMs = Math.round(message.heartbeatIntervalMs));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetHeartbeatIntervalResponse>, I>>(base?: I): GetHeartbeatIntervalResponse {
    return GetHeartbeatIntervalResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetHeartbeatIntervalResponse>, I>>(object: I): GetHeartbeatIntervalResponse {
    const message = createBaseGetHeartbeatIntervalResponse();
    message.heartbeatIntervalMs = object.heartbeatIntervalMs ?? 0;
    return message;
  },
};

/**
 * The following __must__ be assumed:
 *    - Clients may receive data for slots out of order.
 *    - Clients may receive account updates for a given slot out of order.
 */
export type GeyserService = typeof GeyserService;
export const GeyserService = {
  /** Invoke to get the expected heartbeat interval. */
  getHeartbeatInterval: {
    path: "/solana.geyser.Geyser/GetHeartbeatInterval",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: EmptyRequest) => Buffer.from(EmptyRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => EmptyRequest.decode(value),
    responseSerialize: (value: GetHeartbeatIntervalResponse) =>
      Buffer.from(GetHeartbeatIntervalResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetHeartbeatIntervalResponse.decode(value),
  },
  /**
   * Subscribes to account updates in the accounts database; additionally pings clients with empty heartbeats.
   * Upon initially connecting the client can expect a `highest_write_slot` set in the http headers.
   * Subscribe to account updates
   */
  subscribeAccountUpdates: {
    path: "/solana.geyser.Geyser/SubscribeAccountUpdates",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribeAccountUpdatesRequest) =>
      Buffer.from(SubscribeAccountUpdatesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribeAccountUpdatesRequest.decode(value),
    responseSerialize: (value: TimestampedAccountUpdate) =>
      Buffer.from(TimestampedAccountUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TimestampedAccountUpdate.decode(value),
  },
  /**
   * Subscribes to updates given a list of program IDs. When an account update comes in that's owned by a provided
   * program id, one will receive an update
   */
  subscribeProgramUpdates: {
    path: "/solana.geyser.Geyser/SubscribeProgramUpdates",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribeProgramsUpdatesRequest) =>
      Buffer.from(SubscribeProgramsUpdatesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribeProgramsUpdatesRequest.decode(value),
    responseSerialize: (value: TimestampedAccountUpdate) =>
      Buffer.from(TimestampedAccountUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TimestampedAccountUpdate.decode(value),
  },
  /**
   * Functions similarly to `SubscribeAccountUpdates`, but consumes less bandwidth.
   * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
   */
  subscribePartialAccountUpdates: {
    path: "/solana.geyser.Geyser/SubscribePartialAccountUpdates",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribePartialAccountUpdatesRequest) =>
      Buffer.from(SubscribePartialAccountUpdatesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribePartialAccountUpdatesRequest.decode(value),
    responseSerialize: (value: MaybePartialAccountUpdate) =>
      Buffer.from(MaybePartialAccountUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => MaybePartialAccountUpdate.decode(value),
  },
  /**
   * Subscribes to slot updates.
   * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
   */
  subscribeSlotUpdates: {
    path: "/solana.geyser.Geyser/SubscribeSlotUpdates",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribeSlotUpdateRequest) =>
      Buffer.from(SubscribeSlotUpdateRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribeSlotUpdateRequest.decode(value),
    responseSerialize: (value: TimestampedSlotUpdate) => Buffer.from(TimestampedSlotUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TimestampedSlotUpdate.decode(value),
  },
  /** Subscribes to transaction updates. */
  subscribeTransactionUpdates: {
    path: "/solana.geyser.Geyser/SubscribeTransactionUpdates",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribeTransactionUpdatesRequest) =>
      Buffer.from(SubscribeTransactionUpdatesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribeTransactionUpdatesRequest.decode(value),
    responseSerialize: (value: TimestampedTransactionUpdate) =>
      Buffer.from(TimestampedTransactionUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TimestampedTransactionUpdate.decode(value),
  },
  /** Subscribes to block updates. */
  subscribeBlockUpdates: {
    path: "/solana.geyser.Geyser/SubscribeBlockUpdates",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribeBlockUpdatesRequest) =>
      Buffer.from(SubscribeBlockUpdatesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribeBlockUpdatesRequest.decode(value),
    responseSerialize: (value: TimestampedBlockUpdate) => Buffer.from(TimestampedBlockUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TimestampedBlockUpdate.decode(value),
  },
} as const;

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
  subscribePartialAccountUpdates: handleServerStreamingCall<
    SubscribePartialAccountUpdatesRequest,
    MaybePartialAccountUpdate
  >;
  /**
   * Subscribes to slot updates.
   * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
   */
  subscribeSlotUpdates: handleServerStreamingCall<SubscribeSlotUpdateRequest, TimestampedSlotUpdate>;
  /** Subscribes to transaction updates. */
  subscribeTransactionUpdates: handleServerStreamingCall<
    SubscribeTransactionUpdatesRequest,
    TimestampedTransactionUpdate
  >;
  /** Subscribes to block updates. */
  subscribeBlockUpdates: handleServerStreamingCall<SubscribeBlockUpdatesRequest, TimestampedBlockUpdate>;
}

export interface GeyserClient extends Client {
  /** Invoke to get the expected heartbeat interval. */
  getHeartbeatInterval(
    request: EmptyRequest,
    callback: (error: ServiceError | null, response: GetHeartbeatIntervalResponse) => void,
  ): ClientUnaryCall;
  getHeartbeatInterval(
    request: EmptyRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetHeartbeatIntervalResponse) => void,
  ): ClientUnaryCall;
  getHeartbeatInterval(
    request: EmptyRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetHeartbeatIntervalResponse) => void,
  ): ClientUnaryCall;
  /**
   * Subscribes to account updates in the accounts database; additionally pings clients with empty heartbeats.
   * Upon initially connecting the client can expect a `highest_write_slot` set in the http headers.
   * Subscribe to account updates
   */
  subscribeAccountUpdates(
    request: SubscribeAccountUpdatesRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedAccountUpdate>;
  subscribeAccountUpdates(
    request: SubscribeAccountUpdatesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedAccountUpdate>;
  /**
   * Subscribes to updates given a list of program IDs. When an account update comes in that's owned by a provided
   * program id, one will receive an update
   */
  subscribeProgramUpdates(
    request: SubscribeProgramsUpdatesRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedAccountUpdate>;
  subscribeProgramUpdates(
    request: SubscribeProgramsUpdatesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedAccountUpdate>;
  /**
   * Functions similarly to `SubscribeAccountUpdates`, but consumes less bandwidth.
   * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
   */
  subscribePartialAccountUpdates(
    request: SubscribePartialAccountUpdatesRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<MaybePartialAccountUpdate>;
  subscribePartialAccountUpdates(
    request: SubscribePartialAccountUpdatesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<MaybePartialAccountUpdate>;
  /**
   * Subscribes to slot updates.
   * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
   */
  subscribeSlotUpdates(
    request: SubscribeSlotUpdateRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedSlotUpdate>;
  subscribeSlotUpdates(
    request: SubscribeSlotUpdateRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedSlotUpdate>;
  /** Subscribes to transaction updates. */
  subscribeTransactionUpdates(
    request: SubscribeTransactionUpdatesRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedTransactionUpdate>;
  subscribeTransactionUpdates(
    request: SubscribeTransactionUpdatesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedTransactionUpdate>;
  /** Subscribes to block updates. */
  subscribeBlockUpdates(
    request: SubscribeBlockUpdatesRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedBlockUpdate>;
  subscribeBlockUpdates(
    request: SubscribeBlockUpdatesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TimestampedBlockUpdate>;
}

export const GeyserClient = makeGenericClientConstructor(GeyserService, "solana.geyser.Geyser") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): GeyserClient;
  service: typeof GeyserService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
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

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
