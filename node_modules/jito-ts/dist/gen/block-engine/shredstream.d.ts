import { CallOptions, ChannelCredentials, Client, ClientOptions, ClientUnaryCall, handleUnaryCall, Metadata, ServiceError, UntypedServiceImplementation } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Socket } from "./shared";
export declare const protobufPackage = "shredstream";
export interface Heartbeat {
    /**
     * don't trust IP:PORT from tcp header since it can be tampered over the wire
     * `socket.ip` must match incoming packet's ip. this prevents spamming an unwitting destination
     */
    socket: Socket | undefined;
    /**
     * regions for shredstream proxy to receive shreds from
     * list of valid regions: https://jito-labs.gitbook.io/mev/systems/connecting/mainnet
     */
    regions: string[];
}
export interface HeartbeatResponse {
    /** client must respond within `ttl_ms` to keep stream alive */
    ttlMs: number;
}
export declare const Heartbeat: {
    encode(message: Heartbeat, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Heartbeat;
    fromJSON(object: any): Heartbeat;
    toJSON(message: Heartbeat): unknown;
    create<I extends {
        socket?: {
            ip?: string | undefined;
            port?: number | undefined;
        } | undefined;
        regions?: string[] | undefined;
    } & {
        socket?: ({
            ip?: string | undefined;
            port?: number | undefined;
        } & {
            ip?: string | undefined;
            port?: number | undefined;
        } & { [K in Exclude<keyof I["socket"], keyof Socket>]: never; }) | undefined;
        regions?: (string[] & string[] & { [K_1 in Exclude<keyof I["regions"], keyof string[]>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof Heartbeat>]: never; }>(base?: I | undefined): Heartbeat;
    fromPartial<I_1 extends {
        socket?: {
            ip?: string | undefined;
            port?: number | undefined;
        } | undefined;
        regions?: string[] | undefined;
    } & {
        socket?: ({
            ip?: string | undefined;
            port?: number | undefined;
        } & {
            ip?: string | undefined;
            port?: number | undefined;
        } & { [K_3 in Exclude<keyof I_1["socket"], keyof Socket>]: never; }) | undefined;
        regions?: (string[] & string[] & { [K_4 in Exclude<keyof I_1["regions"], keyof string[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof Heartbeat>]: never; }>(object: I_1): Heartbeat;
};
export declare const HeartbeatResponse: {
    encode(message: HeartbeatResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatResponse;
    fromJSON(object: any): HeartbeatResponse;
    toJSON(message: HeartbeatResponse): unknown;
    create<I extends {
        ttlMs?: number | undefined;
    } & {
        ttlMs?: number | undefined;
    } & { [K in Exclude<keyof I, "ttlMs">]: never; }>(base?: I | undefined): HeartbeatResponse;
    fromPartial<I_1 extends {
        ttlMs?: number | undefined;
    } & {
        ttlMs?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "ttlMs">]: never; }>(object: I_1): HeartbeatResponse;
};
export type ShredstreamService = typeof ShredstreamService;
export declare const ShredstreamService: {
    /** RPC endpoint to send heartbeats to keep shreds flowing */
    readonly sendHeartbeat: {
        readonly path: "/shredstream.Shredstream/SendHeartbeat";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: Heartbeat) => Buffer;
        readonly requestDeserialize: (value: Buffer) => Heartbeat;
        readonly responseSerialize: (value: HeartbeatResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => HeartbeatResponse;
    };
};
export interface ShredstreamServer extends UntypedServiceImplementation {
    /** RPC endpoint to send heartbeats to keep shreds flowing */
    sendHeartbeat: handleUnaryCall<Heartbeat, HeartbeatResponse>;
}
export interface ShredstreamClient extends Client {
    /** RPC endpoint to send heartbeats to keep shreds flowing */
    sendHeartbeat(request: Heartbeat, callback: (error: ServiceError | null, response: HeartbeatResponse) => void): ClientUnaryCall;
    sendHeartbeat(request: Heartbeat, metadata: Metadata, callback: (error: ServiceError | null, response: HeartbeatResponse) => void): ClientUnaryCall;
    sendHeartbeat(request: Heartbeat, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: HeartbeatResponse) => void): ClientUnaryCall;
}
export declare const ShredstreamClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): ShredstreamClient;
    service: typeof ShredstreamService;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
