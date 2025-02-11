/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Packet } from "./packet";
import { Header } from "./shared";

export const protobufPackage = "bundle";

export enum DroppedReason {
  BlockhashExpired = 0,
  /** PartiallyProcessed - One or more transactions in the bundle landed on-chain, invalidating the bundle. */
  PartiallyProcessed = 1,
  /** NotFinalized - This indicates bundle was processed but not finalized. This could occur during forks. */
  NotFinalized = 2,
  UNRECOGNIZED = -1,
}

export function droppedReasonFromJSON(object: any): DroppedReason {
  switch (object) {
    case 0:
    case "BlockhashExpired":
      return DroppedReason.BlockhashExpired;
    case 1:
    case "PartiallyProcessed":
      return DroppedReason.PartiallyProcessed;
    case 2:
    case "NotFinalized":
      return DroppedReason.NotFinalized;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DroppedReason.UNRECOGNIZED;
  }
}

export function droppedReasonToJSON(object: DroppedReason): string {
  switch (object) {
    case DroppedReason.BlockhashExpired:
      return "BlockhashExpired";
    case DroppedReason.PartiallyProcessed:
      return "PartiallyProcessed";
    case DroppedReason.NotFinalized:
      return "NotFinalized";
    case DroppedReason.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Bundle {
  header: Header | undefined;
  packets: Packet[];
}

export interface BundleUuid {
  bundle: Bundle | undefined;
  uuid: string;
}

/**
 * Indicates the bundle was accepted and forwarded to a validator.
 * NOTE: A single bundle may have multiple events emitted if forwarded to many validators.
 */
export interface Accepted {
  /** Slot at which bundle was forwarded. */
  slot: number;
  /** Validator identity bundle was forwarded to. */
  validatorIdentity: string;
}

/** Indicates the bundle was dropped and therefore not forwarded to any validator. */
export interface Rejected {
  stateAuctionBidRejected?: StateAuctionBidRejected | undefined;
  winningBatchBidRejected?: WinningBatchBidRejected | undefined;
  simulationFailure?: SimulationFailure | undefined;
  internalError?: InternalError | undefined;
  droppedBundle?: DroppedBundle | undefined;
}

/**
 * Indicates the bundle's bid was high enough to win its state auction.
 * However, not high enough relative to other state auction winners and therefore excluded from being forwarded.
 */
export interface WinningBatchBidRejected {
  /** Auction's unique identifier. */
  auctionId: string;
  /** Bundle's simulated bid. */
  simulatedBidLamports: number;
  msg?: string | undefined;
}

/** Indicates the bundle's bid was __not__ high enough to be included in its state auction's set of winners. */
export interface StateAuctionBidRejected {
  /** Auction's unique identifier. */
  auctionId: string;
  /** Bundle's simulated bid. */
  simulatedBidLamports: number;
  msg?: string | undefined;
}

/** Bundle dropped due to simulation failure. */
export interface SimulationFailure {
  /** Signature of the offending transaction. */
  txSignature: string;
  msg?: string | undefined;
}

/** Bundle dropped due to an internal error. */
export interface InternalError {
  msg: string;
}

/** Bundle dropped (e.g. because no leader upcoming) */
export interface DroppedBundle {
  msg: string;
}

export interface Finalized {
}

export interface Processed {
  validatorIdentity: string;
  slot: number;
  /** / Index within the block. */
  bundleIndex: number;
}

export interface Dropped {
  reason: DroppedReason;
}

export interface BundleResult {
  /** Bundle's Uuid. */
  bundleId: string;
  /** Indicated accepted by the block-engine and forwarded to a jito-solana validator. */
  accepted?:
    | Accepted
    | undefined;
  /** Rejected by the block-engine. */
  rejected?:
    | Rejected
    | undefined;
  /** Reached finalized commitment level. */
  finalized?:
    | Finalized
    | undefined;
  /** Reached a processed commitment level. */
  processed?:
    | Processed
    | undefined;
  /** Was accepted and forwarded by the block-engine but never landed on-chain. */
  dropped?: Dropped | undefined;
}

function createBaseBundle(): Bundle {
  return { header: undefined, packets: [] };
}

export const Bundle = {
  encode(message: Bundle, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      Header.encode(message.header, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.packets) {
      Packet.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Bundle {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBundle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.header = Header.decode(reader, reader.uint32());
          break;
        case 3:
          message.packets.push(Packet.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Bundle {
    return {
      header: isSet(object.header) ? Header.fromJSON(object.header) : undefined,
      packets: Array.isArray(object?.packets) ? object.packets.map((e: any) => Packet.fromJSON(e)) : [],
    };
  },

  toJSON(message: Bundle): unknown {
    const obj: any = {};
    message.header !== undefined && (obj.header = message.header ? Header.toJSON(message.header) : undefined);
    if (message.packets) {
      obj.packets = message.packets.map((e) => e ? Packet.toJSON(e) : undefined);
    } else {
      obj.packets = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Bundle>, I>>(base?: I): Bundle {
    return Bundle.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Bundle>, I>>(object: I): Bundle {
    const message = createBaseBundle();
    message.header = (object.header !== undefined && object.header !== null)
      ? Header.fromPartial(object.header)
      : undefined;
    message.packets = object.packets?.map((e) => Packet.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBundleUuid(): BundleUuid {
  return { bundle: undefined, uuid: "" };
}

export const BundleUuid = {
  encode(message: BundleUuid, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bundle !== undefined) {
      Bundle.encode(message.bundle, writer.uint32(10).fork()).ldelim();
    }
    if (message.uuid !== "") {
      writer.uint32(18).string(message.uuid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BundleUuid {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBundleUuid();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bundle = Bundle.decode(reader, reader.uint32());
          break;
        case 2:
          message.uuid = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BundleUuid {
    return {
      bundle: isSet(object.bundle) ? Bundle.fromJSON(object.bundle) : undefined,
      uuid: isSet(object.uuid) ? String(object.uuid) : "",
    };
  },

  toJSON(message: BundleUuid): unknown {
    const obj: any = {};
    message.bundle !== undefined && (obj.bundle = message.bundle ? Bundle.toJSON(message.bundle) : undefined);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    return obj;
  },

  create<I extends Exact<DeepPartial<BundleUuid>, I>>(base?: I): BundleUuid {
    return BundleUuid.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BundleUuid>, I>>(object: I): BundleUuid {
    const message = createBaseBundleUuid();
    message.bundle = (object.bundle !== undefined && object.bundle !== null)
      ? Bundle.fromPartial(object.bundle)
      : undefined;
    message.uuid = object.uuid ?? "";
    return message;
  },
};

function createBaseAccepted(): Accepted {
  return { slot: 0, validatorIdentity: "" };
}

export const Accepted = {
  encode(message: Accepted, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.slot !== 0) {
      writer.uint32(8).uint64(message.slot);
    }
    if (message.validatorIdentity !== "") {
      writer.uint32(18).string(message.validatorIdentity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Accepted {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccepted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.validatorIdentity = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Accepted {
    return {
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      validatorIdentity: isSet(object.validatorIdentity) ? String(object.validatorIdentity) : "",
    };
  },

  toJSON(message: Accepted): unknown {
    const obj: any = {};
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.validatorIdentity !== undefined && (obj.validatorIdentity = message.validatorIdentity);
    return obj;
  },

  create<I extends Exact<DeepPartial<Accepted>, I>>(base?: I): Accepted {
    return Accepted.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Accepted>, I>>(object: I): Accepted {
    const message = createBaseAccepted();
    message.slot = object.slot ?? 0;
    message.validatorIdentity = object.validatorIdentity ?? "";
    return message;
  },
};

function createBaseRejected(): Rejected {
  return {
    stateAuctionBidRejected: undefined,
    winningBatchBidRejected: undefined,
    simulationFailure: undefined,
    internalError: undefined,
    droppedBundle: undefined,
  };
}

export const Rejected = {
  encode(message: Rejected, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stateAuctionBidRejected !== undefined) {
      StateAuctionBidRejected.encode(message.stateAuctionBidRejected, writer.uint32(10).fork()).ldelim();
    }
    if (message.winningBatchBidRejected !== undefined) {
      WinningBatchBidRejected.encode(message.winningBatchBidRejected, writer.uint32(18).fork()).ldelim();
    }
    if (message.simulationFailure !== undefined) {
      SimulationFailure.encode(message.simulationFailure, writer.uint32(26).fork()).ldelim();
    }
    if (message.internalError !== undefined) {
      InternalError.encode(message.internalError, writer.uint32(34).fork()).ldelim();
    }
    if (message.droppedBundle !== undefined) {
      DroppedBundle.encode(message.droppedBundle, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Rejected {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRejected();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stateAuctionBidRejected = StateAuctionBidRejected.decode(reader, reader.uint32());
          break;
        case 2:
          message.winningBatchBidRejected = WinningBatchBidRejected.decode(reader, reader.uint32());
          break;
        case 3:
          message.simulationFailure = SimulationFailure.decode(reader, reader.uint32());
          break;
        case 4:
          message.internalError = InternalError.decode(reader, reader.uint32());
          break;
        case 5:
          message.droppedBundle = DroppedBundle.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Rejected {
    return {
      stateAuctionBidRejected: isSet(object.stateAuctionBidRejected)
        ? StateAuctionBidRejected.fromJSON(object.stateAuctionBidRejected)
        : undefined,
      winningBatchBidRejected: isSet(object.winningBatchBidRejected)
        ? WinningBatchBidRejected.fromJSON(object.winningBatchBidRejected)
        : undefined,
      simulationFailure: isSet(object.simulationFailure)
        ? SimulationFailure.fromJSON(object.simulationFailure)
        : undefined,
      internalError: isSet(object.internalError) ? InternalError.fromJSON(object.internalError) : undefined,
      droppedBundle: isSet(object.droppedBundle) ? DroppedBundle.fromJSON(object.droppedBundle) : undefined,
    };
  },

  toJSON(message: Rejected): unknown {
    const obj: any = {};
    message.stateAuctionBidRejected !== undefined && (obj.stateAuctionBidRejected = message.stateAuctionBidRejected
      ? StateAuctionBidRejected.toJSON(message.stateAuctionBidRejected)
      : undefined);
    message.winningBatchBidRejected !== undefined && (obj.winningBatchBidRejected = message.winningBatchBidRejected
      ? WinningBatchBidRejected.toJSON(message.winningBatchBidRejected)
      : undefined);
    message.simulationFailure !== undefined && (obj.simulationFailure = message.simulationFailure
      ? SimulationFailure.toJSON(message.simulationFailure)
      : undefined);
    message.internalError !== undefined &&
      (obj.internalError = message.internalError ? InternalError.toJSON(message.internalError) : undefined);
    message.droppedBundle !== undefined &&
      (obj.droppedBundle = message.droppedBundle ? DroppedBundle.toJSON(message.droppedBundle) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Rejected>, I>>(base?: I): Rejected {
    return Rejected.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Rejected>, I>>(object: I): Rejected {
    const message = createBaseRejected();
    message.stateAuctionBidRejected =
      (object.stateAuctionBidRejected !== undefined && object.stateAuctionBidRejected !== null)
        ? StateAuctionBidRejected.fromPartial(object.stateAuctionBidRejected)
        : undefined;
    message.winningBatchBidRejected =
      (object.winningBatchBidRejected !== undefined && object.winningBatchBidRejected !== null)
        ? WinningBatchBidRejected.fromPartial(object.winningBatchBidRejected)
        : undefined;
    message.simulationFailure = (object.simulationFailure !== undefined && object.simulationFailure !== null)
      ? SimulationFailure.fromPartial(object.simulationFailure)
      : undefined;
    message.internalError = (object.internalError !== undefined && object.internalError !== null)
      ? InternalError.fromPartial(object.internalError)
      : undefined;
    message.droppedBundle = (object.droppedBundle !== undefined && object.droppedBundle !== null)
      ? DroppedBundle.fromPartial(object.droppedBundle)
      : undefined;
    return message;
  },
};

function createBaseWinningBatchBidRejected(): WinningBatchBidRejected {
  return { auctionId: "", simulatedBidLamports: 0, msg: undefined };
}

export const WinningBatchBidRejected = {
  encode(message: WinningBatchBidRejected, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.auctionId !== "") {
      writer.uint32(10).string(message.auctionId);
    }
    if (message.simulatedBidLamports !== 0) {
      writer.uint32(16).uint64(message.simulatedBidLamports);
    }
    if (message.msg !== undefined) {
      writer.uint32(26).string(message.msg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WinningBatchBidRejected {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWinningBatchBidRejected();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.auctionId = reader.string();
          break;
        case 2:
          message.simulatedBidLamports = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.msg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WinningBatchBidRejected {
    return {
      auctionId: isSet(object.auctionId) ? String(object.auctionId) : "",
      simulatedBidLamports: isSet(object.simulatedBidLamports) ? Number(object.simulatedBidLamports) : 0,
      msg: isSet(object.msg) ? String(object.msg) : undefined,
    };
  },

  toJSON(message: WinningBatchBidRejected): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.simulatedBidLamports !== undefined && (obj.simulatedBidLamports = Math.round(message.simulatedBidLamports));
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },

  create<I extends Exact<DeepPartial<WinningBatchBidRejected>, I>>(base?: I): WinningBatchBidRejected {
    return WinningBatchBidRejected.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<WinningBatchBidRejected>, I>>(object: I): WinningBatchBidRejected {
    const message = createBaseWinningBatchBidRejected();
    message.auctionId = object.auctionId ?? "";
    message.simulatedBidLamports = object.simulatedBidLamports ?? 0;
    message.msg = object.msg ?? undefined;
    return message;
  },
};

function createBaseStateAuctionBidRejected(): StateAuctionBidRejected {
  return { auctionId: "", simulatedBidLamports: 0, msg: undefined };
}

export const StateAuctionBidRejected = {
  encode(message: StateAuctionBidRejected, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.auctionId !== "") {
      writer.uint32(10).string(message.auctionId);
    }
    if (message.simulatedBidLamports !== 0) {
      writer.uint32(16).uint64(message.simulatedBidLamports);
    }
    if (message.msg !== undefined) {
      writer.uint32(26).string(message.msg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StateAuctionBidRejected {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStateAuctionBidRejected();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.auctionId = reader.string();
          break;
        case 2:
          message.simulatedBidLamports = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.msg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StateAuctionBidRejected {
    return {
      auctionId: isSet(object.auctionId) ? String(object.auctionId) : "",
      simulatedBidLamports: isSet(object.simulatedBidLamports) ? Number(object.simulatedBidLamports) : 0,
      msg: isSet(object.msg) ? String(object.msg) : undefined,
    };
  },

  toJSON(message: StateAuctionBidRejected): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.simulatedBidLamports !== undefined && (obj.simulatedBidLamports = Math.round(message.simulatedBidLamports));
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },

  create<I extends Exact<DeepPartial<StateAuctionBidRejected>, I>>(base?: I): StateAuctionBidRejected {
    return StateAuctionBidRejected.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StateAuctionBidRejected>, I>>(object: I): StateAuctionBidRejected {
    const message = createBaseStateAuctionBidRejected();
    message.auctionId = object.auctionId ?? "";
    message.simulatedBidLamports = object.simulatedBidLamports ?? 0;
    message.msg = object.msg ?? undefined;
    return message;
  },
};

function createBaseSimulationFailure(): SimulationFailure {
  return { txSignature: "", msg: undefined };
}

export const SimulationFailure = {
  encode(message: SimulationFailure, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.txSignature !== "") {
      writer.uint32(10).string(message.txSignature);
    }
    if (message.msg !== undefined) {
      writer.uint32(18).string(message.msg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SimulationFailure {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSimulationFailure();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txSignature = reader.string();
          break;
        case 2:
          message.msg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SimulationFailure {
    return {
      txSignature: isSet(object.txSignature) ? String(object.txSignature) : "",
      msg: isSet(object.msg) ? String(object.msg) : undefined,
    };
  },

  toJSON(message: SimulationFailure): unknown {
    const obj: any = {};
    message.txSignature !== undefined && (obj.txSignature = message.txSignature);
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },

  create<I extends Exact<DeepPartial<SimulationFailure>, I>>(base?: I): SimulationFailure {
    return SimulationFailure.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SimulationFailure>, I>>(object: I): SimulationFailure {
    const message = createBaseSimulationFailure();
    message.txSignature = object.txSignature ?? "";
    message.msg = object.msg ?? undefined;
    return message;
  },
};

function createBaseInternalError(): InternalError {
  return { msg: "" };
}

export const InternalError = {
  encode(message: InternalError, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.msg !== "") {
      writer.uint32(10).string(message.msg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InternalError {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInternalError();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InternalError {
    return { msg: isSet(object.msg) ? String(object.msg) : "" };
  },

  toJSON(message: InternalError): unknown {
    const obj: any = {};
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },

  create<I extends Exact<DeepPartial<InternalError>, I>>(base?: I): InternalError {
    return InternalError.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<InternalError>, I>>(object: I): InternalError {
    const message = createBaseInternalError();
    message.msg = object.msg ?? "";
    return message;
  },
};

function createBaseDroppedBundle(): DroppedBundle {
  return { msg: "" };
}

export const DroppedBundle = {
  encode(message: DroppedBundle, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.msg !== "") {
      writer.uint32(10).string(message.msg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DroppedBundle {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDroppedBundle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DroppedBundle {
    return { msg: isSet(object.msg) ? String(object.msg) : "" };
  },

  toJSON(message: DroppedBundle): unknown {
    const obj: any = {};
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },

  create<I extends Exact<DeepPartial<DroppedBundle>, I>>(base?: I): DroppedBundle {
    return DroppedBundle.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DroppedBundle>, I>>(object: I): DroppedBundle {
    const message = createBaseDroppedBundle();
    message.msg = object.msg ?? "";
    return message;
  },
};

function createBaseFinalized(): Finalized {
  return {};
}

export const Finalized = {
  encode(_: Finalized, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Finalized {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFinalized();
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

  fromJSON(_: any): Finalized {
    return {};
  },

  toJSON(_: Finalized): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Finalized>, I>>(base?: I): Finalized {
    return Finalized.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Finalized>, I>>(_: I): Finalized {
    const message = createBaseFinalized();
    return message;
  },
};

function createBaseProcessed(): Processed {
  return { validatorIdentity: "", slot: 0, bundleIndex: 0 };
}

export const Processed = {
  encode(message: Processed, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorIdentity !== "") {
      writer.uint32(10).string(message.validatorIdentity);
    }
    if (message.slot !== 0) {
      writer.uint32(16).uint64(message.slot);
    }
    if (message.bundleIndex !== 0) {
      writer.uint32(24).uint64(message.bundleIndex);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Processed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorIdentity = reader.string();
          break;
        case 2:
          message.slot = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.bundleIndex = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Processed {
    return {
      validatorIdentity: isSet(object.validatorIdentity) ? String(object.validatorIdentity) : "",
      slot: isSet(object.slot) ? Number(object.slot) : 0,
      bundleIndex: isSet(object.bundleIndex) ? Number(object.bundleIndex) : 0,
    };
  },

  toJSON(message: Processed): unknown {
    const obj: any = {};
    message.validatorIdentity !== undefined && (obj.validatorIdentity = message.validatorIdentity);
    message.slot !== undefined && (obj.slot = Math.round(message.slot));
    message.bundleIndex !== undefined && (obj.bundleIndex = Math.round(message.bundleIndex));
    return obj;
  },

  create<I extends Exact<DeepPartial<Processed>, I>>(base?: I): Processed {
    return Processed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Processed>, I>>(object: I): Processed {
    const message = createBaseProcessed();
    message.validatorIdentity = object.validatorIdentity ?? "";
    message.slot = object.slot ?? 0;
    message.bundleIndex = object.bundleIndex ?? 0;
    return message;
  },
};

function createBaseDropped(): Dropped {
  return { reason: 0 };
}

export const Dropped = {
  encode(message: Dropped, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reason !== 0) {
      writer.uint32(8).int32(message.reason);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Dropped {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDropped();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reason = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Dropped {
    return { reason: isSet(object.reason) ? droppedReasonFromJSON(object.reason) : 0 };
  },

  toJSON(message: Dropped): unknown {
    const obj: any = {};
    message.reason !== undefined && (obj.reason = droppedReasonToJSON(message.reason));
    return obj;
  },

  create<I extends Exact<DeepPartial<Dropped>, I>>(base?: I): Dropped {
    return Dropped.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Dropped>, I>>(object: I): Dropped {
    const message = createBaseDropped();
    message.reason = object.reason ?? 0;
    return message;
  },
};

function createBaseBundleResult(): BundleResult {
  return {
    bundleId: "",
    accepted: undefined,
    rejected: undefined,
    finalized: undefined,
    processed: undefined,
    dropped: undefined,
  };
}

export const BundleResult = {
  encode(message: BundleResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bundleId !== "") {
      writer.uint32(10).string(message.bundleId);
    }
    if (message.accepted !== undefined) {
      Accepted.encode(message.accepted, writer.uint32(18).fork()).ldelim();
    }
    if (message.rejected !== undefined) {
      Rejected.encode(message.rejected, writer.uint32(26).fork()).ldelim();
    }
    if (message.finalized !== undefined) {
      Finalized.encode(message.finalized, writer.uint32(34).fork()).ldelim();
    }
    if (message.processed !== undefined) {
      Processed.encode(message.processed, writer.uint32(42).fork()).ldelim();
    }
    if (message.dropped !== undefined) {
      Dropped.encode(message.dropped, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BundleResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBundleResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bundleId = reader.string();
          break;
        case 2:
          message.accepted = Accepted.decode(reader, reader.uint32());
          break;
        case 3:
          message.rejected = Rejected.decode(reader, reader.uint32());
          break;
        case 4:
          message.finalized = Finalized.decode(reader, reader.uint32());
          break;
        case 5:
          message.processed = Processed.decode(reader, reader.uint32());
          break;
        case 6:
          message.dropped = Dropped.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BundleResult {
    return {
      bundleId: isSet(object.bundleId) ? String(object.bundleId) : "",
      accepted: isSet(object.accepted) ? Accepted.fromJSON(object.accepted) : undefined,
      rejected: isSet(object.rejected) ? Rejected.fromJSON(object.rejected) : undefined,
      finalized: isSet(object.finalized) ? Finalized.fromJSON(object.finalized) : undefined,
      processed: isSet(object.processed) ? Processed.fromJSON(object.processed) : undefined,
      dropped: isSet(object.dropped) ? Dropped.fromJSON(object.dropped) : undefined,
    };
  },

  toJSON(message: BundleResult): unknown {
    const obj: any = {};
    message.bundleId !== undefined && (obj.bundleId = message.bundleId);
    message.accepted !== undefined && (obj.accepted = message.accepted ? Accepted.toJSON(message.accepted) : undefined);
    message.rejected !== undefined && (obj.rejected = message.rejected ? Rejected.toJSON(message.rejected) : undefined);
    message.finalized !== undefined &&
      (obj.finalized = message.finalized ? Finalized.toJSON(message.finalized) : undefined);
    message.processed !== undefined &&
      (obj.processed = message.processed ? Processed.toJSON(message.processed) : undefined);
    message.dropped !== undefined && (obj.dropped = message.dropped ? Dropped.toJSON(message.dropped) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<BundleResult>, I>>(base?: I): BundleResult {
    return BundleResult.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BundleResult>, I>>(object: I): BundleResult {
    const message = createBaseBundleResult();
    message.bundleId = object.bundleId ?? "";
    message.accepted = (object.accepted !== undefined && object.accepted !== null)
      ? Accepted.fromPartial(object.accepted)
      : undefined;
    message.rejected = (object.rejected !== undefined && object.rejected !== null)
      ? Rejected.fromPartial(object.rejected)
      : undefined;
    message.finalized = (object.finalized !== undefined && object.finalized !== null)
      ? Finalized.fromPartial(object.finalized)
      : undefined;
    message.processed = (object.processed !== undefined && object.processed !== null)
      ? Processed.fromPartial(object.processed)
      : undefined;
    message.dropped = (object.dropped !== undefined && object.dropped !== null)
      ? Dropped.fromPartial(object.dropped)
      : undefined;
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
