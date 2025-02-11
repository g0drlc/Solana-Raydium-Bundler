import { PublicKey } from '@solana/web3.js';
export declare const PROGRAM_LAYOUT_VERSIONS: {
    '4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn': number;
    BJ3jrUzddfuSrZHXSCxMUUQsjKEyLmuuyZebkcaFp2fg: number;
    EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o: number;
    '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin': number;
};
export declare function getLayoutVersion(programId: PublicKey): any;
export declare const TOKEN_MINTS: Array<{
    address: PublicKey;
    name: string;
}>;
export declare const MARKETS: Array<{
    address: PublicKey;
    name: string;
    programId: PublicKey;
    deprecated: boolean;
}>;
//# sourceMappingURL=tokens_and_markets.d.ts.map