import * as base64 from "../../utils/bytes/base64.js";
import { IdlCoder } from "./idl.js";
import { discriminator } from "./discriminator.js";
export class BorshEventCoder {
    constructor(idl) {
        if (idl.events === undefined) {
            this.layouts = new Map();
            return;
        }
        const layouts = idl.events.map((event) => {
            let eventTypeDef = {
                name: event.name,
                type: {
                    kind: "struct",
                    fields: event.fields.map((f) => {
                        return { name: f.name, type: f.type };
                    }),
                },
            };
            return [event.name, IdlCoder.typeDefLayout(eventTypeDef, idl.types)];
        });
        this.layouts = new Map(layouts);
        this.discriminators = new Map(idl.events === undefined
            ? []
            : idl.events.map((e) => [
                base64.encode(eventDiscriminator(e.name)),
                e.name,
            ]));
    }
    decode(log) {
        let logArr;
        // This will throw if log length is not a multiple of 4.
        try {
            logArr = base64.decode(log);
        }
        catch (e) {
            return null;
        }
        const disc = base64.encode(logArr.slice(0, 8));
        // Only deserialize if the discriminator implies a proper event.
        const eventName = this.discriminators.get(disc);
        if (eventName === undefined) {
            return null;
        }
        const layout = this.layouts.get(eventName);
        if (!layout) {
            throw new Error(`Unknown event: ${eventName}`);
        }
        const data = layout.decode(logArr.slice(8));
        return { data, name: eventName };
    }
}
export function eventDiscriminator(name) {
    return discriminator(`event:${name}`);
}
//# sourceMappingURL=event.js.map