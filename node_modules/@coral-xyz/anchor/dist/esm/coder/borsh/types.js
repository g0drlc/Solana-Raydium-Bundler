import { Buffer } from "buffer";
import { IdlCoder } from "./idl.js";
/**
 * Encodes and decodes user-defined types.
 */
export class BorshTypesCoder {
    constructor(idl) {
        if (idl.types === undefined) {
            this.typeLayouts = new Map();
            return;
        }
        const layouts = idl.types.map((acc) => {
            return [acc.name, IdlCoder.typeDefLayout(acc, idl.types)];
        });
        this.typeLayouts = new Map(layouts);
        this.idl = idl;
    }
    encode(typeName, type) {
        const buffer = Buffer.alloc(1000); // TODO: use a tighter buffer.
        const layout = this.typeLayouts.get(typeName);
        if (!layout) {
            throw new Error(`Unknown type: ${typeName}`);
        }
        const len = layout.encode(type, buffer);
        return buffer.slice(0, len);
    }
    decode(typeName, typeData) {
        const layout = this.typeLayouts.get(typeName);
        if (!layout) {
            throw new Error(`Unknown type: ${typeName}`);
        }
        return layout.decode(typeData);
    }
}
//# sourceMappingURL=types.js.map