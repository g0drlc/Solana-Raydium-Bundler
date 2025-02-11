import { PublicKey } from "@solana/web3.js";
import { IdlEvent, IdlEventField } from "../idl.js";
import { Coder } from "../coder/index.js";
import { DecodeType } from "./namespace/types.js";
import Provider from "../provider.js";
export type Event<E extends IdlEvent = IdlEvent, Defined = Record<string, never>> = {
    name: E["name"];
    data: EventData<E["fields"][number], Defined>;
};
export type EventData<T extends IdlEventField, Defined> = {
    [N in T["name"]]: DecodeType<(T & {
        name: N;
    })["type"], Defined>;
};
export declare class EventManager {
    /**
     * Program ID for event subscriptions.
     */
    private _programId;
    /**
     * Network and wallet provider.
     */
    private _provider;
    /**
     * Event parser to handle onLogs callbacks.
     */
    private _eventParser;
    /**
     * Maps event listener id to [event-name, callback].
     */
    private _eventCallbacks;
    /**
     * Maps event name to all listeners for the event.
     */
    private _eventListeners;
    /**
     * The next listener id to allocate.
     */
    private _listenerIdCount;
    /**
     * The subscription id from the connection onLogs subscription.
     */
    private _onLogsSubscriptionId;
    constructor(programId: PublicKey, provider: Provider, coder: Coder);
    addEventListener(eventName: string, callback: (event: any, slot: number, signature: string) => void): number;
    removeEventListener(listener: number): Promise<void>;
}
export declare class EventParser {
    private coder;
    private programId;
    constructor(programId: PublicKey, coder: Coder);
    parseLogs(logs: string[], errorOnDecodeFailure?: boolean): Generator<Event<IdlEvent, Record<string, never>>, void, unknown>;
    private handleLog;
    private handleProgramLog;
    private handleSystemLog;
}
//# sourceMappingURL=event.d.ts.map