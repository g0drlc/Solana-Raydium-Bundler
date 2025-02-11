import { transformEncoder, assertIsFixedSize, fixEncoderSize, transformDecoder, fixDecoderSize, containsBytes, combineCodec } from '@solana/codecs-core';
import { getUnitEncoder, getBooleanEncoder, getConstantEncoder, getUnionEncoder, getTupleEncoder, getUnitDecoder, getBooleanDecoder, getConstantDecoder, getUnionDecoder, getTupleDecoder } from '@solana/codecs-data-structures';
import { getU8Encoder, getU8Decoder } from '@solana/codecs-numbers';

// src/option.ts
var some = (value) => ({ __option: "Some", value });
var none = () => ({ __option: "None" });
var isOption = (input) => !!(input && typeof input === "object" && "__option" in input && (input.__option === "Some" && "value" in input || input.__option === "None"));
var isSome = (option) => option.__option === "Some";
var isNone = (option) => option.__option === "None";

// src/unwrap-option.ts
function unwrapOption(option, fallback) {
  if (isSome(option)) return option.value;
  return fallback ? fallback() : null;
}
var wrapNullable = (nullable) => nullable !== null ? some(nullable) : none();

// src/option-codec.ts
function getOptionEncoder(item, config = {}) {
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
      transformEncoder(getTupleEncoder([prefix, item]), (value) => [
        true,
        isOption(value) && isSome(value) ? value.value : value
      ])
    ],
    (variant) => {
      const option = isOption(variant) ? variant : wrapNullable(variant);
      return Number(isSome(option));
    }
  );
}
function getOptionDecoder(item, config = {}) {
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
      transformDecoder(getTupleDecoder([prefix, noneValue]), () => none()),
      transformDecoder(getTupleDecoder([prefix, item]), ([, value]) => some(value))
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
function getOptionCodec(item, config = {}) {
  return combineCodec(
    getOptionEncoder(item, config),
    getOptionDecoder(item, config)
  );
}

// src/unwrap-option-recursively.ts
function unwrapOptionRecursively(input, fallback) {
  if (!input || ArrayBuffer.isView(input)) {
    return input;
  }
  const next = (x) => fallback ? unwrapOptionRecursively(x, fallback) : unwrapOptionRecursively(x);
  if (isOption(input)) {
    if (isSome(input)) return next(input.value);
    return fallback ? fallback() : null;
  }
  if (Array.isArray(input)) {
    return input.map(next);
  }
  if (typeof input === "object") {
    return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, next(v)]));
  }
  return input;
}

export { getOptionCodec, getOptionDecoder, getOptionEncoder, isNone, isOption, isSome, none, some, unwrapOption, unwrapOptionRecursively, wrapNullable };
//# sourceMappingURL=index.browser.mjs.map
//# sourceMappingURL=index.browser.mjs.map