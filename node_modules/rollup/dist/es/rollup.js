/*
  @license
	Rollup.js v4.32.1
	Tue, 28 Jan 2025 08:32:49 GMT - commit abcf4febe11f3d313fae41ddca35fc60670b9ff8

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
export { version as VERSION, defineConfig, rollup, watch } from './shared/node-entry.js';
import './shared/parseAst.js';
import '../native.js';
import 'node:path';
import 'path';
import 'node:process';
import 'node:perf_hooks';
import 'node:fs/promises';
