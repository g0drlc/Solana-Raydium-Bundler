'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.SearcherServiceClient =
  exports.SearcherServiceService =
  exports.SubscribeBundleResultsRequest =
  exports.GetTipAccountsResponse =
  exports.GetTipAccountsRequest =
  exports.ConnectedLeadersResponse_ConnectedValidatorsEntry =
  exports.ConnectedLeadersResponse =
  exports.ConnectedLeadersRequest =
  exports.NextScheduledLeaderResponse =
  exports.NextScheduledLeaderRequest =
  exports.PendingTxNotification =
  exports.PendingTxSubscriptionRequest =
  exports.SendBundleResponse =
  exports.SendBundleRequest =
  exports.SlotList =
  exports.protobufPackage =
    void 0;
/* eslint-disable */
const grpc_js_1 = require("@grpc/grpc-js");
const Long = require("long");
const _m0 = require("protobufjs/minimal");
const bundle_1 = require("./bundle");
const timestamp_1 = require("./google/protobuf/timestamp");
const packet_1 = require("./packet");
exports.protobufPackage = "searcher";
function createBaseSlotList() {
    return { slots: [] };
}
exports.SlotList = {
    encode(message, writer = _m0.Writer.create()) {
        writer.uint32(10).fork();
        for (const v of message.slots) {
            writer.uint64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSlotList();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.slots.push(longToNumber(reader.uint64()));
                        }
                    }
                    else {
                        message.slots.push(longToNumber(reader.uint64()));
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { slots: Array.isArray(object === null || object === void 0 ? void 0 : object.slots) ? object.slots.map((e) => Number(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.slots) {
            obj.slots = message.slots.map((e) => Math.round(e));
        }
        else {
            obj.slots = [];
        }
        return obj;
    },
    create(base) {
        return exports.SlotList.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSlotList();
        message.slots = ((_a = object.slots) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseSendBundleRequest() {
    return { bundle: undefined };
}
exports.SendBundleRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.bundle !== undefined) {
            bundle_1.Bundle.encode(message.bundle, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSendBundleRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.bundle = bundle_1.Bundle.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { bundle: isSet(object.bundle) ? bundle_1.Bundle.fromJSON(object.bundle) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.bundle !== undefined && (obj.bundle = message.bundle ? bundle_1.Bundle.toJSON(message.bundle) : undefined);
        return obj;
    },
    create(base) {
        return exports.SendBundleRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseSendBundleRequest();
        message.bundle = (object.bundle !== undefined && object.bundle !== null)
            ? bundle_1.Bundle.fromPartial(object.bundle)
            : undefined;
        return message;
    },
};
function createBaseSendBundleResponse() {
    return { uuid: "" };
}
exports.SendBundleResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.uuid !== "") {
            writer.uint32(10).string(message.uuid);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSendBundleResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.uuid = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { uuid: isSet(object.uuid) ? String(object.uuid) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.uuid !== undefined && (obj.uuid = message.uuid);
        return obj;
    },
    create(base) {
        return exports.SendBundleResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSendBundleResponse();
        message.uuid = (_a = object.uuid) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBasePendingTxSubscriptionRequest() {
    return { accounts: [] };
}
exports.PendingTxSubscriptionRequest = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.accounts) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePendingTxSubscriptionRequest();
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
        return exports.PendingTxSubscriptionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasePendingTxSubscriptionRequest();
        message.accounts = ((_a = object.accounts) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBasePendingTxNotification() {
    return { serverSideTs: undefined, expirationTime: undefined, transactions: [] };
}
exports.PendingTxNotification = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.serverSideTs !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.serverSideTs), writer.uint32(10).fork()).ldelim();
        }
        if (message.expirationTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.expirationTime), writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.transactions) {
            packet_1.Packet.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePendingTxNotification();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.serverSideTs = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.expirationTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.transactions.push(packet_1.Packet.decode(reader, reader.uint32()));
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
            serverSideTs: isSet(object.serverSideTs) ? fromJsonTimestamp(object.serverSideTs) : undefined,
            expirationTime: isSet(object.expirationTime) ? fromJsonTimestamp(object.expirationTime) : undefined,
            transactions: Array.isArray(object === null || object === void 0 ? void 0 : object.transactions) ? object.transactions.map((e) => packet_1.Packet.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.serverSideTs !== undefined && (obj.serverSideTs = message.serverSideTs.toISOString());
        message.expirationTime !== undefined && (obj.expirationTime = message.expirationTime.toISOString());
        if (message.transactions) {
            obj.transactions = message.transactions.map((e) => e ? packet_1.Packet.toJSON(e) : undefined);
        }
        else {
            obj.transactions = [];
        }
        return obj;
    },
    create(base) {
        return exports.PendingTxNotification.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasePendingTxNotification();
        message.serverSideTs = (_a = object.serverSideTs) !== null && _a !== void 0 ? _a : undefined;
        message.expirationTime = (_b = object.expirationTime) !== null && _b !== void 0 ? _b : undefined;
        message.transactions = ((_c = object.transactions) === null || _c === void 0 ? void 0 : _c.map((e) => packet_1.Packet.fromPartial(e))) || [];
        return message;
    },
};
function createBaseNextScheduledLeaderRequest() {
    return {};
}
exports.NextScheduledLeaderRequest = {
    encode(_, writer = _m0.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseNextScheduledLeaderRequest();
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
        return exports.NextScheduledLeaderRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseNextScheduledLeaderRequest();
        return message;
    },
};
function createBaseNextScheduledLeaderResponse() {
    return { currentSlot: 0, nextLeaderSlot: 0, nextLeaderIdentity: "" };
}
exports.NextScheduledLeaderResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.currentSlot !== 0) {
            writer.uint32(8).uint64(message.currentSlot);
        }
        if (message.nextLeaderSlot !== 0) {
            writer.uint32(16).uint64(message.nextLeaderSlot);
        }
        if (message.nextLeaderIdentity !== "") {
            writer.uint32(26).string(message.nextLeaderIdentity);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseNextScheduledLeaderResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.currentSlot = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.nextLeaderSlot = longToNumber(reader.uint64());
                    break;
                case 3:
                    message.nextLeaderIdentity = reader.string();
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
            currentSlot: isSet(object.currentSlot) ? Number(object.currentSlot) : 0,
            nextLeaderSlot: isSet(object.nextLeaderSlot) ? Number(object.nextLeaderSlot) : 0,
            nextLeaderIdentity: isSet(object.nextLeaderIdentity) ? String(object.nextLeaderIdentity) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.currentSlot !== undefined && (obj.currentSlot = Math.round(message.currentSlot));
        message.nextLeaderSlot !== undefined && (obj.nextLeaderSlot = Math.round(message.nextLeaderSlot));
        message.nextLeaderIdentity !== undefined && (obj.nextLeaderIdentity = message.nextLeaderIdentity);
        return obj;
    },
    create(base) {
        return exports.NextScheduledLeaderResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseNextScheduledLeaderResponse();
        message.currentSlot = (_a = object.currentSlot) !== null && _a !== void 0 ? _a : 0;
        message.nextLeaderSlot = (_b = object.nextLeaderSlot) !== null && _b !== void 0 ? _b : 0;
        message.nextLeaderIdentity = (_c = object.nextLeaderIdentity) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseConnectedLeadersRequest() {
    return {};
}
exports.ConnectedLeadersRequest = {
    encode(_, writer = _m0.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConnectedLeadersRequest();
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
        return exports.ConnectedLeadersRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseConnectedLeadersRequest();
        return message;
    },
};
function createBaseConnectedLeadersResponse() {
    return { connectedValidators: {} };
}
exports.ConnectedLeadersResponse = {
    encode(message, writer = _m0.Writer.create()) {
        Object.entries(message.connectedValidators).forEach(([key, value]) => {
            exports.ConnectedLeadersResponse_ConnectedValidatorsEntry.encode({ key: key, value }, writer.uint32(10).fork())
                .ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConnectedLeadersResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    const entry1 = exports.ConnectedLeadersResponse_ConnectedValidatorsEntry.decode(reader, reader.uint32());
                    if (entry1.value !== undefined) {
                        message.connectedValidators[entry1.key] = entry1.value;
                    }
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
            connectedValidators: isObject(object.connectedValidators)
                ? Object.entries(object.connectedValidators).reduce((acc, [key, value]) => {
                    acc[key] = exports.SlotList.fromJSON(value);
                    return acc;
                }, {})
                : {},
        };
    },
    toJSON(message) {
        const obj = {};
        obj.connectedValidators = {};
        if (message.connectedValidators) {
            Object.entries(message.connectedValidators).forEach(([k, v]) => {
                obj.connectedValidators[k] = exports.SlotList.toJSON(v);
            });
        }
        return obj;
    },
    create(base) {
        return exports.ConnectedLeadersResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseConnectedLeadersResponse();
        message.connectedValidators = Object.entries((_a = object.connectedValidators) !== null && _a !== void 0 ? _a : {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = exports.SlotList.fromPartial(value);
            }
            return acc;
        }, {});
        return message;
    },
};
function createBaseConnectedLeadersResponse_ConnectedValidatorsEntry() {
    return { key: "", value: undefined };
}
exports.ConnectedLeadersResponse_ConnectedValidatorsEntry = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== undefined) {
            exports.SlotList.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConnectedLeadersResponse_ConnectedValidatorsEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = exports.SlotList.decode(reader, reader.uint32());
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
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? exports.SlotList.fromJSON(object.value) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? exports.SlotList.toJSON(message.value) : undefined);
        return obj;
    },
    create(base) {
        return exports.ConnectedLeadersResponse_ConnectedValidatorsEntry.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseConnectedLeadersResponse_ConnectedValidatorsEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.value = (object.value !== undefined && object.value !== null)
            ? exports.SlotList.fromPartial(object.value)
            : undefined;
        return message;
    },
};
function createBaseGetTipAccountsRequest() {
    return {};
}
exports.GetTipAccountsRequest = {
    encode(_, writer = _m0.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetTipAccountsRequest();
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
        return exports.GetTipAccountsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseGetTipAccountsRequest();
        return message;
    },
};
function createBaseGetTipAccountsResponse() {
    return { accounts: [] };
}
exports.GetTipAccountsResponse = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.accounts) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetTipAccountsResponse();
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
        return exports.GetTipAccountsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetTipAccountsResponse();
        message.accounts = ((_a = object.accounts) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseSubscribeBundleResultsRequest() {
    return {};
}
exports.SubscribeBundleResultsRequest = {
    encode(_, writer = _m0.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubscribeBundleResultsRequest();
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
        return exports.SubscribeBundleResultsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseSubscribeBundleResultsRequest();
        return message;
    },
};
exports.SearcherServiceService = {
    /**
     * Searchers can invoke this endpoint to subscribe to their respective bundle results.
     * A success result would indicate the bundle won its state auction and was submitted to the validator.
     */
    subscribeBundleResults: {
        path: "/searcher.SearcherService/SubscribeBundleResults",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.SubscribeBundleResultsRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SubscribeBundleResultsRequest.decode(value),
        responseSerialize: (value) => Buffer.from(bundle_1.BundleResult.encode(value).finish()),
        responseDeserialize: (value) => bundle_1.BundleResult.decode(value),
    },
    /**
     * RPC endpoint to subscribe to pending transactions. Clients can provide a list of base58 encoded accounts.
     * Any transactions that write-lock the provided accounts will be streamed to the searcher.
     */
    subscribePendingTransactions: {
        path: "/searcher.SearcherService/SubscribePendingTransactions",
        requestStream: false,
        responseStream: true,
        requestSerialize: (value) => Buffer.from(exports.PendingTxSubscriptionRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.PendingTxSubscriptionRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.PendingTxNotification.encode(value).finish()),
        responseDeserialize: (value) => exports.PendingTxNotification.decode(value),
    },
    sendBundle: {
        path: "/searcher.SearcherService/SendBundle",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.SendBundleRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SendBundleRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.SendBundleResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.SendBundleResponse.decode(value),
    },
    /** Returns the next scheduled leader connected to the block engine. */
    getNextScheduledLeader: {
        path: "/searcher.SearcherService/GetNextScheduledLeader",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.NextScheduledLeaderRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.NextScheduledLeaderRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.NextScheduledLeaderResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.NextScheduledLeaderResponse.decode(value),
    },
    /** Returns information on connected leader slots */
    getConnectedLeaders: {
        path: "/searcher.SearcherService/GetConnectedLeaders",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.ConnectedLeadersRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.ConnectedLeadersRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.ConnectedLeadersResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.ConnectedLeadersResponse.decode(value),
    },
    /** Returns the tip accounts searchers shall transfer funds to for the leader to claim. */
    getTipAccounts: {
        path: "/searcher.SearcherService/GetTipAccounts",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.GetTipAccountsRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.GetTipAccountsRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.GetTipAccountsResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.GetTipAccountsResponse.decode(value),
    },
};
exports.SearcherServiceClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.SearcherServiceService, "searcher.SearcherService");
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
// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=searcher.js.map