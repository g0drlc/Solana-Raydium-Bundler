import { None, Some } from './option';
/**
 * Lists all types that should not be recursively unwrapped.
 *
 * @see {@link UnwrappedOption}
 */
type UnUnwrappables = Date | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | bigint | boolean | number | string | symbol | null | undefined;
/**
 * A type that defines the recursive unwrapping of a type `T`
 * such that all nested {@link Option} types are unwrapped.
 *
 * For each nested {@link Option} type, if the option is a {@link Some},
 * it returns the type of its value, otherwise, it returns the provided
 * fallback type `U` which defaults to `null`.
 */
export type UnwrappedOption<T, U = null> = T extends Some<infer TValue> ? UnwrappedOption<TValue, U> : T extends None ? U : T extends UnUnwrappables ? T : T extends object ? {
    [key in keyof T]: UnwrappedOption<T[key], U>;
} : T extends Array<infer TItem> ? Array<UnwrappedOption<TItem, U>> : T;
/**
 * Recursively go through a type `T` such that all
 * nested {@link Option} types are unwrapped.
 *
 * For each nested {@link Option} type, if the option is a {@link Some},
 * it returns its value, otherwise, it returns the provided fallback value
 * which defaults to `null`.
 */
export declare function unwrapOptionRecursively<T>(input: T): UnwrappedOption<T>;
export declare function unwrapOptionRecursively<T, U>(input: T, fallback: () => U): UnwrappedOption<T, U>;
export {};
//# sourceMappingURL=unwrap-option-recursively.d.ts.map