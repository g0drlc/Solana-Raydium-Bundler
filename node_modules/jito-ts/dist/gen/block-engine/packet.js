"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketFlags = exports.Meta = exports.Packet = exports.PacketBatch = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "packet";
function createBasePacketBatch() {
    return { packets: [] };
}
exports.PacketBatch = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.packets) {
            exports.Packet.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePacketBatch();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.packets.push(exports.Packet.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { packets: Array.isArray(object === null || object === void 0 ? void 0 : object.packets) ? object.packets.map((e) => exports.Packet.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.packets) {
            obj.packets = message.packets.map((e) => e ? exports.Packet.toJSON(e) : undefined);
        }
        else {
            obj.packets = [];
        }
        return obj;
    },
    create(base) {
        return exports.PacketBatch.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasePacketBatch();
        message.packets = ((_a = object.packets) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Packet.fromPartial(e))) || [];
        return message;
    },
};
function createBasePacket() {
    return { data: new Uint8Array(), meta: undefined };
}
exports.Packet = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        if (message.meta !== undefined) {
            exports.Meta.encode(message.meta, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePacket();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                case 2:
                    message.meta = exports.Meta.decode(reader, reader.uint32());
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
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
            meta: isSet(object.meta) ? exports.Meta.fromJSON(object.meta) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        message.meta !== undefined && (obj.meta = message.meta ? exports.Meta.toJSON(message.meta) : undefined);
        return obj;
    },
    create(base) {
        return exports.Packet.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasePacket();
        message.data = (_a = object.data) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.meta = (object.meta !== undefined && object.meta !== null) ? exports.Meta.fromPartial(object.meta) : undefined;
        return message;
    },
};
function createBaseMeta() {
    return { size: 0, addr: "", port: 0, flags: undefined, senderStake: 0 };
}
exports.Meta = {
    encode(message, writer = minimal_1.default.Writer.create()) {
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
            exports.PacketFlags.encode(message.flags, writer.uint32(34).fork()).ldelim();
        }
        if (message.senderStake !== 0) {
            writer.uint32(40).uint64(message.senderStake);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMeta();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.size = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.addr = reader.string();
                    break;
                case 3:
                    message.port = reader.uint32();
                    break;
                case 4:
                    message.flags = exports.PacketFlags.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.senderStake = longToNumber(reader.uint64());
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
            size: isSet(object.size) ? Number(object.size) : 0,
            addr: isSet(object.addr) ? String(object.addr) : "",
            port: isSet(object.port) ? Number(object.port) : 0,
            flags: isSet(object.flags) ? exports.PacketFlags.fromJSON(object.flags) : undefined,
            senderStake: isSet(object.senderStake) ? Number(object.senderStake) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.size !== undefined && (obj.size = Math.round(message.size));
        message.addr !== undefined && (obj.addr = message.addr);
        message.port !== undefined && (obj.port = Math.round(message.port));
        message.flags !== undefined && (obj.flags = message.flags ? exports.PacketFlags.toJSON(message.flags) : undefined);
        message.senderStake !== undefined && (obj.senderStake = Math.round(message.senderStake));
        return obj;
    },
    create(base) {
        return exports.Meta.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseMeta();
        message.size = (_a = object.size) !== null && _a !== void 0 ? _a : 0;
        message.addr = (_b = object.addr) !== null && _b !== void 0 ? _b : "";
        message.port = (_c = object.port) !== null && _c !== void 0 ? _c : 0;
        message.flags = (object.flags !== undefined && object.flags !== null)
            ? exports.PacketFlags.fromPartial(object.flags)
            : undefined;
        message.senderStake = (_d = object.senderStake) !== null && _d !== void 0 ? _d : 0;
        return message;
    },
};
function createBasePacketFlags() {
    return { discard: false, forwarded: false, repair: false, simpleVoteTx: false, tracerPacket: false };
}
exports.PacketFlags = {
    encode(message, writer = minimal_1.default.Writer.create()) {
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
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return {
            discard: isSet(object.discard) ? Boolean(object.discard) : false,
            forwarded: isSet(object.forwarded) ? Boolean(object.forwarded) : false,
            repair: isSet(object.repair) ? Boolean(object.repair) : false,
            simpleVoteTx: isSet(object.simpleVoteTx) ? Boolean(object.simpleVoteTx) : false,
            tracerPacket: isSet(object.tracerPacket) ? Boolean(object.tracerPacket) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        message.discard !== undefined && (obj.discard = message.discard);
        message.forwarded !== undefined && (obj.forwarded = message.forwarded);
        message.repair !== undefined && (obj.repair = message.repair);
        message.simpleVoteTx !== undefined && (obj.simpleVoteTx = message.simpleVoteTx);
        message.tracerPacket !== undefined && (obj.tracerPacket = message.tracerPacket);
        return obj;
    },
    create(base) {
        return exports.PacketFlags.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBasePacketFlags();
        message.discard = (_a = object.discard) !== null && _a !== void 0 ? _a : false;
        message.forwarded = (_b = object.forwarded) !== null && _b !== void 0 ? _b : false;
        message.repair = (_c = object.repair) !== null && _c !== void 0 ? _c : false;
        message.simpleVoteTx = (_d = object.simpleVoteTx) !== null && _d !== void 0 ? _d : false;
        message.tracerPacket = (_e = object.tracerPacket) !== null && _e !== void 0 ? _e : false;
        return message;
    },
};
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
//# sourceMappingURL=packet.js.map