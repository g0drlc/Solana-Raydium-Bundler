/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientDuplexStream,
  ClientOptions,
  ClientReadableStream,
  ClientUnaryCall,
  handleBidiStreamingCall,
  handleServerStreamingCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { BundleUuid } from "./bundle";
import { PacketBatch } from "./packet";
import { Header, Heartbeat } from "./shared";

export const protobufPackage = "block_engine";

export interface SubscribePacketsRequest {
}

export interface SubscribePacketsResponse {
  header: Header | undefined;
  batch: PacketBatch | undefined;
}

export interface SubscribeBundlesRequest {
}

export interface SubscribeBundlesResponse {
  bundles: BundleUuid[];
}

export interface BlockBuilderFeeInfoRequest {
}

export interface BlockBuilderFeeInfoResponse {
  pubkey: string;
  /** commission (0-100) */
  commission: number;
}

export interface AccountsOfInterest {
  /** use * for all accounts */
  accounts: string[];
}

export interface AccountsOfInterestRequest {
}

export interface AccountsOfInterestUpdate {
  accounts: string[];
}

export interface ProgramsOfInterestRequest {
}

export interface ProgramsOfInterestUpdate {
  programs: string[];
}

/**
 * A series of packets with an expiration attached to them.
 * The header contains a timestamp for when this packet was generated.
 * The expiry is how long the packet batches have before they expire and are forwarded to the validator.
 * This provides a more censorship resistant method to MEV than block engines receiving packets directly.
 */
export interface ExpiringPacketBatch {
  header: Header | undefined;
  batch: PacketBatch | undefined;
  expiryMs: number;
}

/**
 * Packets and heartbeats are sent over the same stream.
 * ExpiringPacketBatches have an expiration attached to them so the block engine can track
 * how long it has until the relayer forwards the packets to the validator.
 * Heartbeats contain a timestamp from the system and is used as a simple and naive time-sync mechanism
 * so the block engine has some idea on how far their clocks are apart.
 */
export interface PacketBatchUpdate {
  batches?: ExpiringPacketBatch | undefined;
  heartbeat?: Heartbeat | undefined;
}

export interface StartExpiringPacketStreamResponse {
  heartbeat: Heartbeat | undefined;
}

function createBaseSubscribePacketsRequest(): SubscribePacketsRequest {
  return {};
}

export const SubscribePacketsRequest = {
  encode(_: SubscribePacketsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribePacketsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribePacketsRequest();
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

  fromJSON(_: any): SubscribePacketsRequest {
    return {};
  },

  toJSON(_: SubscribePacketsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribePacketsRequest>, I>>(base?: I): SubscribePacketsRequest {
    return SubscribePacketsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribePacketsRequest>, I>>(_: I): SubscribePacketsRequest {
    const message = createBaseSubscribePacketsRequest();
    return message;
  },
};

function createBaseSubscribePacketsResponse(): SubscribePacketsResponse {
  return { header: undefined, batch: undefined };
}

export const SubscribePacketsResponse = {
  encode(message: SubscribePacketsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      Header.encode(message.header, writer.uint32(10).fork()).ldelim();
    }
    if (message.batch !== undefined) {
      PacketBatch.encode(message.batch, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribePacketsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribePacketsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.header = Header.decode(reader, reader.uint32());
          break;
        case 2:
          message.batch = PacketBatch.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubscribePacketsResponse {
    return {
      header: isSet(object.header) ? Header.fromJSON(object.header) : undefined,
      batch: isSet(object.batch) ? PacketBatch.fromJSON(object.batch) : undefined,
    };
  },

  toJSON(message: SubscribePacketsResponse): unknown {
    const obj: any = {};
    message.header !== undefined && (obj.header = message.header ? Header.toJSON(message.header) : undefined);
    message.batch !== undefined && (obj.batch = message.batch ? PacketBatch.toJSON(message.batch) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribePacketsResponse>, I>>(base?: I): SubscribePacketsResponse {
    return SubscribePacketsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribePacketsResponse>, I>>(object: I): SubscribePacketsResponse {
    const message = createBaseSubscribePacketsResponse();
    message.header = (object.header !== undefined && object.header !== null)
      ? Header.fromPartial(object.header)
      : undefined;
    message.batch = (object.batch !== undefined && object.batch !== null)
      ? PacketBatch.fromPartial(object.batch)
      : undefined;
    return message;
  },
};

function createBaseSubscribeBundlesRequest(): SubscribeBundlesRequest {
  return {};
}

export const SubscribeBundlesRequest = {
  encode(_: SubscribeBundlesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeBundlesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeBundlesRequest();
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

  fromJSON(_: any): SubscribeBundlesRequest {
    return {};
  },

  toJSON(_: SubscribeBundlesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeBundlesRequest>, I>>(base?: I): SubscribeBundlesRequest {
    return SubscribeBundlesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeBundlesRequest>, I>>(_: I): SubscribeBundlesRequest {
    const message = createBaseSubscribeBundlesRequest();
    return message;
  },
};

function createBaseSubscribeBundlesResponse(): SubscribeBundlesResponse {
  return { bundles: [] };
}

export const SubscribeBundlesResponse = {
  encode(message: SubscribeBundlesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.bundles) {
      BundleUuid.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeBundlesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeBundlesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bundles.push(BundleUuid.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubscribeBundlesResponse {
    return { bundles: Array.isArray(object?.bundles) ? object.bundles.map((e: any) => BundleUuid.fromJSON(e)) : [] };
  },

  toJSON(message: SubscribeBundlesResponse): unknown {
    const obj: any = {};
    if (message.bundles) {
      obj.bundles = message.bundles.map((e) => e ? BundleUuid.toJSON(e) : undefined);
    } else {
      obj.bundles = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeBundlesResponse>, I>>(base?: I): SubscribeBundlesResponse {
    return SubscribeBundlesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubscribeBundlesResponse>, I>>(object: I): SubscribeBundlesResponse {
    const message = createBaseSubscribeBundlesResponse();
    message.bundles = object.bundles?.map((e) => BundleUuid.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBlockBuilderFeeInfoRequest(): BlockBuilderFeeInfoRequest {
  return {};
}

export const BlockBuilderFeeInfoRequest = {
  encode(_: BlockBuilderFeeInfoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BlockBuilderFeeInfoRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlockBuilderFeeInfoRequest();
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

  fromJSON(_: any): BlockBuilderFeeInfoRequest {
    return {};
  },

  toJSON(_: BlockBuilderFeeInfoRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<BlockBuilderFeeInfoRequest>, I>>(base?: I): BlockBuilderFeeInfoRequest {
    return BlockBuilderFeeInfoRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BlockBuilderFeeInfoRequest>, I>>(_: I): BlockBuilderFeeInfoRequest {
    const message = createBaseBlockBuilderFeeInfoRequest();
    return message;
  },
};

function createBaseBlockBuilderFeeInfoResponse(): BlockBuilderFeeInfoResponse {
  return { pubkey: "", commission: 0 };
}

export const BlockBuilderFeeInfoResponse = {
  encode(message: BlockBuilderFeeInfoResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pubkey !== "") {
      writer.uint32(10).string(message.pubkey);
    }
    if (message.commission !== 0) {
      writer.uint32(16).uint64(message.commission);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BlockBuilderFeeInfoResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlockBuilderFeeInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pubkey = reader.string();
          break;
        case 2:
          message.commission = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BlockBuilderFeeInfoResponse {
    return {
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      commission: isSet(object.commission) ? Number(object.commission) : 0,
    };
  },

  toJSON(message: BlockBuilderFeeInfoResponse): unknown {
    const obj: any = {};
    message.pubkey !== undefined && (obj.pubkey = message.pubkey);
    message.commission !== undefined && (obj.commission = Math.round(message.commission));
    return obj;
  },

  create<I extends Exact<DeepPartial<BlockBuilderFeeInfoResponse>, I>>(base?: I): BlockBuilderFeeInfoResponse {
    return BlockBuilderFeeInfoResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BlockBuilderFeeInfoResponse>, I>>(object: I): BlockBuilderFeeInfoResponse {
    const message = createBaseBlockBuilderFeeInfoResponse();
    message.pubkey = object.pubkey ?? "";
    message.commission = object.commission ?? 0;
    return message;
  },
};

function createBaseAccountsOfInterest(): AccountsOfInterest {
  return { accounts: [] };
}

export const AccountsOfInterest = {
  encode(message: AccountsOfInterest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.accounts) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountsOfInterest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountsOfInterest();
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

  fromJSON(object: any): AccountsOfInterest {
    return { accounts: Array.isArray(object?.accounts) ? object.accounts.map((e: any) => String(e)) : [] };
  },

  toJSON(message: AccountsOfInterest): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) => e);
    } else {
      obj.accounts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountsOfInterest>, I>>(base?: I): AccountsOfInterest {
    return AccountsOfInterest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AccountsOfInterest>, I>>(object: I): AccountsOfInterest {
    const message = createBaseAccountsOfInterest();
    message.accounts = object.accounts?.map((e) => e) || [];
    return message;
  },
};

function createBaseAccountsOfInterestRequest(): AccountsOfInterestRequest {
  return {};
}

export const AccountsOfInterestRequest = {
  encode(_: AccountsOfInterestRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountsOfInterestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountsOfInterestRequest();
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

  fromJSON(_: any): AccountsOfInterestRequest {
    return {};
  },

  toJSON(_: AccountsOfInterestRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountsOfInterestRequest>, I>>(base?: I): AccountsOfInterestRequest {
    return AccountsOfInterestRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AccountsOfInterestRequest>, I>>(_: I): AccountsOfInterestRequest {
    const message = createBaseAccountsOfInterestRequest();
    return message;
  },
};

function createBaseAccountsOfInterestUpdate(): AccountsOfInterestUpdate {
  return { accounts: [] };
}

export const AccountsOfInterestUpdate = {
  encode(message: AccountsOfInterestUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.accounts) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountsOfInterestUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountsOfInterestUpdate();
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

  fromJSON(object: any): AccountsOfInterestUpdate {
    return { accounts: Array.isArray(object?.accounts) ? object.accounts.map((e: any) => String(e)) : [] };
  },

  toJSON(message: AccountsOfInterestUpdate): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) => e);
    } else {
      obj.accounts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AccountsOfInterestUpdate>, I>>(base?: I): AccountsOfInterestUpdate {
    return AccountsOfInterestUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AccountsOfInterestUpdate>, I>>(object: I): AccountsOfInterestUpdate {
    const message = createBaseAccountsOfInterestUpdate();
    message.accounts = object.accounts?.map((e) => e) || [];
    return message;
  },
};

function createBaseProgramsOfInterestRequest(): ProgramsOfInterestRequest {
  return {};
}

export const ProgramsOfInterestRequest = {
  encode(_: ProgramsOfInterestRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProgramsOfInterestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProgramsOfInterestRequest();
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

  fromJSON(_: any): ProgramsOfInterestRequest {
    return {};
  },

  toJSON(_: ProgramsOfInterestRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ProgramsOfInterestRequest>, I>>(base?: I): ProgramsOfInterestRequest {
    return ProgramsOfInterestRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProgramsOfInterestRequest>, I>>(_: I): ProgramsOfInterestRequest {
    const message = createBaseProgramsOfInterestRequest();
    return message;
  },
};

function createBaseProgramsOfInterestUpdate(): ProgramsOfInterestUpdate {
  return { programs: [] };
}

export const ProgramsOfInterestUpdate = {
  encode(message: ProgramsOfInterestUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.programs) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProgramsOfInterestUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProgramsOfInterestUpdate();
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

  fromJSON(object: any): ProgramsOfInterestUpdate {
    return { programs: Array.isArray(object?.programs) ? object.programs.map((e: any) => String(e)) : [] };
  },

  toJSON(message: ProgramsOfInterestUpdate): unknown {
    const obj: any = {};
    if (message.programs) {
      obj.programs = message.programs.map((e) => e);
    } else {
      obj.programs = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProgramsOfInterestUpdate>, I>>(base?: I): ProgramsOfInterestUpdate {
    return ProgramsOfInterestUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProgramsOfInterestUpdate>, I>>(object: I): ProgramsOfInterestUpdate {
    const message = createBaseProgramsOfInterestUpdate();
    message.programs = object.programs?.map((e) => e) || [];
    return message;
  },
};

function createBaseExpiringPacketBatch(): ExpiringPacketBatch {
  return { header: undefined, batch: undefined, expiryMs: 0 };
}

export const ExpiringPacketBatch = {
  encode(message: ExpiringPacketBatch, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      Header.encode(message.header, writer.uint32(10).fork()).ldelim();
    }
    if (message.batch !== undefined) {
      PacketBatch.encode(message.batch, writer.uint32(18).fork()).ldelim();
    }
    if (message.expiryMs !== 0) {
      writer.uint32(24).uint32(message.expiryMs);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExpiringPacketBatch {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExpiringPacketBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.header = Header.decode(reader, reader.uint32());
          break;
        case 2:
          message.batch = PacketBatch.decode(reader, reader.uint32());
          break;
        case 3:
          message.expiryMs = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExpiringPacketBatch {
    return {
      header: isSet(object.header) ? Header.fromJSON(object.header) : undefined,
      batch: isSet(object.batch) ? PacketBatch.fromJSON(object.batch) : undefined,
      expiryMs: isSet(object.expiryMs) ? Number(object.expiryMs) : 0,
    };
  },

  toJSON(message: ExpiringPacketBatch): unknown {
    const obj: any = {};
    message.header !== undefined && (obj.header = message.header ? Header.toJSON(message.header) : undefined);
    message.batch !== undefined && (obj.batch = message.batch ? PacketBatch.toJSON(message.batch) : undefined);
    message.expiryMs !== undefined && (obj.expiryMs = Math.round(message.expiryMs));
    return obj;
  },

  create<I extends Exact<DeepPartial<ExpiringPacketBatch>, I>>(base?: I): ExpiringPacketBatch {
    return ExpiringPacketBatch.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ExpiringPacketBatch>, I>>(object: I): ExpiringPacketBatch {
    const message = createBaseExpiringPacketBatch();
    message.header = (object.header !== undefined && object.header !== null)
      ? Header.fromPartial(object.header)
      : undefined;
    message.batch = (object.batch !== undefined && object.batch !== null)
      ? PacketBatch.fromPartial(object.batch)
      : undefined;
    message.expiryMs = object.expiryMs ?? 0;
    return message;
  },
};

function createBasePacketBatchUpdate(): PacketBatchUpdate {
  return { batches: undefined, heartbeat: undefined };
}

export const PacketBatchUpdate = {
  encode(message: PacketBatchUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.batches !== undefined) {
      ExpiringPacketBatch.encode(message.batches, writer.uint32(10).fork()).ldelim();
    }
    if (message.heartbeat !== undefined) {
      Heartbeat.encode(message.heartbeat, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PacketBatchUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePacketBatchUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batches = ExpiringPacketBatch.decode(reader, reader.uint32());
          break;
        case 2:
          message.heartbeat = Heartbeat.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PacketBatchUpdate {
    return {
      batches: isSet(object.batches) ? ExpiringPacketBatch.fromJSON(object.batches) : undefined,
      heartbeat: isSet(object.heartbeat) ? Heartbeat.fromJSON(object.heartbeat) : undefined,
    };
  },

  toJSON(message: PacketBatchUpdate): unknown {
    const obj: any = {};
    message.batches !== undefined &&
      (obj.batches = message.batches ? ExpiringPacketBatch.toJSON(message.batches) : undefined);
    message.heartbeat !== undefined &&
      (obj.heartbeat = message.heartbeat ? Heartbeat.toJSON(message.heartbeat) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<PacketBatchUpdate>, I>>(base?: I): PacketBatchUpdate {
    return PacketBatchUpdate.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PacketBatchUpdate>, I>>(object: I): PacketBatchUpdate {
    const message = createBasePacketBatchUpdate();
    message.batches = (object.batches !== undefined && object.batches !== null)
      ? ExpiringPacketBatch.fromPartial(object.batches)
      : undefined;
    message.heartbeat = (object.heartbeat !== undefined && object.heartbeat !== null)
      ? Heartbeat.fromPartial(object.heartbeat)
      : undefined;
    return message;
  },
};

function createBaseStartExpiringPacketStreamResponse(): StartExpiringPacketStreamResponse {
  return { heartbeat: undefined };
}

export const StartExpiringPacketStreamResponse = {
  encode(message: StartExpiringPacketStreamResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.heartbeat !== undefined) {
      Heartbeat.encode(message.heartbeat, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartExpiringPacketStreamResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartExpiringPacketStreamResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.heartbeat = Heartbeat.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartExpiringPacketStreamResponse {
    return { heartbeat: isSet(object.heartbeat) ? Heartbeat.fromJSON(object.heartbeat) : undefined };
  },

  toJSON(message: StartExpiringPacketStreamResponse): unknown {
    const obj: any = {};
    message.heartbeat !== undefined &&
      (obj.heartbeat = message.heartbeat ? Heartbeat.toJSON(message.heartbeat) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<StartExpiringPacketStreamResponse>, I>>(
    base?: I,
  ): StartExpiringPacketStreamResponse {
    return StartExpiringPacketStreamResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StartExpiringPacketStreamResponse>, I>>(
    object: I,
  ): StartExpiringPacketStreamResponse {
    const message = createBaseStartExpiringPacketStreamResponse();
    message.heartbeat = (object.heartbeat !== undefined && object.heartbeat !== null)
      ? Heartbeat.fromPartial(object.heartbeat)
      : undefined;
    return message;
  },
};

/** / Validators can connect to Block Engines to receive packets and bundles. */
export type BlockEngineValidatorService = typeof BlockEngineValidatorService;
export const BlockEngineValidatorService = {
  /** / Validators can subscribe to the block engine to receive a stream of packets */
  subscribePackets: {
    path: "/block_engine.BlockEngineValidator/SubscribePackets",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribePacketsRequest) => Buffer.from(SubscribePacketsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribePacketsRequest.decode(value),
    responseSerialize: (value: SubscribePacketsResponse) =>
      Buffer.from(SubscribePacketsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SubscribePacketsResponse.decode(value),
  },
  /** / Validators can subscribe to the block engine to receive a stream of simulated and profitable bundles */
  subscribeBundles: {
    path: "/block_engine.BlockEngineValidator/SubscribeBundles",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribeBundlesRequest) => Buffer.from(SubscribeBundlesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribeBundlesRequest.decode(value),
    responseSerialize: (value: SubscribeBundlesResponse) =>
      Buffer.from(SubscribeBundlesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SubscribeBundlesResponse.decode(value),
  },
  /**
   * Block builders can optionally collect fees. This returns fee information if a block builder wants to
   * collect one.
   */
  getBlockBuilderFeeInfo: {
    path: "/block_engine.BlockEngineValidator/GetBlockBuilderFeeInfo",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: BlockBuilderFeeInfoRequest) =>
      Buffer.from(BlockBuilderFeeInfoRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => BlockBuilderFeeInfoRequest.decode(value),
    responseSerialize: (value: BlockBuilderFeeInfoResponse) =>
      Buffer.from(BlockBuilderFeeInfoResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => BlockBuilderFeeInfoResponse.decode(value),
  },
} as const;

export interface BlockEngineValidatorServer extends UntypedServiceImplementation {
  /** / Validators can subscribe to the block engine to receive a stream of packets */
  subscribePackets: handleServerStreamingCall<SubscribePacketsRequest, SubscribePacketsResponse>;
  /** / Validators can subscribe to the block engine to receive a stream of simulated and profitable bundles */
  subscribeBundles: handleServerStreamingCall<SubscribeBundlesRequest, SubscribeBundlesResponse>;
  /**
   * Block builders can optionally collect fees. This returns fee information if a block builder wants to
   * collect one.
   */
  getBlockBuilderFeeInfo: handleUnaryCall<BlockBuilderFeeInfoRequest, BlockBuilderFeeInfoResponse>;
}

export interface BlockEngineValidatorClient extends Client {
  /** / Validators can subscribe to the block engine to receive a stream of packets */
  subscribePackets(
    request: SubscribePacketsRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<SubscribePacketsResponse>;
  subscribePackets(
    request: SubscribePacketsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<SubscribePacketsResponse>;
  /** / Validators can subscribe to the block engine to receive a stream of simulated and profitable bundles */
  subscribeBundles(
    request: SubscribeBundlesRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<SubscribeBundlesResponse>;
  subscribeBundles(
    request: SubscribeBundlesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<SubscribeBundlesResponse>;
  /**
   * Block builders can optionally collect fees. This returns fee information if a block builder wants to
   * collect one.
   */
  getBlockBuilderFeeInfo(
    request: BlockBuilderFeeInfoRequest,
    callback: (error: ServiceError | null, response: BlockBuilderFeeInfoResponse) => void,
  ): ClientUnaryCall;
  getBlockBuilderFeeInfo(
    request: BlockBuilderFeeInfoRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: BlockBuilderFeeInfoResponse) => void,
  ): ClientUnaryCall;
  getBlockBuilderFeeInfo(
    request: BlockBuilderFeeInfoRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: BlockBuilderFeeInfoResponse) => void,
  ): ClientUnaryCall;
}

export const BlockEngineValidatorClient = makeGenericClientConstructor(
  BlockEngineValidatorService,
  "block_engine.BlockEngineValidator",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): BlockEngineValidatorClient;
  service: typeof BlockEngineValidatorService;
};

/**
 * / Relayers can forward packets to Block Engines.
 * / Block Engines provide an AccountsOfInterest field to only send transactions that are of interest.
 */
export type BlockEngineRelayerService = typeof BlockEngineRelayerService;
export const BlockEngineRelayerService = {
  /**
   * / The block engine feeds accounts of interest (AOI) updates to the relayer periodically.
   * / For all transactions the relayer receives, it forwards transactions to the block engine which write-lock
   * / any of the accounts in the AOI.
   */
  subscribeAccountsOfInterest: {
    path: "/block_engine.BlockEngineRelayer/SubscribeAccountsOfInterest",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: AccountsOfInterestRequest) =>
      Buffer.from(AccountsOfInterestRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => AccountsOfInterestRequest.decode(value),
    responseSerialize: (value: AccountsOfInterestUpdate) =>
      Buffer.from(AccountsOfInterestUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => AccountsOfInterestUpdate.decode(value),
  },
  subscribeProgramsOfInterest: {
    path: "/block_engine.BlockEngineRelayer/SubscribeProgramsOfInterest",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: ProgramsOfInterestRequest) =>
      Buffer.from(ProgramsOfInterestRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ProgramsOfInterestRequest.decode(value),
    responseSerialize: (value: ProgramsOfInterestUpdate) =>
      Buffer.from(ProgramsOfInterestUpdate.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ProgramsOfInterestUpdate.decode(value),
  },
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats.
   * NOTE: This is a bi-directional stream due to a bug with how Envoy handles half closed client-side streams.
   * The issue is being tracked here: https://github.com/envoyproxy/envoy/issues/22748. In the meantime, the
   * server will stream heartbeats to clients at some reasonable cadence.
   */
  startExpiringPacketStream: {
    path: "/block_engine.BlockEngineRelayer/StartExpiringPacketStream",
    requestStream: true,
    responseStream: true,
    requestSerialize: (value: PacketBatchUpdate) => Buffer.from(PacketBatchUpdate.encode(value).finish()),
    requestDeserialize: (value: Buffer) => PacketBatchUpdate.decode(value),
    responseSerialize: (value: StartExpiringPacketStreamResponse) =>
      Buffer.from(StartExpiringPacketStreamResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => StartExpiringPacketStreamResponse.decode(value),
  },
} as const;

export interface BlockEngineRelayerServer extends UntypedServiceImplementation {
  /**
   * / The block engine feeds accounts of interest (AOI) updates to the relayer periodically.
   * / For all transactions the relayer receives, it forwards transactions to the block engine which write-lock
   * / any of the accounts in the AOI.
   */
  subscribeAccountsOfInterest: handleServerStreamingCall<AccountsOfInterestRequest, AccountsOfInterestUpdate>;
  subscribeProgramsOfInterest: handleServerStreamingCall<ProgramsOfInterestRequest, ProgramsOfInterestUpdate>;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats.
   * NOTE: This is a bi-directional stream due to a bug with how Envoy handles half closed client-side streams.
   * The issue is being tracked here: https://github.com/envoyproxy/envoy/issues/22748. In the meantime, the
   * server will stream heartbeats to clients at some reasonable cadence.
   */
  startExpiringPacketStream: handleBidiStreamingCall<PacketBatchUpdate, StartExpiringPacketStreamResponse>;
}

export interface BlockEngineRelayerClient extends Client {
  /**
   * / The block engine feeds accounts of interest (AOI) updates to the relayer periodically.
   * / For all transactions the relayer receives, it forwards transactions to the block engine which write-lock
   * / any of the accounts in the AOI.
   */
  subscribeAccountsOfInterest(
    request: AccountsOfInterestRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<AccountsOfInterestUpdate>;
  subscribeAccountsOfInterest(
    request: AccountsOfInterestRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<AccountsOfInterestUpdate>;
  subscribeProgramsOfInterest(
    request: ProgramsOfInterestRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<ProgramsOfInterestUpdate>;
  subscribeProgramsOfInterest(
    request: ProgramsOfInterestRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<ProgramsOfInterestUpdate>;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats.
   * NOTE: This is a bi-directional stream due to a bug with how Envoy handles half closed client-side streams.
   * The issue is being tracked here: https://github.com/envoyproxy/envoy/issues/22748. In the meantime, the
   * server will stream heartbeats to clients at some reasonable cadence.
   */
  startExpiringPacketStream(): ClientDuplexStream<PacketBatchUpdate, StartExpiringPacketStreamResponse>;
  startExpiringPacketStream(
    options: Partial<CallOptions>,
  ): ClientDuplexStream<PacketBatchUpdate, StartExpiringPacketStreamResponse>;
  startExpiringPacketStream(
    metadata: Metadata,
    options?: Partial<CallOptions>,
  ): ClientDuplexStream<PacketBatchUpdate, StartExpiringPacketStreamResponse>;
}

export const BlockEngineRelayerClient = makeGenericClientConstructor(
  BlockEngineRelayerService,
  "block_engine.BlockEngineRelayer",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): BlockEngineRelayerClient;
  service: typeof BlockEngineRelayerService;
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
