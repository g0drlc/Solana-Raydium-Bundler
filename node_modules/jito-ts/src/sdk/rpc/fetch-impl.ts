// copied from @solana/web3.js 1.74.0
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/fetch-impl.ts
import * as nodeFetch from 'node-fetch';

export * from 'node-fetch';
export default async function (
  input: nodeFetch.RequestInfo,
  init?: nodeFetch.RequestInit
): Promise<nodeFetch.Response> {
  const processedInput =
    typeof input === 'string' && input.slice(0, 2) === '//'
      ? 'https:' + input
      : input;
  return await nodeFetch.default(processedInput, init);
}
