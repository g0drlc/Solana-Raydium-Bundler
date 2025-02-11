export declare class SendTransactionError extends Error {
    logs: string[] | undefined;
    constructor(message: string, logs?: string[]);
}
