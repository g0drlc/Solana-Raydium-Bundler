/// <reference types="node" />
import { Buffer } from "buffer";
import { Idl, IdlEvent } from "../../idl.js";
import { Event } from "../../program/event.js";
import { EventCoder } from "../index.js";
export declare class BorshEventCoder implements EventCoder {
    /**
     * Maps account type identifier to a layout.
     */
    private layouts;
    /**
     * Maps base64 encoded event discriminator to event name.
     */
    private discriminators;
    constructor(idl: Idl);
    decode<E extends IdlEvent = IdlEvent, T = Record<string, never>>(log: string): Event<E, T> | null;
}
export declare function eventDiscriminator(name: string): Buffer;
//# sourceMappingURL=event.d.ts.map