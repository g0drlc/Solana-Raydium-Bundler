import { SystemInstructionCoder } from "./instruction.js";
import { SystemStateCoder } from "./state.js";
import { SystemAccountsCoder } from "./accounts.js";
import { SystemEventsCoder } from "./events.js";
import { SystemTypesCoder } from "./types.js";
/**
 * Coder for the System program.
 */
export class SystemCoder {
    constructor(idl) {
        this.instruction = new SystemInstructionCoder(idl);
        this.accounts = new SystemAccountsCoder(idl);
        this.events = new SystemEventsCoder(idl);
        this.state = new SystemStateCoder(idl);
        this.types = new SystemTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map