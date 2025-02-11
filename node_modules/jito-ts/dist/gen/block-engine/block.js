"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CondensedBlock = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const shared_1 = require("./shared");
exports.protobufPackage = "block";
function createBaseCondensedBlock() {
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
exports.CondensedBlock = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.header !== undefined) {
            shared_1.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
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
            writer.uint32(42).bytes(v);
        }
        if (message.slot !== 0) {
            writer.uint32(48).uint64(message.slot);
        }
        if (message.commitment !== "") {
            writer.uint32(58).string(message.commitment);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCondensedBlock();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.header = shared_1.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.previousBlockhash = reader.string();
                    break;
                case 3:
                    message.blockhash = reader.string();
                    break;
                case 4:
                    message.parentSlot = longToNumber(reader.uint64());
                    break;
                case 5:
                    message.versionedTransactions.push(reader.bytes());
                    break;
                case 6:
                    message.slot = longToNumber(reader.uint64());
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
    fromJSON(object) {
        return {
            header: isSet(object.header) ? shared_1.Header.fromJSON(object.header) : undefined,
            previousBlockhash: isSet(object.previousBlockhash) ? String(object.previousBlockhash) : "",
            blockhash: isSet(object.blockhash) ? String(object.blockhash) : "",
            parentSlot: isSet(object.parentSlot) ? Number(object.parentSlot) : 0,
            versionedTransactions: Array.isArray(object === null || object === void 0 ? void 0 : object.versionedTransactions)
                ? object.versionedTransactions.map((e) => bytesFromBase64(e))
                : [],
            slot: isSet(object.slot) ? Number(object.slot) : 0,
            commitment: isSet(object.commitment) ? String(object.commitment) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.header !== undefined && (obj.header = message.header ? shared_1.Header.toJSON(message.header) : undefined);
        message.previousBlockhash !== undefined && (obj.previousBlockhash = message.previousBlockhash);
        message.blockhash !== undefined && (obj.blockhash = message.blockhash);
        message.parentSlot !== undefined && (obj.parentSlot = Math.round(message.parentSlot));
        if (message.versionedTransactions) {
            obj.versionedTransactions = message.versionedTransactions.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.versionedTransactions = [];
        }
        message.slot !== undefined && (obj.slot = Math.round(message.slot));
        message.commitment !== undefined && (obj.commitment = message.commitment);
        return obj;
    },
    create(base) {
        return exports.CondensedBlock.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseCondensedBlock();
        message.header = (object.header !== undefined && object.header !== null)
            ? shared_1.Header.fromPartial(object.header)
            : undefined;
        message.previousBlockhash = (_a = object.previousBlockhash) !== null && _a !== void 0 ? _a : "";
        message.blockhash = (_b = object.blockhash) !== null && _b !== void 0 ? _b : "";
        message.parentSlot = (_c = object.parentSlot) !== null && _c !== void 0 ? _c : 0;
        message.versionedTransactions = ((_d = object.versionedTransactions) === null || _d === void 0 ? void 0 : _d.map((e) => e)) || [];
        message.slot = (_e = object.slot) !== null && _e !== void 0 ? _e : 0;
        message.commitment = (_f = object.commitment) !== null && _f !== void 0 ? _f : "";
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
//# sourceMappingURL=block.js.map