"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShredstreamClient = exports.ShredstreamService = exports.HeartbeatResponse = exports.Heartbeat = exports.protobufPackage = void 0;
/* eslint-disable */
const grpc_js_1 = require("@grpc/grpc-js");
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const shared_1 = require("./shared");
exports.protobufPackage = "shredstream";
function createBaseHeartbeat() {
    return { socket: undefined, regions: [] };
}
exports.Heartbeat = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.socket !== undefined) {
            shared_1.Socket.encode(message.socket, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.regions) {
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHeartbeat();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.socket = shared_1.Socket.decode(reader, reader.uint32());
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
    fromJSON(object) {
        return {
            socket: isSet(object.socket) ? shared_1.Socket.fromJSON(object.socket) : undefined,
            regions: Array.isArray(object === null || object === void 0 ? void 0 : object.regions) ? object.regions.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.socket !== undefined && (obj.socket = message.socket ? shared_1.Socket.toJSON(message.socket) : undefined);
        if (message.regions) {
            obj.regions = message.regions.map((e) => e);
        }
        else {
            obj.regions = [];
        }
        return obj;
    },
    create(base) {
        return exports.Heartbeat.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseHeartbeat();
        message.socket = (object.socket !== undefined && object.socket !== null)
            ? shared_1.Socket.fromPartial(object.socket)
            : undefined;
        message.regions = ((_a = object.regions) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseHeartbeatResponse() {
    return { ttlMs: 0 };
}
exports.HeartbeatResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ttlMs !== 0) {
            writer.uint32(8).uint32(message.ttlMs);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return { ttlMs: isSet(object.ttlMs) ? Number(object.ttlMs) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.ttlMs !== undefined && (obj.ttlMs = Math.round(message.ttlMs));
        return obj;
    },
    create(base) {
        return exports.HeartbeatResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseHeartbeatResponse();
        message.ttlMs = (_a = object.ttlMs) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
exports.ShredstreamService = {
    /** RPC endpoint to send heartbeats to keep shreds flowing */
    sendHeartbeat: {
        path: "/shredstream.Shredstream/SendHeartbeat",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.Heartbeat.encode(value).finish()),
        requestDeserialize: (value) => exports.Heartbeat.decode(value),
        responseSerialize: (value) => Buffer.from(exports.HeartbeatResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.HeartbeatResponse.decode(value),
    },
};
exports.ShredstreamClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.ShredstreamService, "shredstream.Shredstream");
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=shredstream.js.map