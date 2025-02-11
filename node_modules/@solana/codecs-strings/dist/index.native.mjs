import { SolanaError, SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE } from '@solana/errors';
import { createEncoder, createDecoder, combineCodec, transformEncoder, transformDecoder } from '@solana/codecs-core';

// src/assertions.ts
function assertValidBaseString(alphabet4, testValue, givenValue = testValue) {
  if (!testValue.match(new RegExp(`^[${alphabet4}]*$`))) {
    throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
      alphabet: alphabet4,
      base: alphabet4.length,
      value: givenValue
    });
  }
}
var getBaseXEncoder = (alphabet4) => {
  return createEncoder({
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
  return createDecoder({
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
var getBaseXCodec = (alphabet4) => combineCodec(getBaseXEncoder(alphabet4), getBaseXDecoder(alphabet4));
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
var getBase16Encoder = () => createEncoder({
  getSizeFromValue: (value) => Math.ceil(value.length / 2),
  write(value, bytes, offset) {
    const len = value.length;
    const al = len / 2;
    if (len === 1) {
      const c = value.charCodeAt(0);
      const n = charCodeToBase16(c);
      if (n === void 0) {
        throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
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
        throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE, {
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
var getBase16Decoder = () => createDecoder({
  read(bytes, offset) {
    const value = bytes.slice(offset).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    return [value, bytes.length];
  }
});
var getBase16Codec = () => combineCodec(getBase16Encoder(), getBase16Decoder());

// src/base58.ts
var alphabet2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var getBase58Encoder = () => getBaseXEncoder(alphabet2);
var getBase58Decoder = () => getBaseXDecoder(alphabet2);
var getBase58Codec = () => getBaseXCodec(alphabet2);
var getBaseXResliceEncoder = (alphabet4, bits) => createEncoder({
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
var getBaseXResliceDecoder = (alphabet4, bits) => createDecoder({
  read(rawBytes, offset = 0) {
    const bytes = offset === 0 ? rawBytes : rawBytes.slice(offset);
    if (bytes.length === 0) return ["", rawBytes.length];
    const charIndices = reslice([...bytes], 8, bits, true);
    return [charIndices.map((i) => alphabet4[i]).join(""), rawBytes.length];
  }
});
var getBaseXResliceCodec = (alphabet4, bits) => combineCodec(getBaseXResliceEncoder(alphabet4, bits), getBaseXResliceDecoder(alphabet4, bits));
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
  return transformEncoder(getBaseXResliceEncoder(alphabet3, 6), (value) => value.replace(/=/g, ""));
};
var getBase64Decoder = () => {
  return transformDecoder(
    getBaseXResliceDecoder(alphabet3, 6),
    (value) => value.padEnd(Math.ceil(value.length / 4) * 4, "=")
  );
};
var getBase64Codec = () => combineCodec(getBase64Encoder(), getBase64Decoder());

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
  return createEncoder({
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
  return createDecoder({
    read(bytes, offset) {
      const value = (textDecoder ||= new e()).decode(bytes.slice(offset));
      return [removeNullCharacters(value), bytes.length];
    }
  });
};
var getUtf8Codec = () => combineCodec(getUtf8Encoder(), getUtf8Decoder());

export { assertValidBaseString, getBase10Codec, getBase10Decoder, getBase10Encoder, getBase16Codec, getBase16Decoder, getBase16Encoder, getBase58Codec, getBase58Decoder, getBase58Encoder, getBase64Codec, getBase64Decoder, getBase64Encoder, getBaseXCodec, getBaseXDecoder, getBaseXEncoder, getBaseXResliceCodec, getBaseXResliceDecoder, getBaseXResliceEncoder, getUtf8Codec, getUtf8Decoder, getUtf8Encoder, padNullCharacters, removeNullCharacters };
//# sourceMappingURL=index.native.mjs.map
//# sourceMappingURL=index.native.mjs.map