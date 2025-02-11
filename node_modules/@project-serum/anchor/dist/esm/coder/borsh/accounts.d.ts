/// <reference types="node" />
import { Buffer } from "buffer";
import { Idl, IdlTypeDef } from "../../idl.js";
import { AccountsCoder } from "../index.js";
/**
 * Number of bytes of the account discriminator.
 */
export declare const ACCOUNT_DISCRIMINATOR_SIZE = 8;
/**
 * Encodes and decodes account objects.
 */
export declare class BorshAccountsCoder<A extends string = string> implements AccountsCoder {
    /**
     * Maps account type identifier to a layout.
     */
    private accountLayouts;
    /**
     * IDL whose acconts will be coded.
     */
    private idl;
    constructor(idl: Idl);
    encode<T = any>(accountName: A, account: T): Promise<Buffer>;
    decode<T = any>(accountName: A, data: Buffer): T;
    decodeAny<T = any>(data: Buffer): T;
    decodeUnchecked<T = any>(accountName: A, ix: Buffer): T;
    memcmp(accountName: A, appendData?: Buffer): any;
    size(idlAccount: IdlTypeDef): number;
    /**
     * Calculates and returns a unique 8 byte discriminator prepended to all anchor accounts.
     *
     * @param name The name of the account to calculate the discriminator.
     */
    static accountDiscriminator(name: string): Buffer;
}
//# sourceMappingURL=accounts.d.ts.map