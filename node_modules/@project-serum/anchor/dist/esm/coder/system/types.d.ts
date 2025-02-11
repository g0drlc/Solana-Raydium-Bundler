/// <reference types="node" />
import { TypesCoder } from "../index.js";
import { Idl } from "../../idl.js";
export declare class SystemTypesCoder implements TypesCoder {
    constructor(_idl: Idl);
    encode<T = any>(_name: string, _type: T): Buffer;
    decode<T = any>(_name: string, _typeData: Buffer): T;
}
//# sourceMappingURL=types.d.ts.map