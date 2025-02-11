import { Option } from './option';
/**
 * Unwraps the value of an {@link Option} of type `T`
 * or returns a fallback value that defaults to `null`.
 */
export declare function unwrapOption<T>(option: Option<T>): T | null;
export declare function unwrapOption<T, U>(option: Option<T>, fallback: () => U): T | U;
/**
 * Wraps a nullable value into an {@link Option}.
 */
export declare const wrapNullable: <T>(nullable: T | null) => Option<T>;
//# sourceMappingURL=unwrap-option.d.ts.map