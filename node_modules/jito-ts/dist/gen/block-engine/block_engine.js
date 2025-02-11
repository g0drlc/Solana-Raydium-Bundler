"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockEngineRelayerClient = exports.BlockEngineRelayerService = exports.BlockEngineValidatorClient = exports.BlockEngineValidatorService = exports.StartExpiringPacketStreamResponse = exports.PacketBatchUpdate = exports.ExpiringPacketBatch = exports.ProgramsOfInterestUpdate = exports.ProgramsOfInterestRequest = exports.AccountsOfInterestUpdate = exports.AccountsOfInterestRequest = exports.AccountsOfInterest = exports.BlockBuilderFeeInfoResponse = exports.BlockBuilderFeeInfoRequest = exports.SubscribeBundlesResponse = exports.SubscribeBundlesRequest = exports.SubscribePacketsResponse = exports.SubscribePacketsRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const grpc_js_1 = require("@grpc/grpc-js");
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const bundle_1 = require("./bundle");
const packet_1 = require("./packet");
const shared_1 = require("./shared");
exports.protobufPackage = "block_engine";
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
    return { header: undefined, batch: undefined };
}
exports.SubscribePacketsResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.header !== undefined) {
            shared_1.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        if (message.batch !== undefined) {
            packet_1.PacketBatch.encode(message.batch, writer.uint32(18).fork()).ldelim();
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
            batch: isSet(object.batch) ? packet_1.PacketBatch.fromJSON(object.batch) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.header !== undefined && (obj.header = message.header ? shared_1.Header.toJSON(message.header) : undefined);
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
        message.batch = (object.batch !== undefined && object.batch !== null)
            ? packet_1.PacketBatch.fromPartial(object.batch)
            : undefined;
        return message;
    },
};
function createBaseSubscribeBundlesRequest() {
    return {};
}
exports.SubscribeBundlesRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.SubscribeBundlesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseSubscribeBundlesRequest();
        return message;
    },
};
function createBaseSubscribeBundlesResponse() {
    return { bundles: [] };
}
exports.SubscribeBundlesResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.bundles) {
            bundle_1.BundleUuid.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubscribeBundlesResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.bundles.push(bundle_1.BundleUuid.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { bundles: Array.isArray(object === null || object === void 0 ? void 0 : object.bundles) ? object.bundles.map((e) => bundle_1.BundleUuid.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.bundles) {
            obj.bundles = message.bundles.map((e) => e ? bundle_1.BundleUuid.toJSON(e) : undefined);
        }
        else {
            obj.bundles = [];
        }
        return obj;
    },
    create(base) {
        return exports.SubscribeBundlesResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSubscribeBundlesResponse();
        message.bundles = ((_a = object.bundles) === null || _a === void 0 ? void 0 : _a.map((e) => bundle_1.BundleUuid.fromPartial(e))) || [];
        return message;
    },
};
function createBaseBlockBuilderFeeInfoRequest() {
    return {};
}
exports.BlockBuilderFeeInfoRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.BlockBuilderFeeInfoRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseBlockBuilderFeeInfoRequest();
        return message;
    },
};
function createBaseBlockBuilderFeeInfoResponse() {
    return { pubkey: "", commission: 0 };
}
exports.BlockBuilderFeeInfoResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pubkey !== "") {
            writer.uint32(10).string(message.pubkey);
        }
        if (message.commission !== 0) {
            writer.uint32(16).uint64(message.commission);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockBuilderFeeInfoResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pubkey = reader.string();
                    break;
                case 2:
                    message.commission = longToNumber(reader.uint64());
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
            pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
            commission: isSet(object.commission) ? Number(object.commission) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.pubkey !== undefined && (obj.pubkey = message.pubkey);
        message.commission !== undefined && (obj.commission = Math.round(message.commission));
        return obj;
    },
    create(base) {
        return exports.BlockBuilderFeeInfoResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseBlockBuilderFeeInfoResponse();
        message.pubkey = (_a = object.pubkey) !== null && _a !== void 0 ? _a : "";
        message.commission = (_b = object.commission) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseAccountsOfInterest() {
    return { accounts: [] };
}
exports.AccountsOfInterest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.accounts) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return { accounts: Array.isArray(object === null || object === void 0 ? void 0 : object.accounts) ? object.accounts.map((e) => String(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.accounts) {
            obj.accounts = message.accounts.map((e) => e);
        }
        else {
            obj.accounts = [];
        }
        return obj;
    },
    create(base) {
        return exports.AccountsOfInterest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseAccountsOfInterest();
        message.accounts = ((_a = object.accounts) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseAccountsOfInterestRequest() {
    return {};
}
exports.AccountsOfInterestRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.AccountsOfInterestRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseAccountsOfInterestRequest();
        return message;
    },
};
function createBaseAccountsOfInterestUpdate() {
    return { accounts: [] };
}
exports.AccountsOfInterestUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.accounts) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return { accounts: Array.isArray(object === null || object === void 0 ? void 0 : object.accounts) ? object.accounts.map((e) => String(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.accounts) {
            obj.accounts = message.accounts.map((e) => e);
        }
        else {
            obj.accounts = [];
        }
        return obj;
    },
    create(base) {
        return exports.AccountsOfInterestUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseAccountsOfInterestUpdate();
        message.accounts = ((_a = object.accounts) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseProgramsOfInterestRequest() {
    return {};
}
exports.ProgramsOfInterestRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.ProgramsOfInterestRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseProgramsOfInterestRequest();
        return message;
    },
};
function createBaseProgramsOfInterestUpdate() {
    return { programs: [] };
}
exports.ProgramsOfInterestUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.programs) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
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
    fromJSON(object) {
        return { programs: Array.isArray(object === null || object === void 0 ? void 0 : object.programs) ? object.programs.map((e) => String(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.programs) {
            obj.programs = message.programs.map((e) => e);
        }
        else {
            obj.programs = [];
        }
        return obj;
    },
    create(base) {
        return exports.ProgramsOfInterestUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseProgramsOfInterestUpdate();
        message.programs = ((_a = object.programs) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseExpiringPacketBatch() {
    return { header: undefined, batch: undefined, expiryMs: 0 };
}
exports.ExpiringPacketBatch = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.header !== undefined) {
            shared_1.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        if (message.batch !== undefined) {
            packet_1.PacketBatch.encode(message.batch, writer.uint32(18).fork()).ldelim();
        }
        if (message.expiryMs !== 0) {
            writer.uint32(24).uint32(message.expiryMs);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExpiringPacketBatch();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.header = shared_1.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.batch = packet_1.PacketBatch.decode(reader, reader.uint32());
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
    fromJSON(object) {
        return {
            header: isSet(object.header) ? shared_1.Header.fromJSON(object.header) : undefined,
            batch: isSet(object.batch) ? packet_1.PacketBatch.fromJSON(object.batch) : undefined,
            expiryMs: isSet(object.expiryMs) ? Number(object.expiryMs) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.header !== undefined && (obj.header = message.header ? shared_1.Header.toJSON(message.header) : undefined);
        message.batch !== undefined && (obj.batch = message.batch ? packet_1.PacketBatch.toJSON(message.batch) : undefined);
        message.expiryMs !== undefined && (obj.expiryMs = Math.round(message.expiryMs));
        return obj;
    },
    create(base) {
        return exports.ExpiringPacketBatch.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseExpiringPacketBatch();
        message.header = (object.header !== undefined && object.header !== null)
            ? shared_1.Header.fromPartial(object.header)
            : undefined;
        message.batch = (object.batch !== undefined && object.batch !== null)
            ? packet_1.PacketBatch.fromPartial(object.batch)
            : undefined;
        message.expiryMs = (_a = object.expiryMs) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBasePacketBatchUpdate() {
    return { batches: undefined, heartbeat: undefined };
}
exports.PacketBatchUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.batches !== undefined) {
            exports.ExpiringPacketBatch.encode(message.batches, writer.uint32(10).fork()).ldelim();
        }
        if (message.heartbeat !== undefined) {
            shared_1.Heartbeat.encode(message.heartbeat, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePacketBatchUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.batches = exports.ExpiringPacketBatch.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.heartbeat = shared_1.Heartbeat.decode(reader, reader.uint32());
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
            batches: isSet(object.batches) ? exports.ExpiringPacketBatch.fromJSON(object.batches) : undefined,
            heartbeat: isSet(object.heartbeat) ? shared_1.Heartbeat.fromJSON(object.heartbeat) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.batches !== undefined &&
            (obj.batches = message.batches ? exports.ExpiringPacketBatch.toJSON(message.batches) : undefined);
        message.heartbeat !== undefined &&
            (obj.heartbeat = message.heartbeat ? shared_1.Heartbeat.toJSON(message.heartbeat) : undefined);
        return obj;
    },
    create(base) {
        return exports.PacketBatchUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBasePacketBatchUpdate();
        message.batches = (object.batches !== undefined && object.batches !== null)
            ? exports.ExpiringPacketBatch.fromPartial(object.batches)
            : undefined;
        message.heartbeat = (object.heartbeat !== undefined && object.heartbeat !== null)
            ? shared_1.Heartbeat.fromPartial(object.heartbeat)
            : undefined;
        return message;
    },
};
function createBaseStartExpiringPacketStreamResponse() {
    return { heartbeat: undefined };
}
exports.StartExpiringPacketStreamResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.heartbeat !== undefined) {
            shared_1.Heartbeat.encode(message.heartbeat, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStartExpiringPacketStreamResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.heartbeat = shared_1.Heartbeat.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { heartbeat: isSet(object.heartbeat) ? shared_1.Heartbeat.fromJSON(object.heartbeat) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.heartbeat !== undefined &&
            (obj.heartbeat = message.heartbeat ? shared_1.Heartbeat.toJSON(message.heartbeat) : undefined);
        return obj;
    },
    create(base) {
        return exports.StartExpiringPacketStreamResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseStartExpiringPacketStreamResponse();
        message.heartbeat = (object.heartbeat !== undefined && object.heartbeat !== null)
            ? shared_1.Heartbeat.fromPartial(object.heartbeat)
            : undefined;
        return message;
    },
};
exports.BlockEngineValidatorService = {
    /** / Validators can subscribe to the block engine to receive a stream of packets */
    subscribePackets: {
        path: "/block_engine.BlockEngineValidator/SubscribePackets",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribePacketsRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribePacketsRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.SubscribePacketsResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.SubscribePacketsResponse.decode(value),
    },
    /** / Validators can subscribe to the block engine to receive a stream of simulated and profitable bundles */
    subscribeBundles: {
        path: "/block_engine.BlockEngineValidator/SubscribeBundles",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribeBundlesRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribeBundlesRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.SubscribeBundlesResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.SubscribeBundlesResponse.decode(value),
    },
    /**
     * Block builders can optionally collect fees. This returns fee information if a block builder wants to
     * collect one.
     */
    getBlockBuilderFeeInfo: {
        path: "/block_engine.BlockEngineValidator/GetBlockBuilderFeeInfo",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.BlockBuilderFeeInfoRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.BlockBuilderFeeInfoRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.BlockBuilderFeeInfoResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.BlockBuilderFeeInfoResponse.decode(value),
    },
};
exports.BlockEngineValidatorClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.BlockEngineValidatorService, "block_engine.BlockEngineValidator");
exports.BlockEngineRelayerService = {
    /**
     * / The block engine feeds accounts of interest (AOI) updates to the relayer periodically.
     * / For all transactions the relayer receives, it forwards transactions to the block engine which write-lock
     * / any of the accounts in the AOI.
     */
    subscribeAccountsOfInterest: {
        path: "/block_engine.BlockEngineRelayer/SubscribeAccountsOfInterest",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.AccountsOfInterestRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.AccountsOfInterestRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.AccountsOfInterestUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.AccountsOfInterestUpdate.decode(value),
    },
    subscribeProgramsOfInterest: {
        path: "/block_engine.BlockEngineRelayer/SubscribeProgramsOfInterest",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.ProgramsOfInterestRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.ProgramsOfInterestRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.ProgramsOfInterestUpdate.encode(value).finish()),
        responseDeserialize: (value) => exports.ProgramsOfInterestUpdate.decode(value),
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
        requestSerialize: (value) => Buffer.from(exports.PacketBatchUpdate.encode(value).finish()),
        requestDeserialize: (value) => exports.PacketBatchUpdate.decode(value),
        responseSerialize: (value) => Buffer.from(exports.StartExpiringPacketStreamResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.StartExpiringPacketStreamResponse.decode(value),
    },
};
exports.BlockEngineRelayerClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.BlockEngineRelayerService, "block_engine.BlockEngineRelayer");
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
//# sourceMappingURL=block_engine.js.map