import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import * as _m0 from 'protobufjs/minimal';
export declare const protobufPackage = 'auth';
export declare enum Role {
  RELAYER = 0,
  SEARCHER = 1,
  VALIDATOR = 2,
  SHREDSTREAM_SUBSCRIBER = 3,
  UNRECOGNIZED = -1,
}
export declare function roleFromJSON(object: any): Role;
export declare function roleToJSON(object: Role): string;
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
  accessToken: Token | undefined;
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
export declare const GenerateAuthChallengeRequest: {
  encode(
    message: GenerateAuthChallengeRequest,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GenerateAuthChallengeRequest;
  fromJSON(object: any): GenerateAuthChallengeRequest;
  toJSON(message: GenerateAuthChallengeRequest): unknown;
  create<
    I extends {
      role?: Role | undefined;
      pubkey?: Uint8Array | undefined;
    } & {
      role?: Role | undefined;
      pubkey?: Uint8Array | undefined;
    } & {[K in Exclude<keyof I, keyof GenerateAuthChallengeRequest>]: never}
  >(
    base?: I | undefined
  ): GenerateAuthChallengeRequest;
  fromPartial<
    I_1 extends {
      role?: Role | undefined;
      pubkey?: Uint8Array | undefined;
    } & {
      role?: Role | undefined;
      pubkey?: Uint8Array | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof GenerateAuthChallengeRequest>]: never}
  >(
    object: I_1
  ): GenerateAuthChallengeRequest;
};
export declare const GenerateAuthChallengeResponse: {
  encode(
    message: GenerateAuthChallengeResponse,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GenerateAuthChallengeResponse;
  fromJSON(object: any): GenerateAuthChallengeResponse;
  toJSON(message: GenerateAuthChallengeResponse): unknown;
  create<
    I extends {
      challenge?: string | undefined;
    } & {
      challenge?: string | undefined;
    } & {[K in Exclude<keyof I, 'challenge'>]: never}
  >(
    base?: I | undefined
  ): GenerateAuthChallengeResponse;
  fromPartial<
    I_1 extends {
      challenge?: string | undefined;
    } & {
      challenge?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, 'challenge'>]: never}
  >(
    object: I_1
  ): GenerateAuthChallengeResponse;
};
export declare const GenerateAuthTokensRequest: {
  encode(message: GenerateAuthTokensRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GenerateAuthTokensRequest;
  fromJSON(object: any): GenerateAuthTokensRequest;
  toJSON(message: GenerateAuthTokensRequest): unknown;
  create<
    I extends {
      challenge?: string | undefined;
      clientPubkey?: Uint8Array | undefined;
      signedChallenge?: Uint8Array | undefined;
    } & {
      challenge?: string | undefined;
      clientPubkey?: Uint8Array | undefined;
      signedChallenge?: Uint8Array | undefined;
    } & {[K in Exclude<keyof I, keyof GenerateAuthTokensRequest>]: never}
  >(
    base?: I | undefined
  ): GenerateAuthTokensRequest;
  fromPartial<
    I_1 extends {
      challenge?: string | undefined;
      clientPubkey?: Uint8Array | undefined;
      signedChallenge?: Uint8Array | undefined;
    } & {
      challenge?: string | undefined;
      clientPubkey?: Uint8Array | undefined;
      signedChallenge?: Uint8Array | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof GenerateAuthTokensRequest>]: never}
  >(
    object: I_1
  ): GenerateAuthTokensRequest;
};
export declare const Token: {
  encode(message: Token, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Token;
  fromJSON(object: any): Token;
  toJSON(message: Token): unknown;
  create<
    I extends {
      value?: string | undefined;
      expiresAtUtc?: Date | undefined;
    } & {
      value?: string | undefined;
      expiresAtUtc?: Date | undefined;
    } & {[K in Exclude<keyof I, keyof Token>]: never}
  >(
    base?: I | undefined
  ): Token;
  fromPartial<
    I_1 extends {
      value?: string | undefined;
      expiresAtUtc?: Date | undefined;
    } & {
      value?: string | undefined;
      expiresAtUtc?: Date | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof Token>]: never}
  >(
    object: I_1
  ): Token;
};
export declare const GenerateAuthTokensResponse: {
  encode(message: GenerateAuthTokensResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GenerateAuthTokensResponse;
  fromJSON(object: any): GenerateAuthTokensResponse;
  toJSON(message: GenerateAuthTokensResponse): unknown;
  create<
    I extends {
      accessToken?:
        | {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          }
        | undefined;
      refreshToken?:
        | {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          }
        | undefined;
    } & {
      accessToken?:
        | ({
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {[K in Exclude<keyof I['accessToken'], keyof Token>]: never})
        | undefined;
      refreshToken?:
        | ({
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {[K_1 in Exclude<keyof I['refreshToken'], keyof Token>]: never})
        | undefined;
    } & {[K_2 in Exclude<keyof I, keyof GenerateAuthTokensResponse>]: never}
  >(
    base?: I | undefined
  ): GenerateAuthTokensResponse;
  fromPartial<
    I_1 extends {
      accessToken?:
        | {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          }
        | undefined;
      refreshToken?:
        | {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          }
        | undefined;
    } & {
      accessToken?:
        | ({
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {[K_3 in Exclude<keyof I_1['accessToken'], keyof Token>]: never})
        | undefined;
      refreshToken?:
        | ({
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {[K_4 in Exclude<keyof I_1['refreshToken'], keyof Token>]: never})
        | undefined;
    } & {[K_5 in Exclude<keyof I_1, keyof GenerateAuthTokensResponse>]: never}
  >(
    object: I_1
  ): GenerateAuthTokensResponse;
};
export declare const RefreshAccessTokenRequest: {
  encode(message: RefreshAccessTokenRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RefreshAccessTokenRequest;
  fromJSON(object: any): RefreshAccessTokenRequest;
  toJSON(message: RefreshAccessTokenRequest): unknown;
  create<
    I extends {
      refreshToken?: string | undefined;
    } & {
      refreshToken?: string | undefined;
    } & {[K in Exclude<keyof I, 'refreshToken'>]: never}
  >(
    base?: I | undefined
  ): RefreshAccessTokenRequest;
  fromPartial<
    I_1 extends {
      refreshToken?: string | undefined;
    } & {
      refreshToken?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, 'refreshToken'>]: never}
  >(
    object: I_1
  ): RefreshAccessTokenRequest;
};
export declare const RefreshAccessTokenResponse: {
  encode(message: RefreshAccessTokenResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RefreshAccessTokenResponse;
  fromJSON(object: any): RefreshAccessTokenResponse;
  toJSON(message: RefreshAccessTokenResponse): unknown;
  create<
    I extends {
      accessToken?:
        | {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          }
        | undefined;
    } & {
      accessToken?:
        | ({
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {[K in Exclude<keyof I['accessToken'], keyof Token>]: never})
        | undefined;
    } & {[K_1 in Exclude<keyof I, 'accessToken'>]: never}
  >(
    base?: I | undefined
  ): RefreshAccessTokenResponse;
  fromPartial<
    I_1 extends {
      accessToken?:
        | {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          }
        | undefined;
    } & {
      accessToken?:
        | ({
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {
            value?: string | undefined;
            expiresAtUtc?: Date | undefined;
          } & {[K_2 in Exclude<keyof I_1['accessToken'], keyof Token>]: never})
        | undefined;
    } & {[K_3 in Exclude<keyof I_1, 'accessToken'>]: never}
  >(
    object: I_1
  ): RefreshAccessTokenResponse;
};
/** / This service is responsible for issuing auth tokens to clients for API access. */
export type AuthServiceService = typeof AuthServiceService;
export declare const AuthServiceService: {
  /** / Returns a challenge, client is expected to sign this challenge with an appropriate keypair in order to obtain access tokens. */
  readonly generateAuthChallenge: {
    readonly path: '/auth.AuthService/GenerateAuthChallenge';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: GenerateAuthChallengeRequest) => Buffer;
    readonly requestDeserialize: (
      value: Buffer
    ) => GenerateAuthChallengeRequest;
    readonly responseSerialize: (
      value: GenerateAuthChallengeResponse
    ) => Buffer;
    readonly responseDeserialize: (
      value: Buffer
    ) => GenerateAuthChallengeResponse;
  };
  /** / Provides the client with the initial pair of auth tokens for API access. */
  readonly generateAuthTokens: {
    readonly path: '/auth.AuthService/GenerateAuthTokens';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: GenerateAuthTokensRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => GenerateAuthTokensRequest;
    readonly responseSerialize: (value: GenerateAuthTokensResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => GenerateAuthTokensResponse;
  };
  /** / Call this method with a non-expired refresh token to obtain a new access token. */
  readonly refreshAccessToken: {
    readonly path: '/auth.AuthService/RefreshAccessToken';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: RefreshAccessTokenRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => RefreshAccessTokenRequest;
    readonly responseSerialize: (value: RefreshAccessTokenResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => RefreshAccessTokenResponse;
  };
};
export interface AuthServiceServer extends UntypedServiceImplementation {
  /** / Returns a challenge, client is expected to sign this challenge with an appropriate keypair in order to obtain access tokens. */
  generateAuthChallenge: handleUnaryCall<
    GenerateAuthChallengeRequest,
    GenerateAuthChallengeResponse
  >;
  /** / Provides the client with the initial pair of auth tokens for API access. */
  generateAuthTokens: handleUnaryCall<
    GenerateAuthTokensRequest,
    GenerateAuthTokensResponse
  >;
  /** / Call this method with a non-expired refresh token to obtain a new access token. */
  refreshAccessToken: handleUnaryCall<
    RefreshAccessTokenRequest,
    RefreshAccessTokenResponse
  >;
}
export interface AuthServiceClient extends Client {
  /** / Returns a challenge, client is expected to sign this challenge with an appropriate keypair in order to obtain access tokens. */
  generateAuthChallenge(
    request: GenerateAuthChallengeRequest,
    callback: (
      error: ServiceError | null,
      response: GenerateAuthChallengeResponse
    ) => void
  ): ClientUnaryCall;
  generateAuthChallenge(
    request: GenerateAuthChallengeRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GenerateAuthChallengeResponse
    ) => void
  ): ClientUnaryCall;
  generateAuthChallenge(
    request: GenerateAuthChallengeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GenerateAuthChallengeResponse
    ) => void
  ): ClientUnaryCall;
  /** / Provides the client with the initial pair of auth tokens for API access. */
  generateAuthTokens(
    request: GenerateAuthTokensRequest,
    callback: (
      error: ServiceError | null,
      response: GenerateAuthTokensResponse
    ) => void
  ): ClientUnaryCall;
  generateAuthTokens(
    request: GenerateAuthTokensRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GenerateAuthTokensResponse
    ) => void
  ): ClientUnaryCall;
  generateAuthTokens(
    request: GenerateAuthTokensRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GenerateAuthTokensResponse
    ) => void
  ): ClientUnaryCall;
  /** / Call this method with a non-expired refresh token to obtain a new access token. */
  refreshAccessToken(
    request: RefreshAccessTokenRequest,
    callback: (
      error: ServiceError | null,
      response: RefreshAccessTokenResponse
    ) => void
  ): ClientUnaryCall;
  refreshAccessToken(
    request: RefreshAccessTokenRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: RefreshAccessTokenResponse
    ) => void
  ): ClientUnaryCall;
  refreshAccessToken(
    request: RefreshAccessTokenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: RefreshAccessTokenResponse
    ) => void
  ): ClientUnaryCall;
}
export declare const AuthServiceClient: {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>
  ): AuthServiceClient;
  service: typeof AuthServiceService;
};
type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & {
      [K in keyof P]: Exact<P[K], I[K]>;
    } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };
export {};
