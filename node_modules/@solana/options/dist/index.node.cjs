'use strict';

var codecsCore = require('@solana/codecs-core');
var codecsDataStructures = require('@solana/codecs-data-structures');
var codecsNumbers = require('@solana/codecs-numbers');

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
      return codecsCore.transformEncoder(codecsDataStructures.getUnitEncoder(), (_boolean) => void 0);
    }
    return codecsDataStructures.getBooleanEncoder({ size: config.prefix ?? codecsNumbers.getU8Encoder() });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      codecsCore.assertIsFixedSize(item);
      return codecsCore.fixEncoderSize(codecsDataStructures.getUnitEncoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return codecsDataStructures.getUnitEncoder();
    }
    return codecsDataStructures.getConstantEncoder(config.noneValue);
  })();
  return codecsDataStructures.getUnionEncoder(
    [
      codecsCore.transformEncoder(codecsDataStructures.getTupleEncoder([prefix, noneValue]), (_value) => [
        false,
        void 0
      ]),
      codecsCore.transformEncoder(codecsDataStructures.getTupleEncoder([prefix, item]), (value) => [
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
      return codecsCore.transformDecoder(codecsDataStructures.getUnitDecoder(), () => false);
    }
    return codecsDataStructures.getBooleanDecoder({ size: config.prefix ?? codecsNumbers.getU8Decoder() });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      codecsCore.assertIsFixedSize(item);
      return codecsCore.fixDecoderSize(codecsDataStructures.getUnitDecoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return codecsDataStructures.getUnitDecoder();
    }
    return codecsDataStructures.getConstantDecoder(config.noneValue);
  })();
  return codecsDataStructures.getUnionDecoder(
    [
      codecsCore.transformDecoder(codecsDataStructures.getTupleDecoder([prefix, noneValue]), () => none()),
      codecsCore.transformDecoder(codecsDataStructures.getTupleDecoder([prefix, item]), ([, value]) => some(value))
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
function getOptionCodec(item, config = {}) {
  return codecsCore.combineCodec(
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

exports.getOptionCodec = getOptionCodec;
exports.getOptionDecoder = getOptionDecoder;
exports.getOptionEncoder = getOptionEncoder;
exports.isNone = isNone;
exports.isOption = isOption;
exports.isSome = isSome;
exports.none = none;
exports.some = some;
exports.unwrapOption = unwrapOption;
exports.unwrapOptionRecursively = unwrapOptionRecursively;
exports.wrapNullable = wrapNullable;
//# sourceMappingURL=index.node.cjs.map
//# sourceMappingURL=index.node.cjs.map