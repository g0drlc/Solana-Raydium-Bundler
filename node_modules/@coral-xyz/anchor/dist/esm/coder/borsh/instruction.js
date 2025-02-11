import bs58 from "bs58";
import { Buffer } from "buffer";
import camelCase from "camelcase";
import { snakeCase } from "snake-case";
import * as borsh from "@coral-xyz/borsh";
import { IdlCoder } from "./idl.js";
import { sha256 } from "@noble/hashes/sha256";
/**
 * Namespace for global instruction function signatures (i.e. functions
 * that aren't namespaced by the state or any of its trait implementations).
 */
export const SIGHASH_GLOBAL_NAMESPACE = "global";
/**
 * Encodes and decodes program instructions.
 */
export class BorshInstructionCoder {
    constructor(idl) {
        this.idl = idl;
        this.ixLayout = BorshInstructionCoder.parseIxLayout(idl);
        const sighashLayouts = new Map();
        idl.instructions.forEach((ix) => {
            const sh = sighash(SIGHASH_GLOBAL_NAMESPACE, ix.name);
            sighashLayouts.set(bs58.encode(sh), {
                layout: this.ixLayout.get(ix.name),
                name: ix.name,
            });
        });
        this.sighashLayouts = sighashLayouts;
    }
    /**
     * Encodes a program instruction.
     */
    encode(ixName, ix) {
        return this._encode(SIGHASH_GLOBAL_NAMESPACE, ixName, ix);
    }
    _encode(nameSpace, ixName, ix) {
        const buffer = Buffer.alloc(1000); // TODO: use a tighter buffer.
        const methodName = camelCase(ixName);
        const layout = this.ixLayout.get(methodName);
        if (!layout) {
            throw new Error(`Unknown method: ${methodName}`);
        }
        const len = layout.encode(ix, buffer);
        const data = buffer.slice(0, len);
        return Buffer.concat([sighash(nameSpace, ixName), data]);
    }
    static parseIxLayout(idl) {
        const ixLayouts = idl.instructions.map((ix) => {
            let fieldLayouts = ix.args.map((arg) => {
                var _a, _b;
                return IdlCoder.fieldLayout(arg, Array.from([...((_a = idl.accounts) !== null && _a !== void 0 ? _a : []), ...((_b = idl.types) !== null && _b !== void 0 ? _b : [])]));
            });
            const name = camelCase(ix.name);
            return [name, borsh.struct(fieldLayouts, name)];
        });
        return new Map(ixLayouts);
    }
    /**
     * Decodes a program instruction.
     */
    decode(ix, encoding = "hex") {
        if (typeof ix === "string") {
            ix = encoding === "hex" ? Buffer.from(ix, "hex") : bs58.decode(ix);
        }
        let sighash = bs58.encode(ix.slice(0, 8));
        let data = ix.slice(8);
        const decoder = this.sighashLayouts.get(sighash);
        if (!decoder) {
            return null;
        }
        return {
            data: decoder.layout.decode(data),
            name: decoder.name,
        };
    }
    /**
     * Returns a formatted table of all the fields in the given instruction data.
     */
    format(ix, accountMetas) {
        return InstructionFormatter.format(ix, accountMetas, this.idl);
    }
}
class InstructionFormatter {
    static format(ix, accountMetas, idl) {
        const idlIx = idl.instructions.filter((i) => ix.name === i.name)[0];
        if (idlIx === undefined) {
            console.error("Invalid instruction given");
            return null;
        }
        const args = idlIx.args.map((idlField) => {
            return {
                name: idlField.name,
                type: InstructionFormatter.formatIdlType(idlField.type),
                data: InstructionFormatter.formatIdlData(idlField, ix.data[idlField.name], idl.types),
            };
        });
        const flatIdlAccounts = InstructionFormatter.flattenIdlAccounts(idlIx.accounts);
        const accounts = accountMetas.map((meta, idx) => {
            if (idx < flatIdlAccounts.length) {
                return {
                    name: flatIdlAccounts[idx].name,
                    ...meta,
                };
            }
            // "Remaining accounts" are unnamed in Anchor.
            else {
                return {
                    name: undefined,
                    ...meta,
                };
            }
        });
        return {
            args,
            accounts,
        };
    }
    static formatIdlType(idlType) {
        if (typeof idlType === "string") {
            return idlType;
        }
        if ("vec" in idlType) {
            return `Vec<${this.formatIdlType(idlType.vec)}>`;
        }
        if ("option" in idlType) {
            return `Option<${this.formatIdlType(idlType.option)}>`;
        }
        if ("defined" in idlType) {
            return idlType.defined;
        }
        if ("array" in idlType) {
            return `Array<${idlType.array[0]}; ${idlType.array[1]}>`;
        }
        throw new Error(`Unknown IDL type: ${idlType}`);
    }
    static formatIdlData(idlField, data, types) {
        if (typeof idlField.type === "string") {
            return data.toString();
        }
        if (idlField.type.hasOwnProperty("vec")) {
            return ("[" +
                data
                    .map((d) => this.formatIdlData({ name: "", type: idlField.type.vec }, d))
                    .join(", ") +
                "]");
        }
        if (idlField.type.hasOwnProperty("option")) {
            return data === null
                ? "null"
                : this.formatIdlData({ name: "", type: idlField.type.option }, data, types);
        }
        if (idlField.type.hasOwnProperty("defined")) {
            if (types === undefined) {
                throw new Error("User defined types not provided");
            }
            const filtered = types.filter((t) => t.name === idlField.type.defined);
            if (filtered.length !== 1) {
                throw new Error(`Type not found: ${idlField.type.defined}`);
            }
            return InstructionFormatter.formatIdlDataDefined(filtered[0], data, types);
        }
        return "unknown";
    }
    static formatIdlDataDefined(typeDef, data, types) {
        switch (typeDef.type.kind) {
            case "struct": {
                const struct = typeDef.type;
                const fields = Object.keys(data)
                    .map((k) => {
                    const field = struct.fields.find((f) => f.name === k);
                    if (!field) {
                        throw new Error("Unable to find type");
                    }
                    return (k +
                        ": " +
                        InstructionFormatter.formatIdlData(field, data[k], types));
                })
                    .join(", ");
                return "{ " + fields + " }";
            }
            case "enum": {
                if (typeDef.type.variants.length === 0) {
                    return "{}";
                }
                // Struct enum.
                if (typeDef.type.variants[0].name) {
                    const variants = typeDef.type.variants;
                    const variant = Object.keys(data)[0];
                    const enumType = data[variant];
                    const namedFields = Object.keys(enumType)
                        .map((f) => {
                        var _a;
                        const fieldData = enumType[f];
                        const idlField = (_a = variants[variant]) === null || _a === void 0 ? void 0 : _a.find((v) => v.name === f);
                        if (!idlField) {
                            throw new Error("Unable to find variant");
                        }
                        return (f +
                            ": " +
                            InstructionFormatter.formatIdlData(idlField, fieldData, types));
                    })
                        .join(", ");
                    const variantName = camelCase(variant, { pascalCase: true });
                    if (namedFields.length === 0) {
                        return variantName;
                    }
                    return `${variantName} { ${namedFields} }`;
                }
                // Tuple enum.
                else {
                    // TODO.
                    return "Tuple formatting not yet implemented";
                }
            }
            case "alias": {
                return InstructionFormatter.formatIdlType(typeDef.type.value);
            }
        }
    }
    static flattenIdlAccounts(accounts, prefix) {
        return accounts
            .map((account) => {
            const accName = sentenceCase(account.name);
            if (account.hasOwnProperty("accounts")) {
                const newPrefix = prefix ? `${prefix} > ${accName}` : accName;
                return InstructionFormatter.flattenIdlAccounts(account.accounts, newPrefix);
            }
            else {
                return {
                    ...account,
                    name: prefix ? `${prefix} > ${accName}` : accName,
                };
            }
        })
            .flat();
    }
}
function sentenceCase(field) {
    const result = field.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}
// Not technically sighash, since we don't include the arguments, as Rust
// doesn't allow function overloading.
function sighash(nameSpace, ixName) {
    let name = snakeCase(ixName);
    let preimage = `${nameSpace}:${name}`;
    return Buffer.from(sha256(preimage).slice(0, 8));
}
//# sourceMappingURL=instruction.js.map