/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Header } from "./shared";

export const protobufPackage = "block";

/** Condensed block helpful for getting data around efficiently internal to our system. */
export interface CondensedBlock {
  header: Header | undefined;
  previousBlockhash: string;
  blockhash: string;
  parentSlot: number;
  versionedTransactions: Uint8Array[];
  slot: number;
  commitment: string;
}

function createBaseCondensedBlock(): CondensedBlock {
  return {
    header: undefined,
    previousBlockhash: "",
    blockhash: "",
    parentSlot: 0,
    versionedTransactions: [],
    slot: 0,
    commitment: "",
  };
}

export const CondensedBlock = {
  encode(message: CondensedBlock, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      Header.encode(message.header, writer.uint32(10).fork()).ldelim();
    }
    if (message.previousBlockhash !== "") {
      writer.uint32(18).string(message.previousBlockhash);
    }
    if (message.blockhash !== "") {
      writer.uint32(26).string(message.blockhash);
    }
    if (message.parentSlot !== 0) {
      writer.uint32(32).uint64(message.parentSlot);
    }
    for (const v of message.versionedTransactions) {
      writer.uint32(42).bytes(v!);
    }
    if (message.slot !== 0) {
      writer.uint32(48).uint64(message.slot);
    }
    if (message.commitment !== "") {
      writer.uint32(58).string(message.commitment);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CondensedBlock {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCondensedBlock();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.header = Header.decode(reader, reader.uint32());
          break;
        case 2:
          message.previousBlockhash = reader.string();
          break;
        case 3:
          message.blockhash = reader.string();
          break;
        case 4:
          message.parentSlot = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.versionedTransactions.push(reader.bytes());
          break;
        case 6:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.commitment = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CondensedBlock {
    return {
      header: isSet(object.header) ? Header.fromJSON(object.header) : undefined,
      previousBlockhash: isSet(object.previousBlockhash) ? String(object.previousBlockhash) : "",
      blockhash: isSet(object.blockhash) ? String(object.blockhash) : "",
      parentSlot: isSet(object.parentSlot) ? Number(object.parentSlot) : 0,
      versionedTransactions: Array.isArray(object?.versionedTransactions)
        ? object.versionedTransactions.map((e: any) => bytesFromBase64(e))
        : [],
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      commitment: isSet(object.commitment) ? String(object.commitment) : "",
    };
  },

  toJSON(message: CondensedBlock): unknown {
    const obj: any = {};
    message.header !== undefined && (obj.header = message.header ? Header.toJSON(message.header) : undefined);
    message.previousBlockhash !== undefined && (obj.previousBlockhash = message.previousBlockhash);
    message.blockhash !== undefined && (obj.blockhash = message.blockhash);
    message.parentSlot !== undefined && (obj.parentSlot = Math.round(message.parentSlot));
    if (message.versionedTransactions) {
      obj.versionedTransactions = message.versionedTransactions.map((e) =>
        base64FromBytes(e !== undefined ? e : new Uint8Array())
      );
    } else {
      obj.versionedTransactions = [];
    }
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.commitment !== undefined && (obj.commitment = message.commitment);
    return obj;
  },

  create<I extends Exact<DeepPartial<CondensedBlock>, I>>(base?: I): CondensedBlock {
    return CondensedBlock.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CondensedBlock>, I>>(object: I): CondensedBlock {
    const message = createBaseCondensedBlock();
    message.header = (object.header !== undefined && object.header !== null)
      ? Header.fromPartial(object.header)
      : undefined;
    message.previousBlockhash = object.previousBlockhash ?? "";
    message.blockhash = object.blockhash ?? "";
    message.parentSlot = object.parentSlot ?? 0;
    message.versionedTransactions = object.versionedTransactions?.map((e) => e) || [];
    message.slot = object.slot ?? 0;
    message.commitment = object.commitment ?? "";
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
