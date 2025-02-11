import { PublicKey, TransactionInstruction } from '@solana/web3.js';
export interface Middleware {
    initOpenOrders(ix: TransactionInstruction): void;
    newOrderV3(ix: TransactionInstruction): void;
    cancelOrderV2(ix: TransactionInstruction): void;
    cancelOrderByClientIdV2(ix: TransactionInstruction): void;
    settleFunds(ix: TransactionInstruction): void;
    closeOpenOrders(ix: TransactionInstruction): void;
    prune(ix: TransactionInstruction): void;
    consumeEvents(ix: TransactionInstruction): void;
    consumeEventsPermissioned(ix: TransactionInstruction): void;
}
export declare class OpenOrdersPda implements Middleware {
    private _proxyProgramId;
    private _dexProgramId;
    constructor({ proxyProgramId, dexProgramId, }: {
        proxyProgramId: PublicKey;
        dexProgramId: PublicKey;
    });
    static marketAuthority(market: PublicKey, dexProgramId: PublicKey, proxyProgramId: PublicKey): Promise<PublicKey>;
    static openOrdersAddress(market: PublicKey, owner: PublicKey, dexProgramId: PublicKey, proxyProgramId: PublicKey): Promise<PublicKey>;
    initOpenOrders(ix: TransactionInstruction): void;
    newOrderV3(ix: TransactionInstruction): void;
    cancelOrderV2(ix: TransactionInstruction): void;
    cancelOrderByClientIdV2(ix: TransactionInstruction): void;
    settleFunds(ix: TransactionInstruction): void;
    closeOpenOrders(ix: TransactionInstruction): void;
    prune(ix: TransactionInstruction): void;
    consumeEvents(ix: TransactionInstruction): void;
    consumeEventsPermissioned(ix: TransactionInstruction): void;
}
export declare class ReferralFees implements Middleware {
    initOpenOrders(_ix: TransactionInstruction): void;
    newOrderV3(_ix: TransactionInstruction): void;
    cancelOrderV2(_ix: TransactionInstruction): void;
    cancelOrderByClientIdV2(_ix: TransactionInstruction): void;
    settleFunds(_ix: TransactionInstruction): void;
    closeOpenOrders(_ix: TransactionInstruction): void;
    prune(_ix: TransactionInstruction): void;
    consumeEvents(_ix: TransactionInstruction): void;
    consumeEventsPermissioned(_ix: TransactionInstruction): void;
}
export declare class PermissionedCrank implements Middleware {
    initOpenOrders(_ix: TransactionInstruction): void;
    newOrderV3(_ix: TransactionInstruction): void;
    cancelOrderV2(_ix: TransactionInstruction): void;
    cancelOrderByClientIdV2(_ix: TransactionInstruction): void;
    settleFunds(_ix: TransactionInstruction): void;
    closeOpenOrders(_ix: TransactionInstruction): void;
    prune(_ix: TransactionInstruction): void;
    consumeEvents(_ix: TransactionInstruction): void;
    consumeEventsPermissioned(ix: TransactionInstruction): void;
}
export declare class Logger implements Middleware {
    initOpenOrders(ix: TransactionInstruction): void;
    newOrderV3(ix: TransactionInstruction): void;
    cancelOrderV2(ix: TransactionInstruction): void;
    cancelOrderByClientIdV2(ix: TransactionInstruction): void;
    settleFunds(ix: TransactionInstruction): void;
    closeOpenOrders(ix: TransactionInstruction): void;
    prune(ix: TransactionInstruction): void;
    consumeEvents(ix: TransactionInstruction): void;
    consumeEventsPermissioned(ix: TransactionInstruction): void;
    ixToDisplay(ix: TransactionInstruction): any;
}
//# sourceMappingURL=middleware.d.ts.map