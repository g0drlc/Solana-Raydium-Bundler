/// <reference types="node" />
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
export interface Event {
    eventFlags: {
        fill: boolean;
        out: boolean;
        bid: boolean;
        maker: boolean;
    };
    seqNum?: number;
    orderId: BN;
    openOrders: PublicKey;
    openOrdersSlot: number;
    feeTier: number;
    nativeQuantityReleased: BN;
    nativeQuantityPaid: BN;
    nativeFeeOrRebate: BN;
}
export declare function decodeEventsSince(buffer: Buffer, lastSeqNum: number): Event[];
export declare function decodeRequestQueue(buffer: Buffer, history?: number): any[];
export declare function decodeEventQueue(buffer: Buffer, history?: number): Event[];
export declare const REQUEST_QUEUE_LAYOUT: {
    HEADER: any;
    NODE: any;
};
export declare const EVENT_QUEUE_LAYOUT: {
    HEADER: any;
    NODE: any;
};
//# sourceMappingURL=queue.d.ts.map