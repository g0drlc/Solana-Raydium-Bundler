/* eslint-env browser */
/* global globalThis:readonly */
'use strict';

// Ponyfill for `globalThis`
const _globalThis = (() => {
	if (typeof globalThis !== 'undefined') {
		return globalThis;
	}

	if (typeof self !== 'undefined') {
		return self;
	}

	/* istanbul ignore next */
	if (typeof window !== 'undefined') {
		return window;
	}

	/* istanbul ignore next */
	if (typeof global !== 'undefined') {
		return global;
	}
})();

const bufferToHex = buffer => {
	const view = new DataView(buffer);

	let hexCodes = '';
	for (let i = 0; i < view.byteLength; i += 4) {
		hexCodes += view.getUint32(i).toString(16).padStart(8, '0');
	}

	return hexCodes;
};

const create = algorithm => async (buffer, options) => {
	if (typeof buffer === 'string') {
		buffer = new _globalThis.TextEncoder().encode(buffer);
	}

	options = {
		outputFormat: 'hex',
		...options
	};

	const hash = await _globalThis.crypto.subtle.digest(algorithm, buffer);

	return options.outputFormat === 'hex' ? bufferToHex(hash) : hash;
};

exports.sha1 = create('SHA-1');
exports.sha256 = create('SHA-256');
exports.sha384 = create('SHA-384');
exports.sha512 = create('SHA-512');
