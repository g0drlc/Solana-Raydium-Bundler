import { IdlCoder } from "./idl";
/**
 * Encodes and decodes user defined types.
 */
export class TypesCoder {
    constructor(idl) {
        if (idl.types === undefined) {
            this.layouts = new Map();
            return;
        }
        const layouts = idl.types.map((acc) => {
            return [acc.name, IdlCoder.typeDefLayout(acc, idl.types)];
        });
        // @ts-ignore
        this.layouts = new Map(layouts);
    }
    encode(accountName, account) {
        const buffer = Buffer.alloc(1000); // TODO: use a tighter buffer.
        const layout = this.layouts.get(accountName);
        const len = layout.encode(account, buffer);
        return buffer.slice(0, len);
    }
    decode(accountName, ix) {
        const layout = this.layouts.get(accountName);
        return layout.decode(ix);
    }
}
//# sourceMappingURL=types.js.map