/// <reference types="node" />
import { Idl } from "../idl";
import { Event } from "../program/event";
export declare class EventCoder {
    /**
     * Maps account type identifier to a layout.
     */
    private layouts;
    /**
     * Maps base64 encoded event discriminator to event name.
     */
    private discriminators;
    constructor(idl: Idl);
    decode(log: string): Event | null;
}
export declare function eventDiscriminator(name: string): Buffer;
//# sourceMappingURL=event.d.ts.map