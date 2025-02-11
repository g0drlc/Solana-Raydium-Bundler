/// <reference types="node" />
import { Idl } from "../../idl.js";
import { InstructionCoder } from "../index.js";
export declare class SystemInstructionCoder implements InstructionCoder {
    constructor(_: Idl);
    encode(ixName: string, ix: any): Buffer;
    encodeState(_ixName: string, _ix: any): Buffer;
}
//# sourceMappingURL=instruction.d.ts.map