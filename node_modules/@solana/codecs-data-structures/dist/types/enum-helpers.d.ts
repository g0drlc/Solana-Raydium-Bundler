/**
 * Defines the "lookup object" of an enum.
 *
 * @example
 * ```ts
 * enum Direction { Left, Right };
 * ```
 */
export type EnumLookupObject = {
    [key: string]: number | string;
};
/**
 * Returns the allowed input for an enum.
 *
 * @example
 * ```ts
 * enum Direction { Left, Right };
 * type DirectionInput = GetEnumFrom<Direction>; // "Left" | "Right" | 0 | 1
 * ```
 */
export type GetEnumFrom<TEnum extends EnumLookupObject> = TEnum[keyof TEnum] | keyof TEnum;
/**
 * Returns all the available variants of an enum.
 *
 * @example
 * ```ts
 * enum Direction { Left, Right };
 * type DirectionOutput = GetEnumTo<Direction>; // 0 | 1
 * ```
 */
export type GetEnumTo<TEnum extends EnumLookupObject> = TEnum[keyof TEnum];
export declare function getEnumStats(constructor: EnumLookupObject): {
    enumKeys: string[];
    enumRecord: Record<string, string | number>;
    enumValues: (string | number)[];
    numericalValues: number[];
    stringValues: string[];
};
export declare function getEnumIndexFromVariant({ enumKeys, enumValues, variant, }: {
    enumKeys: string[];
    enumValues: (number | string)[];
    variant: number | string | symbol;
}): number;
export declare function getEnumIndexFromDiscriminator({ discriminator, enumKeys, enumValues, useValuesAsDiscriminators, }: {
    discriminator: number;
    enumKeys: string[];
    enumValues: (number | string)[];
    useValuesAsDiscriminators: boolean;
}): number;
export declare function formatNumericalValues(values: number[]): string;
//# sourceMappingURL=enum-helpers.d.ts.map