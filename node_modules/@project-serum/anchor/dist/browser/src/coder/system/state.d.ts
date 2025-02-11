/// <reference types="node" />
import { StateCoder } from "../index.js";
import { Idl } from "../../idl";
export declare class SystemStateCoder implements StateCoder {
    constructor(_idl: Idl);
    encode<T = any>(_name: string, _account: T): Promise<Buffer>;
    decode<T = any>(_ix: Buffer): T;
}
//# sourceMappingURL=state.d.ts.map