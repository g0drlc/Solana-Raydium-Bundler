"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sighash = exports.accountSize = void 0;
const snake_case_1 = require("snake-case");
const js_sha256_1 = require("js-sha256");
const error_1 = require("../error");
function accountSize(idl, idlAccount) {
    if (idlAccount.type.kind === "enum") {
        let variantSizes = idlAccount.type.variants.map((variant) => {
            if (variant.fields === undefined) {
                return 0;
            }
            return (variant.fields
                // @ts-ignore
                .map((f) => {
                // @ts-ignore
                if (f.name === undefined) {
                    throw new Error("Tuple enum variants not yet implemented.");
                }
                // @ts-ignore
                return typeSize(idl, f.type);
            })
                .reduce((a, b) => a + b));
        });
        return Math.max(...variantSizes) + 1;
    }
    if (idlAccount.type.fields === undefined) {
        return 0;
    }
    return idlAccount.type.fields
        .map((f) => typeSize(idl, f.type))
        .reduce((a, b) => a + b);
}
exports.accountSize = accountSize;
// Returns the size of the type in bytes. For variable length types, just return
// 1. Users should override this value in such cases.
function typeSize(idl, ty) {
    switch (ty) {
        case "bool":
            return 1;
        case "u8":
            return 1;
        case "i8":
            return 1;
        case "i16":
            return 2;
        case "u16":
            return 2;
        case "u32":
            return 4;
        case "i32":
            return 4;
        case "u64":
            return 8;
        case "i64":
            return 8;
        case "u128":
            return 16;
        case "i128":
            return 16;
        case "bytes":
            return 1;
        case "string":
            return 1;
        case "publicKey":
            return 32;
        default:
            // @ts-ignore
            if (ty.vec !== undefined) {
                return 1;
            }
            // @ts-ignore
            if (ty.option !== undefined) {
                // @ts-ignore
                return 1 + typeSize(idl, ty.option);
            }
            // @ts-ignore
            if (ty.defined !== undefined) {
                // @ts-ignore
                const filtered = idl.types.filter((t) => t.name === ty.defined);
                if (filtered.length !== 1) {
                    throw new error_1.IdlError(`Type not found: ${JSON.stringify(ty)}`);
                }
                let typeDef = filtered[0];
                return accountSize(idl, typeDef);
            }
            // @ts-ignore
            if (ty.array !== undefined) {
                // @ts-ignore
                let arrayTy = ty.array[0];
                // @ts-ignore
                let arraySize = ty.array[1];
                // @ts-ignore
                return typeSize(idl, arrayTy) * arraySize;
            }
            throw new Error(`Invalid type ${JSON.stringify(ty)}`);
    }
}
// Not technically sighash, since we don't include the arguments, as Rust
// doesn't allow function overloading.
function sighash(nameSpace, ixName) {
    let name = snake_case_1.snakeCase(ixName);
    let preimage = `${nameSpace}:${name}`;
    return Buffer.from(js_sha256_1.sha256.digest(preimage)).slice(0, 8);
}
exports.sighash = sighash;
//# sourceMappingURL=common.js.map