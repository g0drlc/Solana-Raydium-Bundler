'use strict';

var errors = require('@solana/errors');
var codecsCore = require('@solana/codecs-core');

// src/assertions.ts
function assertValidBaseString(alphabet4, testValue, givenValue = testValue) {
  if (!testValue.match(new RegExp(`^[${alphabet4}]*$`))) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
      alphabet: alphabet4,
      base: alphabet4.length,
      value: givenValue
    });
  }
}
var getBaseXEncoder = (alphabet4) => {
  return codecsCore.createEncoder({
    getSizeFromValue: (value) => {
      const [leadingZeroes, tailChars] = partitionLeadingZeroes(value, alphabet4[0]);
      if (!tailChars) return value.length;
      const base10Number = getBigIntFromBaseX(tailChars, alphabet4);
      return leadingZeroes.length + Math.ceil(base10Number.toString(16).length / 2);
    },
    write(value, bytes, offset) {
      assertValidBaseString(alphabet4, value);
      if (value === "") return offset;
      const [leadingZeroes, tailChars] = partitionLeadingZeroes(value, alphabet4[0]);
      if (!tailChars) {
        bytes.set(new Uint8Array(leadingZeroes.length).fill(0), offset);
        return offset + leadingZeroes.length;
      }
      let base10Number = getBigIntFromBaseX(tailChars, alphabet4);
      const tailBytes = [];
      while (base10Number > 0n) {
        tailBytes.unshift(Number(base10Number % 256n));
        base10Number /= 256n;
      }
      const bytesToAdd = [...Array(leadingZeroes.length).fill(0), ...tailBytes];
      bytes.set(bytesToAdd, offset);
      return offset + bytesToAdd.length;
    }
  });
};
var getBaseXDecoder = (alphabet4) => {
  return codecsCore.createDecoder({
    read(rawBytes, offset) {
      const bytes = offset === 0 ? rawBytes : rawBytes.slice(offset);
      if (bytes.length === 0) return ["", 0];
      let trailIndex = bytes.findIndex((n) => n !== 0);
      trailIndex = trailIndex === -1 ? bytes.length : trailIndex;
      const leadingZeroes = alphabet4[0].repeat(trailIndex);
      if (trailIndex === bytes.length) return [leadingZeroes, rawBytes.length];
      const base10Number = bytes.slice(trailIndex).reduce((sum, byte) => sum * 256n + BigInt(byte), 0n);
      const tailChars = getBaseXFromBigInt(base10Number, alphabet4);
      return [leadingZeroes + tailChars, rawBytes.length];
    }
  });
};
var getBaseXCodec = (alphabet4) => codecsCore.combineCodec(getBaseXEncoder(alphabet4), getBaseXDecoder(alphabet4));
function partitionLeadingZeroes(value, zeroCharacter) {
  const [leadingZeros, tailChars] = value.split(new RegExp(`((?!${zeroCharacter}).*)`));
  return [leadingZeros, tailChars];
}
function getBigIntFromBaseX(value, alphabet4) {
  const base = BigInt(alphabet4.length);
  let sum = 0n;
  for (const char of value) {
    sum *= base;
    sum += BigInt(alphabet4.indexOf(char));
  }
  return sum;
}
function getBaseXFromBigInt(value, alphabet4) {
  const base = BigInt(alphabet4.length);
  const tailChars = [];
  while (value > 0n) {
    tailChars.unshift(alphabet4[Number(value % base)]);
    value /= base;
  }
  return tailChars.join("");
}

// src/base10.ts
var alphabet = "0123456789";
var getBase10Encoder = () => getBaseXEncoder(alphabet);
var getBase10Decoder = () => getBaseXDecoder(alphabet);
var getBase10Codec = () => getBaseXCodec(alphabet);
var INVALID_STRING_ERROR_BASE_CONFIG = {
  alphabet: "0123456789abcdef",
  base: 16
};
function charCodeToBase16(char) {
  if (char >= 48 /* ZERO */ && char <= 57 /* NINE */) return char - 48 /* ZERO */;
  if (char >= 65 /* A_UP */ && char <= 70 /* F_UP */) return char - (65 /* A_UP */ - 10);
  if (char >= 97 /* A_LO */ && char <= 102 /* F_LO */) return char - (97 /* A_LO */ - 10);
}
var getBase16Encoder = () => codecsCore.createEncoder({
  getSizeFromValue: (value) => Math.ceil(value.length / 2),
  write(value, bytes, offset) {
    const len = value.length;
    const al = len / 2;
    if (len === 1) {
      const c = value.charCodeAt(0);
      const n = charCodeToBase16(c);
      if (n === void 0) {
        throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
          ...INVALID_STRING_ERROR_BASE_CONFIG,
          value
        });
      }
      bytes.set([n], offset);
      return 1 + offset;
    }
    const hexBytes = new Uint8Array(al);
    for (let i = 0, j = 0; i < al; i++) {
      const c1 = value.charCodeAt(j++);
      const c2 = value.charCodeAt(j++);
      const n1 = charCodeToBase16(c1);
      const n2 = charCodeToBase16(c2);
      if (n1 === void 0 || n2 === void 0 && !Number.isNaN(c2)) {
        throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
          ...INVALID_STRING_ERROR_BASE_CONFIG,
          value
        });
      }
      hexBytes[i] = !Number.isNaN(c2) ? n1 << 4 | (n2 ?? 0) : n1;
    }
    bytes.set(hexBytes, offset);
    return hexBytes.length + offset;
  }
});
var getBase16Decoder = () => codecsCore.createDecoder({
  read(bytes, offset) {
    const value = bytes.slice(offset).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    return [value, bytes.length];
  }
});
var getBase16Codec = () => codecsCore.combineCodec(getBase16Encoder(), getBase16Decoder());

// src/base58.ts
var alphabet2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var getBase58Encoder = () => getBaseXEncoder(alphabet2);
var getBase58Decoder = () => getBaseXDecoder(alphabet2);
var getBase58Codec = () => getBaseXCodec(alphabet2);
var getBaseXResliceEncoder = (alphabet4, bits) => codecsCore.createEncoder({
  getSizeFromValue: (value) => Math.floor(value.length * bits / 8),
  write(value, bytes, offset) {
    assertValidBaseString(alphabet4, value);
    if (value === "") return offset;
    const charIndices = [...value].map((c) => alphabet4.indexOf(c));
    const reslicedBytes = reslice(charIndices, bits, 8, false);
    bytes.set(reslicedBytes, offset);
    return reslicedBytes.length + offset;
  }
});
var getBaseXResliceDecoder = (alphabet4, bits) => codecsCore.createDecoder({
  read(rawBytes, offset = 0) {
    const bytes = offset === 0 ? rawBytes : rawBytes.slice(offset);
    if (bytes.length === 0) return ["", rawBytes.length];
    const charIndices = reslice([...bytes], 8, bits, true);
    return [charIndices.map((i) => alphabet4[i]).join(""), rawBytes.length];
  }
});
var getBaseXResliceCodec = (alphabet4, bits) => codecsCore.combineCodec(getBaseXResliceEncoder(alphabet4, bits), getBaseXResliceDecoder(alphabet4, bits));
function reslice(input, inputBits, outputBits, useRemainder) {
  const output = [];
  let accumulator = 0;
  let bitsInAccumulator = 0;
  const mask = (1 << outputBits) - 1;
  for (const value of input) {
    accumulator = accumulator << inputBits | value;
    bitsInAccumulator += inputBits;
    while (bitsInAccumulator >= outputBits) {
      bitsInAccumulator -= outputBits;
      output.push(accumulator >> bitsInAccumulator & mask);
    }
  }
  if (useRemainder && bitsInAccumulator > 0) {
    output.push(accumulator << outputBits - bitsInAccumulator & mask);
  }
  return output;
}

// src/base64.ts
var alphabet3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var getBase64Encoder = () => {
  {
    return codecsCore.createEncoder({
      getSizeFromValue: (value) => {
        try {
          return atob(value).length;
        } catch (e2) {
          throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
            alphabet: alphabet3,
            base: 64,
            value
          });
        }
      },
      write(value, bytes, offset) {
        try {
          const bytesToAdd = atob(value).split("").map((c) => c.charCodeAt(0));
          bytes.set(bytesToAdd, offset);
          return bytesToAdd.length + offset;
        } catch (e2) {
          throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
            alphabet: alphabet3,
            base: 64,
            value
          });
        }
      }
    });
  }
};
var getBase64Decoder = () => {
  {
    return codecsCore.createDecoder({
      read(bytes, offset = 0) {
        const slice = bytes.slice(offset);
        const value = btoa(String.fromCharCode(...slice));
        return [value, bytes.length];
      }
    });
  }
};
var getBase64Codec = () => codecsCore.combineCodec(getBase64Encoder(), getBase64Decoder());

// src/null-characters.ts
var removeNullCharacters = (value) => (
  // eslint-disable-next-line no-control-regex
  value.replace(/\u0000/g, "")
);
var padNullCharacters = (value, chars) => value.padEnd(chars, "\0");

// ../text-encoding-impl/dist/index.browser.mjs
var e = globalThis.TextDecoder;
var o = globalThis.TextEncoder;

// src/utf8.ts
var getUtf8Encoder = () => {
  let textEncoder;
  return codecsCore.createEncoder({
    getSizeFromValue: (value) => (textEncoder ||= new o()).encode(value).length,
    write: (value, bytes, offset) => {
      const bytesToAdd = (textEncoder ||= new o()).encode(value);
      bytes.set(bytesToAdd, offset);
      return offset + bytesToAdd.length;
    }
  });
};
var getUtf8Decoder = () => {
  let textDecoder;
  return codecsCore.createDecoder({
    read(bytes, offset) {
      const value = (textDecoder ||= new e()).decode(bytes.slice(offset));
      return [removeNullCharacters(value), bytes.length];
    }
  });
};
var getUtf8Codec = () => codecsCore.combineCodec(getUtf8Encoder(), getUtf8Decoder());

exports.assertValidBaseString = assertValidBaseString;
exports.getBase10Codec = getBase10Codec;
exports.getBase10Decoder = getBase10Decoder;
exports.getBase10Encoder = getBase10Encoder;
exports.getBase16Codec = getBase16Codec;
exports.getBase16Decoder = getBase16Decoder;
exports.getBase16Encoder = getBase16Encoder;
exports.getBase58Codec = getBase58Codec;
exports.getBase58Decoder = getBase58Decoder;
exports.getBase58Encoder = getBase58Encoder;
exports.getBase64Codec = getBase64Codec;
exports.getBase64Decoder = getBase64Decoder;
exports.getBase64Encoder = getBase64Encoder;
exports.getBaseXCodec = getBaseXCodec;
exports.getBaseXDecoder = getBaseXDecoder;
exports.getBaseXEncoder = getBaseXEncoder;
exports.getBaseXResliceCodec = getBaseXResliceCodec;
exports.getBaseXResliceDecoder = getBaseXResliceDecoder;
exports.getBaseXResliceEncoder = getBaseXResliceEncoder;
exports.getUtf8Codec = getUtf8Codec;
exports.getUtf8Decoder = getUtf8Decoder;
exports.getUtf8Encoder = getUtf8Encoder;
exports.padNullCharacters = padNullCharacters;
exports.removeNullCharacters = removeNullCharacters;
//# sourceMappingURL=index.browser.cjs.map
//# sourceMappingURL=index.browser.cjs.map