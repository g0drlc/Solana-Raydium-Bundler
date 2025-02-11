/// <reference types="node" />
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
export declare const SLAB_LAYOUT: any;
export declare class Slab {
    private header;
    private nodes;
    constructor(header: any, nodes: any);
    static decode(buffer: Buffer): any;
    get(searchKey: BN | number): any;
    [Symbol.iterator](): Generator<{
        ownerSlot: number;
        key: BN;
        owner: PublicKey;
        quantity: BN;
        feeTier: number;
        clientOrderId: BN;
    }, any, unknown>;
    items(descending?: boolean): Generator<{
        ownerSlot: number;
        key: BN;
        owner: PublicKey;
        quantity: BN;
        feeTier: number;
        clientOrderId: BN;
    }>;
}
//# sourceMappingURL=slab.d.ts.map