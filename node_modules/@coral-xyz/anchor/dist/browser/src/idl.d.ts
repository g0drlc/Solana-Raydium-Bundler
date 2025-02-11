/// <reference types="node" />
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
export type Idl = {
    version: string;
    name: string;
    docs?: string[];
    instructions: IdlInstruction[];
    accounts?: IdlAccountDef[];
    types?: IdlTypeDef[];
    events?: IdlEvent[];
    errors?: IdlErrorCode[];
    constants?: IdlConstant[];
    metadata?: IdlMetadata;
};
export type IdlMetadata = any;
export type IdlConstant = {
    name: string;
    type: IdlType;
    value: string;
};
export type IdlEvent = {
    name: string;
    fields: IdlEventField[];
};
export type IdlEventField = {
    name: string;
    type: IdlType;
    index: boolean;
};
export type IdlInstruction = {
    name: string;
    docs?: string[];
    accounts: IdlAccountItem[];
    args: IdlField[];
    returns?: IdlType;
};
export type IdlStateMethod = IdlInstruction;
export type IdlAccountItem = IdlAccount | IdlAccounts;
export declare function isIdlAccounts(accountItem: IdlAccountItem): accountItem is IdlAccounts;
export type IdlAccount = {
    name: string;
    isMut: boolean;
    isSigner: boolean;
    isOptional?: boolean;
    docs?: string[];
    relations?: string[];
    pda?: IdlPda;
};
export type IdlPda = {
    seeds: IdlSeed[];
    programId?: IdlSeed;
};
export type IdlSeed = any;
export type IdlAccounts = {
    name: string;
    docs?: string[];
    accounts: IdlAccountItem[];
};
export type IdlField = {
    name: string;
    docs?: string[];
    type: IdlType;
};
export type IdlTypeDef = {
    name: string;
    docs?: string[];
    type: IdlTypeDefTy;
};
export type IdlAccountDef = {
    name: string;
    docs?: string[];
    type: IdlTypeDefTyStruct;
};
export type IdlTypeDefTyStruct = {
    kind: "struct";
    fields: IdlTypeDefStruct;
};
export type IdlTypeDefTyEnum = {
    kind: "enum";
    variants: IdlEnumVariant[];
};
export type IdlTypeDefTyAlias = {
    kind: "alias";
    value: IdlType;
};
export type IdlTypeDefTy = IdlTypeDefTyEnum | IdlTypeDefTyStruct | IdlTypeDefTyAlias;
export type IdlTypeDefStruct = Array<IdlField>;
export type IdlType = "bool" | "u8" | "i8" | "u16" | "i16" | "u32" | "i32" | "f32" | "u64" | "i64" | "f64" | "u128" | "i128" | "u256" | "i256" | "bytes" | "string" | "publicKey" | IdlTypeDefined | IdlTypeOption | IdlTypeCOption | IdlTypeVec | IdlTypeArray;
export type IdlTypeDefined = {
    defined: string;
};
export type IdlTypeOption = {
    option: IdlType;
};
export type IdlTypeCOption = {
    coption: IdlType;
};
export type IdlTypeVec = {
    vec: IdlType;
};
export type IdlTypeArray = {
    array: [idlType: IdlType, size: number];
};
export type IdlEnumVariant = {
    name: string;
    fields?: IdlEnumFields;
};
export type IdlEnumFields = IdlEnumFieldsNamed | IdlEnumFieldsTuple;
export type IdlEnumFieldsNamed = IdlField[];
export type IdlEnumFieldsTuple = IdlType[];
export type IdlErrorCode = {
    code: number;
    name: string;
    msg?: string;
};
export declare function idlAddress(programId: PublicKey): Promise<PublicKey>;
export declare function seed(): string;
export interface IdlProgramAccount {
    authority: PublicKey;
    data: Buffer;
}
export declare function decodeIdlAccount(data: Buffer): IdlProgramAccount;
export declare function encodeIdlAccount(acc: IdlProgramAccount): Buffer;
//# sourceMappingURL=idl.d.ts.map