/**
 * SHA1 (RFC 3174) legacy hash function.
 * @module
 */
import { HashMD } from './_md.js';
import { type CHash } from './utils.js';
export declare class SHA1 extends HashMD<SHA1> {
    private A;
    private B;
    private C;
    private D;
    private E;
    constructor();
    protected get(): [number, number, number, number, number];
    protected set(A: number, B: number, C: number, D: number, E: number): void;
    protected process(view: DataView, offset: number): void;
    protected roundClean(): void;
    destroy(): void;
}
/** SHA1 (RFC 3174) legacy hash function. It was cryptographically broken. */
export declare const sha1: CHash;
//# sourceMappingURL=sha1.d.ts.map