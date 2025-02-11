import { Infer, Struct } from '../struct.js';
import { ObjectSchema, ObjectType, AnyStruct, InferStructTuple, UnionToIntersection } from '../utils.js';
/**
 * Ensure that any value passes validation.
 */
export declare function any(): Struct<any, null>;
/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 */
export declare function array<T extends Struct<any>>(Element: T): Struct<Infer<T>[], T>;
export declare function array(): Struct<unknown[], undefined>;
/**
 * Ensure that a value is a bigint.
 */
export declare function bigint(): Struct<bigint, null>;
/**
 * Ensure that a value is a boolean.
 */
export declare function boolean(): Struct<boolean, null>;
/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 */
export declare function date(): Struct<Date, null>;
/**
 * Ensure that a value is one of a set of potential values.
 *
 * Note: after creating the struct, you can access the definition of the
 * potential values as `struct.schema`.
 */
export declare function enums<U extends number, T extends readonly U[]>(values: T): Struct<T[number], {
    [K in T[number]]: K;
}>;
export declare function enums<U extends string, T extends readonly U[]>(values: T): Struct<T[number], {
    [K in T[number]]: K;
}>;
/**
 * Ensure that a value is a function.
 */
export declare function func(): Struct<Function, null>;
/**
 * Ensure that a value is an instance of a specific class.
 */
export declare function instance<T extends {
    new (...args: any): any;
}>(Class: T): Struct<InstanceType<T>, null>;
/**
 * Ensure that a value is an integer.
 */
export declare function integer(): Struct<number, null>;
/**
 * Ensure that a value matches all of a set of types.
 */
export declare function intersection<A extends AnyStruct, B extends AnyStruct[]>(Structs: [A, ...B]): Struct<Infer<A> & UnionToIntersection<InferStructTuple<B>[number]>, null>;
/**
 * Ensure that a value is an exact value, using `===` for comparison.
 */
export declare function literal<T extends boolean>(constant: T): Struct<T, T>;
export declare function literal<T extends number>(constant: T): Struct<T, T>;
export declare function literal<T extends string>(constant: T): Struct<T, T>;
export declare function literal<T>(constant: T): Struct<T, null>;
/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 */
export declare function map(): Struct<Map<unknown, unknown>, null>;
export declare function map<K, V>(Key: Struct<K>, Value: Struct<V>): Struct<Map<K, V>, null>;
/**
 * Ensure that no value ever passes validation.
 */
export declare function never(): Struct<never, null>;
/**
 * Augment an existing struct to allow `null` values.
 */
export declare function nullable<T, S>(struct: Struct<T, S>): Struct<T | null, S>;
/**
 * Ensure that a value is a number.
 */
export declare function number(): Struct<number, null>;
/**
 * Ensure that a value is an object, that is has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 */
export declare function object(): Struct<Record<string, unknown>, null>;
export declare function object<S extends ObjectSchema>(schema: S): Struct<ObjectType<S>, S>;
/**
 * Augment a struct to allow `undefined` values.
 */
export declare function optional<T, S>(struct: Struct<T, S>): Struct<T | undefined, S>;
/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */
export declare function record<K extends string, V>(Key: Struct<K>, Value: Struct<V>): Struct<Record<K, V>, null>;
/**
 * Ensure that a value is a `RegExp`.
 *
 * Note: this does not test the value against the regular expression! For that
 * you need to use the `pattern()` refinement.
 */
export declare function regexp(): Struct<RegExp, null>;
/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 */
export declare function set(): Struct<Set<unknown>, null>;
export declare function set<T>(Element: Struct<T>): Struct<Set<T>, null>;
/**
 * Ensure that a value is a string.
 */
export declare function string(): Struct<string, null>;
/**
 * Ensure that a value is a tuple of a specific length, and that each of its
 * elements is of a specific type.
 */
export declare function tuple<A extends AnyStruct, B extends AnyStruct[]>(Structs: [A, ...B]): Struct<[Infer<A>, ...InferStructTuple<B>], null>;
/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 */
export declare function type<S extends ObjectSchema>(schema: S): Struct<ObjectType<S>, S>;
/**
 * Ensure that a value matches one of a set of types.
 */
export declare function union<A extends AnyStruct, B extends AnyStruct[]>(Structs: [A, ...B]): Struct<Infer<A> | InferStructTuple<B>[number], null>;
/**
 * Ensure that any value passes validation, without widening its type to `any`.
 */
export declare function unknown(): Struct<unknown, null>;
//# sourceMappingURL=types.d.ts.map