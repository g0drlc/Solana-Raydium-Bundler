"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = exports.coder = exports.program = void 0;
const web3_js_1 = require("@solana/web3.js");
const index_js_1 = require("../program/index.js");
const index_js_2 = require("../coder/system/index.js");
const SYSTEM_PROGRAM_ID = new web3_js_1.PublicKey("11111111111111111111111111111111");
function program(provider) {
    return new index_js_1.Program(exports.IDL, SYSTEM_PROGRAM_ID, provider, coder());
}
exports.program = program;
function coder() {
    return new index_js_2.SystemCoder(exports.IDL);
}
exports.coder = coder;
exports.IDL = {
    version: "0.1.0",
    name: "system_program",
    instructions: [
        {
            name: "createAccount",
            accounts: [
                {
                    name: "from",
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: "to",
                    isMut: true,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64",
                },
                {
                    name: "space",
                    type: "u64",
                },
                {
                    name: "owner",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "assign",
            accounts: [
                {
                    name: "pubkey",
                    isMut: true,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "owner",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "transfer",
            accounts: [
                {
                    name: "from",
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: "to",
                    isMut: true,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64",
                },
            ],
        },
        {
            name: "createAccountWithSeed",
            accounts: [
                {
                    name: "from",
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: "to",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "base",
                    isMut: false,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "base",
                    type: "publicKey",
                },
                {
                    name: "seed",
                    type: "string",
                },
                {
                    name: "lamports",
                    type: "u64",
                },
                {
                    name: "space",
                    type: "u64",
                },
                {
                    name: "owner",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "advanceNonceAccount",
            accounts: [
                {
                    name: "nonce",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "recentBlockhashes",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "authorized",
                    isMut: false,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "authorized",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "withdrawNonceAccount",
            accounts: [
                {
                    name: "nonce",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "to",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "recentBlockhashes",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "rent",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "authorized",
                    isMut: false,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64",
                },
            ],
        },
        {
            name: "initializeNonceAccount",
            accounts: [
                {
                    name: "nonce",
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: "recentBlockhashes",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "rent",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: "authorized",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "authorizeNonceAccount",
            accounts: [
                {
                    name: "nonce",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "authorized",
                    isMut: false,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "authorized",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "allocate",
            accounts: [
                {
                    name: "pubkey",
                    isMut: true,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "space",
                    type: "u64",
                },
            ],
        },
        {
            name: "allocateWithSeed",
            accounts: [
                {
                    name: "account",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "base",
                    isMut: false,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "base",
                    type: "publicKey",
                },
                {
                    name: "seed",
                    type: "string",
                },
                {
                    name: "space",
                    type: "u64",
                },
                {
                    name: "owner",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "assignWithSeed",
            accounts: [
                {
                    name: "account",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "base",
                    isMut: false,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: "base",
                    type: "publicKey",
                },
                {
                    name: "seed",
                    type: "string",
                },
                {
                    name: "owner",
                    type: "publicKey",
                },
            ],
        },
        {
            name: "transferWithSeed",
            accounts: [
                {
                    name: "from",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "base",
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: "to",
                    isMut: true,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64",
                },
                {
                    name: "seed",
                    type: "string",
                },
                {
                    name: "owner",
                    type: "publicKey",
                },
            ],
        },
    ],
    accounts: [
        {
            name: "nonce",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "version",
                        type: "u32",
                    },
                    {
                        name: "state",
                        type: "u32",
                    },
                    {
                        name: "authorizedPubkey",
                        type: "publicKey",
                    },
                    {
                        name: "nonce",
                        type: "publicKey",
                    },
                    {
                        name: "feeCalculator",
                        type: {
                            defined: "FeeCalculator",
                        },
                    },
                ],
            },
        },
    ],
    types: [
        {
            name: "FeeCalculator",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "lamportsPerSignature",
                        type: "u64",
                    },
                ],
            },
        },
    ],
};
//# sourceMappingURL=system.js.map