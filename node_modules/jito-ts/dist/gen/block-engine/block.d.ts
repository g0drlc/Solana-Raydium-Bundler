import _m0 from "protobufjs/minimal";
import { Header } from "./shared";
export declare const protobufPackage = "block";
/** Condensed block helpful for getting data around efficiently internal to our system. */
export interface CondensedBlock {
    header: Header | undefined;
    previousBlockhash: string;
    blockhash: string;
    parentSlot: number;
    versionedTransactions: Uint8Array[];
    slot: number;
    commitment: string;
}
export declare const CondensedBlock: {
    encode(message: CondensedBlock, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CondensedBlock;
    fromJSON(object: any): CondensedBlock;
    toJSON(message: CondensedBlock): unknown;
    create<I extends {
        header?: {
            ts?: Date | undefined;
        } | undefined;
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        versionedTransactions?: Uint8Array[] | undefined;
        slot?: number | undefined;
        commitment?: string | undefined;
    } & {
        header?: ({
            ts?: Date | undefined;
        } & {
            ts?: Date | undefined;
        } & { [K in Exclude<keyof I["header"], "ts">]: never; }) | undefined;
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        versionedTransactions?: (Uint8Array[] & Uint8Array[] & { [K_1 in Exclude<keyof I["versionedTransactions"], keyof Uint8Array[]>]: never; }) | undefined;
        slot?: number | undefined;
        commitment?: string | undefined;
    } & { [K_2 in Exclude<keyof I, keyof CondensedBlock>]: never; }>(base?: I | undefined): CondensedBlock;
    fromPartial<I_1 extends {
        header?: {
            ts?: Date | undefined;
        } | undefined;
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        versionedTransactions?: Uint8Array[] | undefined;
        slot?: number | undefined;
        commitment?: string | undefined;
    } & {
        header?: ({
            ts?: Date | undefined;
        } & {
            ts?: Date | undefined;
        } & { [K_3 in Exclude<keyof I_1["header"], "ts">]: never; }) | undefined;
        previousBlockhash?: string | undefined;
        blockhash?: string | undefined;
        parentSlot?: number | undefined;
        versionedTransactions?: (Uint8Array[] & Uint8Array[] & { [K_4 in Exclude<keyof I_1["versionedTransactions"], keyof Uint8Array[]>]: never; }) | undefined;
        slot?: number | undefined;
        commitment?: string | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof CondensedBlock>]: never; }>(object: I_1): CondensedBlock;
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
