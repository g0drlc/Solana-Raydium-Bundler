import { createEncoder, getEncodedSize, createDecoder, combineCodec, assertByteArrayHasEnoughBytesForCodec, transformEncoder, transformDecoder, containsBytes, isFixedSize, assertIsFixedSize, fixEncoderSize, fixDecoderSize } from '@solana/codecs-core';
import { getU32Encoder, getU32Decoder, getU8Encoder, getU8Decoder } from '@solana/codecs-numbers';
import { SolanaError, SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS, SOLANA_ERROR__CODECS__INVALID_CONSTANT, SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE, SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT, SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS, SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT, SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE } from '@solana/errors';

// src/array.ts
function assertValidNumberOfItemsForCodec(codecDescription, expected, actual) {
  if (expected !== actual) {
    throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS, {
      actual,
      codecDescription,
      expected
    });
  }
}
function maxCodecSizes(sizes) {
  return sizes.reduce(
    (all, size) => all === null || size === null ? null : Math.max(all, size),
    0
  );
}
function sumCodecSizes(sizes) {
  return sizes.reduce((all, size) => all === null || size === null ? null : all + size, 0);
}
function getFixedSize(codec) {
  return isFixedSize(codec) ? codec.fixedSize : null;
}
function getMaxSize(codec) {
  return isFixedSize(codec) ? codec.fixedSize : codec.maxSize ?? null;
}

// src/array.ts
function getArrayEncoder(item, config = {}) {
  const size = config.size ?? getU32Encoder();
  const fixedSize = computeArrayLikeCodecSize(size, getFixedSize(item));
  const maxSize = computeArrayLikeCodecSize(size, getMaxSize(item)) ?? void 0;
  return createEncoder({
    ...fixedSize !== null ? { fixedSize } : {
      getSizeFromValue: (array) => {
        const prefixSize = typeof size === "object" ? getEncodedSize(array.length, size) : 0;
        return prefixSize + [...array].reduce((all, value) => all + getEncodedSize(value, item), 0);
      },
      maxSize
    },
    write: (array, bytes, offset) => {
      if (typeof size === "number") {
        assertValidNumberOfItemsForCodec("array", size, array.length);
      }
      if (typeof size === "object") {
        offset = size.write(array.length, bytes, offset);
      }
      array.forEach((value) => {
        offset = item.write(value, bytes, offset);
      });
      return offset;
    }
  });
}
function getArrayDecoder(item, config = {}) {
  const size = config.size ?? getU32Decoder();
  const itemSize = getFixedSize(item);
  const fixedSize = computeArrayLikeCodecSize(size, itemSize);
  const maxSize = computeArrayLikeCodecSize(size, getMaxSize(item)) ?? void 0;
  return createDecoder({
    ...fixedSize !== null ? { fixedSize } : { maxSize },
    read: (bytes, offset) => {
      const array = [];
      if (typeof size === "object" && bytes.slice(offset).length === 0) {
        return [array, offset];
      }
      if (size === "remainder") {
        while (offset < bytes.length) {
          const [value, newOffset2] = item.read(bytes, offset);
          offset = newOffset2;
          array.push(value);
        }
        return [array, offset];
      }
      const [resolvedSize, newOffset] = typeof size === "number" ? [size, offset] : size.read(bytes, offset);
      offset = newOffset;
      for (let i = 0; i < resolvedSize; i += 1) {
        const [value, newOffset2] = item.read(bytes, offset);
        offset = newOffset2;
        array.push(value);
      }
      return [array, offset];
    }
  });
}
function getArrayCodec(item, config = {}) {
  return combineCodec(getArrayEncoder(item, config), getArrayDecoder(item, config));
}
function computeArrayLikeCodecSize(size, itemSize) {
  if (typeof size !== "number") return null;
  if (size === 0) return 0;
  return itemSize === null ? null : itemSize * size;
}
function getBitArrayEncoder(size, config = {}) {
  const parsedConfig = typeof config === "boolean" ? { backward: config } : config;
  const backward = parsedConfig.backward ?? false;
  return createEncoder({
    fixedSize: size,
    write(value, bytes, offset) {
      const bytesToAdd = [];
      for (let i = 0; i < size; i += 1) {
        let byte = 0;
        for (let j = 0; j < 8; j += 1) {
          const feature = Number(value[i * 8 + j] ?? 0);
          byte |= feature << (backward ? j : 7 - j);
        }
        if (backward) {
          bytesToAdd.unshift(byte);
        } else {
          bytesToAdd.push(byte);
        }
      }
      bytes.set(bytesToAdd, offset);
      return size;
    }
  });
}
function getBitArrayDecoder(size, config = {}) {
  const parsedConfig = typeof config === "boolean" ? { backward: config } : config;
  const backward = parsedConfig.backward ?? false;
  return createDecoder({
    fixedSize: size,
    read(bytes, offset) {
      assertByteArrayHasEnoughBytesForCodec("bitArray", size, bytes, offset);
      const booleans = [];
      let slice = bytes.slice(offset, offset + size);
      slice = backward ? slice.reverse() : slice;
      slice.forEach((byte) => {
        for (let i = 0; i < 8; i += 1) {
          if (backward) {
            booleans.push(Boolean(byte & 1));
            byte >>= 1;
          } else {
            booleans.push(Boolean(byte & 128));
            byte <<= 1;
          }
        }
      });
      return [booleans, offset + size];
    }
  });
}
function getBitArrayCodec(size, config = {}) {
  return combineCodec(getBitArrayEncoder(size, config), getBitArrayDecoder(size, config));
}
function getBooleanEncoder(config = {}) {
  return transformEncoder(config.size ?? getU8Encoder(), (value) => value ? 1 : 0);
}
function getBooleanDecoder(config = {}) {
  return transformDecoder(config.size ?? getU8Decoder(), (value) => Number(value) === 1);
}
function getBooleanCodec(config = {}) {
  return combineCodec(getBooleanEncoder(config), getBooleanDecoder(config));
}
function getBytesEncoder() {
  return createEncoder({
    getSizeFromValue: (value) => value.length,
    write: (value, bytes, offset) => {
      bytes.set(value, offset);
      return offset + value.length;
    }
  });
}
function getBytesDecoder() {
  return createDecoder({
    read: (bytes, offset) => {
      const slice = bytes.slice(offset);
      return [slice, offset + slice.length];
    }
  });
}
function getBytesCodec() {
  return combineCodec(getBytesEncoder(), getBytesDecoder());
}
var getBase16Decoder = () => createDecoder({
  read(bytes, offset) {
    const value = bytes.slice(offset).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    return [value, bytes.length];
  }
});
function getConstantEncoder(constant) {
  return createEncoder({
    fixedSize: constant.length,
    write: (_, bytes, offset) => {
      bytes.set(constant, offset);
      return offset + constant.length;
    }
  });
}
function getConstantDecoder(constant) {
  return createDecoder({
    fixedSize: constant.length,
    read: (bytes, offset) => {
      const base16 = getBase16Decoder();
      if (!containsBytes(bytes, constant, offset)) {
        throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_CONSTANT, {
          constant,
          data: bytes,
          hexConstant: base16.decode(constant),
          hexData: base16.decode(bytes),
          offset
        });
      }
      return [void 0, offset + constant.length];
    }
  });
}
function getConstantCodec(constant) {
  return combineCodec(getConstantEncoder(constant), getConstantDecoder(constant));
}
function getTupleEncoder(items) {
  const fixedSize = sumCodecSizes(items.map(getFixedSize));
  const maxSize = sumCodecSizes(items.map(getMaxSize)) ?? void 0;
  return createEncoder({
    ...fixedSize === null ? {
      getSizeFromValue: (value) => items.map((item, index) => getEncodedSize(value[index], item)).reduce((all, one) => all + one, 0),
      maxSize
    } : { fixedSize },
    write: (value, bytes, offset) => {
      assertValidNumberOfItemsForCodec("tuple", items.length, value.length);
      items.forEach((item, index) => {
        offset = item.write(value[index], bytes, offset);
      });
      return offset;
    }
  });
}
function getTupleDecoder(items) {
  const fixedSize = sumCodecSizes(items.map(getFixedSize));
  const maxSize = sumCodecSizes(items.map(getMaxSize)) ?? void 0;
  return createDecoder({
    ...fixedSize === null ? { maxSize } : { fixedSize },
    read: (bytes, offset) => {
      const values = [];
      items.forEach((item) => {
        const [newValue, newOffset] = item.read(bytes, offset);
        values.push(newValue);
        offset = newOffset;
      });
      return [values, offset];
    }
  });
}
function getTupleCodec(items) {
  return combineCodec(
    getTupleEncoder(items),
    getTupleDecoder(items)
  );
}
function getUnionEncoder(variants, getIndexFromValue) {
  const fixedSize = getUnionFixedSize(variants);
  const write = (variant, bytes, offset) => {
    const index = getIndexFromValue(variant);
    assertValidVariantIndex(variants, index);
    return variants[index].write(variant, bytes, offset);
  };
  if (fixedSize !== null) {
    return createEncoder({ fixedSize, write });
  }
  const maxSize = getUnionMaxSize(variants);
  return createEncoder({
    ...maxSize !== null ? { maxSize } : {},
    getSizeFromValue: (variant) => {
      const index = getIndexFromValue(variant);
      assertValidVariantIndex(variants, index);
      return getEncodedSize(variant, variants[index]);
    },
    write
  });
}
function getUnionDecoder(variants, getIndexFromBytes) {
  const fixedSize = getUnionFixedSize(variants);
  const read = (bytes, offset) => {
    const index = getIndexFromBytes(bytes, offset);
    assertValidVariantIndex(variants, index);
    return variants[index].read(bytes, offset);
  };
  if (fixedSize !== null) {
    return createDecoder({ fixedSize, read });
  }
  const maxSize = getUnionMaxSize(variants);
  return createDecoder({ ...maxSize !== null ? { maxSize } : {}, read });
}
function getUnionCodec(variants, getIndexFromValue, getIndexFromBytes) {
  return combineCodec(
    getUnionEncoder(variants, getIndexFromValue),
    getUnionDecoder(variants, getIndexFromBytes)
  );
}
function assertValidVariantIndex(variants, index) {
  if (typeof variants[index] === "undefined") {
    throw new SolanaError(SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE, {
      maxRange: variants.length - 1,
      minRange: 0,
      variant: index
    });
  }
}
function getUnionFixedSize(variants) {
  if (variants.length === 0) return 0;
  if (!isFixedSize(variants[0])) return null;
  const variantSize = variants[0].fixedSize;
  const sameSizedVariants = variants.every((variant) => isFixedSize(variant) && variant.fixedSize === variantSize);
  return sameSizedVariants ? variantSize : null;
}
function getUnionMaxSize(variants) {
  return maxCodecSizes(variants.map((variant) => getMaxSize(variant)));
}

// src/discriminated-union.ts
function getDiscriminatedUnionEncoder(variants, config = {}) {
  const discriminatorProperty = config.discriminator ?? "__kind";
  const prefix = config.size ?? getU8Encoder();
  return getUnionEncoder(
    variants.map(
      ([, variant], index) => transformEncoder(getTupleEncoder([prefix, variant]), (value) => [index, value])
    ),
    (value) => getVariantDiscriminator(variants, value[discriminatorProperty])
  );
}
function getDiscriminatedUnionDecoder(variants, config = {}) {
  const discriminatorProperty = config.discriminator ?? "__kind";
  const prefix = config.size ?? getU8Decoder();
  return getUnionDecoder(
    variants.map(
      ([discriminator, variant]) => transformDecoder(getTupleDecoder([prefix, variant]), ([, value]) => ({
        [discriminatorProperty]: discriminator,
        ...value
      }))
    ),
    (bytes, offset) => Number(prefix.read(bytes, offset)[0])
  );
}
function getDiscriminatedUnionCodec(variants, config = {}) {
  return combineCodec(
    getDiscriminatedUnionEncoder(variants, config),
    getDiscriminatedUnionDecoder(variants, config)
  );
}
function getVariantDiscriminator(variants, discriminatorValue) {
  const discriminator = variants.findIndex(([key]) => discriminatorValue === key);
  if (discriminator < 0) {
    throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT, {
      value: discriminatorValue,
      variants: variants.map(([key]) => key)
    });
  }
  return discriminator;
}
var getDataEnumEncoder = getDiscriminatedUnionEncoder;
var getDataEnumDecoder = getDiscriminatedUnionDecoder;
var getDataEnumCodec = getDiscriminatedUnionCodec;

// src/enum-helpers.ts
function getEnumStats(constructor) {
  const numericalValues = [
    ...new Set(Object.values(constructor).filter((v) => typeof v === "number"))
  ].sort();
  const enumRecord = Object.fromEntries(Object.entries(constructor).slice(numericalValues.length));
  const enumKeys = Object.keys(enumRecord);
  const enumValues = Object.values(enumRecord);
  const stringValues = [
    .../* @__PURE__ */ new Set([...enumKeys, ...enumValues.filter((v) => typeof v === "string")])
  ];
  return { enumKeys, enumRecord, enumValues, numericalValues, stringValues };
}
function getEnumIndexFromVariant({
  enumKeys,
  enumValues,
  variant
}) {
  const valueIndex = findLastIndex(enumValues, (value) => value === variant);
  if (valueIndex >= 0) return valueIndex;
  return enumKeys.findIndex((key) => key === variant);
}
function getEnumIndexFromDiscriminator({
  discriminator,
  enumKeys,
  enumValues,
  useValuesAsDiscriminators
}) {
  if (!useValuesAsDiscriminators) {
    return discriminator >= 0 && discriminator < enumKeys.length ? discriminator : -1;
  }
  return findLastIndex(enumValues, (value) => value === discriminator);
}
function findLastIndex(array, predicate) {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}
function formatNumericalValues(values) {
  if (values.length === 0) return "";
  let range = [values[0], values[0]];
  const ranges = [];
  for (let index = 1; index < values.length; index++) {
    const value = values[index];
    if (range[1] + 1 === value) {
      range[1] = value;
    } else {
      ranges.push(range[0] === range[1] ? `${range[0]}` : `${range[0]}-${range[1]}`);
      range = [value, value];
    }
  }
  ranges.push(range[0] === range[1] ? `${range[0]}` : `${range[0]}-${range[1]}`);
  return ranges.join(", ");
}

// src/enum.ts
function getEnumEncoder(constructor, config = {}) {
  const prefix = config.size ?? getU8Encoder();
  const useValuesAsDiscriminators = config.useValuesAsDiscriminators ?? false;
  const { enumKeys, enumValues, numericalValues, stringValues } = getEnumStats(constructor);
  if (useValuesAsDiscriminators && enumValues.some((value) => typeof value === "string")) {
    throw new SolanaError(SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS, {
      stringValues: enumValues.filter((v) => typeof v === "string")
    });
  }
  return transformEncoder(prefix, (variant) => {
    const index = getEnumIndexFromVariant({ enumKeys, enumValues, variant });
    if (index < 0) {
      throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT, {
        formattedNumericalValues: formatNumericalValues(numericalValues),
        numericalValues,
        stringValues,
        variant
      });
    }
    return useValuesAsDiscriminators ? enumValues[index] : index;
  });
}
function getEnumDecoder(constructor, config = {}) {
  const prefix = config.size ?? getU8Decoder();
  const useValuesAsDiscriminators = config.useValuesAsDiscriminators ?? false;
  const { enumKeys, enumValues, numericalValues } = getEnumStats(constructor);
  if (useValuesAsDiscriminators && enumValues.some((value) => typeof value === "string")) {
    throw new SolanaError(SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS, {
      stringValues: enumValues.filter((v) => typeof v === "string")
    });
  }
  return transformDecoder(prefix, (value) => {
    const discriminator = Number(value);
    const index = getEnumIndexFromDiscriminator({
      discriminator,
      enumKeys,
      enumValues,
      useValuesAsDiscriminators
    });
    if (index < 0) {
      const validDiscriminators = useValuesAsDiscriminators ? numericalValues : [...Array(enumKeys.length).keys()];
      throw new SolanaError(SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE, {
        discriminator,
        formattedValidDiscriminators: formatNumericalValues(validDiscriminators),
        validDiscriminators
      });
    }
    return enumValues[index];
  });
}
function getEnumCodec(constructor, config = {}) {
  return combineCodec(getEnumEncoder(constructor, config), getEnumDecoder(constructor, config));
}
var getScalarEnumEncoder = getEnumEncoder;
var getScalarEnumDecoder = getEnumDecoder;
var getScalarEnumCodec = getEnumCodec;
function getHiddenPrefixEncoder(encoder, prefixedEncoders) {
  return transformEncoder(
    getTupleEncoder([...prefixedEncoders, encoder]),
    (value) => [...prefixedEncoders.map(() => void 0), value]
  );
}
function getHiddenPrefixDecoder(decoder, prefixedDecoders) {
  return transformDecoder(
    getTupleDecoder([...prefixedDecoders, decoder]),
    (tuple) => tuple[tuple.length - 1]
  );
}
function getHiddenPrefixCodec(codec, prefixedCodecs) {
  return combineCodec(getHiddenPrefixEncoder(codec, prefixedCodecs), getHiddenPrefixDecoder(codec, prefixedCodecs));
}
function getHiddenSuffixEncoder(encoder, suffixedEncoders) {
  return transformEncoder(
    getTupleEncoder([encoder, ...suffixedEncoders]),
    (value) => [value, ...suffixedEncoders.map(() => void 0)]
  );
}
function getHiddenSuffixDecoder(decoder, suffixedDecoders) {
  return transformDecoder(
    getTupleDecoder([decoder, ...suffixedDecoders]),
    (tuple) => tuple[0]
  );
}
function getHiddenSuffixCodec(codec, suffixedCodecs) {
  return combineCodec(getHiddenSuffixEncoder(codec, suffixedCodecs), getHiddenSuffixDecoder(codec, suffixedCodecs));
}
function getMapEncoder(key, value, config = {}) {
  return transformEncoder(
    getArrayEncoder(getTupleEncoder([key, value]), config),
    (map) => [...map.entries()]
  );
}
function getMapDecoder(key, value, config = {}) {
  return transformDecoder(
    getArrayDecoder(getTupleDecoder([key, value]), config),
    (entries) => new Map(entries)
  );
}
function getMapCodec(key, value, config = {}) {
  return combineCodec(getMapEncoder(key, value, config), getMapDecoder(key, value, config));
}
function getUnitEncoder() {
  return createEncoder({
    fixedSize: 0,
    write: (_value, _bytes, offset) => offset
  });
}
function getUnitDecoder() {
  return createDecoder({
    fixedSize: 0,
    read: (_bytes, offset) => [void 0, offset]
  });
}
function getUnitCodec() {
  return combineCodec(getUnitEncoder(), getUnitDecoder());
}

// src/nullable.ts
function getNullableEncoder(item, config = {}) {
  const prefix = (() => {
    if (config.prefix === null) {
      return transformEncoder(getUnitEncoder(), (_boolean) => void 0);
    }
    return getBooleanEncoder({ size: config.prefix ?? getU8Encoder() });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      assertIsFixedSize(item);
      return fixEncoderSize(getUnitEncoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return getUnitEncoder();
    }
    return getConstantEncoder(config.noneValue);
  })();
  return getUnionEncoder(
    [
      transformEncoder(getTupleEncoder([prefix, noneValue]), (_value) => [
        false,
        void 0
      ]),
      transformEncoder(getTupleEncoder([prefix, item]), (value) => [true, value])
    ],
    (variant) => Number(variant !== null)
  );
}
function getNullableDecoder(item, config = {}) {
  const prefix = (() => {
    if (config.prefix === null) {
      return transformDecoder(getUnitDecoder(), () => false);
    }
    return getBooleanDecoder({ size: config.prefix ?? getU8Decoder() });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      assertIsFixedSize(item);
      return fixDecoderSize(getUnitDecoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return getUnitDecoder();
    }
    return getConstantDecoder(config.noneValue);
  })();
  return getUnionDecoder(
    [
      transformDecoder(getTupleDecoder([prefix, noneValue]), () => null),
      transformDecoder(getTupleDecoder([prefix, item]), ([, value]) => value)
    ],
    (bytes, offset) => {
      if (config.prefix === null && !config.noneValue) {
        return Number(offset < bytes.length);
      }
      if (config.prefix === null && config.noneValue != null) {
        const zeroValue = config.noneValue === "zeroes" ? new Uint8Array(noneValue.fixedSize).fill(0) : config.noneValue;
        return containsBytes(bytes, zeroValue, offset) ? 0 : 1;
      }
      return Number(prefix.read(bytes, offset)[0]);
    }
  );
}
function getNullableCodec(item, config = {}) {
  return combineCodec(
    getNullableEncoder(item, config),
    getNullableDecoder(item, config)
  );
}
function getSetEncoder(item, config = {}) {
  return transformEncoder(getArrayEncoder(item, config), (set) => [...set]);
}
function getSetDecoder(item, config = {}) {
  return transformDecoder(getArrayDecoder(item, config), (entries) => new Set(entries));
}
function getSetCodec(item, config = {}) {
  return combineCodec(getSetEncoder(item, config), getSetDecoder(item, config));
}
function getStructEncoder(fields) {
  const fieldCodecs = fields.map(([, codec]) => codec);
  const fixedSize = sumCodecSizes(fieldCodecs.map(getFixedSize));
  const maxSize = sumCodecSizes(fieldCodecs.map(getMaxSize)) ?? void 0;
  return createEncoder({
    ...fixedSize === null ? {
      getSizeFromValue: (value) => fields.map(([key, codec]) => getEncodedSize(value[key], codec)).reduce((all, one) => all + one, 0),
      maxSize
    } : { fixedSize },
    write: (struct, bytes, offset) => {
      fields.forEach(([key, codec]) => {
        offset = codec.write(struct[key], bytes, offset);
      });
      return offset;
    }
  });
}
function getStructDecoder(fields) {
  const fieldCodecs = fields.map(([, codec]) => codec);
  const fixedSize = sumCodecSizes(fieldCodecs.map(getFixedSize));
  const maxSize = sumCodecSizes(fieldCodecs.map(getMaxSize)) ?? void 0;
  return createDecoder({
    ...fixedSize === null ? { maxSize } : { fixedSize },
    read: (bytes, offset) => {
      const struct = {};
      fields.forEach(([key, codec]) => {
        const [value, newOffset] = codec.read(bytes, offset);
        offset = newOffset;
        struct[key] = value;
      });
      return [struct, offset];
    }
  });
}
function getStructCodec(fields) {
  return combineCodec(
    getStructEncoder(fields),
    getStructDecoder(fields)
  );
}

export { assertValidNumberOfItemsForCodec, getArrayCodec, getArrayDecoder, getArrayEncoder, getBitArrayCodec, getBitArrayDecoder, getBitArrayEncoder, getBooleanCodec, getBooleanDecoder, getBooleanEncoder, getBytesCodec, getBytesDecoder, getBytesEncoder, getConstantCodec, getConstantDecoder, getConstantEncoder, getDataEnumCodec, getDataEnumDecoder, getDataEnumEncoder, getDiscriminatedUnionCodec, getDiscriminatedUnionDecoder, getDiscriminatedUnionEncoder, getEnumCodec, getEnumDecoder, getEnumEncoder, getHiddenPrefixCodec, getHiddenPrefixDecoder, getHiddenPrefixEncoder, getHiddenSuffixCodec, getHiddenSuffixDecoder, getHiddenSuffixEncoder, getMapCodec, getMapDecoder, getMapEncoder, getNullableCodec, getNullableDecoder, getNullableEncoder, getScalarEnumCodec, getScalarEnumDecoder, getScalarEnumEncoder, getSetCodec, getSetDecoder, getSetEncoder, getStructCodec, getStructDecoder, getStructEncoder, getTupleCodec, getTupleDecoder, getTupleEncoder, getUnionCodec, getUnionDecoder, getUnionEncoder, getUnitCodec, getUnitDecoder, getUnitEncoder };
//# sourceMappingURL=index.native.mjs.map
//# sourceMappingURL=index.native.mjs.map