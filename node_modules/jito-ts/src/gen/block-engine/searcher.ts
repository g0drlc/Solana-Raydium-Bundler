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
import { Bundle, BundleResult } from "./bundle";
import { Timestamp } from "./google/protobuf/timestamp";
import { Packet } from "./packet";

export const protobufPackage = "searcher";

export interface SlotList {
  slots: number[];
}

export interface ConnectedLeadersResponse {
  /** Mapping of validator pubkey to leader slots for the current epoch. */
  connectedValidators: { [key: string]: SlotList };
}

export interface ConnectedLeadersResponse_ConnectedValidatorsEntry {
  key: string;
  value: SlotList | undefined;
}

export interface SendBundleRequest {
  bundle: Bundle | undefined;
}

export interface SendBundleResponse {
  /** server uuid for the bundle */
  uuid: string;
}

export interface ProgramSubscriptionV0 {
  /** Base58 encoded program id that transactions mention */
  programs: string[];
}

export interface WriteLockedAccountSubscriptionV0 {
  /** Base58 encoded account pubkey that transactions mention */
  accounts: string[];
}

export interface MempoolSubscription {
  programV0Sub?:
    | ProgramSubscriptionV0
    | undefined;
  /** / field numbers upto (and incl) 9 are reserved */
  wlaV0Sub?:
    | WriteLockedAccountSubscriptionV0
    | undefined;
  /**
   * Filters transactions to originate from specified regions.
   * Defaults to the currently connected region.
   */
  regions: string[];
}

export interface PendingTxSubscriptionRequest {
  /**
   * list of accounts to subscribe to
   * NOTE: the block-engine will only forward transactions that write lock the provided accounts here.
   */
  accounts: string[];
}

export interface PendingTxNotification {
  /** server-side timestamp the transactions were generated at (for debugging/profiling purposes) */
  serverSideTs:
    | Date
    | undefined;
  /** expiration time of the packet */
  expirationTime:
    | Date
    | undefined;
  /** list of pending transactions */
  transactions: Packet[];
}

export interface NextScheduledLeaderRequest {
}

export interface NextScheduledLeaderResponse {
  /** the current slot the backend is on */
  currentSlot: number;
  /** the slot and identity of the next leader */
  nextLeaderSlot: number;
  nextLeaderIdentity: string;
}

export interface ConnectedLeadersRequest {
}

export interface ConnectedLeadersRegionedRequest {
  /** Defaults to the currently connected region if no region provided. */
  regions: string[];
}

export interface ConnectedLeadersRegionedResponse {
  connectedValidators: { [key: string]: ConnectedLeadersResponse };
}

export interface ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry {
  key: string;
  value: ConnectedLeadersResponse | undefined;
}

export interface GetTipAccountsRequest {
}

export interface GetTipAccountsResponse {
  accounts: string[];
}

export interface SubscribeBundleResultsRequest {
}

export interface GetRegionsRequest {
}

export interface GetRegionsResponse {
  /** The region the client is currently connected to */
  currentRegion: string;
  /**
   * Regions that are online and ready for connections
   * All regions: https://jito-labs.gitbook.io/mev/systems/connecting/mainnet
   */
  availableRegions: string[];
}

function createBaseSlotList(): SlotList {
  return { slots: [] };
}

export const SlotList = {
  encode(message: SlotList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.slots) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SlotList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSlotList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.slots.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.slots.push(longToNumber(reader.uint64() as Long));
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SlotList {
    return { slots: Array.isArray(object?.slots) ? object.slots.map((e: any) => Number(e)) : [] };
  },

  toJSON(message: SlotList): unknown {
    const obj: any = {};
    if (message.slots) {
      obj.slots = message.slots.map((e) => Math.round(e));
    } else {
      obj.slots = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SlotList>, I>>(base?: I): SlotList {
    return SlotList.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SlotList>, I>>(object: I): SlotList {
    const message = createBaseSlotList();
    message.slots = object.slots?.map((e) => e) || [];
    return message;
  },
};

function createBaseConnectedLeadersResponse(): ConnectedLeadersResponse {
  return { connectedValidators: {} };
}

export const ConnectedLeadersResponse = {
  encode(message: ConnectedLeadersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.connectedValidators).forEach(([key, value]) => {
      ConnectedLeadersResponse_ConnectedValidatorsEntry.encode({ key: key as any, value }, writer.uint32(10).fork())
        .ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectedLeadersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectedLeadersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = ConnectedLeadersResponse_ConnectedValidatorsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.connectedValidators[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConnectedLeadersResponse {
    return {
      connectedValidators: isObject(object.connectedValidators)
        ? Object.entries(object.connectedValidators).reduce<{ [key: string]: SlotList }>((acc, [key, value]) => {
          acc[key] = SlotList.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ConnectedLeadersResponse): unknown {
    const obj: any = {};
    obj.connectedValidators = {};
    if (message.connectedValidators) {
      Object.entries(message.connectedValidators).forEach(([k, v]) => {
        obj.connectedValidators[k] = SlotList.toJSON(v);
      });
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectedLeadersResponse>, I>>(base?: I): ConnectedLeadersResponse {
    return ConnectedLeadersResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConnectedLeadersResponse>, I>>(object: I): ConnectedLeadersResponse {
    const message = createBaseConnectedLeadersResponse();
    message.connectedValidators = Object.entries(object.connectedValidators ?? {}).reduce<{ [key: string]: SlotList }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = SlotList.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseConnectedLeadersResponse_ConnectedValidatorsEntry(): ConnectedLeadersResponse_ConnectedValidatorsEntry {
  return { key: "", value: undefined };
}

export const ConnectedLeadersResponse_ConnectedValidatorsEntry = {
  encode(
    message: ConnectedLeadersResponse_ConnectedValidatorsEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      SlotList.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectedLeadersResponse_ConnectedValidatorsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectedLeadersResponse_ConnectedValidatorsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = SlotList.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConnectedLeadersResponse_ConnectedValidatorsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? SlotList.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ConnectedLeadersResponse_ConnectedValidatorsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? SlotList.toJSON(message.value) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectedLeadersResponse_ConnectedValidatorsEntry>, I>>(
    base?: I,
  ): ConnectedLeadersResponse_ConnectedValidatorsEntry {
    return ConnectedLeadersResponse_ConnectedValidatorsEntry.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConnectedLeadersResponse_ConnectedValidatorsEntry>, I>>(
    object: I,
  ): ConnectedLeadersResponse_ConnectedValidatorsEntry {
    const message = createBaseConnectedLeadersResponse_ConnectedValidatorsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? SlotList.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseSendBundleRequest(): SendBundleRequest {
  return { bundle: undefined };
}

export const SendBundleRequest = {
  encode(message: SendBundleRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bundle !== undefined) {
      Bundle.encode(message.bundle, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendBundleRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendBundleRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bundle = Bundle.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendBundleRequest {
    return { bundle: isSet(object.bundle) ? Bundle.fromJSON(object.bundle) : undefined };
  },

  toJSON(message: SendBundleRequest): unknown {
    const obj: any = {};
    message.bundle !== undefined && (obj.bundle = message.bundle ? Bundle.toJSON(message.bundle) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<SendBundleRequest>, I>>(base?: I): SendBundleRequest {
    return SendBundleRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SendBundleRequest>, I>>(object: I): SendBundleRequest {
    const message = createBaseSendBundleRequest();
    message.bundle = (object.bundle !== undefined && object.bundle !== null)
      ? Bundle.fromPartial(object.bundle)
      : undefined;
    return message;
  },
};

function createBaseSendBundleResponse(): SendBundleResponse {
  return { uuid: "" };
}

export const SendBundleResponse = {
  encode(message: SendBundleResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.uuid !== "") {
      writer.uint32(10).string(message.uuid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendBundleResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendBundleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uuid = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendBundleResponse {
    return { uuid: isSet(object.uuid) ? String(object.uuid) : "" };
  },

  toJSON(message: SendBundleResponse): unknown {
    const obj: any = {};
    message.uuid !== undefined && (obj.uuid = message.uuid);
    return obj;
  },

  create<I extends Exact<DeepPartial<SendBundleResponse>, I>>(base?: I): SendBundleResponse {
    return SendBundleResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SendBundleResponse>, I>>(object: I): SendBundleResponse {
    const message = createBaseSendBundleResponse();
    message.uuid = object.uuid ?? "";
    return message;
  },
};

function createBaseProgramSubscriptionV0(): ProgramSubscriptionV0 {
  return { programs: [] };
}

export const ProgramSubscriptionV0 = {
  encode(message: ProgramSubscriptionV0, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.programs) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProgramSubscriptionV0 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProgramSubscriptionV0();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.programs.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProgramSubscriptionV0 {
    return { programs: Array.isArray(object?.programs) ? object.programs.map((e: any) => String(e)) : [] };
  },

  toJSON(message: ProgramSubscriptionV0): unknown {
    const obj: any = {};
    if (message.programs) {
      obj.programs = message.programs.map((e) => e);
    } else {
      obj.programs = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProgramSubscriptionV0>, I>>(base?: I): ProgramSubscriptionV0 {
    return ProgramSubscriptionV0.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProgramSubscriptionV0>, I>>(object: I): ProgramSubscriptionV0 {
    const message = createBaseProgramSubscriptionV0();
    message.programs = object.programs?.map((e) => e) || [];
    return message;
  },
};

function createBaseWriteLockedAccountSubscriptionV0(): WriteLockedAccountSubscriptionV0 {
  return { accounts: [] };
}

export const WriteLockedAccountSubscriptionV0 = {
  encode(message: WriteLockedAccountSubscriptionV0, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.accounts) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WriteLockedAccountSubscriptionV0 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWriteLockedAccountSubscriptionV0();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WriteLockedAccountSubscriptionV0 {
    return { accounts: Array.isArray(object?.accounts) ? object.accounts.map((e: any) => String(e)) : [] };
  },

  toJSON(message: WriteLockedAccountSubscriptionV0): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) => e);
    } else {
      obj.accounts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WriteLockedAccountSubscriptionV0>, I>>(
    base?: I,
  ): WriteLockedAccountSubscriptionV0 {
    return WriteLockedAccountSubscriptionV0.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<WriteLockedAccountSubscriptionV0>, I>>(
    object: I,
  ): WriteLockedAccountSubscriptionV0 {
    const message = createBaseWriteLockedAccountSubscriptionV0();
    message.accounts = object.accounts?.map((e) => e) || [];
    return message;
  },
};

function createBaseMempoolSubscription(): MempoolSubscription {
  return { programV0Sub: undefined, wlaV0Sub: undefined, regions: [] };
}

export const MempoolSubscription = {
  encode(message: MempoolSubscription, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.programV0Sub !== undefined) {
      ProgramSubscriptionV0.encode(message.programV0Sub, writer.uint32(10).fork()).ldelim();
    }
    if (message.wlaV0Sub !== undefined) {
      WriteLockedAccountSubscriptionV0.encode(message.wlaV0Sub, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.regions) {
      writer.uint32(82).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MempoolSubscription {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMempoolSubscription();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.programV0Sub = ProgramSubscriptionV0.decode(reader, reader.uint32());
          break;
        case 2:
          message.wlaV0Sub = WriteLockedAccountSubscriptionV0.decode(reader, reader.uint32());
          break;
        case 10:
          message.regions.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MempoolSubscription {
    return {
      programV0Sub: isSet(object.programV0Sub) ? ProgramSubscriptionV0.fromJSON(object.programV0Sub) : undefined,
      wlaV0Sub: isSet(object.wlaV0Sub) ? WriteLockedAccountSubscriptionV0.fromJSON(object.wlaV0Sub) : undefined,
      regions: Array.isArray(object?.regions) ? object.regions.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: MempoolSubscription): unknown {
    const obj: any = {};
    message.programV0Sub !== undefined &&
      (obj.programV0Sub = message.programV0Sub ? ProgramSubscriptionV0.toJSON(message.programV0Sub) : undefined);
    message.wlaV0Sub !== undefined &&
      (obj.wlaV0Sub = message.wlaV0Sub ? WriteLockedAccountSubscriptionV0.toJSON(message.wlaV0Sub) : undefined);
    if (message.regions) {
      obj.regions = message.regions.map((e) => e);
    } else {
      obj.regions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MempoolSubscription>, I>>(base?: I): MempoolSubscription {
    return MempoolSubscription.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MempoolSubscription>, I>>(object: I): MempoolSubscription {
    const message = createBaseMempoolSubscription();
    message.programV0Sub = (object.programV0Sub !== undefined && object.programV0Sub !== null)
      ? ProgramSubscriptionV0.fromPartial(object.programV0Sub)
      : undefined;
    message.wlaV0Sub = (object.wlaV0Sub !== undefined && object.wlaV0Sub !== null)
      ? WriteLockedAccountSubscriptionV0.fromPartial(object.wlaV0Sub)
      : undefined;
    message.regions = object.regions?.map((e) => e) || [];
    return message;
  },
};

function createBasePendingTxSubscriptionRequest(): PendingTxSubscriptionRequest {
  return { accounts: [] };
}

export const PendingTxSubscriptionRequest = {
  encode(message: PendingTxSubscriptionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.accounts) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PendingTxSubscriptionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePendingTxSubscriptionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PendingTxSubscriptionRequest {
    return { accounts: Array.isArray(object?.accounts) ? object.accounts.map((e: any) => String(e)) : [] };
  },

  toJSON(message: PendingTxSubscriptionRequest): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) => e);
    } else {
      obj.accounts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PendingTxSubscriptionRequest>, I>>(base?: I): PendingTxSubscriptionRequest {
    return PendingTxSubscriptionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PendingTxSubscriptionRequest>, I>>(object: I): PendingTxSubscriptionRequest {
    const message = createBasePendingTxSubscriptionRequest();
    message.accounts = object.accounts?.map((e) => e) || [];
    return message;
  },
};

function createBasePendingTxNotification(): PendingTxNotification {
  return { serverSideTs: undefined, expirationTime: undefined, transactions: [] };
}

export const PendingTxNotification = {
  encode(message: PendingTxNotification, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serverSideTs !== undefined) {
      Timestamp.encode(toTimestamp(message.serverSideTs), writer.uint32(10).fork()).ldelim();
    }
    if (message.expirationTime !== undefined) {
      Timestamp.encode(toTimestamp(message.expirationTime), writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.transactions) {
      Packet.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PendingTxNotification {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePendingTxNotification();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serverSideTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 2:
          message.expirationTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.transactions.push(Packet.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PendingTxNotification {
    return {
      serverSideTs: isSet(object.serverSideTs) ? fromJsonTimestamp(object.serverSideTs) : undefined,
      expirationTime: isSet(object.expirationTime) ? fromJsonTimestamp(object.expirationTime) : undefined,
      transactions: Array.isArray(object?.transactions) ? object.transactions.map((e: any) => Packet.fromJSON(e)) : [],
    };
  },

  toJSON(message: PendingTxNotification): unknown {
    const obj: any = {};
    message.serverSideTs !== undefined && (obj.serverSideTs = message.serverSideTs.toISOString());
    message.expirationTime !== undefined && (obj.expirationTime = message.expirationTime.toISOString());
    if (message.transactions) {
      obj.transactions = message.transactions.map((e) => e ? Packet.toJSON(e) : undefined);
    } else {
      obj.transactions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PendingTxNotification>, I>>(base?: I): PendingTxNotification {
    return PendingTxNotification.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PendingTxNotification>, I>>(object: I): PendingTxNotification {
    const message = createBasePendingTxNotification();
    message.serverSideTs = object.serverSideTs ?? undefined;
    message.expirationTime = object.expirationTime ?? undefined;
    message.transactions = object.transactions?.map((e) => Packet.fromPartial(e)) || [];
    return message;
  },
};

function createBaseNextScheduledLeaderRequest(): NextScheduledLeaderRequest {
  return {};
}

export const NextScheduledLeaderRequest = {
  encode(_: NextScheduledLeaderRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NextScheduledLeaderRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNextScheduledLeaderRequest();
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

  fromJSON(_: any): NextScheduledLeaderRequest {
    return {};
  },

  toJSON(_: NextScheduledLeaderRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<NextScheduledLeaderRequest>, I>>(base?: I): NextScheduledLeaderRequest {
    return NextScheduledLeaderRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<NextScheduledLeaderRequest>, I>>(_: I): NextScheduledLeaderRequest {
    const message = createBaseNextScheduledLeaderRequest();
    return message;
  },
};

function createBaseNextScheduledLeaderResponse(): NextScheduledLeaderResponse {
  return { currentSlot: 0, nextLeaderSlot: 0, nextLeaderIdentity: "" };
}

export const NextScheduledLeaderResponse = {
  encode(message: NextScheduledLeaderResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.currentSlot !== 0) {
      writer.uint32(8).uint64(message.currentSlot);
    }
    if (message.nextLeaderSlot !== 0) {
      writer.uint32(16).uint64(message.nextLeaderSlot);
    }
    if (message.nextLeaderIdentity !== "") {
      writer.uint32(26).string(message.nextLeaderIdentity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NextScheduledLeaderResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNextScheduledLeaderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.currentSlot = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.nextLeaderSlot = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.nextLeaderIdentity = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NextScheduledLeaderResponse {
    return {
      currentSlot: isSet(object.currentSlot) ? Number(object.currentSlot) : 0,
      nextLeaderSlot: isSet(object.nextLeaderSlot) ? Number(object.nextLeaderSlot) : 0,
      nextLeaderIdentity: isSet(object.nextLeaderIdentity) ? String(object.nextLeaderIdentity) : "",
    };
  },

  toJSON(message: NextScheduledLeaderResponse): unknown {
    const obj: any = {};
    message.currentSlot !== undefined && (obj.currentSlot = Math.round(message.currentSlot));
    message.nextLeaderSlot !== undefined && (obj.nextLeaderSlot = Math.round(message.nextLeaderSlot));
    message.nextLeaderIdentity !== undefined && (obj.nextLeaderIdentity = message.nextLeaderIdentity);
    return obj;
  },

  create<I extends Exact<DeepPartial<NextScheduledLeaderResponse>, I>>(base?: I): NextScheduledLeaderResponse {
    return NextScheduledLeaderResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<NextScheduledLeaderResponse>, I>>(object: I): NextScheduledLeaderResponse {
    const message = createBaseNextScheduledLeaderResponse();
    message.currentSlot = object.currentSlot ?? 0;
    message.nextLeaderSlot = object.nextLeaderSlot ?? 0;
    message.nextLeaderIdentity = object.nextLeaderIdentity ?? "";
    return message;
  },
};

function createBaseConnectedLeadersRequest(): ConnectedLeadersRequest {
  return {};
}

export const ConnectedLeadersRequest = {
  encode(_: ConnectedLeadersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectedLeadersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectedLeadersRequest();
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

  fromJSON(_: any): ConnectedLeadersRequest {
    return {};
  },

  toJSON(_: ConnectedLeadersRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectedLeadersRequest>, I>>(base?: I): ConnectedLeadersRequest {
    return ConnectedLeadersRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConnectedLeadersRequest>, I>>(_: I): ConnectedLeadersRequest {
    const message = createBaseConnectedLeadersRequest();
    return message;
  },
};

function createBaseConnectedLeadersRegionedRequest(): ConnectedLeadersRegionedRequest {
  return { regions: [] };
}

export const ConnectedLeadersRegionedRequest = {
  encode(message: ConnectedLeadersRegionedRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.regions) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectedLeadersRegionedRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectedLeadersRegionedRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.regions.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConnectedLeadersRegionedRequest {
    return { regions: Array.isArray(object?.regions) ? object.regions.map((e: any) => String(e)) : [] };
  },

  toJSON(message: ConnectedLeadersRegionedRequest): unknown {
    const obj: any = {};
    if (message.regions) {
      obj.regions = message.regions.map((e) => e);
    } else {
      obj.regions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectedLeadersRegionedRequest>, I>>(base?: I): ConnectedLeadersRegionedRequest {
    return ConnectedLeadersRegionedRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConnectedLeadersRegionedRequest>, I>>(
    object: I,
  ): ConnectedLeadersRegionedRequest {
    const message = createBaseConnectedLeadersRegionedRequest();
    message.regions = object.regions?.map((e) => e) || [];
    return message;
  },
};

function createBaseConnectedLeadersRegionedResponse(): ConnectedLeadersRegionedResponse {
  return { connectedValidators: {} };
}

export const ConnectedLeadersRegionedResponse = {
  encode(message: ConnectedLeadersRegionedResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.connectedValidators).forEach(([key, value]) => {
      ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork(),
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectedLeadersRegionedResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectedLeadersRegionedResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.connectedValidators[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConnectedLeadersRegionedResponse {
    return {
      connectedValidators: isObject(object.connectedValidators)
        ? Object.entries(object.connectedValidators).reduce<{ [key: string]: ConnectedLeadersResponse }>(
          (acc, [key, value]) => {
            acc[key] = ConnectedLeadersResponse.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
    };
  },

  toJSON(message: ConnectedLeadersRegionedResponse): unknown {
    const obj: any = {};
    obj.connectedValidators = {};
    if (message.connectedValidators) {
      Object.entries(message.connectedValidators).forEach(([k, v]) => {
        obj.connectedValidators[k] = ConnectedLeadersResponse.toJSON(v);
      });
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectedLeadersRegionedResponse>, I>>(
    base?: I,
  ): ConnectedLeadersRegionedResponse {
    return ConnectedLeadersRegionedResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConnectedLeadersRegionedResponse>, I>>(
    object: I,
  ): ConnectedLeadersRegionedResponse {
    const message = createBaseConnectedLeadersRegionedResponse();
    message.connectedValidators = Object.entries(object.connectedValidators ?? {}).reduce<
      { [key: string]: ConnectedLeadersResponse }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = ConnectedLeadersResponse.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseConnectedLeadersRegionedResponse_ConnectedValidatorsEntry(): ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry {
  return { key: "", value: undefined };
}

export const ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry = {
  encode(
    message: ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ConnectedLeadersResponse.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectedLeadersRegionedResponse_ConnectedValidatorsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = ConnectedLeadersResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ConnectedLeadersResponse.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? ConnectedLeadersResponse.toJSON(message.value) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry>, I>>(
    base?: I,
  ): ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry {
    return ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry>, I>>(
    object: I,
  ): ConnectedLeadersRegionedResponse_ConnectedValidatorsEntry {
    const message = createBaseConnectedLeadersRegionedResponse_ConnectedValidatorsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? ConnectedLeadersResponse.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseGetTipAccountsRequest(): GetTipAccountsRequest {
  return {};
}

export const GetTipAccountsRequest = {
  encode(_: GetTipAccountsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTipAccountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTipAccountsRequest();
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

  fromJSON(_: any): GetTipAccountsRequest {
    return {};
  },

  toJSON(_: GetTipAccountsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTipAccountsRequest>, I>>(base?: I): GetTipAccountsRequest {
    return GetTipAccountsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTipAccountsRequest>, I>>(_: I): GetTipAccountsRequest {
    const message = createBaseGetTipAccountsRequest();
    return message;
  },
};

function createBaseGetTipAccountsResponse(): GetTipAccountsResponse {
  return { accounts: [] };
}

export const GetTipAccountsResponse = {
  encode(message: GetTipAccountsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.accounts) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTipAccountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTipAccountsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTipAccountsResponse {
    return { accounts: Array.isArray(object?.accounts) ? object.accounts.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetTipAccountsResponse): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) => e);
    } else {
      obj.accounts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTipAccountsResponse>, I>>(base?: I): GetTipAccountsResponse {
    return GetTipAccountsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTipAccountsResponse>, I>>(object: I): GetTipAccountsResponse {
    const message = createBaseGetTipAccountsResponse();
    message.accounts = object.accounts?.map((e) => e) || [];
    return message;
  },
};

function createBaseSubscribeBundleResultsRequest(): SubscribeBundleResultsRequest {
  return {};
}

export const SubscribeBundleResultsRequest = {
  encode(_: SubscribeBundleResultsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeBundleResultsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeBundleResultsRequest();
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

  fromJSON(_: any): SubscribeBundleResultsRequest {
    return {};
  },

  toJSON(_: SubscribeBundleResultsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeBundleResultsRequest>, I>>(base?: I): SubscribeBundleResultsRequest {
    return SubscribeBundleResultsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeBundleResultsRequest>, I>>(_: I): SubscribeBundleResultsRequest {
    const message = createBaseSubscribeBundleResultsRequest();
    return message;
  },
};

function createBaseGetRegionsRequest(): GetRegionsRequest {
  return {};
}

export const GetRegionsRequest = {
  encode(_: GetRegionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRegionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRegionsRequest();
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

  fromJSON(_: any): GetRegionsRequest {
    return {};
  },

  toJSON(_: GetRegionsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRegionsRequest>, I>>(base?: I): GetRegionsRequest {
    return GetRegionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRegionsRequest>, I>>(_: I): GetRegionsRequest {
    const message = createBaseGetRegionsRequest();
    return message;
  },
};

function createBaseGetRegionsResponse(): GetRegionsResponse {
  return { currentRegion: "", availableRegions: [] };
}

export const GetRegionsResponse = {
  encode(message: GetRegionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.currentRegion !== "") {
      writer.uint32(10).string(message.currentRegion);
    }
    for (const v of message.availableRegions) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRegionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRegionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.currentRegion = reader.string();
          break;
        case 2:
          message.availableRegions.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRegionsResponse {
    return {
      currentRegion: isSet(object.currentRegion) ? String(object.currentRegion) : "",
      availableRegions: Array.isArray(object?.availableRegions)
        ? object.availableRegions.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: GetRegionsResponse): unknown {
    const obj: any = {};
    message.currentRegion !== undefined && (obj.currentRegion = message.currentRegion);
    if (message.availableRegions) {
      obj.availableRegions = message.availableRegions.map((e) => e);
    } else {
      obj.availableRegions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRegionsResponse>, I>>(base?: I): GetRegionsResponse {
    return GetRegionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRegionsResponse>, I>>(object: I): GetRegionsResponse {
    const message = createBaseGetRegionsResponse();
    message.currentRegion = object.currentRegion ?? "";
    message.availableRegions = object.availableRegions?.map((e) => e) || [];
    return message;
  },
};

export type SearcherServiceService = typeof SearcherServiceService;
export const SearcherServiceService = {
  /**
   * Searchers can invoke this endpoint to subscribe to their respective bundle results.
   * A success result would indicate the bundle won its state auction and was submitted to the validator.
   */
  subscribeBundleResults: {
    path: "/searcher.SearcherService/SubscribeBundleResults",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribeBundleResultsRequest) =>
      Buffer.from(SubscribeBundleResultsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribeBundleResultsRequest.decode(value),
    responseSerialize: (value: BundleResult) => Buffer.from(BundleResult.encode(value).finish()),
    responseDeserialize: (value: Buffer) => BundleResult.decode(value),
  },
  /**
   * RPC endpoint to subscribe to pending transactions. Clients can provide a list of base58 encoded accounts.
   * Any transactions that write-lock the provided accounts will be streamed to the searcher.
   * NOTE: DEPRECATED SOON!!!
   */
  subscribePendingTransactions: {
    path: "/searcher.SearcherService/SubscribePendingTransactions",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: PendingTxSubscriptionRequest) =>
      Buffer.from(PendingTxSubscriptionRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => PendingTxSubscriptionRequest.decode(value),
    responseSerialize: (value: PendingTxNotification) => Buffer.from(PendingTxNotification.encode(value).finish()),
    responseDeserialize: (value: Buffer) => PendingTxNotification.decode(value),
  },
  /** RPC endpoint to subscribe to mempool based on a few filters */
  subscribeMempool: {
    path: "/searcher.SearcherService/SubscribeMempool",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: MempoolSubscription) => Buffer.from(MempoolSubscription.encode(value).finish()),
    requestDeserialize: (value: Buffer) => MempoolSubscription.decode(value),
    responseSerialize: (value: PendingTxNotification) => Buffer.from(PendingTxNotification.encode(value).finish()),
    responseDeserialize: (value: Buffer) => PendingTxNotification.decode(value),
  },
  sendBundle: {
    path: "/searcher.SearcherService/SendBundle",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SendBundleRequest) => Buffer.from(SendBundleRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SendBundleRequest.decode(value),
    responseSerialize: (value: SendBundleResponse) => Buffer.from(SendBundleResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SendBundleResponse.decode(value),
  },
  /** Returns the next scheduled leader connected to the block engine. */
  getNextScheduledLeader: {
    path: "/searcher.SearcherService/GetNextScheduledLeader",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: NextScheduledLeaderRequest) =>
      Buffer.from(NextScheduledLeaderRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => NextScheduledLeaderRequest.decode(value),
    responseSerialize: (value: NextScheduledLeaderResponse) =>
      Buffer.from(NextScheduledLeaderResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => NextScheduledLeaderResponse.decode(value),
  },
  /** Returns leader slots for connected jito validators during the current epoch. Only returns data for this region. */
  getConnectedLeaders: {
    path: "/searcher.SearcherService/GetConnectedLeaders",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ConnectedLeadersRequest) => Buffer.from(ConnectedLeadersRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ConnectedLeadersRequest.decode(value),
    responseSerialize: (value: ConnectedLeadersResponse) =>
      Buffer.from(ConnectedLeadersResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ConnectedLeadersResponse.decode(value),
  },
  /** Returns leader slots for connected jito validators during the current epoch. */
  getConnectedLeadersRegioned: {
    path: "/searcher.SearcherService/GetConnectedLeadersRegioned",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ConnectedLeadersRegionedRequest) =>
      Buffer.from(ConnectedLeadersRegionedRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ConnectedLeadersRegionedRequest.decode(value),
    responseSerialize: (value: ConnectedLeadersRegionedResponse) =>
      Buffer.from(ConnectedLeadersRegionedResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ConnectedLeadersRegionedResponse.decode(value),
  },
  /** Returns the tip accounts searchers shall transfer funds to for the leader to claim. */
  getTipAccounts: {
    path: "/searcher.SearcherService/GetTipAccounts",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetTipAccountsRequest) => Buffer.from(GetTipAccountsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetTipAccountsRequest.decode(value),
    responseSerialize: (value: GetTipAccountsResponse) => Buffer.from(GetTipAccountsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetTipAccountsResponse.decode(value),
  },
  /** Returns region the client is directly connected to, along with all available regions */
  getRegions: {
    path: "/searcher.SearcherService/GetRegions",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRegionsRequest) => Buffer.from(GetRegionsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRegionsRequest.decode(value),
    responseSerialize: (value: GetRegionsResponse) => Buffer.from(GetRegionsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRegionsResponse.decode(value),
  },
} as const;

export interface SearcherServiceServer extends UntypedServiceImplementation {
  /**
   * Searchers can invoke this endpoint to subscribe to their respective bundle results.
   * A success result would indicate the bundle won its state auction and was submitted to the validator.
   */
  subscribeBundleResults: handleServerStreamingCall<SubscribeBundleResultsRequest, BundleResult>;
  /**
   * RPC endpoint to subscribe to pending transactions. Clients can provide a list of base58 encoded accounts.
   * Any transactions that write-lock the provided accounts will be streamed to the searcher.
   * NOTE: DEPRECATED SOON!!!
   */
  subscribePendingTransactions: handleServerStreamingCall<PendingTxSubscriptionRequest, PendingTxNotification>;
  /** RPC endpoint to subscribe to mempool based on a few filters */
  subscribeMempool: handleServerStreamingCall<MempoolSubscription, PendingTxNotification>;
  sendBundle: handleUnaryCall<SendBundleRequest, SendBundleResponse>;
  /** Returns the next scheduled leader connected to the block engine. */
  getNextScheduledLeader: handleUnaryCall<NextScheduledLeaderRequest, NextScheduledLeaderResponse>;
  /** Returns leader slots for connected jito validators during the current epoch. Only returns data for this region. */
  getConnectedLeaders: handleUnaryCall<ConnectedLeadersRequest, ConnectedLeadersResponse>;
  /** Returns leader slots for connected jito validators during the current epoch. */
  getConnectedLeadersRegioned: handleUnaryCall<ConnectedLeadersRegionedRequest, ConnectedLeadersRegionedResponse>;
  /** Returns the tip accounts searchers shall transfer funds to for the leader to claim. */
  getTipAccounts: handleUnaryCall<GetTipAccountsRequest, GetTipAccountsResponse>;
  /** Returns region the client is directly connected to, along with all available regions */
  getRegions: handleUnaryCall<GetRegionsRequest, GetRegionsResponse>;
}

export interface SearcherServiceClient extends Client {
  /**
   * Searchers can invoke this endpoint to subscribe to their respective bundle results.
   * A success result would indicate the bundle won its state auction and was submitted to the validator.
   */
  subscribeBundleResults(
    request: SubscribeBundleResultsRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<BundleResult>;
  subscribeBundleResults(
    request: SubscribeBundleResultsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<BundleResult>;
  /**
   * RPC endpoint to subscribe to pending transactions. Clients can provide a list of base58 encoded accounts.
   * Any transactions that write-lock the provided accounts will be streamed to the searcher.
   * NOTE: DEPRECATED SOON!!!
   */
  subscribePendingTransactions(
    request: PendingTxSubscriptionRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<PendingTxNotification>;
  subscribePendingTransactions(
    request: PendingTxSubscriptionRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<PendingTxNotification>;
  /** RPC endpoint to subscribe to mempool based on a few filters */
  subscribeMempool(
    request: MempoolSubscription,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<PendingTxNotification>;
  subscribeMempool(
    request: MempoolSubscription,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<PendingTxNotification>;
  sendBundle(
    request: SendBundleRequest,
    callback: (error: ServiceError | null, response: SendBundleResponse) => void,
  ): ClientUnaryCall;
  sendBundle(
    request: SendBundleRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: SendBundleResponse) => void,
  ): ClientUnaryCall;
  sendBundle(
    request: SendBundleRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: SendBundleResponse) => void,
  ): ClientUnaryCall;
  /** Returns the next scheduled leader connected to the block engine. */
  getNextScheduledLeader(
    request: NextScheduledLeaderRequest,
    callback: (error: ServiceError | null, response: NextScheduledLeaderResponse) => void,
  ): ClientUnaryCall;
  getNextScheduledLeader(
    request: NextScheduledLeaderRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: NextScheduledLeaderResponse) => void,
  ): ClientUnaryCall;
  getNextScheduledLeader(
    request: NextScheduledLeaderRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: NextScheduledLeaderResponse) => void,
  ): ClientUnaryCall;
  /** Returns leader slots for connected jito validators during the current epoch. Only returns data for this region. */
  getConnectedLeaders(
    request: ConnectedLeadersRequest,
    callback: (error: ServiceError | null, response: ConnectedLeadersResponse) => void,
  ): ClientUnaryCall;
  getConnectedLeaders(
    request: ConnectedLeadersRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ConnectedLeadersResponse) => void,
  ): ClientUnaryCall;
  getConnectedLeaders(
    request: ConnectedLeadersRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ConnectedLeadersResponse) => void,
  ): ClientUnaryCall;
  /** Returns leader slots for connected jito validators during the current epoch. */
  getConnectedLeadersRegioned(
    request: ConnectedLeadersRegionedRequest,
    callback: (error: ServiceError | null, response: ConnectedLeadersRegionedResponse) => void,
  ): ClientUnaryCall;
  getConnectedLeadersRegioned(
    request: ConnectedLeadersRegionedRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ConnectedLeadersRegionedResponse) => void,
  ): ClientUnaryCall;
  getConnectedLeadersRegioned(
    request: ConnectedLeadersRegionedRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ConnectedLeadersRegionedResponse) => void,
  ): ClientUnaryCall;
  /** Returns the tip accounts searchers shall transfer funds to for the leader to claim. */
  getTipAccounts(
    request: GetTipAccountsRequest,
    callback: (error: ServiceError | null, response: GetTipAccountsResponse) => void,
  ): ClientUnaryCall;
  getTipAccounts(
    request: GetTipAccountsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetTipAccountsResponse) => void,
  ): ClientUnaryCall;
  getTipAccounts(
    request: GetTipAccountsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetTipAccountsResponse) => void,
  ): ClientUnaryCall;
  /** Returns region the client is directly connected to, along with all available regions */
  getRegions(
    request: GetRegionsRequest,
    callback: (error: ServiceError | null, response: GetRegionsResponse) => void,
  ): ClientUnaryCall;
  getRegions(
    request: GetRegionsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetRegionsResponse) => void,
  ): ClientUnaryCall;
  getRegions(
    request: GetRegionsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetRegionsResponse) => void,
  ): ClientUnaryCall;
}

export const SearcherServiceClient = makeGenericClientConstructor(
  SearcherServiceService,
  "searcher.SearcherService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): SearcherServiceClient;
  service: typeof SearcherServiceService;
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
