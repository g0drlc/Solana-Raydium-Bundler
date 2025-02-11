/// <reference types="node" />
import { Idl } from "../idl";
/**
 * Number of bytes of the account discriminator.
 */
export declare const ACCOUNT_DISCRIMINATOR_SIZE = 8;
/**
 * Encodes and decodes account objects.
 */
export declare class AccountsCoder {
    /**
     * Maps account type identifier to a layout.
     */
    private accountLayouts;
    constructor(idl: Idl);
    encode<T = any>(accountName: string, account: T): Promise<Buffer>;
    decode<T = any>(accountName: string, ix: Buffer): T;
}
export declare function accountDiscriminator(name: string): Promise<Buffer>;
//# sourceMappingURL=accounts.d.ts.map