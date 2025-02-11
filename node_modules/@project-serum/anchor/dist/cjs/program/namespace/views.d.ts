import { PublicKey } from "@solana/web3.js";
import { Idl } from "../../idl.js";
import { SimulateFn } from "./simulate.js";
import { AllInstructions, InstructionContextFn, MakeInstructionsNamespace } from "./types";
export default class ViewFactory {
    static build<IDL extends Idl, I extends AllInstructions<IDL>>(programId: PublicKey, idlIx: AllInstructions<IDL>, simulateFn: SimulateFn<IDL>, idl: IDL): ViewFn<IDL, I> | undefined;
}
export type ViewNamespace<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = MakeInstructionsNamespace<IDL, I, Promise<any>>;
/**
 * ViewFn is a single method generated from an IDL. It simulates a method
 * against a cluster configured by the provider, and then parses the events
 * and extracts return data from the raw logs emitted during the simulation.
 */
export type ViewFn<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = InstructionContextFn<IDL, I, Promise<any>>;
//# sourceMappingURL=views.d.ts.map