import { BorshInstructionCoder } from "./instruction.js";
import { BorshAccountsCoder } from "./accounts.js";
import { BorshEventCoder } from "./event.js";
import { BorshStateCoder } from "./state.js";
import { BorshTypesCoder } from "./types.js";
export { BorshInstructionCoder } from "./instruction.js";
export { BorshAccountsCoder, ACCOUNT_DISCRIMINATOR_SIZE } from "./accounts.js";
export { BorshEventCoder, eventDiscriminator } from "./event.js";
export { BorshStateCoder, stateDiscriminator } from "./state.js";
/**
 * BorshCoder is the default Coder for Anchor programs implementing the
 * borsh based serialization interface.
 */
export class BorshCoder {
    constructor(idl) {
        this.instruction = new BorshInstructionCoder(idl);
        this.accounts = new BorshAccountsCoder(idl);
        this.events = new BorshEventCoder(idl);
        if (idl.state) {
            this.state = new BorshStateCoder(idl);
        }
        this.types = new BorshTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map