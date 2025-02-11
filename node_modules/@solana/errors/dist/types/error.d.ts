import { SolanaErrorCode, SolanaErrorCodeWithCause } from './codes';
import { SolanaErrorContext } from './context';
export declare function isSolanaError<TErrorCode extends SolanaErrorCode>(e: unknown, code?: TErrorCode): e is SolanaError<TErrorCode>;
type SolanaErrorCodedContext = Readonly<{
    [P in SolanaErrorCode]: (SolanaErrorContext[P] extends undefined ? object : SolanaErrorContext[P]) & {
        __code: P;
    };
}>;
export declare class SolanaError<TErrorCode extends SolanaErrorCode = SolanaErrorCode> extends Error {
    readonly cause?: TErrorCode extends SolanaErrorCodeWithCause ? SolanaError : unknown;
    readonly context: SolanaErrorCodedContext[TErrorCode];
    constructor(...[code, contextAndErrorOptions]: SolanaErrorContext[TErrorCode] extends undefined ? [code: TErrorCode, errorOptions?: ErrorOptions | undefined] : [code: TErrorCode, contextAndErrorOptions: SolanaErrorContext[TErrorCode] & (ErrorOptions | undefined)]);
}
export {};
//# sourceMappingURL=error.d.ts.map