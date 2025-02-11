import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "shared";
export interface Header {
    ts: Date | undefined;
}
export interface Heartbeat {
    count: number;
}
export interface Socket {
    ip: string;
    port: number;
}
export declare const Header: {
    encode(message: Header, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Header;
    fromJSON(object: any): Header;
    toJSON(message: Header): unknown;
    create<I extends {
        ts?: Date | undefined;
    } & {
        ts?: Date | undefined;
    } & { [K in Exclude<keyof I, "ts">]: never; }>(base?: I | undefined): Header;
    fromPartial<I_1 extends {
        ts?: Date | undefined;
    } & {
        ts?: Date | undefined;
    } & { [K_1 in Exclude<keyof I_1, "ts">]: never; }>(object: I_1): Header;
};
export declare const Heartbeat: {
    encode(message: Heartbeat, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Heartbeat;
    fromJSON(object: any): Heartbeat;
    toJSON(message: Heartbeat): unknown;
    create<I extends {
        count?: number | undefined;
    } & {
        count?: number | undefined;
    } & { [K in Exclude<keyof I, "count">]: never; }>(base?: I | undefined): Heartbeat;
    fromPartial<I_1 extends {
        count?: number | undefined;
    } & {
        count?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "count">]: never; }>(object: I_1): Heartbeat;
};
export declare const Socket: {
    encode(message: Socket, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Socket;
    fromJSON(object: any): Socket;
    toJSON(message: Socket): unknown;
    create<I extends {
        ip?: string | undefined;
        port?: number | undefined;
    } & {
        ip?: string | undefined;
        port?: number | undefined;
    } & { [K in Exclude<keyof I, keyof Socket>]: never; }>(base?: I | undefined): Socket;
    fromPartial<I_1 extends {
        ip?: string | undefined;
        port?: number | undefined;
    } & {
        ip?: string | undefined;
        port?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof Socket>]: never; }>(object: I_1): Socket;
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
