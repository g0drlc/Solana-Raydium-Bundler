"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorshTypesCoder = void 0;
const buffer_1 = require("buffer");
const idl_js_1 = require("./idl.js");
/**
 * Encodes and decodes user-defined types.
 */
class BorshTypesCoder {
    constructor(idl) {
        if (idl.types === undefined) {
            this.typeLayouts = new Map();
            return;
        }
        const layouts = idl.types.map((acc) => {
            return [acc.name, idl_js_1.IdlCoder.typeDefLayout(acc, idl.types)];
        });
        this.typeLayouts = new Map(layouts);
        this.idl = idl;
    }
    encode(typeName, type) {
        const buffer = buffer_1.Buffer.alloc(1000); // TODO: use a tighter buffer.
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
exports.BorshTypesCoder = BorshTypesCoder;
//# sourceMappingURL=types.js.map