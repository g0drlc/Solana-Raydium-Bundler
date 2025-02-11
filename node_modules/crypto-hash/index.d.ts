export interface OptionsHexOutput {
	outputFormat?: 'hex';
}

export interface OptionBufferOutput {
	outputFormat: 'buffer';
}

/**
[SHA-1 is insecure](https://stackoverflow.com/a/38045085/64949) and should not be used for anything sensitive.

@returns The hex-encoded hash.
*/
export function sha1(
	input: string | ArrayBuffer | ArrayBufferView,
	options?: OptionsHexOutput
): Promise<string>;
export function sha1(
	input: string | ArrayBuffer | ArrayBufferView,
	options: OptionBufferOutput
): Promise<ArrayBuffer>;

/**
@returns The hex-encoded hash.

@example
```
import {sha256} from 'crypto-hash';

(async () => {
	console.log(await sha256('🦄'));
	//=> '5df82936cbf0864be4b7ba801bee392457fde9e4'
})();
```
*/
export function sha256(
	input: string | ArrayBuffer | ArrayBufferView,
	options?: OptionsHexOutput
): Promise<string>;
export function sha256(
	input: string | ArrayBuffer | ArrayBufferView,
	options: OptionBufferOutput
): Promise<ArrayBuffer>;

/**
@returns The hex-encoded hash.
*/
export function sha384(
	input: string | ArrayBuffer | ArrayBufferView,
	options?: OptionsHexOutput
): Promise<string>;
export function sha384(
	input: string | ArrayBuffer | ArrayBufferView,
	options: OptionBufferOutput
): Promise<ArrayBuffer>;

/**
@returns The hex-encoded hash.
*/
export function sha512(
	input: string | ArrayBuffer | ArrayBufferView,
	options?: OptionsHexOutput
): Promise<string>;
export function sha512(
	input: string | ArrayBuffer | ArrayBufferView,
	options: OptionBufferOutput
): Promise<ArrayBuffer>;
