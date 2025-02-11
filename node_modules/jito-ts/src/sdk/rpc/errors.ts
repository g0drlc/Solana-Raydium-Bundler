// copied from @solana/web3.js 1.74.0
// https://github.com/solana-labs/solana-web3.js/blob/3cd0cfd91a7fe08b9c67ac6f0d0c31c0c2ae8157/packages/library-legacy/src/errors.ts#L1
export class SendTransactionError extends Error {
  logs: string[] | undefined;

  constructor(message: string, logs?: string[]) {
    super(message);

    this.logs = logs;
  }
}
