/// <reference types="node" />
import { Buffer } from "buffer";
import { Idl } from "../../idl.js";
import { TypesCoder } from "../index.js";
/**
 * Encodes and decodes user-defined types.
 */
export declare class BorshTypesCoder<N extends string = string> implements TypesCoder {
    /**
     * Maps type name to a layout.
     */
    private typeLayouts;
    /**
     * IDL whose types will be coded.
     */
    private idl;
    constructor(idl: Idl);
    encode<T = any>(typeName: N, type: T): Buffer;
    decode<T = any>(typeName: N, typeData: Buffer): T;
}
//# sourceMappingURL=types.d.ts.map