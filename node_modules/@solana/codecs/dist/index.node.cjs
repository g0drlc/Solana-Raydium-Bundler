'use strict';

var codecsCore = require('@solana/codecs-core');
var codecsDataStructures = require('@solana/codecs-data-structures');
var codecsNumbers = require('@solana/codecs-numbers');
var codecsStrings = require('@solana/codecs-strings');
var options = require('@solana/options');



Object.keys(codecsCore).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return codecsCore[k]; }
	});
});
Object.keys(codecsDataStructures).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return codecsDataStructures[k]; }
	});
});
Object.keys(codecsNumbers).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return codecsNumbers[k]; }
	});
});
Object.keys(codecsStrings).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return codecsStrings[k]; }
	});
});
Object.keys(options).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return options[k]; }
	});
});
//# sourceMappingURL=index.node.cjs.map
//# sourceMappingURL=index.node.cjs.map