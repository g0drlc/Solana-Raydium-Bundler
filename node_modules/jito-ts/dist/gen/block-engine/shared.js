"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.Heartbeat = exports.Header = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const timestamp_1 = require("./google/protobuf/timestamp");
exports.protobufPackage = "shared";
function createBaseHeader() {
    return { ts: undefined };
}
exports.Header = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ts !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHeader();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ts = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { ts: isSet(object.ts) ? fromJsonTimestamp(object.ts) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.ts !== undefined && (obj.ts = message.ts.toISOString());
        return obj;
    },
    create(base) {
        return exports.Header.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseHeader();
        message.ts = (_a = object.ts) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseHeartbeat() {
    return { count: 0 };
}
exports.Heartbeat = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.count !== 0) {
            writer.uint32(8).uint64(message.count);
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
                    message.count = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { count: isSet(object.count) ? Number(object.count) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.count !== undefined && (obj.count = Math.round(message.count));
        return obj;
    },
    create(base) {
        return exports.Heartbeat.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseHeartbeat();
        message.count = (_a = object.count) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseSocket() {
    return { ip: "", port: 0 };
}
exports.Socket = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ip !== "") {
            writer.uint32(10).string(message.ip);
        }
        if (message.port !== 0) {
            writer.uint32(16).int64(message.port);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSocket();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ip = reader.string();
                    break;
                case 2:
                    message.port = longToNumber(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { ip: isSet(object.ip) ? String(object.ip) : "", port: isSet(object.port) ? Number(object.port) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.ip !== undefined && (obj.ip = message.ip);
        message.port !== undefined && (obj.port = Math.round(message.port));
        return obj;
    },
    create(base) {
        return exports.Socket.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseSocket();
        message.ip = (_a = object.ip) !== null && _a !== void 0 ? _a : "";
        message.port = (_b = object.port) !== null && _b !== void 0 ? _b : 0;
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
//# sourceMappingURL=shared.js.map