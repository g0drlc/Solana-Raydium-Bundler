import { BorshInstructionCoder } from "./instruction.js";
import { BorshAccountsCoder } from "./accounts.js";
import { BorshEventCoder } from "./event.js";
import { BorshTypesCoder } from "./types.js";
export { BorshInstructionCoder } from "./instruction.js";
export { BorshAccountsCoder } from "./accounts.js";
export { DISCRIMINATOR_SIZE } from "./discriminator.js";
export { BorshEventCoder, eventDiscriminator } from "./event.js";
/**
 * BorshCoder is the default Coder for Anchor programs implementing the
 * borsh based serialization interface.
 */
export class BorshCoder {
    constructor(idl) {
        this.instruction = new BorshInstructionCoder(idl);
        this.accounts = new BorshAccountsCoder(idl);
        this.events = new BorshEventCoder(idl);
        this.types = new BorshTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map