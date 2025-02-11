"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeyserClient = exports.GeyserService = exports.GetHeartbeatIntervalResponse = exports.SubscribePartialAccountUpdatesRequest = exports.SubscribeProgramsUpdatesRequest = exports.SubscribeAccountUpdatesRequest = exports.SubscribeSlotUpdateRequest = exports.TimestampedTransactionUpdate = exports.TransactionUpdate = exports.TimestampedBlockUpdate = exports.BlockUpdate = exports.EmptyRequest = exports.Heartbeat = exports.MaybePartialAccountUpdate = exports.SubscribeBlockUpdatesRequest = exports.SubscribeTransactionUpdatesRequest = exports.TimestampedAccountUpdate = exports.TimestampedSlotUpdate = exports.SlotUpdate = exports.AccountUpdate = exports.PartialAccountUpdate = exports.slotUpdateStatusToJSON = exports.slotUpdateStatusFromJSON = exports.SlotUpdateStatus = exports.protobufPackage = void 0;
/* eslint-disable */
const grpc_js_1 = require("@grpc/grpc-js");
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const confirmed_block_1 = require("./confirmed_block");
const timestamp_1 = require("./google/protobuf/timestamp");
exports.protobufPackage = "solana.geyser";
var SlotUpdateStatus;
(function (SlotUpdateStatus) {
    SlotUpdateStatus[SlotUpdateStatus["CONFIRMED"] = 0] = "CONFIRMED";
    SlotUpdateStatus[SlotUpdateStatus["PROCESSED"] = 1] = "PROCESSED";
    SlotUpdateStatus[SlotUpdateStatus["ROOTED"] = 2] = "ROOTED";
    SlotUpdateStatus[SlotUpdateStatus["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SlotUpdateStatus = exports.SlotUpdateStatus || (exports.SlotUpdateStatus = {}));
function slotUpdateStatusFromJSON(object) {
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
exports.slotUpdateStatusFromJSON = slotUpdateStatusFromJSON;
function slotUpdateStatusToJSON(object) {
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
exports.slotUpdateStatusToJSON = slotUpdateStatusToJSON;
function createBasePartialAccountUpdate() {
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
exports.PartialAccountUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
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
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePartialAccountUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.slot = longToNumber(reader.uint64());
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
                    message.seq = longToNumber(reader.uint64());
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
    fromJSON(object) {
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
    toJSON(message) {
        const obj = {};
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
    create(base) {
        return exports.PartialAccountUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBasePartialAccountUpdate();
        message.slot = (_a = object.slot) !== null && _a !== void 0 ? _a : 0;
        message.pubkey = (_b = object.pubkey) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.owner = (_c = object.owner) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.isStartup = (_d = object.isStartup) !== null && _d !== void 0 ? _d : false;
        message.seq = (_e = object.seq) !== null && _e !== void 0 ? _e : 0;
        message.txSignature = (_f = object.txSignature) !== null && _f !== void 0 ? _f : undefined;
        message.replicaVersion = (_g = object.replicaVersion) !== null && _g !== void 0 ? _g : 0;
        return message;
    },
};
function createBaseAccountUpdate() {
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
exports.AccountUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
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
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAccountUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.slot = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.pubkey = reader.bytes();
                    break;
                case 3:
                    message.lamports = longToNumber(reader.uint64());
                    break;
                case 4:
                    message.owner = reader.bytes();
                    break;
                case 5:
                    message.isExecutable = reader.bool();
                    break;
                case 6:
                    message.rentEpoch = longToNumber(reader.uint64());
                    break;
                case 7:
                    message.data = reader.bytes();
                    break;
                case 8:
                    message.seq = longToNumber(reader.uint64());
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
    fromJSON(object) {
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
    toJSON(message) {
        const obj = {};
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
    create(base) {
        return exports.AccountUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const message = createBaseAccountUpdate();
        message.slot = (_a = object.slot) !== null && _a !== void 0 ? _a : 0;
        message.pubkey = (_b = object.pubkey) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.lamports = (_c = object.lamports) !== null && _c !== void 0 ? _c : 0;
        message.owner = (_d = object.owner) !== null && _d !== void 0 ? _d : new Uint8Array();
        message.isExecutable = (_e = object.isExecutable) !== null && _e !== void 0 ? _e : false;
        message.rentEpoch = (_f = object.rentEpoch) !== null && _f !== void 0 ? _f : 0;
        message.data = (_g = object.data) !== null && _g !== void 0 ? _g : new Uint8Array();
        message.seq = (_h = object.seq) !== null && _h !== void 0 ? _h : 0;
        message.isStartup = (_j = object.isStartup) !== null && _j !== void 0 ? _j : false;
        message.txSignature = (_k = object.txSignature) !== null && _k !== void 0 ? _k : undefined;
        message.replicaVersion = (_l = object.replicaVersion) !== null && _l !== void 0 ? _l : 0;
        return message;
    },
};
function createBaseSlotUpdate() {
    return { slot: 0, parentSlot: undefined, status: 0 };
}
exports.SlotUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
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
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSlotUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.slot = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.parentSlot = longToNumber(reader.uint64());
                    break;
                case 3:
                    message.status = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            slot: isSet(object.slot) ? Number(object.slot) : 0,
            parentSlot: isSet(object.parentSlot) ? Number(object.parentSlot) : undefined,
            status: isSet(object.status) ? slotUpdateStatusFromJSON(object.status) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.slot !== undefined && (obj.slot = Math.round(message.slot));
        message.parentSlot !== undefined && (obj.parentSlot = Math.round(message.parentSlot));
        message.status !== undefined && (obj.status = slotUpdateStatusToJSON(message.status));
        return obj;
    },
    create(base) {
        return exports.SlotUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseSlotUpdate();
        message.slot = (_a = object.slot) !== null && _a !== void 0 ? _a : 0;
        message.parentSlot = (_b = object.parentSlot) !== null && _b !== void 0 ? _b : undefined;
        message.status = (_c = object.status) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
function createBaseTimestampedSlotUpdate() {
    return { ts: undefined, slotUpdate: undefined };
}
exports.TimestampedSlotUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ts !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
        }
        if (message.slotUpdate !== undefined) {
            exports.SlotUpdate.encode(message.slotUpdate, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTimestampedSlotUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ts = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.slotUpdate = exports.SlotUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
            slotUpdate: isSet(object.slotUpdate) ? exports.SlotUpdate.fromJSON(object.slotUpdate) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.ts !== undefined && (obj.ts = message.ts.toISOString());
        message.slotUpdate !== undefined &&
            (obj.slotUpdate = message.slotUpdate ? exports.SlotUpdate.toJSON(message.slotUpdate) : undefined);
        return obj;
    },
    create(base) {
        return exports.TimestampedSlotUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTimestampedSlotUpdate();
        message.ts = (_a = object.ts) !== null && _a !== void 0 ? _a : undefined;
        message.slotUpdate = (object.slotUpdate !== undefined && object.slotUpdate !== null)
            ? exports.SlotUpdate.fromPartial(object.slotUpdate)
            : undefined;
        return message;
    },
};
function createBaseTimestampedAccountUpdate() {
    return { ts: undefined, accountUpdate: undefined };
}
exports.TimestampedAccountUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ts !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
        }
        if (message.accountUpdate !== undefined) {
            exports.AccountUpdate.encode(message.accountUpdate, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTimestampedAccountUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ts = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.accountUpdate = exports.AccountUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
            accountUpdate: isSet(object.accountUpdate) ? exports.AccountUpdate.fromJSON(object.accountUpdate) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.ts !== undefined && (obj.ts = message.ts.toISOString());
        message.accountUpdate !== undefined &&
            (obj.accountUpdate = message.accountUpdate ? exports.AccountUpdate.toJSON(message.accountUpdate) : undefined);
        return obj;
    },
    create(base) {
        return exports.TimestampedAccountUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTimestampedAccountUpdate();
        message.ts = (_a = object.ts) !== null && _a !== void 0 ? _a : undefined;
        message.accountUpdate = (object.accountUpdate !== undefined && object.accountUpdate !== null)
            ? exports.AccountUpdate.fromPartial(object.accountUpdate)
            : undefined;
        return message;
    },
};
function createBaseSubscribeTransactionUpdatesRequest() {
    return {};
}
exports.SubscribeTransactionUpdatesRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.SubscribeTransactionUpdatesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseSubscribeTransactionUpdatesRequest();
        return message;
    },
};
function createBaseSubscribeBlockUpdatesRequest() {
    return {};
}
exports.SubscribeBlockUpdatesRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.SubscribeBlockUpdatesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseSubscribeBlockUpdatesRequest();
        return message;
    },
};
function createBaseMaybePartialAccountUpdate() {
    return { partialAccountUpdate: undefined, hb: undefined };
}
exports.MaybePartialAccountUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.partialAccountUpdate !== undefined) {
            exports.PartialAccountUpdate.encode(message.partialAccountUpdate, writer.uint32(10).fork()).ldelim();
        }
        if (message.hb !== undefined) {
            exports.Heartbeat.encode(message.hb, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMaybePartialAccountUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.partialAccountUpdate = exports.PartialAccountUpdate.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.hb = exports.Heartbeat.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            partialAccountUpdate: isSet(object.partialAccountUpdate)
                ? exports.PartialAccountUpdate.fromJSON(object.partialAccountUpdate)
                : undefined,
            hb: isSet(object.hb) ? exports.Heartbeat.fromJSON(object.hb) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.partialAccountUpdate !== undefined && (obj.partialAccountUpdate = message.partialAccountUpdate
            ? exports.PartialAccountUpdate.toJSON(message.partialAccountUpdate)
            : undefined);
        message.hb !== undefined && (obj.hb = message.hb ? exports.Heartbeat.toJSON(message.hb) : undefined);
        return obj;
    },
    create(base) {
        return exports.MaybePartialAccountUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseMaybePartialAccountUpdate();
        message.partialAccountUpdate = (object.partialAccountUpdate !== undefined && object.partialAccountUpdate !== null)
            ? exports.PartialAccountUpdate.fromPartial(object.partialAccountUpdate)
            : undefined;
        message.hb = (object.hb !== undefined && object.hb !== null) ? exports.Heartbeat.fromPartial(object.hb) : undefined;
        return message;
    },
};
function createBaseHeartbeat() {
    return {};
}
exports.Heartbeat = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.Heartbeat.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseHeartbeat();
        return message;
    },
};
function createBaseEmptyRequest() {
    return {};
}
exports.EmptyRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.EmptyRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseEmptyRequest();
        return message;
    },
};
function createBaseBlockUpdate() {
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
exports.BlockUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.slot !== 0) {
            writer.uint32(8).uint64(message.slot);
        }
        if (message.blockhash !== "") {
            writer.uint32(18).string(message.blockhash);
        }
        for (const v of message.rewards) {
            confirmed_block_1.Reward.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.blockTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.blockTime), writer.uint32(34).fork()).ldelim();
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
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.slot = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.blockhash = reader.string();
                    break;
                case 3:
                    message.rewards.push(confirmed_block_1.Reward.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.blockTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.blockHeight = longToNumber(reader.uint64());
                    break;
                case 6:
                    message.executedTransactionCount = longToNumber(reader.uint64());
                    break;
                case 7:
                    message.entryCount = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            slot: isSet(object.slot) ? Number(object.slot) : 0,
            blockhash: isSet(object.blockhash) ? String(object.blockhash) : "",
            rewards: Array.isArray(object === null || object === void 0 ? void 0 : object.rewards) ? object.rewards.map((e) => confirmed_block_1.Reward.fromJSON(e)) : [],
            blockTime: isSet(object.blockTime) ? fromJsonTimestamp(object.blockTime) : undefined,
            blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : undefined,
            executedTransactionCount: isSet(object.executedTransactionCount)
                ? Number(object.executedTransactionCount)
                : undefined,
            entryCount: isSet(object.entryCount) ? Number(object.entryCount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.slot !== undefined && (obj.slot = Math.round(message.slot));
        message.blockhash !== undefined && (obj.blockhash = message.blockhash);
        if (message.rewards) {
            obj.rewards = message.rewards.map((e) => e ? confirmed_block_1.Reward.toJSON(e) : undefined);
        }
        else {
            obj.rewards = [];
        }
        message.blockTime !== undefined && (obj.blockTime = message.blockTime.toISOString());
        message.blockHeight !== undefined && (obj.blockHeight = Math.round(message.blockHeight));
        message.executedTransactionCount !== undefined &&
            (obj.executedTransactionCount = Math.round(message.executedTransactionCount));
        message.entryCount !== undefined && (obj.entryCount = Math.round(message.entryCount));
        return obj;
    },
    create(base) {
        return exports.BlockUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseBlockUpdate();
        message.slot = (_a = object.slot) !== null && _a !== void 0 ? _a : 0;
        message.blockhash = (_b = object.blockhash) !== null && _b !== void 0 ? _b : "";
        message.rewards = ((_c = object.rewards) === null || _c === void 0 ? void 0 : _c.map((e) => confirmed_block_1.Reward.fromPartial(e))) || [];
        message.blockTime = (_d = object.blockTime) !== null && _d !== void 0 ? _d : undefined;
        message.blockHeight = (_e = object.blockHeight) !== null && _e !== void 0 ? _e : undefined;
        message.executedTransactionCount = (_f = object.executedTransactionCount) !== null && _f !== void 0 ? _f : undefined;
        message.entryCount = (_g = object.entryCount) !== null && _g !== void 0 ? _g : undefined;
        return message;
    },
};
function createBaseTimestampedBlockUpdate() {
    return { ts: undefined, blockUpdate: undefined };
}
exports.TimestampedBlockUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ts !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
        }
        if (message.blockUpdate !== undefined) {
            exports.BlockUpdate.encode(message.blockUpdate, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTimestampedBlockUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ts = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.blockUpdate = exports.BlockUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
            blockUpdate: isSet(object.blockUpdate) ? exports.BlockUpdate.fromJSON(object.blockUpdate) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.ts !== undefined && (obj.ts = message.ts.toISOString());
        message.blockUpdate !== undefined &&
            (obj.blockUpdate = message.blockUpdate ? exports.BlockUpdate.toJSON(message.blockUpdate) : undefined);
        return obj;
    },
    create(base) {
        return exports.TimestampedBlockUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTimestampedBlockUpdate();
        message.ts = (_a = object.ts) !== null && _a !== void 0 ? _a : undefined;
        message.blockUpdate = (object.blockUpdate !== undefined && object.blockUpdate !== null)
            ? exports.BlockUpdate.fromPartial(object.blockUpdate)
            : undefined;
        return message;
    },
};
function createBaseTransactionUpdate() {
    return { slot: 0, signature: "", isVote: false, txIdx: 0, tx: undefined };
}
exports.TransactionUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
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
            confirmed_block_1.ConfirmedTransaction.encode(message.tx, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.slot = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.signature = reader.string();
                    break;
                case 3:
                    message.isVote = reader.bool();
                    break;
                case 4:
                    message.txIdx = longToNumber(reader.uint64());
                    break;
                case 5:
                    message.tx = confirmed_block_1.ConfirmedTransaction.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            slot: isSet(object.slot) ? Number(object.slot) : 0,
            signature: isSet(object.signature) ? String(object.signature) : "",
            isVote: isSet(object.isVote) ? Boolean(object.isVote) : false,
            txIdx: isSet(object.txIdx) ? Number(object.txIdx) : 0,
            tx: isSet(object.tx) ? confirmed_block_1.ConfirmedTransaction.fromJSON(object.tx) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.slot !== undefined && (obj.slot = Math.round(message.slot));
        message.signature !== undefined && (obj.signature = message.signature);
        message.isVote !== undefined && (obj.isVote = message.isVote);
        message.txIdx !== undefined && (obj.txIdx = Math.round(message.txIdx));
        message.tx !== undefined && (obj.tx = message.tx ? confirmed_block_1.ConfirmedTransaction.toJSON(message.tx) : undefined);
        return obj;
    },
    create(base) {
        return exports.TransactionUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseTransactionUpdate();
        message.slot = (_a = object.slot) !== null && _a !== void 0 ? _a : 0;
        message.signature = (_b = object.signature) !== null && _b !== void 0 ? _b : "";
        message.isVote = (_c = object.isVote) !== null && _c !== void 0 ? _c : false;
        message.txIdx = (_d = object.txIdx) !== null && _d !== void 0 ? _d : 0;
        message.tx = (object.tx !== undefined && object.tx !== null)
            ? confirmed_block_1.ConfirmedTransaction.fromPartial(object.tx)
            : undefined;
        return message;
    },
};
function createBaseTimestampedTransactionUpdate() {
    return { ts: undefined, transaction: undefined };
}
exports.TimestampedTransactionUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ts !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
        }
        if (message.transaction !== undefined) {
            exports.TransactionUpdate.encode(message.transaction, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTimestampedTransactionUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ts = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.transaction = exports.TransactionUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined,
            transaction: isSet(object.transaction) ? exports.TransactionUpdate.fromJSON(object.transaction) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.ts !== undefined && (obj.ts = message.ts.toISOString());
        message.transaction !== undefined &&
            (obj.transaction = message.transaction ? exports.TransactionUpdate.toJSON(message.transaction) : undefined);
        return obj;
    },
    create(base) {
        return exports.TimestampedTransactionUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTimestampedTransactionUpdate();
        message.ts = (_a = object.ts) !== null && _a !== void 0 ? _a : undefined;
        message.transaction = (object.transaction !== undefined && object.transaction !== null)
            ? exports.TransactionUpdate.fromPartial(object.transaction)
            : undefined;
        return message;
    },
};
function createBaseSubscribeSlotUpdateRequest() {
    return {};
}
exports.SubscribeSlotUpdateRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.SubscribeSlotUpdateRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseSubscribeSlotUpdateRequest();
        return message;
    },
};
function createBaseSubscribeAccountUpdatesRequest() {
    return { accounts: [] };
}
exports.SubscribeAccountUpdatesRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.accounts) {
            writer.uint32(10).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return { accounts: Array.isArray(object === null || object === void 0 ? void 0 : object.accounts) ? object.accounts.map((e) => bytesFromBase64(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.accounts) {
            obj.accounts = message.accounts.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.accounts = [];
        }
        return obj;
    },
    create(base) {
        return exports.SubscribeAccountUpdatesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSubscribeAccountUpdatesRequest();
        message.accounts = ((_a = object.accounts) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseSubscribeProgramsUpdatesRequest() {
    return { programs: [] };
}
exports.SubscribeProgramsUpdatesRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.programs) {
            writer.uint32(10).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return { programs: Array.isArray(object === null || object === void 0 ? void 0 : object.programs) ? object.programs.map((e) => bytesFromBase64(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.programs) {
            obj.programs = message.programs.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.programs = [];
        }
        return obj;
    },
    create(base) {
        return exports.SubscribeProgramsUpdatesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSubscribeProgramsUpdatesRequest();
        message.programs = ((_a = object.programs) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseSubscribePartialAccountUpdatesRequest() {
    return { skipVoteAccounts: false };
}
exports.SubscribePartialAccountUpdatesRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.skipVoteAccounts === true) {
            writer.uint32(8).bool(message.skipVoteAccounts);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return { skipVoteAccounts: isSet(object.skipVoteAccounts) ? Boolean(object.skipVoteAccounts) : false };
    },
    toJSON(message) {
        const obj = {};
        message.skipVoteAccounts !== undefined && (obj.skipVoteAccounts = message.skipVoteAccounts);
        return obj;
    },
    create(base) {
        return exports.SubscribePartialAccountUpdatesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSubscribePartialAccountUpdatesRequest();
        message.skipVoteAccounts = (_a = object.skipVoteAccounts) !== null && _a !== void 0 ? _a : false;
        return message;
    },
};
function createBaseGetHeartbeatIntervalResponse() {
    return { heartbeatIntervalMs: 0 };
}
exports.GetHeartbeatIntervalResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.heartbeatIntervalMs !== 0) {
            writer.uint32(8).uint64(message.heartbeatIntervalMs);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetHeartbeatIntervalResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.heartbeatIntervalMs = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { heartbeatIntervalMs: isSet(object.heartbeatIntervalMs) ? Number(object.heartbeatIntervalMs) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.heartbeatIntervalMs !== undefined && (obj.heartbeatIntervalMs = Math.round(message.heartbeatIntervalMs));
        return obj;
    },
    create(base) {
        return exports.GetHeartbeatIntervalResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetHeartbeatIntervalResponse();
        message.heartbeatIntervalMs = (_a = object.heartbeatIntervalMs) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
exports.GeyserService = {
    /** Invoke to get the expected heartbeat interval. */
    getHeartbeatInterval: {
        path: "/solana.geyser.Geyser/GetHeartbeatInterval",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.EmptyRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.EmptyRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.GetHeartbeatIntervalResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.GetHeartbeatIntervalResponse.decode(value),
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
        requestSerialize: (value) => Buffer.from(exports.SubscribeAccountUpdatesRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribeAccountUpdatesRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.TimestampedAccountUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.TimestampedAccountUpdate.decode(value),
    },
    /**
     * Subscribes to updates given a list of program IDs. When an account update comes in that's owned by a provided
     * program id, one will receive an update
     */
    subscribeProgramUpdates: {
        path: "/solana.geyser.Geyser/SubscribeProgramUpdates",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribeProgramsUpdatesRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribeProgramsUpdatesRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.TimestampedAccountUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.TimestampedAccountUpdate.decode(value),
    },
    /**
     * Functions similarly to `SubscribeAccountUpdates`, but consumes less bandwidth.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    subscribePartialAccountUpdates: {
        path: "/solana.geyser.Geyser/SubscribePartialAccountUpdates",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribePartialAccountUpdatesRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribePartialAccountUpdatesRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.MaybePartialAccountUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.MaybePartialAccountUpdate.decode(value),
    },
    /**
     * Subscribes to slot updates.
     * Returns the highest slot seen thus far in the http headers named `highest-write-slot`.
     */
    subscribeSlotUpdates: {
        path: "/solana.geyser.Geyser/SubscribeSlotUpdates",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribeSlotUpdateRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribeSlotUpdateRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.TimestampedSlotUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.TimestampedSlotUpdate.decode(value),
    },
    /** Subscribes to transaction updates. */
    subscribeTransactionUpdates: {
        path: "/solana.geyser.Geyser/SubscribeTransactionUpdates",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribeTransactionUpdatesRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribeTransactionUpdatesRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.TimestampedTransactionUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.TimestampedTransactionUpdate.decode(value),
    },
    /** Subscribes to block updates. */
    subscribeBlockUpdates: {
        path: "/solana.geyser.Geyser/SubscribeBlockUpdates",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribeBlockUpdatesRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribeBlockUpdatesRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.TimestampedBlockUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.TimestampedBlockUpdate.decode(value),
    },
};
exports.GeyserClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.GeyserService, "solana.geyser.Geyser");
var tsProtoGlobalThis = (() => {
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
function bytesFromBase64(b64) {
    if (tsProtoGlobalThis.Buffer) {
        return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = tsProtoGlobalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (tsProtoGlobalThis.Buffer) {
        return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(String.fromCharCode(byte));
        });
        return tsProtoGlobalThis.btoa(bin.join(""));
    }
}
function toTimestamp(date) {
    const seconds = date.getTime() / 1000;
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = t.seconds * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=geyser.js.map