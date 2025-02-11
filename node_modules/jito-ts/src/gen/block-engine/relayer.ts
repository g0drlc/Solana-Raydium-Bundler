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
import _m0 from "protobufjs/minimal";
import { PacketBatch } from "./packet";
import { Header, Heartbeat, Socket } from "./shared";

export const protobufPackage = "relayer";

export interface GetTpuConfigsRequest {
}

export interface GetTpuConfigsResponse {
  tpu: Socket | undefined;
  tpuForward: Socket | undefined;
}

export interface SubscribePacketsRequest {
}

export interface SubscribePacketsResponse {
  header: Header | undefined;
  heartbeat?: Heartbeat | undefined;
  batch?: PacketBatch | undefined;
}

function createBaseGetTpuConfigsRequest(): GetTpuConfigsRequest {
  return {};
}

export const GetTpuConfigsRequest = {
  encode(_: GetTpuConfigsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTpuConfigsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTpuConfigsRequest();
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

  fromJSON(_: any): GetTpuConfigsRequest {
    return {};
  },

  toJSON(_: GetTpuConfigsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTpuConfigsRequest>, I>>(base?: I): GetTpuConfigsRequest {
    return GetTpuConfigsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTpuConfigsRequest>, I>>(_: I): GetTpuConfigsRequest {
    const message = createBaseGetTpuConfigsRequest();
    return message;
  },
};

function createBaseGetTpuConfigsResponse(): GetTpuConfigsResponse {
  return { tpu: undefined, tpuForward: undefined };
}

export const GetTpuConfigsResponse = {
  encode(message: GetTpuConfigsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tpu !== undefined) {
      Socket.encode(message.tpu, writer.uint32(10).fork()).ldelim();
    }
    if (message.tpuForward !== undefined) {
      Socket.encode(message.tpuForward, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTpuConfigsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTpuConfigsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tpu = Socket.decode(reader, reader.uint32());
          break;
        case 2:
          message.tpuForward = Socket.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTpuConfigsResponse {
    return {
      tpu: isSet(object.tpu) ? Socket.fromJSON(object.tpu) : undefined,
      tpuForward: isSet(object.tpuForward) ? Socket.fromJSON(object.tpuForward) : undefined,
    };
  },

  toJSON(message: GetTpuConfigsResponse): unknown {
    const obj: any = {};
    message.tpu !== undefined && (obj.tpu = message.tpu ? Socket.toJSON(message.tpu) : undefined);
    message.tpuForward !== undefined &&
      (obj.tpuForward = message.tpuForward ? Socket.toJSON(message.tpuForward) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTpuConfigsResponse>, I>>(base?: I): GetTpuConfigsResponse {
    return GetTpuConfigsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTpuConfigsResponse>, I>>(object: I): GetTpuConfigsResponse {
    const message = createBaseGetTpuConfigsResponse();
    message.tpu = (object.tpu !== undefined && object.tpu !== null) ? Socket.fromPartial(object.tpu) : undefined;
    message.tpuForward = (object.tpuForward !== undefined && object.tpuForward !== null)
      ? Socket.fromPartial(object.tpuForward)
      : undefined;
    return message;
  },
};

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
  return { header: undefined, heartbeat: undefined, batch: undefined };
}

export const SubscribePacketsResponse = {
  encode(message: SubscribePacketsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      Header.encode(message.header, writer.uint32(10).fork()).ldelim();
    }
    if (message.heartbeat !== undefined) {
      Heartbeat.encode(message.heartbeat, writer.uint32(18).fork()).ldelim();
    }
    if (message.batch !== undefined) {
      PacketBatch.encode(message.batch, writer.uint32(26).fork()).ldelim();
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
          message.heartbeat = Heartbeat.decode(reader, reader.uint32());
          break;
        case 3:
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
      heartbeat: isSet(object.heartbeat) ? Heartbeat.fromJSON(object.heartbeat) : undefined,
      batch: isSet(object.batch) ? PacketBatch.fromJSON(object.batch) : undefined,
    };
  },

  toJSON(message: SubscribePacketsResponse): unknown {
    const obj: any = {};
    message.header !== undefined && (obj.header = message.header ? Header.toJSON(message.header) : undefined);
    message.heartbeat !== undefined &&
      (obj.heartbeat = message.heartbeat ? Heartbeat.toJSON(message.heartbeat) : undefined);
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
    message.heartbeat = (object.heartbeat !== undefined && object.heartbeat !== null)
      ? Heartbeat.fromPartial(object.heartbeat)
      : undefined;
    message.batch = (object.batch !== undefined && object.batch !== null)
      ? PacketBatch.fromPartial(object.batch)
      : undefined;
    return message;
  },
};

/**
 * / Relayers offer a TPU and TPU forward proxy for Solana validators.
 * / Validators can connect and fetch the TPU configuration for the relayer and start to advertise the
 * / relayer's information in gossip.
 * / They can also subscribe to packets which arrived on the TPU ports at the relayer
 */
export type RelayerService = typeof RelayerService;
export const RelayerService = {
  /**
   * The relayer has TPU and TPU forward sockets that validators can leverage.
   * A validator can fetch this config and change its TPU and TPU forward port in gossip.
   */
  getTpuConfigs: {
    path: "/relayer.Relayer/GetTpuConfigs",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetTpuConfigsRequest) => Buffer.from(GetTpuConfigsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetTpuConfigsRequest.decode(value),
    responseSerialize: (value: GetTpuConfigsResponse) => Buffer.from(GetTpuConfigsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetTpuConfigsResponse.decode(value),
  },
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats
   */
  subscribePackets: {
    path: "/relayer.Relayer/SubscribePackets",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: SubscribePacketsRequest) => Buffer.from(SubscribePacketsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubscribePacketsRequest.decode(value),
    responseSerialize: (value: SubscribePacketsResponse) =>
      Buffer.from(SubscribePacketsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SubscribePacketsResponse.decode(value),
  },
} as const;

export interface RelayerServer extends UntypedServiceImplementation {
  /**
   * The relayer has TPU and TPU forward sockets that validators can leverage.
   * A validator can fetch this config and change its TPU and TPU forward port in gossip.
   */
  getTpuConfigs: handleUnaryCall<GetTpuConfigsRequest, GetTpuConfigsResponse>;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats
   */
  subscribePackets: handleServerStreamingCall<SubscribePacketsRequest, SubscribePacketsResponse>;
}

export interface RelayerClient extends Client {
  /**
   * The relayer has TPU and TPU forward sockets that validators can leverage.
   * A validator can fetch this config and change its TPU and TPU forward port in gossip.
   */
  getTpuConfigs(
    request: GetTpuConfigsRequest,
    callback: (error: ServiceError | null, response: GetTpuConfigsResponse) => void,
  ): ClientUnaryCall;
  getTpuConfigs(
    request: GetTpuConfigsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetTpuConfigsResponse) => void,
  ): ClientUnaryCall;
  getTpuConfigs(
    request: GetTpuConfigsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetTpuConfigsResponse) => void,
  ): ClientUnaryCall;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats
   */
  subscribePackets(
    request: SubscribePacketsRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<SubscribePacketsResponse>;
  subscribePackets(
    request: SubscribePacketsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<SubscribePacketsResponse>;
}

export const RelayerClient = makeGenericClientConstructor(RelayerService, "relayer.Relayer") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): RelayerClient;
  service: typeof RelayerService;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
