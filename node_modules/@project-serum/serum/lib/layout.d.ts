export function zeros(length: any): Zeros;
export function publicKeyLayout(property: any): PublicKeyLayout;
export function u64(property: any): BNLayout;
export function i64(property: any): BNLayout;
export function u128(property: any): BNLayout;
export function sideLayout(property: any): EnumLayout;
export function orderTypeLayout(property: any): EnumLayout;
export function selfTradeBehaviorLayout(property: any): EnumLayout;
export function accountFlagsLayout(property?: string): any;
export function setLayoutDecoder(layout: any, decoder: any): void;
export function setLayoutEncoder(layout: any, encoder: any): any;
export class WideBits {
    constructor(property: any);
    _lower: any;
    _upper: any;
    addBoolean(property: any): void;
    decode(b: any, offset?: number): any;
    encode(src: any, b: any, offset?: number): any;
}
export class VersionedLayout {
    constructor(version: any, inner: any, property: any);
    version: any;
    inner: any;
    decode(b: any, offset?: number): any;
    encode(src: any, b: any, offset?: number): any;
    getSpan(b: any, offset?: number): any;
}
declare class Zeros {
    decode(b: any, offset: any): any;
}
declare class PublicKeyLayout {
    constructor(property: any);
    decode(b: any, offset: any): PublicKey;
    encode(src: any, b: any, offset: any): any;
}
declare class BNLayout {
    decode(b: any, offset: any): BN;
    encode(src: any, b: any, offset: any): any;
}
declare class EnumLayout {
    constructor(values: any, span: any, property: any);
    values: any;
    encode(src: any, b: any, offset: any): any;
    decode(b: any, offset: any): string;
}
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export {};
//# sourceMappingURL=layout.d.ts.map