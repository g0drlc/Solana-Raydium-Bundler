import { Layout } from "buffer-layout";
import { IdlField, IdlTypeDef } from "../idl";
export declare class IdlCoder {
    static fieldLayout(field: IdlField, types?: IdlTypeDef[]): Layout;
    static typeDefLayout(typeDef: IdlTypeDef, types: IdlTypeDef[], name?: string): Layout;
}
//# sourceMappingURL=idl.d.ts.map