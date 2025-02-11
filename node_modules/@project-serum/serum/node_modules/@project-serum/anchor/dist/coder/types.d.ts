/// <reference types="node" />
import { Idl } from "../idl";
/**
 * Encodes and decodes user defined types.
 */
export declare class TypesCoder {
    /**
     * Maps account type identifier to a layout.
     */
    private layouts;
    constructor(idl: Idl);
    encode<T = any>(accountName: string, account: T): Buffer;
    decode<T = any>(accountName: string, ix: Buffer): T;
}
//# sourceMappingURL=types.d.ts.map