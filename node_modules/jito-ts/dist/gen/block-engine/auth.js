"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceClient = exports.AuthServiceService = exports.RefreshAccessTokenResponse = exports.RefreshAccessTokenRequest = exports.GenerateAuthTokensResponse = exports.Token = exports.GenerateAuthTokensRequest = exports.GenerateAuthChallengeResponse = exports.GenerateAuthChallengeRequest = exports.roleToJSON = exports.roleFromJSON = exports.Role = exports.protobufPackage = void 0;
/* eslint-disable */
const grpc_js_1 = require("@grpc/grpc-js");
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const timestamp_1 = require("./google/protobuf/timestamp");
exports.protobufPackage = "auth";
var Role;
(function (Role) {
    Role[Role["RELAYER"] = 0] = "RELAYER";
    Role[Role["SEARCHER"] = 1] = "SEARCHER";
    Role[Role["VALIDATOR"] = 2] = "VALIDATOR";
    Role[Role["SHREDSTREAM_SUBSCRIBER"] = 3] = "SHREDSTREAM_SUBSCRIBER";
    Role[Role["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(Role = exports.Role || (exports.Role = {}));
function roleFromJSON(object) {
    switch (object) {
        case 0:
        case "RELAYER":
            return Role.RELAYER;
        case 1:
        case "SEARCHER":
            return Role.SEARCHER;
        case 2:
        case "VALIDATOR":
            return Role.VALIDATOR;
        case 3:
        case "SHREDSTREAM_SUBSCRIBER":
            return Role.SHREDSTREAM_SUBSCRIBER;
        case -1:
        case "UNRECOGNIZED":
        default:
            return Role.UNRECOGNIZED;
    }
}
exports.roleFromJSON = roleFromJSON;
function roleToJSON(object) {
    switch (object) {
        case Role.RELAYER:
            return "RELAYER";
        case Role.SEARCHER:
            return "SEARCHER";
        case Role.VALIDATOR:
            return "VALIDATOR";
        case Role.SHREDSTREAM_SUBSCRIBER:
            return "SHREDSTREAM_SUBSCRIBER";
        case Role.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.roleToJSON = roleToJSON;
function createBaseGenerateAuthChallengeRequest() {
    return { role: 0, pubkey: new Uint8Array() };
}
exports.GenerateAuthChallengeRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.role !== 0) {
            writer.uint32(8).int32(message.role);
        }
        if (message.pubkey.length !== 0) {
            writer.uint32(18).bytes(message.pubkey);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenerateAuthChallengeRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.role = reader.int32();
                    break;
                case 2:
                    message.pubkey = reader.bytes();
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
            role: isSet(object.role) ? roleFromJSON(object.role) : 0,
            pubkey: isSet(object.pubkey) ? bytesFromBase64(object.pubkey) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.role !== undefined && (obj.role = roleToJSON(message.role));
        message.pubkey !== undefined &&
            (obj.pubkey = base64FromBytes(message.pubkey !== undefined ? message.pubkey : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.GenerateAuthChallengeRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGenerateAuthChallengeRequest();
        message.role = (_a = object.role) !== null && _a !== void 0 ? _a : 0;
        message.pubkey = (_b = object.pubkey) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBaseGenerateAuthChallengeResponse() {
    return { challenge: "" };
}
exports.GenerateAuthChallengeResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.challenge !== "") {
            writer.uint32(10).string(message.challenge);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenerateAuthChallengeResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.challenge = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { challenge: isSet(object.challenge) ? String(object.challenge) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.challenge !== undefined && (obj.challenge = message.challenge);
        return obj;
    },
    create(base) {
        return exports.GenerateAuthChallengeResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGenerateAuthChallengeResponse();
        message.challenge = (_a = object.challenge) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseGenerateAuthTokensRequest() {
    return { challenge: "", clientPubkey: new Uint8Array(), signedChallenge: new Uint8Array() };
}
exports.GenerateAuthTokensRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.challenge !== "") {
            writer.uint32(10).string(message.challenge);
        }
        if (message.clientPubkey.length !== 0) {
            writer.uint32(18).bytes(message.clientPubkey);
        }
        if (message.signedChallenge.length !== 0) {
            writer.uint32(26).bytes(message.signedChallenge);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenerateAuthTokensRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.challenge = reader.string();
                    break;
                case 2:
                    message.clientPubkey = reader.bytes();
                    break;
                case 3:
                    message.signedChallenge = reader.bytes();
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
            challenge: isSet(object.challenge) ? String(object.challenge) : "",
            clientPubkey: isSet(object.clientPubkey) ? bytesFromBase64(object.clientPubkey) : new Uint8Array(),
            signedChallenge: isSet(object.signedChallenge) ? bytesFromBase64(object.signedChallenge) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.challenge !== undefined && (obj.challenge = message.challenge);
        message.clientPubkey !== undefined &&
            (obj.clientPubkey = base64FromBytes(message.clientPubkey !== undefined ? message.clientPubkey : new Uint8Array()));
        message.signedChallenge !== undefined &&
            (obj.signedChallenge = base64FromBytes(message.signedChallenge !== undefined ? message.signedChallenge : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.GenerateAuthTokensRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseGenerateAuthTokensRequest();
        message.challenge = (_a = object.challenge) !== null && _a !== void 0 ? _a : "";
        message.clientPubkey = (_b = object.clientPubkey) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.signedChallenge = (_c = object.signedChallenge) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
function createBaseToken() {
    return { value: "", expiresAtUtc: undefined };
}
exports.Token = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.value !== "") {
            writer.uint32(10).string(message.value);
        }
        if (message.expiresAtUtc !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.expiresAtUtc), writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseToken();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.value = reader.string();
                    break;
                case 2:
                    message.expiresAtUtc = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
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
            value: isSet(object.value) ? String(object.value) : "",
            expiresAtUtc: isSet(object.expiresAtUtc) ? fromJsonTimestamp(object.expiresAtUtc) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.value !== undefined && (obj.value = message.value);
        message.expiresAtUtc !== undefined && (obj.expiresAtUtc = message.expiresAtUtc.toISOString());
        return obj;
    },
    create(base) {
        return exports.Token.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseToken();
        message.value = (_a = object.value) !== null && _a !== void 0 ? _a : "";
        message.expiresAtUtc = (_b = object.expiresAtUtc) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBaseGenerateAuthTokensResponse() {
    return { accessToken: undefined, refreshToken: undefined };
}
exports.GenerateAuthTokensResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.accessToken !== undefined) {
            exports.Token.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
        }
        if (message.refreshToken !== undefined) {
            exports.Token.encode(message.refreshToken, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenerateAuthTokensResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accessToken = exports.Token.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.refreshToken = exports.Token.decode(reader, reader.uint32());
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
            accessToken: isSet(object.accessToken) ? exports.Token.fromJSON(object.accessToken) : undefined,
            refreshToken: isSet(object.refreshToken) ? exports.Token.fromJSON(object.refreshToken) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.accessToken !== undefined &&
            (obj.accessToken = message.accessToken ? exports.Token.toJSON(message.accessToken) : undefined);
        message.refreshToken !== undefined &&
            (obj.refreshToken = message.refreshToken ? exports.Token.toJSON(message.refreshToken) : undefined);
        return obj;
    },
    create(base) {
        return exports.GenerateAuthTokensResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseGenerateAuthTokensResponse();
        message.accessToken = (object.accessToken !== undefined && object.accessToken !== null)
            ? exports.Token.fromPartial(object.accessToken)
            : undefined;
        message.refreshToken = (object.refreshToken !== undefined && object.refreshToken !== null)
            ? exports.Token.fromPartial(object.refreshToken)
            : undefined;
        return message;
    },
};
function createBaseRefreshAccessTokenRequest() {
    return { refreshToken: "" };
}
exports.RefreshAccessTokenRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.refreshToken !== "") {
            writer.uint32(10).string(message.refreshToken);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRefreshAccessTokenRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.refreshToken = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
        return obj;
    },
    create(base) {
        return exports.RefreshAccessTokenRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseRefreshAccessTokenRequest();
        message.refreshToken = (_a = object.refreshToken) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseRefreshAccessTokenResponse() {
    return { accessToken: undefined };
}
exports.RefreshAccessTokenResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.accessToken !== undefined) {
            exports.Token.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRefreshAccessTokenResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accessToken = exports.Token.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { accessToken: isSet(object.accessToken) ? exports.Token.fromJSON(object.accessToken) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.accessToken !== undefined &&
            (obj.accessToken = message.accessToken ? exports.Token.toJSON(message.accessToken) : undefined);
        return obj;
    },
    create(base) {
        return exports.RefreshAccessTokenResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseRefreshAccessTokenResponse();
        message.accessToken = (object.accessToken !== undefined && object.accessToken !== null)
            ? exports.Token.fromPartial(object.accessToken)
            : undefined;
        return message;
    },
};
exports.AuthServiceService = {
    /** / Returns a challenge, client is expected to sign this challenge with an appropriate keypair in order to obtain access tokens. */
    generateAuthChallenge: {
        path: "/auth.AuthService/GenerateAuthChallenge",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.GenerateAuthChallengeRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.GenerateAuthChallengeRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.GenerateAuthChallengeResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.GenerateAuthChallengeResponse.decode(value),
    },
    /** / Provides the client with the initial pair of auth tokens for API access. */
    generateAuthTokens: {
        path: "/auth.AuthService/GenerateAuthTokens",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.GenerateAuthTokensRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.GenerateAuthTokensRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.GenerateAuthTokensResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.GenerateAuthTokensResponse.decode(value),
    },
    /** / Call this method with a non-expired refresh token to obtain a new access token. */
    refreshAccessToken: {
        path: "/auth.AuthService/RefreshAccessToken",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.RefreshAccessTokenRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.RefreshAccessTokenRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.RefreshAccessTokenResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.RefreshAccessTokenResponse.decode(value),
    },
};
exports.AuthServiceClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.AuthServiceService, "auth.AuthService");
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
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=auth.js.map