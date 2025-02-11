/// <reference types="node" />
import { Idl } from "../idl";
export declare class StateCoder {
    private layout;
    constructor(idl: Idl);
    encode<T = any>(name: string, account: T): Promise<Buffer>;
    decode<T = any>(ix: Buffer): T;
}
export declare function stateDiscriminator(name: string): Promise<Buffer>;
//# sourceMappingURL=state.d.ts.map