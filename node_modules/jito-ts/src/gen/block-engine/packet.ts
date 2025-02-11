/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "packet";

export interface PacketBatch {
  packets: Packet[];
}

export interface Packet {
  data: Uint8Array;
  meta: Meta | undefined;
}

export interface Meta {
  size: number;
  addr: string;
  port: number;
  flags: PacketFlags | undefined;
  senderStake: number;
}

export interface PacketFlags {
  discard: boolean;
  forwarded: boolean;
  repair: boolean;
  simpleVoteTx: boolean;
  tracerPacket: boolean;
}

function createBasePacketBatch(): PacketBatch {
  return { packets: [] };
}

export const PacketBatch = {
  encode(message: PacketBatch, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.packets) {
      Packet.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PacketBatch {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePacketBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.packets.push(Packet.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PacketBatch {
    return { packets: Array.isArray(object?.packets) ? object.packets.map((e: any) => Packet.fromJSON(e)) : [] };
  },

  toJSON(message: PacketBatch): unknown {
    const obj: any = {};
    if (message.packets) {
      obj.packets = message.packets.map((e) => e ? Packet.toJSON(e) : undefined);
    } else {
      obj.packets = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PacketBatch>, I>>(base?: I): PacketBatch {
    return PacketBatch.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PacketBatch>, I>>(object: I): PacketBatch {
    const message = createBasePacketBatch();
    message.packets = object.packets?.map((e) => Packet.fromPartial(e)) || [];
    return message;
  },
};

function createBasePacket(): Packet {
  return { data: new Uint8Array(), meta: undefined };
}

export const Packet = {
  encode(message: Packet, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.data.length !== 0) {
      writer.uint32(10).bytes(message.data);
    }
    if (message.meta !== undefined) {
      Meta.encode(message.meta, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Packet {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data = reader.bytes();
          break;
        case 2:
          message.meta = Meta.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Packet {
    return {
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
      meta: isSet(object.meta) ? Meta.fromJSON(object.meta) : undefined,
    };
  },

  toJSON(message: Packet): unknown {
    const obj: any = {};
    message.data !== undefined &&
      (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
    message.meta !== undefined && (obj.meta = message.meta ? Meta.toJSON(message.meta) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Packet>, I>>(base?: I): Packet {
    return Packet.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Packet>, I>>(object: I): Packet {
    const message = createBasePacket();
    message.data = object.data ?? new Uint8Array();
    message.meta = (object.meta !== undefined && object.meta !== null) ? Meta.fromPartial(object.meta) : undefined;
    return message;
  },
};

function createBaseMeta(): Meta {
  return { size: 0, addr: "", port: 0, flags: undefined, senderStake: 0 };
}

export const Meta = {
  encode(message: Meta, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.size !== 0) {
      writer.uint32(8).uint64(message.size);
    }
    if (message.addr !== "") {
      writer.uint32(18).string(message.addr);
    }
    if (message.port !== 0) {
      writer.uint32(24).uint32(message.port);
    }
    if (message.flags !== undefined) {
      PacketFlags.encode(message.flags, writer.uint32(34).fork()).ldelim();
    }
    if (message.senderStake !== 0) {
      writer.uint32(40).uint64(message.senderStake);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Meta {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMeta();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.size = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.addr = reader.string();
          break;
        case 3:
          message.port = reader.uint32();
          break;
        case 4:
          message.flags = PacketFlags.decode(reader, reader.uint32());
          break;
        case 5:
          message.senderStake = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Meta {
    return {
      size: isSet(object.size) ? Number(object.size) : 0,
      addr: isSet(object.addr) ? String(object.addr) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      flags: isSet(object.flags) ? PacketFlags.fromJSON(object.flags) : undefined,
      senderStake: isSet(object.senderStake) ? Number(object.senderStake) : 0,
    };
  },

  toJSON(message: Meta): unknown {
    const obj: any = {};
    message.size !== undefined && (obj.size = Math.round(message.size));
    message.addr !== undefined && (obj.addr = message.addr);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.flags !== undefined && (obj.flags = message.flags ? PacketFlags.toJSON(message.flags) : undefined);
    message.senderStake !== undefined && (obj.senderStake = Math.round(message.senderStake));
    return obj;
  },

  create<I extends Exact<DeepPartial<Meta>, I>>(base?: I): Meta {
    return Meta.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Meta>, I>>(object: I): Meta {
    const message = createBaseMeta();
    message.size = object.size ?? 0;
    message.addr = object.addr ?? "";
    message.port = object.port ?? 0;
    message.flags = (object.flags !== undefined && object.flags !== null)
      ? PacketFlags.fromPartial(object.flags)
      : undefined;
    message.senderStake = object.senderStake ?? 0;
    return message;
  },
};

function createBasePacketFlags(): PacketFlags {
  return { discard: false, forwarded: false, repair: false, simpleVoteTx: false, tracerPacket: false };
}

export const PacketFlags = {
  encode(message: PacketFlags, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.discard === true) {
      writer.uint32(8).bool(message.discard);
    }
    if (message.forwarded === true) {
      writer.uint32(16).bool(message.forwarded);
    }
    if (message.repair === true) {
      writer.uint32(24).bool(message.repair);
    }
    if (message.simpleVoteTx === true) {
      writer.uint32(32).bool(message.simpleVoteTx);
    }
    if (message.tracerPacket === true) {
      writer.uint32(40).bool(message.tracerPacket);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PacketFlags {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePacketFlags();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.discard = reader.bool();
          break;
        case 2:
          message.forwarded = reader.bool();
          break;
        case 3:
          message.repair = reader.bool();
          break;
        case 4:
          message.simpleVoteTx = reader.bool();
          break;
        case 5:
          message.tracerPacket = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PacketFlags {
    return {
      discard: isSet(object.discard) ? Boolean(object.discard) : false,
      forwarded: isSet(object.forwarded) ? Boolean(object.forwarded) : false,
      repair: isSet(object.repair) ? Boolean(object.repair) : false,
      simpleVoteTx: isSet(object.simpleVoteTx) ? Boolean(object.simpleVoteTx) : false,
      tracerPacket: isSet(object.tracerPacket) ? Boolean(object.tracerPacket) : false,
    };
  },

  toJSON(message: PacketFlags): unknown {
    const obj: any = {};
    message.discard !== undefined && (obj.discard = message.discard);
    message.forwarded !== undefined && (obj.forwarded = message.forwarded);
    message.repair !== undefined && (obj.repair = message.repair);
    message.simpleVoteTx !== undefined && (obj.simpleVoteTx = message.simpleVoteTx);
    message.tracerPacket !== undefined && (obj.tracerPacket = message.tracerPacket);
    return obj;
  },

  create<I extends Exact<DeepPartial<PacketFlags>, I>>(base?: I): PacketFlags {
    return PacketFlags.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PacketFlags>, I>>(object: I): PacketFlags {
    const message = createBasePacketFlags();
    message.discard = object.discard ?? false;
    message.forwarded = object.forwarded ?? false;
    message.repair = object.repair ?? false;
    message.simpleVoteTx = object.simpleVoteTx ?? false;
    message.tracerPacket = object.tracerPacket ?? false;
    return message;
  },
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
