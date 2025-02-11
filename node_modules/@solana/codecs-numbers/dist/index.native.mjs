import { SolanaError, SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE } from '@solana/errors';
import { combineCodec, createEncoder, createDecoder, assertByteArrayIsNotEmptyForCodec, assertByteArrayHasEnoughBytesForCodec } from '@solana/codecs-core';

// src/assertions.ts
function assertNumberIsBetweenForCodec(codecDescription, min, max, value) {
  if (value < min || value > max) {
    throw new SolanaError(SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE, {
      codecDescription,
      max,
      min,
      value
    });
  }
}

// src/common.ts
var Endian = /* @__PURE__ */ ((Endian2) => {
  Endian2[Endian2["Little"] = 0] = "Little";
  Endian2[Endian2["Big"] = 1] = "Big";
  return Endian2;
})(Endian || {});
function isLittleEndian(config) {
  return config?.endian === 1 /* Big */ ? false : true;
}
function numberEncoderFactory(input) {
  return createEncoder({
    fixedSize: input.size,
    write(value, bytes, offset) {
      if (input.range) {
        assertNumberIsBetweenForCodec(input.name, input.range[0], input.range[1], value);
      }
      const arrayBuffer = new ArrayBuffer(input.size);
      input.set(new DataView(arrayBuffer), value, isLittleEndian(input.config));
      bytes.set(new Uint8Array(arrayBuffer), offset);
      return offset + input.size;
    }
  });
}
function numberDecoderFactory(input) {
  return createDecoder({
    fixedSize: input.size,
    read(bytes, offset = 0) {
      assertByteArrayIsNotEmptyForCodec(input.name, bytes, offset);
      assertByteArrayHasEnoughBytesForCodec(input.name, input.size, bytes, offset);
      const view = new DataView(toArrayBuffer(bytes, offset, input.size));
      return [input.get(view, isLittleEndian(input.config)), offset + input.size];
    }
  });
}
function toArrayBuffer(bytes, offset, length) {
  const bytesOffset = bytes.byteOffset + (offset ?? 0);
  const bytesLength = length ?? bytes.byteLength;
  return bytes.buffer.slice(bytesOffset, bytesOffset + bytesLength);
}

// src/f32.ts
var getF32Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "f32",
  set: (view, value, le) => view.setFloat32(0, Number(value), le),
  size: 4
});
var getF32Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getFloat32(0, le),
  name: "f32",
  size: 4
});
var getF32Codec = (config = {}) => combineCodec(getF32Encoder(config), getF32Decoder(config));
var getF64Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "f64",
  set: (view, value, le) => view.setFloat64(0, Number(value), le),
  size: 8
});
var getF64Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getFloat64(0, le),
  name: "f64",
  size: 8
});
var getF64Codec = (config = {}) => combineCodec(getF64Encoder(config), getF64Decoder(config));
var getI128Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i128",
  range: [-BigInt("0x7fffffffffffffffffffffffffffffff") - 1n, BigInt("0x7fffffffffffffffffffffffffffffff")],
  set: (view, value, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const rightMask = 0xffffffffffffffffn;
    view.setBigInt64(leftOffset, BigInt(value) >> 64n, le);
    view.setBigUint64(rightOffset, BigInt(value) & rightMask, le);
  },
  size: 16
});
var getI128Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const left = view.getBigInt64(leftOffset, le);
    const right = view.getBigUint64(rightOffset, le);
    return (left << 64n) + right;
  },
  name: "i128",
  size: 16
});
var getI128Codec = (config = {}) => combineCodec(getI128Encoder(config), getI128Decoder(config));
var getI16Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i16",
  range: [-Number("0x7fff") - 1, Number("0x7fff")],
  set: (view, value, le) => view.setInt16(0, Number(value), le),
  size: 2
});
var getI16Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getInt16(0, le),
  name: "i16",
  size: 2
});
var getI16Codec = (config = {}) => combineCodec(getI16Encoder(config), getI16Decoder(config));
var getI32Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i32",
  range: [-Number("0x7fffffff") - 1, Number("0x7fffffff")],
  set: (view, value, le) => view.setInt32(0, Number(value), le),
  size: 4
});
var getI32Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getInt32(0, le),
  name: "i32",
  size: 4
});
var getI32Codec = (config = {}) => combineCodec(getI32Encoder(config), getI32Decoder(config));
var getI64Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i64",
  range: [-BigInt("0x7fffffffffffffff") - 1n, BigInt("0x7fffffffffffffff")],
  set: (view, value, le) => view.setBigInt64(0, BigInt(value), le),
  size: 8
});
var getI64Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getBigInt64(0, le),
  name: "i64",
  size: 8
});
var getI64Codec = (config = {}) => combineCodec(getI64Encoder(config), getI64Decoder(config));
var getI8Encoder = () => numberEncoderFactory({
  name: "i8",
  range: [-Number("0x7f") - 1, Number("0x7f")],
  set: (view, value) => view.setInt8(0, Number(value)),
  size: 1
});
var getI8Decoder = () => numberDecoderFactory({
  get: (view) => view.getInt8(0),
  name: "i8",
  size: 1
});
var getI8Codec = () => combineCodec(getI8Encoder(), getI8Decoder());
var getShortU16Encoder = () => createEncoder({
  getSizeFromValue: (value) => {
    if (value <= 127) return 1;
    if (value <= 16383) return 2;
    return 3;
  },
  maxSize: 3,
  write: (value, bytes, offset) => {
    assertNumberIsBetweenForCodec("shortU16", 0, 65535, value);
    const shortU16Bytes = [0];
    for (let ii = 0; ; ii += 1) {
      const alignedValue = Number(value) >> ii * 7;
      if (alignedValue === 0) {
        break;
      }
      const nextSevenBits = 127 & alignedValue;
      shortU16Bytes[ii] = nextSevenBits;
      if (ii > 0) {
        shortU16Bytes[ii - 1] |= 128;
      }
    }
    bytes.set(shortU16Bytes, offset);
    return offset + shortU16Bytes.length;
  }
});
var getShortU16Decoder = () => createDecoder({
  maxSize: 3,
  read: (bytes, offset) => {
    let value = 0;
    let byteCount = 0;
    while (++byteCount) {
      const byteIndex = byteCount - 1;
      const currentByte = bytes[offset + byteIndex];
      const nextSevenBits = 127 & currentByte;
      value |= nextSevenBits << byteIndex * 7;
      if ((currentByte & 128) === 0) {
        break;
      }
    }
    return [value, offset + byteCount];
  }
});
var getShortU16Codec = () => combineCodec(getShortU16Encoder(), getShortU16Decoder());
var getU128Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u128",
  range: [0n, BigInt("0xffffffffffffffffffffffffffffffff")],
  set: (view, value, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const rightMask = 0xffffffffffffffffn;
    view.setBigUint64(leftOffset, BigInt(value) >> 64n, le);
    view.setBigUint64(rightOffset, BigInt(value) & rightMask, le);
  },
  size: 16
});
var getU128Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const left = view.getBigUint64(leftOffset, le);
    const right = view.getBigUint64(rightOffset, le);
    return (left << 64n) + right;
  },
  name: "u128",
  size: 16
});
var getU128Codec = (config = {}) => combineCodec(getU128Encoder(config), getU128Decoder(config));
var getU16Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u16",
  range: [0, Number("0xffff")],
  set: (view, value, le) => view.setUint16(0, Number(value), le),
  size: 2
});
var getU16Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getUint16(0, le),
  name: "u16",
  size: 2
});
var getU16Codec = (config = {}) => combineCodec(getU16Encoder(config), getU16Decoder(config));
var getU32Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u32",
  range: [0, Number("0xffffffff")],
  set: (view, value, le) => view.setUint32(0, Number(value), le),
  size: 4
});
var getU32Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getUint32(0, le),
  name: "u32",
  size: 4
});
var getU32Codec = (config = {}) => combineCodec(getU32Encoder(config), getU32Decoder(config));
var getU64Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u64",
  range: [0n, BigInt("0xffffffffffffffff")],
  set: (view, value, le) => view.setBigUint64(0, BigInt(value), le),
  size: 8
});
var getU64Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getBigUint64(0, le),
  name: "u64",
  size: 8
});
var getU64Codec = (config = {}) => combineCodec(getU64Encoder(config), getU64Decoder(config));
var getU8Encoder = () => numberEncoderFactory({
  name: "u8",
  range: [0, Number("0xff")],
  set: (view, value) => view.setUint8(0, Number(value)),
  size: 1
});
var getU8Decoder = () => numberDecoderFactory({
  get: (view) => view.getUint8(0),
  name: "u8",
  size: 1
});
var getU8Codec = () => combineCodec(getU8Encoder(), getU8Decoder());

export { Endian, assertNumberIsBetweenForCodec, getF32Codec, getF32Decoder, getF32Encoder, getF64Codec, getF64Decoder, getF64Encoder, getI128Codec, getI128Decoder, getI128Encoder, getI16Codec, getI16Decoder, getI16Encoder, getI32Codec, getI32Decoder, getI32Encoder, getI64Codec, getI64Decoder, getI64Encoder, getI8Codec, getI8Decoder, getI8Encoder, getShortU16Codec, getShortU16Decoder, getShortU16Encoder, getU128Codec, getU128Decoder, getU128Encoder, getU16Codec, getU16Decoder, getU16Encoder, getU32Codec, getU32Decoder, getU32Encoder, getU64Codec, getU64Decoder, getU64Encoder, getU8Codec, getU8Decoder, getU8Encoder };
//# sourceMappingURL=index.native.mjs.map
//# sourceMappingURL=index.native.mjs.map