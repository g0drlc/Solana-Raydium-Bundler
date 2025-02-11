'use strict';

var errors = require('@solana/errors');

// src/add-codec-sentinel.ts

// src/bytes.ts
var mergeBytes = (byteArrays) => {
  const nonEmptyByteArrays = byteArrays.filter((arr) => arr.length);
  if (nonEmptyByteArrays.length === 0) {
    return byteArrays.length ? byteArrays[0] : new Uint8Array();
  }
  if (nonEmptyByteArrays.length === 1) {
    return nonEmptyByteArrays[0];
  }
  const totalLength = nonEmptyByteArrays.reduce((total, arr) => total + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  nonEmptyByteArrays.forEach((arr) => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
};
var padBytes = (bytes, length) => {
  if (bytes.length >= length) return bytes;
  const paddedBytes = new Uint8Array(length).fill(0);
  paddedBytes.set(bytes);
  return paddedBytes;
};
var fixBytes = (bytes, length) => padBytes(bytes.length <= length ? bytes : bytes.slice(0, length), length);
function containsBytes(data, bytes, offset) {
  const slice = offset === 0 && data.length === bytes.length ? data : data.slice(offset, offset + bytes.length);
  if (slice.length !== bytes.length) return false;
  return bytes.every((b, i) => b === slice[i]);
}
function getEncodedSize(value, encoder) {
  return "fixedSize" in encoder ? encoder.fixedSize : encoder.getSizeFromValue(value);
}
function createEncoder(encoder) {
  return Object.freeze({
    ...encoder,
    encode: (value) => {
      const bytes = new Uint8Array(getEncodedSize(value, encoder));
      encoder.write(value, bytes, 0);
      return bytes;
    }
  });
}
function createDecoder(decoder) {
  return Object.freeze({
    ...decoder,
    decode: (bytes, offset = 0) => decoder.read(bytes, offset)[0]
  });
}
function createCodec(codec) {
  return Object.freeze({
    ...codec,
    decode: (bytes, offset = 0) => codec.read(bytes, offset)[0],
    encode: (value) => {
      const bytes = new Uint8Array(getEncodedSize(value, codec));
      codec.write(value, bytes, 0);
      return bytes;
    }
  });
}
function isFixedSize(codec) {
  return "fixedSize" in codec && typeof codec.fixedSize === "number";
}
function assertIsFixedSize(codec) {
  if (!isFixedSize(codec)) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__EXPECTED_FIXED_LENGTH);
  }
}
function isVariableSize(codec) {
  return !isFixedSize(codec);
}
function assertIsVariableSize(codec) {
  if (!isVariableSize(codec)) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__EXPECTED_VARIABLE_LENGTH);
  }
}
function combineCodec(encoder, decoder) {
  if (isFixedSize(encoder) !== isFixedSize(decoder)) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH);
  }
  if (isFixedSize(encoder) && isFixedSize(decoder) && encoder.fixedSize !== decoder.fixedSize) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH, {
      decoderFixedSize: decoder.fixedSize,
      encoderFixedSize: encoder.fixedSize
    });
  }
  if (!isFixedSize(encoder) && !isFixedSize(decoder) && encoder.maxSize !== decoder.maxSize) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH, {
      decoderMaxSize: decoder.maxSize,
      encoderMaxSize: encoder.maxSize
    });
  }
  return {
    ...decoder,
    ...encoder,
    decode: decoder.decode,
    encode: encoder.encode,
    read: decoder.read,
    write: encoder.write
  };
}

// src/add-codec-sentinel.ts
function addEncoderSentinel(encoder, sentinel) {
  const write = (value, bytes, offset) => {
    const encoderBytes = encoder.encode(value);
    if (findSentinelIndex(encoderBytes, sentinel) >= 0) {
      throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__ENCODED_BYTES_MUST_NOT_INCLUDE_SENTINEL, {
        encodedBytes: encoderBytes,
        hexEncodedBytes: hexBytes(encoderBytes),
        hexSentinel: hexBytes(sentinel),
        sentinel
      });
    }
    bytes.set(encoderBytes, offset);
    offset += encoderBytes.length;
    bytes.set(sentinel, offset);
    offset += sentinel.length;
    return offset;
  };
  if (isFixedSize(encoder)) {
    return createEncoder({ ...encoder, fixedSize: encoder.fixedSize + sentinel.length, write });
  }
  return createEncoder({
    ...encoder,
    ...encoder.maxSize != null ? { maxSize: encoder.maxSize + sentinel.length } : {},
    getSizeFromValue: (value) => encoder.getSizeFromValue(value) + sentinel.length,
    write
  });
}
function addDecoderSentinel(decoder, sentinel) {
  const read = (bytes, offset) => {
    const candidateBytes = offset === 0 ? bytes : bytes.slice(offset);
    const sentinelIndex = findSentinelIndex(candidateBytes, sentinel);
    if (sentinelIndex === -1) {
      throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__SENTINEL_MISSING_IN_DECODED_BYTES, {
        decodedBytes: candidateBytes,
        hexDecodedBytes: hexBytes(candidateBytes),
        hexSentinel: hexBytes(sentinel),
        sentinel
      });
    }
    const preSentinelBytes = candidateBytes.slice(0, sentinelIndex);
    return [decoder.decode(preSentinelBytes), offset + preSentinelBytes.length + sentinel.length];
  };
  if (isFixedSize(decoder)) {
    return createDecoder({ ...decoder, fixedSize: decoder.fixedSize + sentinel.length, read });
  }
  return createDecoder({
    ...decoder,
    ...decoder.maxSize != null ? { maxSize: decoder.maxSize + sentinel.length } : {},
    read
  });
}
function addCodecSentinel(codec, sentinel) {
  return combineCodec(addEncoderSentinel(codec, sentinel), addDecoderSentinel(codec, sentinel));
}
function findSentinelIndex(bytes, sentinel) {
  return bytes.findIndex((byte, index, arr) => {
    if (sentinel.length === 1) return byte === sentinel[0];
    return containsBytes(arr, sentinel, index);
  });
}
function hexBytes(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
function assertByteArrayIsNotEmptyForCodec(codecDescription, bytes, offset = 0) {
  if (bytes.length - offset <= 0) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY, {
      codecDescription
    });
  }
}
function assertByteArrayHasEnoughBytesForCodec(codecDescription, expected, bytes, offset = 0) {
  const bytesLength = bytes.length - offset;
  if (bytesLength < expected) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH, {
      bytesLength,
      codecDescription,
      expected
    });
  }
}
function assertByteArrayOffsetIsNotOutOfRange(codecDescription, offset, bytesLength) {
  if (offset < 0 || offset > bytesLength) {
    throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__OFFSET_OUT_OF_RANGE, {
      bytesLength,
      codecDescription,
      offset
    });
  }
}

// src/add-codec-size-prefix.ts
function addEncoderSizePrefix(encoder, prefix) {
  const write = (value, bytes, offset) => {
    const encoderBytes = encoder.encode(value);
    offset = prefix.write(encoderBytes.length, bytes, offset);
    bytes.set(encoderBytes, offset);
    return offset + encoderBytes.length;
  };
  if (isFixedSize(prefix) && isFixedSize(encoder)) {
    return createEncoder({ ...encoder, fixedSize: prefix.fixedSize + encoder.fixedSize, write });
  }
  const prefixMaxSize = isFixedSize(prefix) ? prefix.fixedSize : prefix.maxSize ?? null;
  const encoderMaxSize = isFixedSize(encoder) ? encoder.fixedSize : encoder.maxSize ?? null;
  const maxSize = prefixMaxSize !== null && encoderMaxSize !== null ? prefixMaxSize + encoderMaxSize : null;
  return createEncoder({
    ...encoder,
    ...maxSize !== null ? { maxSize } : {},
    getSizeFromValue: (value) => {
      const encoderSize = getEncodedSize(value, encoder);
      return getEncodedSize(encoderSize, prefix) + encoderSize;
    },
    write
  });
}
function addDecoderSizePrefix(decoder, prefix) {
  const read = (bytes, offset) => {
    const [bigintSize, decoderOffset] = prefix.read(bytes, offset);
    const size = Number(bigintSize);
    offset = decoderOffset;
    if (offset > 0 || bytes.length > size) {
      bytes = bytes.slice(offset, offset + size);
    }
    assertByteArrayHasEnoughBytesForCodec("addDecoderSizePrefix", size, bytes);
    return [decoder.decode(bytes), offset + size];
  };
  if (isFixedSize(prefix) && isFixedSize(decoder)) {
    return createDecoder({ ...decoder, fixedSize: prefix.fixedSize + decoder.fixedSize, read });
  }
  const prefixMaxSize = isFixedSize(prefix) ? prefix.fixedSize : prefix.maxSize ?? null;
  const decoderMaxSize = isFixedSize(decoder) ? decoder.fixedSize : decoder.maxSize ?? null;
  const maxSize = prefixMaxSize !== null && decoderMaxSize !== null ? prefixMaxSize + decoderMaxSize : null;
  return createDecoder({ ...decoder, ...maxSize !== null ? { maxSize } : {}, read });
}
function addCodecSizePrefix(codec, prefix) {
  return combineCodec(addEncoderSizePrefix(codec, prefix), addDecoderSizePrefix(codec, prefix));
}

// src/fix-codec-size.ts
function fixEncoderSize(encoder, fixedBytes) {
  return createEncoder({
    fixedSize: fixedBytes,
    write: (value, bytes, offset) => {
      const variableByteArray = encoder.encode(value);
      const fixedByteArray = variableByteArray.length > fixedBytes ? variableByteArray.slice(0, fixedBytes) : variableByteArray;
      bytes.set(fixedByteArray, offset);
      return offset + fixedBytes;
    }
  });
}
function fixDecoderSize(decoder, fixedBytes) {
  return createDecoder({
    fixedSize: fixedBytes,
    read: (bytes, offset) => {
      assertByteArrayHasEnoughBytesForCodec("fixCodecSize", fixedBytes, bytes, offset);
      if (offset > 0 || bytes.length > fixedBytes) {
        bytes = bytes.slice(offset, offset + fixedBytes);
      }
      if (isFixedSize(decoder)) {
        bytes = fixBytes(bytes, decoder.fixedSize);
      }
      const [value] = decoder.read(bytes, 0);
      return [value, offset + fixedBytes];
    }
  });
}
function fixCodecSize(codec, fixedBytes) {
  return combineCodec(fixEncoderSize(codec, fixedBytes), fixDecoderSize(codec, fixedBytes));
}

// src/offset-codec.ts
function offsetEncoder(encoder, config) {
  return createEncoder({
    ...encoder,
    write: (value, bytes, preOffset) => {
      const wrapBytes = (offset) => modulo(offset, bytes.length);
      const newPreOffset = config.preOffset ? config.preOffset({ bytes, preOffset, wrapBytes }) : preOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetEncoder", newPreOffset, bytes.length);
      const postOffset = encoder.write(value, bytes, newPreOffset);
      const newPostOffset = config.postOffset ? config.postOffset({ bytes, newPreOffset, postOffset, preOffset, wrapBytes }) : postOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetEncoder", newPostOffset, bytes.length);
      return newPostOffset;
    }
  });
}
function offsetDecoder(decoder, config) {
  return createDecoder({
    ...decoder,
    read: (bytes, preOffset) => {
      const wrapBytes = (offset) => modulo(offset, bytes.length);
      const newPreOffset = config.preOffset ? config.preOffset({ bytes, preOffset, wrapBytes }) : preOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetDecoder", newPreOffset, bytes.length);
      const [value, postOffset] = decoder.read(bytes, newPreOffset);
      const newPostOffset = config.postOffset ? config.postOffset({ bytes, newPreOffset, postOffset, preOffset, wrapBytes }) : postOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetDecoder", newPostOffset, bytes.length);
      return [value, newPostOffset];
    }
  });
}
function offsetCodec(codec, config) {
  return combineCodec(offsetEncoder(codec, config), offsetDecoder(codec, config));
}
function modulo(dividend, divisor) {
  if (divisor === 0) return 0;
  return (dividend % divisor + divisor) % divisor;
}
function resizeEncoder(encoder, resize) {
  if (isFixedSize(encoder)) {
    const fixedSize = resize(encoder.fixedSize);
    if (fixedSize < 0) {
      throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH, {
        bytesLength: fixedSize,
        codecDescription: "resizeEncoder"
      });
    }
    return createEncoder({ ...encoder, fixedSize });
  }
  return createEncoder({
    ...encoder,
    getSizeFromValue: (value) => {
      const newSize = resize(encoder.getSizeFromValue(value));
      if (newSize < 0) {
        throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH, {
          bytesLength: newSize,
          codecDescription: "resizeEncoder"
        });
      }
      return newSize;
    }
  });
}
function resizeDecoder(decoder, resize) {
  if (isFixedSize(decoder)) {
    const fixedSize = resize(decoder.fixedSize);
    if (fixedSize < 0) {
      throw new errors.SolanaError(errors.SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH, {
        bytesLength: fixedSize,
        codecDescription: "resizeDecoder"
      });
    }
    return createDecoder({ ...decoder, fixedSize });
  }
  return decoder;
}
function resizeCodec(codec, resize) {
  return combineCodec(resizeEncoder(codec, resize), resizeDecoder(codec, resize));
}

// src/pad-codec.ts
function padLeftEncoder(encoder, offset) {
  return offsetEncoder(
    resizeEncoder(encoder, (size) => size + offset),
    { preOffset: ({ preOffset }) => preOffset + offset }
  );
}
function padRightEncoder(encoder, offset) {
  return offsetEncoder(
    resizeEncoder(encoder, (size) => size + offset),
    { postOffset: ({ postOffset }) => postOffset + offset }
  );
}
function padLeftDecoder(decoder, offset) {
  return offsetDecoder(
    resizeDecoder(decoder, (size) => size + offset),
    { preOffset: ({ preOffset }) => preOffset + offset }
  );
}
function padRightDecoder(decoder, offset) {
  return offsetDecoder(
    resizeDecoder(decoder, (size) => size + offset),
    { postOffset: ({ postOffset }) => postOffset + offset }
  );
}
function padLeftCodec(codec, offset) {
  return combineCodec(padLeftEncoder(codec, offset), padLeftDecoder(codec, offset));
}
function padRightCodec(codec, offset) {
  return combineCodec(padRightEncoder(codec, offset), padRightDecoder(codec, offset));
}

// src/reverse-codec.ts
function copySourceToTargetInReverse(source, target_WILL_MUTATE, sourceOffset, sourceLength, targetOffset = 0) {
  while (sourceOffset < --sourceLength) {
    const leftValue = source[sourceOffset];
    target_WILL_MUTATE[sourceOffset + targetOffset] = source[sourceLength];
    target_WILL_MUTATE[sourceLength + targetOffset] = leftValue;
    sourceOffset++;
  }
  if (sourceOffset === sourceLength) {
    target_WILL_MUTATE[sourceOffset + targetOffset] = source[sourceOffset];
  }
}
function reverseEncoder(encoder) {
  assertIsFixedSize(encoder);
  return createEncoder({
    ...encoder,
    write: (value, bytes, offset) => {
      const newOffset = encoder.write(value, bytes, offset);
      copySourceToTargetInReverse(
        bytes,
        bytes,
        offset,
        offset + encoder.fixedSize
      );
      return newOffset;
    }
  });
}
function reverseDecoder(decoder) {
  assertIsFixedSize(decoder);
  return createDecoder({
    ...decoder,
    read: (bytes, offset) => {
      const reversedBytes = bytes.slice();
      copySourceToTargetInReverse(
        bytes,
        reversedBytes,
        offset,
        offset + decoder.fixedSize
      );
      return decoder.read(reversedBytes, offset);
    }
  });
}
function reverseCodec(codec) {
  return combineCodec(reverseEncoder(codec), reverseDecoder(codec));
}

// src/transform-codec.ts
function transformEncoder(encoder, unmap) {
  return createEncoder({
    ...isVariableSize(encoder) ? { ...encoder, getSizeFromValue: (value) => encoder.getSizeFromValue(unmap(value)) } : encoder,
    write: (value, bytes, offset) => encoder.write(unmap(value), bytes, offset)
  });
}
function transformDecoder(decoder, map) {
  return createDecoder({
    ...decoder,
    read: (bytes, offset) => {
      const [value, newOffset] = decoder.read(bytes, offset);
      return [map(value, bytes, offset), newOffset];
    }
  });
}
function transformCodec(codec, unmap, map) {
  return createCodec({
    ...transformEncoder(codec, unmap),
    read: map ? transformDecoder(codec, map).read : codec.read
  });
}

exports.addCodecSentinel = addCodecSentinel;
exports.addCodecSizePrefix = addCodecSizePrefix;
exports.addDecoderSentinel = addDecoderSentinel;
exports.addDecoderSizePrefix = addDecoderSizePrefix;
exports.addEncoderSentinel = addEncoderSentinel;
exports.addEncoderSizePrefix = addEncoderSizePrefix;
exports.assertByteArrayHasEnoughBytesForCodec = assertByteArrayHasEnoughBytesForCodec;
exports.assertByteArrayIsNotEmptyForCodec = assertByteArrayIsNotEmptyForCodec;
exports.assertByteArrayOffsetIsNotOutOfRange = assertByteArrayOffsetIsNotOutOfRange;
exports.assertIsFixedSize = assertIsFixedSize;
exports.assertIsVariableSize = assertIsVariableSize;
exports.combineCodec = combineCodec;
exports.containsBytes = containsBytes;
exports.createCodec = createCodec;
exports.createDecoder = createDecoder;
exports.createEncoder = createEncoder;
exports.fixBytes = fixBytes;
exports.fixCodecSize = fixCodecSize;
exports.fixDecoderSize = fixDecoderSize;
exports.fixEncoderSize = fixEncoderSize;
exports.getEncodedSize = getEncodedSize;
exports.isFixedSize = isFixedSize;
exports.isVariableSize = isVariableSize;
exports.mergeBytes = mergeBytes;
exports.offsetCodec = offsetCodec;
exports.offsetDecoder = offsetDecoder;
exports.offsetEncoder = offsetEncoder;
exports.padBytes = padBytes;
exports.padLeftCodec = padLeftCodec;
exports.padLeftDecoder = padLeftDecoder;
exports.padLeftEncoder = padLeftEncoder;
exports.padRightCodec = padRightCodec;
exports.padRightDecoder = padRightDecoder;
exports.padRightEncoder = padRightEncoder;
exports.resizeCodec = resizeCodec;
exports.resizeDecoder = resizeDecoder;
exports.resizeEncoder = resizeEncoder;
exports.reverseCodec = reverseCodec;
exports.reverseDecoder = reverseDecoder;
exports.reverseEncoder = reverseEncoder;
exports.transformCodec = transformCodec;
exports.transformDecoder = transformDecoder;
exports.transformEncoder = transformEncoder;
//# sourceMappingURL=index.browser.cjs.map
//# sourceMappingURL=index.browser.cjs.map