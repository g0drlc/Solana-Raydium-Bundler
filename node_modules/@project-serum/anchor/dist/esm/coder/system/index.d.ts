import { Idl } from "../../idl.js";
import { Coder } from "../index.js";
import { SystemInstructionCoder } from "./instruction.js";
import { SystemStateCoder } from "./state.js";
import { SystemAccountsCoder } from "./accounts.js";
import { SystemEventsCoder } from "./events.js";
import { SystemTypesCoder } from "./types.js";
/**
 * Coder for the System program.
 */
export declare class SystemCoder implements Coder {
    readonly instruction: SystemInstructionCoder;
    readonly accounts: SystemAccountsCoder;
    readonly state: SystemStateCoder;
    readonly events: SystemEventsCoder;
    readonly types: SystemTypesCoder;
    constructor(idl: Idl);
}
//# sourceMappingURL=index.d.ts.map