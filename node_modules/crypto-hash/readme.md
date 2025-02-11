# crypto-hash [![Build Status](https://travis-ci.com/sindresorhus/crypto-hash.svg?branch=master)](https://travis-ci.com/github/sindresorhus/crypto-hash)

> Tiny hashing module that uses the native crypto API in Node.js and the browser

Useful when you want the same hashing API in all environments. My cat calls it *isomorphic*.

In Node.js it uses [`require('crypto')`](https://nodejs.org/api/crypto.html#crypto_class_hash), while in the browser it uses [`window.crypto`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest).

The browser version is only ~300 bytes minified & gzipped.

## Install

```
$ npm install crypto-hash
```

## Usage

```js
const {sha256} = require('crypto-hash');

(async () => {
	console.log(await sha256('🦄'));
	//=> '5df82936cbf0864be4b7ba801bee392457fde9e4'
})();
```

## API

### sha1(input, options?)
### sha256(input, options?)
### sha384(input, options?)
### sha512(input, options?)

Returns a `Promise<string>` with a hex-encoded hash.

*In Node.js 12 or later, the operation is executed using [`worker_threads`](https://nodejs.org/api/worker_threads.html). A thread is lazily spawned on the first operation and lives until the end of the program execution. It's `unref`ed, so it won't keep the process alive.*

[SHA-1 is insecure](https://stackoverflow.com/a/38045085/64949) and should not be used for anything sensitive.

#### input

Type: `string` [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

#### options

Type: `object`

##### outputFormat

Type: `string`\
Values: `'hex' | 'buffer'`\
Default: `'hex'`

Setting this to `buffer` makes it return an `ArrayBuffer` instead of a `string`.

## Related

- [hasha](https://github.com/sindresorhus/hasha) - Hashing in Node.js made simple
