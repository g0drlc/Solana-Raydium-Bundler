import * as base64 from "base64-js";
import { sha256 } from "js-sha256";
import { IdlCoder } from "./idl";
export class EventCoder {
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
        // @ts-ignore
        this.layouts = new Map(layouts);
        this.discriminators = new Map(idl.events === undefined
            ? []
            : idl.events.map((e) => [
                base64.fromByteArray(eventDiscriminator(e.name)),
                e.name,
            ]));
    }
    decode(log) {
        let logArr;
        // This will throw if log length is not a multiple of 4.
        try {
            logArr = Buffer.from(base64.toByteArray(log));
        }
        catch (e) {
            return null;
        }
        const disc = base64.fromByteArray(logArr.slice(0, 8));
        // Only deserialize if the discriminator implies a proper event.
        const eventName = this.discriminators.get(disc);
        if (eventName === undefined) {
            return null;
        }
        const layout = this.layouts.get(eventName);
        const data = layout.decode(logArr.slice(8));
        return { data, name: eventName };
    }
}
export function eventDiscriminator(name) {
    return Buffer.from(sha256.digest(`event:${name}`)).slice(0, 8);
}
//# sourceMappingURL=event.js.map