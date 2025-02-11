interface IRPCError {
    code: number;
    message: string;
    data?: string;
}
export interface DataPack<T, R extends string | ArrayBufferLike | Blob | ArrayBufferView> {
    encode(value: T): R;
    decode(value: R): T;
}
export declare class DefaultDataPack implements DataPack<Object, string> {
    encode(value: Object): string;
    decode(value: string): Object;
}
/**
 * Creates a JSON-RPC 2.0-compliant error.
 * @param {Number} code - error code
 * @param {String} details - error details
 * @return {Object}
 */
declare function createError(code: number, details?: string): IRPCError;
export { createError };
