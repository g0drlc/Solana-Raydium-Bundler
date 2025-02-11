"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayerClient = exports.RelayerService = exports.SubscribePacketsResponse = exports.SubscribePacketsRequest = exports.GetTpuConfigsResponse = exports.GetTpuConfigsRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const grpc_js_1 = require("@grpc/grpc-js");
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const packet_1 = require("./packet");
const shared_1 = require("./shared");
exports.protobufPackage = "relayer";
function createBaseGetTpuConfigsRequest() {
    return {};
}
exports.GetTpuConfigsRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.GetTpuConfigsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseGetTpuConfigsRequest();
        return message;
    },
};
function createBaseGetTpuConfigsResponse() {
    return { tpu: undefined, tpuForward: undefined };
}
exports.GetTpuConfigsResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.tpu !== undefined) {
            shared_1.Socket.encode(message.tpu, writer.uint32(10).fork()).ldelim();
        }
        if (message.tpuForward !== undefined) {
            shared_1.Socket.encode(message.tpuForward, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetTpuConfigsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.tpu = shared_1.Socket.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.tpuForward = shared_1.Socket.decode(reader, reader.uint32());
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
            tpu: isSet(object.tpu) ? shared_1.Socket.fromJSON(object.tpu) : undefined,
            tpuForward: isSet(object.tpuForward) ? shared_1.Socket.fromJSON(object.tpuForward) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.tpu !== undefined && (obj.tpu = message.tpu ? shared_1.Socket.toJSON(message.tpu) : undefined);
        message.tpuForward !== undefined &&
            (obj.tpuForward = message.tpuForward ? shared_1.Socket.toJSON(message.tpuForward) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetTpuConfigsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseGetTpuConfigsResponse();
        message.tpu = (object.tpu !== undefined && object.tpu !== null) ? shared_1.Socket.fromPartial(object.tpu) : undefined;
        message.tpuForward = (object.tpuForward !== undefined && object.tpuForward !== null)
            ? shared_1.Socket.fromPartial(object.tpuForward)
            : undefined;
        return message;
    },
};
function createBaseSubscribePacketsRequest() {
    return {};
}
exports.SubscribePacketsRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.SubscribePacketsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseSubscribePacketsRequest();
        return message;
    },
};
function createBaseSubscribePacketsResponse() {
    return { header: undefined, heartbeat: undefined, batch: undefined };
}
exports.SubscribePacketsResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.header !== undefined) {
            shared_1.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        if (message.heartbeat !== undefined) {
            shared_1.Heartbeat.encode(message.heartbeat, writer.uint32(18).fork()).ldelim();
        }
        if (message.batch !== undefined) {
            packet_1.PacketBatch.encode(message.batch, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubscribePacketsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.header = shared_1.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.heartbeat = shared_1.Heartbeat.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.batch = packet_1.PacketBatch.decode(reader, reader.uint32());
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
            header: isSet(object.header) ? shared_1.Header.fromJSON(object.header) : undefined,
            heartbeat: isSet(object.heartbeat) ? shared_1.Heartbeat.fromJSON(object.heartbeat) : undefined,
            batch: isSet(object.batch) ? packet_1.PacketBatch.fromJSON(object.batch) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.header !== undefined && (obj.header = message.header ? shared_1.Header.toJSON(message.header) : undefined);
        message.heartbeat !== undefined &&
            (obj.heartbeat = message.heartbeat ? shared_1.Heartbeat.toJSON(message.heartbeat) : undefined);
        message.batch !== undefined && (obj.batch = message.batch ? packet_1.PacketBatch.toJSON(message.batch) : undefined);
        return obj;
    },
    create(base) {
        return exports.SubscribePacketsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseSubscribePacketsResponse();
        message.header = (object.header !== undefined && object.header !== null)
            ? shared_1.Header.fromPartial(object.header)
            : undefined;
        message.heartbeat = (object.heartbeat !== undefined && object.heartbeat !== null)
            ? shared_1.Heartbeat.fromPartial(object.heartbeat)
            : undefined;
        message.batch = (object.batch !== undefined && object.batch !== null)
            ? packet_1.PacketBatch.fromPartial(object.batch)
            : undefined;
        return message;
    },
};
exports.RelayerService = {
    /**
     * The relayer has TPU and TPU forward sockets that validators can leverage.
     * A validator can fetch this config and change its TPU and TPU forward port in gossip.
     */
    getTpuConfigs: {
        path: "/relayer.Relayer/GetTpuConfigs",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.GetTpuConfigsRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.GetTpuConfigsRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.GetTpuConfigsResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.GetTpuConfigsResponse.decode(value),
    },
    /**
     * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
     * of packets and heartbeats
     */
    subscribePackets: {
        path: "/relayer.Relayer/SubscribePackets",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribePacketsRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribePacketsRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.SubscribePacketsResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.SubscribePacketsResponse.decode(value),
    },
};
exports.RelayerClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.RelayerService, "relayer.Relayer");
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=relayer.js.map