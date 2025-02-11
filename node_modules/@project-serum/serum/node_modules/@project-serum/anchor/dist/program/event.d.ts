import { PublicKey } from "@solana/web3.js";
import Coder from "../coder";
export declare type Event = {
    name: string;
    data: Object;
};
export declare class EventParser {
    private coder;
    private programId;
    constructor(coder: Coder, programId: PublicKey);
    parseLogs(logs: string[], callback: (log: Event) => void): void;
    private handleLog;
    private handleProgramLog;
    private handleSystemLog;
}
//# sourceMappingURL=event.d.ts.map