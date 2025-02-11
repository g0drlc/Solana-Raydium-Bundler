/// <reference types="node" />
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export { u8, s8 as i8, u16, s16 as i16, u32, s32 as i32, f32, f64, struct, } from "buffer-layout";
export interface Layout<T> {
    span: number;
    property?: string;
    decode(b: Buffer, offset?: number): T;
    encode(src: T, b: Buffer, offset?: number): number;
    getSpan(b: Buffer, offset?: number): number;
    replicate(name: string): this;
}
export declare function u64(property?: string): Layout<BN>;
export declare function i64(property?: string): Layout<BN>;
export declare function u128(property?: string): Layout<BN>;
export declare function i128(property?: string): Layout<BN>;
export declare function u256(property?: string): Layout<BN>;
export declare function i256(property?: string): Layout<BN>;
export declare function publicKey(property?: string): Layout<PublicKey>;
export declare function option<T>(layout: Layout<T>, property?: string): Layout<T | null>;
export declare function bool(property?: string): Layout<boolean>;
export declare function vec<T>(elementLayout: Layout<T>, property?: string): Layout<T[]>;
export declare function tagged<T>(tag: BN, layout: Layout<T>, property?: string): Layout<T>;
export declare function vecU8(property?: string): Layout<Buffer>;
export declare function str(property?: string): Layout<string>;
export interface EnumLayout<T> extends Layout<T> {
    registry: Record<string, Layout<any>>;
}
export declare function rustEnum<T>(variants: Layout<any>[], property?: string, discriminant?: Layout<any>): EnumLayout<T>;
export declare function array<T>(elementLayout: Layout<T>, length: number, property?: string): Layout<T[]>;
export declare function map<K, V>(keyLayout: Layout<K>, valueLayout: Layout<V>, property?: string): Layout<Map<K, V>>;
//# sourceMappingURL=index.d.ts.map