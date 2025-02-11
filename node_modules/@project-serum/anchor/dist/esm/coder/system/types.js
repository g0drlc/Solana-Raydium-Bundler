export class SystemTypesCoder {
    constructor(_idl) { }
    encode(_name, _type) {
        throw new Error("System does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("System does not have user-defined types");
    }
}
//# sourceMappingURL=types.js.map