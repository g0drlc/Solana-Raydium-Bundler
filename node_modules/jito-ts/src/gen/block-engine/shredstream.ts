/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Socket } from "./shared";

export const protobufPackage = "shredstream";

export interface Heartbeat {
  /**
   * don't trust IP:PORT from tcp header since it can be tampered over the wire
   * `socket.ip` must match incoming packet's ip. this prevents spamming an unwitting destination
   */
  socket:
    | Socket
    | undefined;
  /**
   * regions for shredstream proxy to receive shreds from
   * list of valid regions: https://jito-labs.gitbook.io/mev/systems/connecting/mainnet
   */
  regions: string[];
}

export interface HeartbeatResponse {
  /** client must respond within `ttl_ms` to keep stream alive */
  ttlMs: number;
}

function createBaseHeartbeat(): Heartbeat {
  return { socket: undefined, regions: [] };
}

export const Heartbeat = {
  encode(message: Heartbeat, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.socket !== undefined) {
      Socket.encode(message.socket, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.regions) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Heartbeat {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartbeat();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.socket = Socket.decode(reader, reader.uint32());
          break;
        case 2:
          message.regions.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Heartbeat {
    return {
      socket: isSet(object.socket) ? Socket.fromJSON(object.socket) : undefined,
      regions: Array.isArray(object?.regions) ? object.regions.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: Heartbeat): unknown {
    const obj: any = {};
    message.socket !== undefined && (obj.socket = message.socket ? Socket.toJSON(message.socket) : undefined);
    if (message.regions) {
      obj.regions = message.regions.map((e) => e);
    } else {
      obj.regions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Heartbeat>, I>>(base?: I): Heartbeat {
    return Heartbeat.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Heartbeat>, I>>(object: I): Heartbeat {
    const message = createBaseHeartbeat();
    message.socket = (object.socket !== undefined && object.socket !== null)
      ? Socket.fromPartial(object.socket)
      : undefined;
    message.regions = object.regions?.map((e) => e) || [];
    return message;
  },
};

function createBaseHeartbeatResponse(): HeartbeatResponse {
  return { ttlMs: 0 };
}

export const HeartbeatResponse = {
  encode(message: HeartbeatResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ttlMs !== 0) {
      writer.uint32(8).uint32(message.ttlMs);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeartbeatResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ttlMs = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HeartbeatResponse {
    return { ttlMs: isSet(object.ttlMs) ? Number(object.ttlMs) : 0 };
  },

  toJSON(message: HeartbeatResponse): unknown {
    const obj: any = {};
    message.ttlMs !== undefined && (obj.ttlMs = Math.round(message.ttlMs));
    return obj;
  },

  create<I extends Exact<DeepPartial<HeartbeatResponse>, I>>(base?: I): HeartbeatResponse {
    return HeartbeatResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HeartbeatResponse>, I>>(object: I): HeartbeatResponse {
    const message = createBaseHeartbeatResponse();
    message.ttlMs = object.ttlMs ?? 0;
    return message;
  },
};

export type ShredstreamService = typeof ShredstreamService;
export const ShredstreamService = {
  /** RPC endpoint to send heartbeats to keep shreds flowing */
  sendHeartbeat: {
    path: "/shredstream.Shredstream/SendHeartbeat",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: Heartbeat) => Buffer.from(Heartbeat.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Heartbeat.decode(value),
    responseSerialize: (value: HeartbeatResponse) => Buffer.from(HeartbeatResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => HeartbeatResponse.decode(value),
  },
} as const;

export interface ShredstreamServer extends UntypedServiceImplementation {
  /** RPC endpoint to send heartbeats to keep shreds flowing */
  sendHeartbeat: handleUnaryCall<Heartbeat, HeartbeatResponse>;
}

export interface ShredstreamClient extends Client {
  /** RPC endpoint to send heartbeats to keep shreds flowing */
  sendHeartbeat(
    request: Heartbeat,
    callback: (error: ServiceError | null, response: HeartbeatResponse) => void,
  ): ClientUnaryCall;
  sendHeartbeat(
    request: Heartbeat,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: HeartbeatResponse) => void,
  ): ClientUnaryCall;
  sendHeartbeat(
    request: Heartbeat,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: HeartbeatResponse) => void,
  ): ClientUnaryCall;
}

export const ShredstreamClient = makeGenericClientConstructor(
  ShredstreamService,
  "shredstream.Shredstream",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): ShredstreamClient;
  service: typeof ShredstreamService;
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
