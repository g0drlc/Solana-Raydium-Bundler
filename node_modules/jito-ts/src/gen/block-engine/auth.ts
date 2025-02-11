/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "auth";

export enum Role {
  RELAYER = 0,
  SEARCHER = 1,
  VALIDATOR = 2,
  SHREDSTREAM_SUBSCRIBER = 3,
  UNRECOGNIZED = -1,
}

export function roleFromJSON(object: any): Role {
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

export function roleToJSON(object: Role): string {
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

export interface GenerateAuthChallengeRequest {
  /** / Role the client is attempting to generate tokens for. */
  role: Role;
  /** / Client's 32 byte pubkey. */
  pubkey: Uint8Array;
}

export interface GenerateAuthChallengeResponse {
  challenge: string;
}

export interface GenerateAuthTokensRequest {
  /** / The pre-signed challenge. */
  challenge: string;
  /** / The signing keypair's corresponding 32 byte pubkey. */
  clientPubkey: Uint8Array;
  /**
   * / The 64 byte signature of the challenge signed by the client's private key. The private key must correspond to
   * the pubkey passed in the [GenerateAuthChallenge] method. The client is expected to sign the challenge token
   * prepended with their pubkey. For example sign(pubkey, challenge).
   */
  signedChallenge: Uint8Array;
}

export interface Token {
  /** / The token. */
  value: string;
  /** / When the token will expire. */
  expiresAtUtc: Date | undefined;
}

export interface GenerateAuthTokensResponse {
  /** / The token granting access to resources. */
  accessToken:
    | Token
    | undefined;
  /** / The token used to refresh the access_token. This has a longer TTL than the access_token. */
  refreshToken: Token | undefined;
}

export interface RefreshAccessTokenRequest {
  /** / Non-expired refresh token obtained from the [GenerateAuthTokens] method. */
  refreshToken: string;
}

export interface RefreshAccessTokenResponse {
  /** / Fresh access_token. */
  accessToken: Token | undefined;
}

function createBaseGenerateAuthChallengeRequest(): GenerateAuthChallengeRequest {
  return { role: 0, pubkey: new Uint8Array() };
}

export const GenerateAuthChallengeRequest = {
  encode(message: GenerateAuthChallengeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.role !== 0) {
      writer.uint32(8).int32(message.role);
    }
    if (message.pubkey.length !== 0) {
      writer.uint32(18).bytes(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenerateAuthChallengeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenerateAuthChallengeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.role = reader.int32() as any;
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

  fromJSON(object: any): GenerateAuthChallengeRequest {
    return {
      role: isSet(object.role) ? roleFromJSON(object.role) : 0,
      pubkey: isSet(object.pubkey) ? bytesFromBase64(object.pubkey) : new Uint8Array(),
    };
  },

  toJSON(message: GenerateAuthChallengeRequest): unknown {
    const obj: any = {};
    message.role !== undefined && (obj.role = roleToJSON(message.role));
    message.pubkey !== undefined &&
      (obj.pubkey = base64FromBytes(message.pubkey !== undefined ? message.pubkey : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAuthChallengeRequest>, I>>(base?: I): GenerateAuthChallengeRequest {
    return GenerateAuthChallengeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GenerateAuthChallengeRequest>, I>>(object: I): GenerateAuthChallengeRequest {
    const message = createBaseGenerateAuthChallengeRequest();
    message.role = object.role ?? 0;
    message.pubkey = object.pubkey ?? new Uint8Array();
    return message;
  },
};

function createBaseGenerateAuthChallengeResponse(): GenerateAuthChallengeResponse {
  return { challenge: "" };
}

export const GenerateAuthChallengeResponse = {
  encode(message: GenerateAuthChallengeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenerateAuthChallengeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): GenerateAuthChallengeResponse {
    return { challenge: isSet(object.challenge) ? String(object.challenge) : "" };
  },

  toJSON(message: GenerateAuthChallengeResponse): unknown {
    const obj: any = {};
    message.challenge !== undefined && (obj.challenge = message.challenge);
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAuthChallengeResponse>, I>>(base?: I): GenerateAuthChallengeResponse {
    return GenerateAuthChallengeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GenerateAuthChallengeResponse>, I>>(
    object: I,
  ): GenerateAuthChallengeResponse {
    const message = createBaseGenerateAuthChallengeResponse();
    message.challenge = object.challenge ?? "";
    return message;
  },
};

function createBaseGenerateAuthTokensRequest(): GenerateAuthTokensRequest {
  return { challenge: "", clientPubkey: new Uint8Array(), signedChallenge: new Uint8Array() };
}

export const GenerateAuthTokensRequest = {
  encode(message: GenerateAuthTokensRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): GenerateAuthTokensRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): GenerateAuthTokensRequest {
    return {
      challenge: isSet(object.challenge) ? String(object.challenge) : "",
      clientPubkey: isSet(object.clientPubkey) ? bytesFromBase64(object.clientPubkey) : new Uint8Array(),
      signedChallenge: isSet(object.signedChallenge) ? bytesFromBase64(object.signedChallenge) : new Uint8Array(),
    };
  },

  toJSON(message: GenerateAuthTokensRequest): unknown {
    const obj: any = {};
    message.challenge !== undefined && (obj.challenge = message.challenge);
    message.clientPubkey !== undefined &&
      (obj.clientPubkey = base64FromBytes(
        message.clientPubkey !== undefined ? message.clientPubkey : new Uint8Array(),
      ));
    message.signedChallenge !== undefined &&
      (obj.signedChallenge = base64FromBytes(
        message.signedChallenge !== undefined ? message.signedChallenge : new Uint8Array(),
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAuthTokensRequest>, I>>(base?: I): GenerateAuthTokensRequest {
    return GenerateAuthTokensRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GenerateAuthTokensRequest>, I>>(object: I): GenerateAuthTokensRequest {
    const message = createBaseGenerateAuthTokensRequest();
    message.challenge = object.challenge ?? "";
    message.clientPubkey = object.clientPubkey ?? new Uint8Array();
    message.signedChallenge = object.signedChallenge ?? new Uint8Array();
    return message;
  },
};

function createBaseToken(): Token {
  return { value: "", expiresAtUtc: undefined };
}

export const Token = {
  encode(message: Token, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== "") {
      writer.uint32(10).string(message.value);
    }
    if (message.expiresAtUtc !== undefined) {
      Timestamp.encode(toTimestamp(message.expiresAtUtc), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Token {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.string();
          break;
        case 2:
          message.expiresAtUtc = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Token {
    return {
      value: isSet(object.value) ? String(object.value) : "",
      expiresAtUtc: isSet(object.expiresAtUtc) ? fromJsonTimestamp(object.expiresAtUtc) : undefined,
    };
  },

  toJSON(message: Token): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    message.expiresAtUtc !== undefined && (obj.expiresAtUtc = message.expiresAtUtc.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<Token>, I>>(base?: I): Token {
    return Token.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Token>, I>>(object: I): Token {
    const message = createBaseToken();
    message.value = object.value ?? "";
    message.expiresAtUtc = object.expiresAtUtc ?? undefined;
    return message;
  },
};

function createBaseGenerateAuthTokensResponse(): GenerateAuthTokensResponse {
  return { accessToken: undefined, refreshToken: undefined };
}

export const GenerateAuthTokensResponse = {
  encode(message: GenerateAuthTokensResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessToken !== undefined) {
      Token.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.refreshToken !== undefined) {
      Token.encode(message.refreshToken, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenerateAuthTokensResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenerateAuthTokensResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken = Token.decode(reader, reader.uint32());
          break;
        case 2:
          message.refreshToken = Token.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenerateAuthTokensResponse {
    return {
      accessToken: isSet(object.accessToken) ? Token.fromJSON(object.accessToken) : undefined,
      refreshToken: isSet(object.refreshToken) ? Token.fromJSON(object.refreshToken) : undefined,
    };
  },

  toJSON(message: GenerateAuthTokensResponse): unknown {
    const obj: any = {};
    message.accessToken !== undefined &&
      (obj.accessToken = message.accessToken ? Token.toJSON(message.accessToken) : undefined);
    message.refreshToken !== undefined &&
      (obj.refreshToken = message.refreshToken ? Token.toJSON(message.refreshToken) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAuthTokensResponse>, I>>(base?: I): GenerateAuthTokensResponse {
    return GenerateAuthTokensResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GenerateAuthTokensResponse>, I>>(object: I): GenerateAuthTokensResponse {
    const message = createBaseGenerateAuthTokensResponse();
    message.accessToken = (object.accessToken !== undefined && object.accessToken !== null)
      ? Token.fromPartial(object.accessToken)
      : undefined;
    message.refreshToken = (object.refreshToken !== undefined && object.refreshToken !== null)
      ? Token.fromPartial(object.refreshToken)
      : undefined;
    return message;
  },
};

function createBaseRefreshAccessTokenRequest(): RefreshAccessTokenRequest {
  return { refreshToken: "" };
}

export const RefreshAccessTokenRequest = {
  encode(message: RefreshAccessTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.refreshToken !== "") {
      writer.uint32(10).string(message.refreshToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshAccessTokenRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): RefreshAccessTokenRequest {
    return { refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : "" };
  },

  toJSON(message: RefreshAccessTokenRequest): unknown {
    const obj: any = {};
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshAccessTokenRequest>, I>>(base?: I): RefreshAccessTokenRequest {
    return RefreshAccessTokenRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RefreshAccessTokenRequest>, I>>(object: I): RefreshAccessTokenRequest {
    const message = createBaseRefreshAccessTokenRequest();
    message.refreshToken = object.refreshToken ?? "";
    return message;
  },
};

function createBaseRefreshAccessTokenResponse(): RefreshAccessTokenResponse {
  return { accessToken: undefined };
}

export const RefreshAccessTokenResponse = {
  encode(message: RefreshAccessTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessToken !== undefined) {
      Token.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshAccessTokenResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshAccessTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken = Token.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RefreshAccessTokenResponse {
    return { accessToken: isSet(object.accessToken) ? Token.fromJSON(object.accessToken) : undefined };
  },

  toJSON(message: RefreshAccessTokenResponse): unknown {
    const obj: any = {};
    message.accessToken !== undefined &&
      (obj.accessToken = message.accessToken ? Token.toJSON(message.accessToken) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshAccessTokenResponse>, I>>(base?: I): RefreshAccessTokenResponse {
    return RefreshAccessTokenResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RefreshAccessTokenResponse>, I>>(object: I): RefreshAccessTokenResponse {
    const message = createBaseRefreshAccessTokenResponse();
    message.accessToken = (object.accessToken !== undefined && object.accessToken !== null)
      ? Token.fromPartial(object.accessToken)
      : undefined;
    return message;
  },
};

/** / This service is responsible for issuing auth tokens to clients for API access. */
export type AuthServiceService = typeof AuthServiceService;
export const AuthServiceService = {
  /** / Returns a challenge, client is expected to sign this challenge with an appropriate keypair in order to obtain access tokens. */
  generateAuthChallenge: {
    path: "/auth.AuthService/GenerateAuthChallenge",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GenerateAuthChallengeRequest) =>
      Buffer.from(GenerateAuthChallengeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GenerateAuthChallengeRequest.decode(value),
    responseSerialize: (value: GenerateAuthChallengeResponse) =>
      Buffer.from(GenerateAuthChallengeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GenerateAuthChallengeResponse.decode(value),
  },
  /** / Provides the client with the initial pair of auth tokens for API access. */
  generateAuthTokens: {
    path: "/auth.AuthService/GenerateAuthTokens",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GenerateAuthTokensRequest) =>
      Buffer.from(GenerateAuthTokensRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GenerateAuthTokensRequest.decode(value),
    responseSerialize: (value: GenerateAuthTokensResponse) =>
      Buffer.from(GenerateAuthTokensResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GenerateAuthTokensResponse.decode(value),
  },
  /** / Call this method with a non-expired refresh token to obtain a new access token. */
  refreshAccessToken: {
    path: "/auth.AuthService/RefreshAccessToken",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: RefreshAccessTokenRequest) =>
      Buffer.from(RefreshAccessTokenRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => RefreshAccessTokenRequest.decode(value),
    responseSerialize: (value: RefreshAccessTokenResponse) =>
      Buffer.from(RefreshAccessTokenResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => RefreshAccessTokenResponse.decode(value),
  },
} as const;

export interface AuthServiceServer extends UntypedServiceImplementation {
  /** / Returns a challenge, client is expected to sign this challenge with an appropriate keypair in order to obtain access tokens. */
  generateAuthChallenge: handleUnaryCall<GenerateAuthChallengeRequest, GenerateAuthChallengeResponse>;
  /** / Provides the client with the initial pair of auth tokens for API access. */
  generateAuthTokens: handleUnaryCall<GenerateAuthTokensRequest, GenerateAuthTokensResponse>;
  /** / Call this method with a non-expired refresh token to obtain a new access token. */
  refreshAccessToken: handleUnaryCall<RefreshAccessTokenRequest, RefreshAccessTokenResponse>;
}

export interface AuthServiceClient extends Client {
  /** / Returns a challenge, client is expected to sign this challenge with an appropriate keypair in order to obtain access tokens. */
  generateAuthChallenge(
    request: GenerateAuthChallengeRequest,
    callback: (error: ServiceError | null, response: GenerateAuthChallengeResponse) => void,
  ): ClientUnaryCall;
  generateAuthChallenge(
    request: GenerateAuthChallengeRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GenerateAuthChallengeResponse) => void,
  ): ClientUnaryCall;
  generateAuthChallenge(
    request: GenerateAuthChallengeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GenerateAuthChallengeResponse) => void,
  ): ClientUnaryCall;
  /** / Provides the client with the initial pair of auth tokens for API access. */
  generateAuthTokens(
    request: GenerateAuthTokensRequest,
    callback: (error: ServiceError | null, response: GenerateAuthTokensResponse) => void,
  ): ClientUnaryCall;
  generateAuthTokens(
    request: GenerateAuthTokensRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GenerateAuthTokensResponse) => void,
  ): ClientUnaryCall;
  generateAuthTokens(
    request: GenerateAuthTokensRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GenerateAuthTokensResponse) => void,
  ): ClientUnaryCall;
  /** / Call this method with a non-expired refresh token to obtain a new access token. */
  refreshAccessToken(
    request: RefreshAccessTokenRequest,
    callback: (error: ServiceError | null, response: RefreshAccessTokenResponse) => void,
  ): ClientUnaryCall;
  refreshAccessToken(
    request: RefreshAccessTokenRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: RefreshAccessTokenResponse) => void,
  ): ClientUnaryCall;
  refreshAccessToken(
    request: RefreshAccessTokenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: RefreshAccessTokenResponse) => void,
  ): ClientUnaryCall;
}

export const AuthServiceClient = makeGenericClientConstructor(AuthServiceService, "auth.AuthService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): AuthServiceClient;
  service: typeof AuthServiceService;
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

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
