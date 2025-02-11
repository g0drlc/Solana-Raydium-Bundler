/// <reference types="node" />
import { Idl } from "../idl";
import { InstructionCoder } from "./instruction";
import { AccountsCoder } from "./accounts";
import { TypesCoder } from "./types";
import { EventCoder } from "./event";
import { StateCoder } from "./state";
export { accountSize } from "./common";
export { TypesCoder } from "./types";
export { InstructionCoder } from "./instruction";
export { AccountsCoder, accountDiscriminator, ACCOUNT_DISCRIMINATOR_SIZE, } from "./accounts";
export { EventCoder, eventDiscriminator } from "./event";
export { StateCoder, stateDiscriminator } from "./state";
/**
 * Coder provides a facade for encoding and decoding all IDL related objects.
 */
export default class Coder {
    /**
     * Instruction coder.
     */
    readonly instruction: InstructionCoder;
    /**
     * Account coder.
     */
    readonly accounts: AccountsCoder;
    /**
     * Types coder.
     */
    readonly types: TypesCoder;
    /**
     * Coder for state structs.
     */
    readonly state: StateCoder;
    /**
     * Coder for events.
     */
    readonly events: EventCoder;
    constructor(idl: Idl);
    sighash(nameSpace: string, ixName: string): Buffer;
}
//# sourceMappingURL=index.d.ts.map