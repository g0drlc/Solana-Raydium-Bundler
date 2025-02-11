'use strict';

var codecsCore = require('@solana/codecs-core');
var codecsNumbers = require('@solana/codecs-numbers');
var errors = require('@solana/errors');

// src/array.ts
function assertValidNumberOfItemsForCodec(codecDescription, expected, actual) {
  if (expected !== actual) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS, {
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
  return codecsCore.isFixedSize(codec) ? codec.fixedSize : null;
}
function getMaxSize(codec) {
  return codecsCore.isFixedSize(codec) ? codec.fixedSize : codec.maxSize ?? null;
}

// src/array.ts
function getArrayEncoder(item, config = {}) {
  const size = config.size ?? codecsNumbers.getU32Encoder();
  const fixedSize = computeArrayLikeCodecSize(size, getFixedSize(item));
  const maxSize = computeArrayLikeCodecSize(size, getMaxSize(item)) ?? void 0;
  return codecsCore.createEncoder({
    ...fixedSize !== null ? { fixedSize } : {
      getSizeFromValue: (array) => {
        const prefixSize = typeof size === "object" ? codecsCore.getEncodedSize(array.length, size) : 0;
        return prefixSize + [...array].reduce((all, value) => all + codecsCore.getEncodedSize(value, item), 0);
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
  const size = config.size ?? codecsNumbers.getU32Decoder();
  const itemSize = getFixedSize(item);
  const fixedSize = computeArrayLikeCodecSize(size, itemSize);
  const maxSize = computeArrayLikeCodecSize(size, getMaxSize(item)) ?? void 0;
  return codecsCore.createDecoder({
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
  return codecsCore.combineCodec(getArrayEncoder(item, config), getArrayDecoder(item, config));
}
function computeArrayLikeCodecSize(size, itemSize) {
  if (typeof size !== "number") return null;
  if (size === 0) return 0;
  return itemSize === null ? null : itemSize * size;
}
function getBitArrayEncoder(size, config = {}) {
  const parsedConfig = typeof config === "boolean" ? { backward: config } : config;
  const backward = parsedConfig.backward ?? false;
  return codecsCore.createEncoder({
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
  return codecsCore.createDecoder({
    fixedSize: size,
    read(bytes, offset) {
      codecsCore.assertByteArrayHasEnoughBytesForCodec("bitArray", size, bytes, offset);
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
  return codecsCore.combineCodec(getBitArrayEncoder(size, config), getBitArrayDecoder(size, config));
}
function getBooleanEncoder(config = {}) {
  return codecsCore.transformEncoder(config.size ?? codecsNumbers.getU8Encoder(), (value) => value ? 1 : 0);
}
function getBooleanDecoder(config = {}) {
  return codecsCore.transformDecoder(config.size ?? codecsNumbers.getU8Decoder(), (value) => Number(value) === 1);
}
function getBooleanCodec(config = {}) {
  return codecsCore.combineCodec(getBooleanEncoder(config), getBooleanDecoder(config));
}
function getBytesEncoder() {
  return codecsCore.createEncoder({
    getSizeFromValue: (value) => value.length,
    write: (value, bytes, offset) => {
      bytes.set(value, offset);
      return offset + value.length;
    }
  });
}
function getBytesDecoder() {
  return codecsCore.createDecoder({
    read: (bytes, offset) => {
      const slice = bytes.slice(offset);
      return [slice, offset + slice.length];
    }
  });
}
function getBytesCodec() {
  return codecsCore.combineCodec(getBytesEncoder(), getBytesDecoder());
}
var getBase16Decoder = () => codecsCore.createDecoder({
  read(bytes, offset) {
    const value = bytes.slice(offset).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    return [value, bytes.length];
  }
});
function getConstantEncoder(constant) {
  return codecsCore.createEncoder({
    fixedSize: constant.length,
    write: (_, bytes, offset) => {
      bytes.set(constant, offset);
      return offset + constant.length;
    }
  });
}
function getConstantDecoder(constant) {
  return codecsCore.createDecoder({
    fixedSize: constant.length,
    read: (bytes, offset) => {
      const base16 = getBase16Decoder();
      if (!codecsCore.containsBytes(bytes, constant, offset)) {
        throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_CONSTANT, {
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
  return codecsCore.combineCodec(getConstantEncoder(constant), getConstantDecoder(constant));
}
function getTupleEncoder(items) {
  const fixedSize = sumCodecSizes(items.map(getFixedSize));
  const maxSize = sumCodecSizes(items.map(getMaxSize)) ?? void 0;
  return codecsCore.createEncoder({
    ...fixedSize === null ? {
      getSizeFromValue: (value) => items.map((item, index) => codecsCore.getEncodedSize(value[index], item)).reduce((all, one) => all + one, 0),
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
  return codecsCore.createDecoder({
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
  return codecsCore.combineCodec(
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
    return codecsCore.createEncoder({ fixedSize, write });
  }
  const maxSize = getUnionMaxSize(variants);
  return codecsCore.createEncoder({
    ...maxSize !== null ? { maxSize } : {},
    getSizeFromValue: (variant) => {
      const index = getIndexFromValue(variant);
      assertValidVariantIndex(variants, index);
      return codecsCore.getEncodedSize(variant, variants[index]);
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
    return codecsCore.createDecoder({ fixedSize, read });
  }
  const maxSize = getUnionMaxSize(variants);
  return codecsCore.createDecoder({ ...maxSize !== null ? { maxSize } : {}, read });
}
function getUnionCodec(variants, getIndexFromValue, getIndexFromBytes) {
  return codecsCore.combineCodec(
    getUnionEncoder(variants, getIndexFromValue),
    getUnionDecoder(variants, getIndexFromBytes)
  );
}
function assertValidVariantIndex(variants, index) {
  if (typeof variants[index] === "undefined") {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE, {
      maxRange: variants.length - 1,
      minRange: 0,
      variant: index
    });
  }
}
function getUnionFixedSize(variants) {
  if (variants.length === 0) return 0;
  if (!codecsCore.isFixedSize(variants[0])) return null;
  const variantSize = variants[0].fixedSize;
  const sameSizedVariants = variants.every((variant) => codecsCore.isFixedSize(variant) && variant.fixedSize === variantSize);
  return sameSizedVariants ? variantSize : null;
}
function getUnionMaxSize(variants) {
  return maxCodecSizes(variants.map((variant) => getMaxSize(variant)));
}

// src/discriminated-union.ts
function getDiscriminatedUnionEncoder(variants, config = {}) {
  const discriminatorProperty = config.discriminator ?? "__kind";
  const prefix = config.size ?? codecsNumbers.getU8Encoder();
  return getUnionEncoder(
    variants.map(
      ([, variant], index) => codecsCore.transformEncoder(getTupleEncoder([prefix, variant]), (value) => [index, value])
    ),
    (value) => getVariantDiscriminator(variants, value[discriminatorProperty])
  );
}
function getDiscriminatedUnionDecoder(variants, config = {}) {
  const discriminatorProperty = config.discriminator ?? "__kind";
  const prefix = config.size ?? codecsNumbers.getU8Decoder();
  return getUnionDecoder(
    variants.map(
      ([discriminator, variant]) => codecsCore.transformDecoder(getTupleDecoder([prefix, variant]), ([, value]) => ({
        [discriminatorProperty]: discriminator,
        ...value
      }))
    ),
    (bytes, offset) => Number(prefix.read(bytes, offset)[0])
  );
}
function getDiscriminatedUnionCodec(variants, config = {}) {
  return codecsCore.combineCodec(
    getDiscriminatedUnionEncoder(variants, config),
    getDiscriminatedUnionDecoder(variants, config)
  );
}
function getVariantDiscriminator(variants, discriminatorValue) {
  const discriminator = variants.findIndex(([key]) => discriminatorValue === key);
  if (discriminator < 0) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT, {
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
  const prefix = config.size ?? codecsNumbers.getU8Encoder();
  const useValuesAsDiscriminators = config.useValuesAsDiscriminators ?? false;
  const { enumKeys, enumValues, numericalValues, stringValues } = getEnumStats(constructor);
  if (useValuesAsDiscriminators && enumValues.some((value) => typeof value === "string")) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS, {
      stringValues: enumValues.filter((v) => typeof v === "string")
    });
  }
  return codecsCore.transformEncoder(prefix, (variant) => {
    const index = getEnumIndexFromVariant({ enumKeys, enumValues, variant });
    if (index < 0) {
      throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT, {
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
  const prefix = config.size ?? codecsNumbers.getU8Decoder();
  const useValuesAsDiscriminators = config.useValuesAsDiscriminators ?? false;
  const { enumKeys, enumValues, numericalValues } = getEnumStats(constructor);
  if (useValuesAsDiscriminators && enumValues.some((value) => typeof value === "string")) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS, {
      stringValues: enumValues.filter((v) => typeof v === "string")
    });
  }
  return codecsCore.transformDecoder(prefix, (value) => {
    const discriminator = Number(value);
    const index = getEnumIndexFromDiscriminator({
      discriminator,
      enumKeys,
      enumValues,
      useValuesAsDiscriminators
    });
    if (index < 0) {
      const validDiscriminators = useValuesAsDiscriminators ? numericalValues : [...Array(enumKeys.length).keys()];
      throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE, {
        discriminator,
        formattedValidDiscriminators: formatNumericalValues(validDiscriminators),
        validDiscriminators
      });
    }
    return enumValues[index];
  });
}
function getEnumCodec(constructor, config = {}) {
  return codecsCore.combineCodec(getEnumEncoder(constructor, config), getEnumDecoder(constructor, config));
}
var getScalarEnumEncoder = getEnumEncoder;
var getScalarEnumDecoder = getEnumDecoder;
var getScalarEnumCodec = getEnumCodec;
function getHiddenPrefixEncoder(encoder, prefixedEncoders) {
  return codecsCore.transformEncoder(
    getTupleEncoder([...prefixedEncoders, encoder]),
    (value) => [...prefixedEncoders.map(() => void 0), value]
  );
}
function getHiddenPrefixDecoder(decoder, prefixedDecoders) {
  return codecsCore.transformDecoder(
    getTupleDecoder([...prefixedDecoders, decoder]),
    (tuple) => tuple[tuple.length - 1]
  );
}
function getHiddenPrefixCodec(codec, prefixedCodecs) {
  return codecsCore.combineCodec(getHiddenPrefixEncoder(codec, prefixedCodecs), getHiddenPrefixDecoder(codec, prefixedCodecs));
}
function getHiddenSuffixEncoder(encoder, suffixedEncoders) {
  return codecsCore.transformEncoder(
    getTupleEncoder([encoder, ...suffixedEncoders]),
    (value) => [value, ...suffixedEncoders.map(() => void 0)]
  );
}
function getHiddenSuffixDecoder(decoder, suffixedDecoders) {
  return codecsCore.transformDecoder(
    getTupleDecoder([decoder, ...suffixedDecoders]),
    (tuple) => tuple[0]
  );
}
function getHiddenSuffixCodec(codec, suffixedCodecs) {
  return codecsCore.combineCodec(getHiddenSuffixEncoder(codec, suffixedCodecs), getHiddenSuffixDecoder(codec, suffixedCodecs));
}
function getMapEncoder(key, value, config = {}) {
  return codecsCore.transformEncoder(
    getArrayEncoder(getTupleEncoder([key, value]), config),
    (map) => [...map.entries()]
  );
}
function getMapDecoder(key, value, config = {}) {
  return codecsCore.transformDecoder(
    getArrayDecoder(getTupleDecoder([key, value]), config),
    (entries) => new Map(entries)
  );
}
function getMapCodec(key, value, config = {}) {
  return codecsCore.combineCodec(getMapEncoder(key, value, config), getMapDecoder(key, value, config));
}
function getUnitEncoder() {
  return codecsCore.createEncoder({
    fixedSize: 0,
    write: (_value, _bytes, offset) => offset
  });
}
function getUnitDecoder() {
  return codecsCore.createDecoder({
    fixedSize: 0,
    read: (_bytes, offset) => [void 0, offset]
  });
}
function getUnitCodec() {
  return codecsCore.combineCodec(getUnitEncoder(), getUnitDecoder());
}

// src/nullable.ts
function getNullableEncoder(item, config = {}) {
  const prefix = (() => {
    if (config.prefix === null) {
      return codecsCore.transformEncoder(getUnitEncoder(), (_boolean) => void 0);
    }
    return getBooleanEncoder({ size: config.prefix ?? codecsNumbers.getU8Encoder() });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      codecsCore.assertIsFixedSize(item);
      return codecsCore.fixEncoderSize(getUnitEncoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return getUnitEncoder();
    }
    return getConstantEncoder(config.noneValue);
  })();
  return getUnionEncoder(
    [
      codecsCore.transformEncoder(getTupleEncoder([prefix, noneValue]), (_value) => [
        false,
        void 0
      ]),
      codecsCore.transformEncoder(getTupleEncoder([prefix, item]), (value) => [true, value])
    ],
    (variant) => Number(variant !== null)
  );
}
function getNullableDecoder(item, config = {}) {
  const prefix = (() => {
    if (config.prefix === null) {
      return codecsCore.transformDecoder(getUnitDecoder(), () => false);
    }
    return getBooleanDecoder({ size: config.prefix ?? codecsNumbers.getU8Decoder() });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      codecsCore.assertIsFixedSize(item);
      return codecsCore.fixDecoderSize(getUnitDecoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return getUnitDecoder();
    }
    return getConstantDecoder(config.noneValue);
  })();
  return getUnionDecoder(
    [
      codecsCore.transformDecoder(getTupleDecoder([prefix, noneValue]), () => null),
      codecsCore.transformDecoder(getTupleDecoder([prefix, item]), ([, value]) => value)
    ],
    (bytes, offset) => {
      if (config.prefix === null && !config.noneValue) {
        return Number(offset < bytes.length);
      }
      if (config.prefix === null && config.noneValue != null) {
        const zeroValue = config.noneValue === "zeroes" ? new Uint8Array(noneValue.fixedSize).fill(0) : config.noneValue;
        return codecsCore.containsBytes(bytes, zeroValue, offset) ? 0 : 1;
      }
      return Number(prefix.read(bytes, offset)[0]);
    }
  );
}
function getNullableCodec(item, config = {}) {
  return codecsCore.combineCodec(
    getNullableEncoder(item, config),
    getNullableDecoder(item, config)
  );
}
function getSetEncoder(item, config = {}) {
  return codecsCore.transformEncoder(getArrayEncoder(item, config), (set) => [...set]);
}
function getSetDecoder(item, config = {}) {
  return codecsCore.transformDecoder(getArrayDecoder(item, config), (entries) => new Set(entries));
}
function getSetCodec(item, config = {}) {
  return codecsCore.combineCodec(getSetEncoder(item, config), getSetDecoder(item, config));
}
function getStructEncoder(fields) {
  const fieldCodecs = fields.map(([, codec]) => codec);
  const fixedSize = sumCodecSizes(fieldCodecs.map(getFixedSize));
  const maxSize = sumCodecSizes(fieldCodecs.map(getMaxSize)) ?? void 0;
  return codecsCore.createEncoder({
    ...fixedSize === null ? {
      getSizeFromValue: (value) => fields.map(([key, codec]) => codecsCore.getEncodedSize(value[key], codec)).reduce((all, one) => all + one, 0),
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
  return codecsCore.createDecoder({
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
  return codecsCore.combineCodec(
    getStructEncoder(fields),
    getStructDecoder(fields)
  );
}

exports.assertValidNumberOfItemsForCodec = assertValidNumberOfItemsForCodec;
exports.getArrayCodec = getArrayCodec;
exports.getArrayDecoder = getArrayDecoder;
exports.getArrayEncoder = getArrayEncoder;
exports.getBitArrayCodec = getBitArrayCodec;
exports.getBitArrayDecoder = getBitArrayDecoder;
exports.getBitArrayEncoder = getBitArrayEncoder;
exports.getBooleanCodec = getBooleanCodec;
exports.getBooleanDecoder = getBooleanDecoder;
exports.getBooleanEncoder = getBooleanEncoder;
exports.getBytesCodec = getBytesCodec;
exports.getBytesDecoder = getBytesDecoder;
exports.getBytesEncoder = getBytesEncoder;
exports.getConstantCodec = getConstantCodec;
exports.getConstantDecoder = getConstantDecoder;
exports.getConstantEncoder = getConstantEncoder;
exports.getDataEnumCodec = getDataEnumCodec;
exports.getDataEnumDecoder = getDataEnumDecoder;
exports.getDataEnumEncoder = getDataEnumEncoder;
exports.getDiscriminatedUnionCodec = getDiscriminatedUnionCodec;
exports.getDiscriminatedUnionDecoder = getDiscriminatedUnionDecoder;
exports.getDiscriminatedUnionEncoder = getDiscriminatedUnionEncoder;
exports.getEnumCodec = getEnumCodec;
exports.getEnumDecoder = getEnumDecoder;
exports.getEnumEncoder = getEnumEncoder;
exports.getHiddenPrefixCodec = getHiddenPrefixCodec;
exports.getHiddenPrefixDecoder = getHiddenPrefixDecoder;
exports.getHiddenPrefixEncoder = getHiddenPrefixEncoder;
exports.getHiddenSuffixCodec = getHiddenSuffixCodec;
exports.getHiddenSuffixDecoder = getHiddenSuffixDecoder;
exports.getHiddenSuffixEncoder = getHiddenSuffixEncoder;
exports.getMapCodec = getMapCodec;
exports.getMapDecoder = getMapDecoder;
exports.getMapEncoder = getMapEncoder;
exports.getNullableCodec = getNullableCodec;
exports.getNullableDecoder = getNullableDecoder;
exports.getNullableEncoder = getNullableEncoder;
exports.getScalarEnumCodec = getScalarEnumCodec;
exports.getScalarEnumDecoder = getScalarEnumDecoder;
exports.getScalarEnumEncoder = getScalarEnumEncoder;
exports.getSetCodec = getSetCodec;
exports.getSetDecoder = getSetDecoder;
exports.getSetEncoder = getSetEncoder;
exports.getStructCodec = getStructCodec;
exports.getStructDecoder = getStructDecoder;
exports.getStructEncoder = getStructEncoder;
exports.getTupleCodec = getTupleCodec;
exports.getTupleDecoder = getTupleDecoder;
exports.getTupleEncoder = getTupleEncoder;
exports.getUnionCodec = getUnionCodec;
exports.getUnionDecoder = getUnionDecoder;
exports.getUnionEncoder = getUnionEncoder;
exports.getUnitCodec = getUnitCodec;
exports.getUnitDecoder = getUnitDecoder;
exports.getUnitEncoder = getUnitEncoder;
//# sourceMappingURL=index.browser.cjs.map
//# sourceMappingURL=index.browser.cjs.map