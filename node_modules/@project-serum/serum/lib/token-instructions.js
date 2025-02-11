"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAccount = exports.mintTo = exports.setAuthority = exports.revoke = exports.approve = exports.transfer = exports.initializeAccount = exports.initializeMint = exports.decodeTokenInstructionData = exports.SRM_DECIMALS = exports.SRM_MINT = exports.MSRM_DECIMALS = exports.MSRM_MINT = exports.WRAPPED_SOL_MINT = exports.TOKEN_PROGRAM_ID = exports.CLOSE_ACCOUNT_OWNER_INDEX = exports.CLOSE_ACCOUNT_DESTINATION_INDEX = exports.CLOSE_ACCOUNT_SOURCE_INDEX = exports.TRANSFER_OWNER_INDEX = exports.TRANSFER_DESTINATION_INDEX = exports.TRANSFER_SOURCE_INDEX = exports.INITIALIZE_ACCOUNT_OWNER_INDEX = exports.INITIALIZE_ACCOUNT_MINT_INDEX = exports.INITIALIZE_ACCOUNT_ACCOUNT_INDEX = void 0;
const BufferLayout = __importStar(require("buffer-layout"));
const web3_js_1 = require("@solana/web3.js");
const layout_1 = require("./layout");
// NOTE: Update these if the position of arguments for the initializeAccount instruction changes
exports.INITIALIZE_ACCOUNT_ACCOUNT_INDEX = 0;
exports.INITIALIZE_ACCOUNT_MINT_INDEX = 1;
exports.INITIALIZE_ACCOUNT_OWNER_INDEX = 2;
// NOTE: Update these if the position of arguments for the transfer instruction changes
exports.TRANSFER_SOURCE_INDEX = 0;
exports.TRANSFER_DESTINATION_INDEX = 1;
exports.TRANSFER_OWNER_INDEX = 2;
// NOTE: Update these if the position of arguments for the closeAccount instruction changes
exports.CLOSE_ACCOUNT_SOURCE_INDEX = 0;
exports.CLOSE_ACCOUNT_DESTINATION_INDEX = 1;
exports.CLOSE_ACCOUNT_OWNER_INDEX = 2;
exports.TOKEN_PROGRAM_ID = new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
exports.WRAPPED_SOL_MINT = new web3_js_1.PublicKey('So11111111111111111111111111111111111111112');
exports.MSRM_MINT = new web3_js_1.PublicKey('MSRMcoVyrFxnSgo5uXwone5SKcGhT1KEJMFEkMEWf9L');
exports.MSRM_DECIMALS = 0;
exports.SRM_MINT = new web3_js_1.PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt');
exports.SRM_DECIMALS = 6;
const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'));
LAYOUT.addVariant(0, BufferLayout.struct([
    BufferLayout.u8('decimals'),
    layout_1.publicKeyLayout('mintAuthority'),
    BufferLayout.u8('freezeAuthorityOption'),
    layout_1.publicKeyLayout('freezeAuthority'),
]), 'initializeMint');
LAYOUT.addVariant(1, BufferLayout.struct([]), 'initializeAccount');
LAYOUT.addVariant(3, BufferLayout.struct([BufferLayout.nu64('amount')]), 'transfer');
LAYOUT.addVariant(4, BufferLayout.struct([BufferLayout.nu64('amount')]), 'approve');
LAYOUT.addVariant(5, BufferLayout.struct([]), 'revoke');
LAYOUT.addVariant(6, BufferLayout.struct([
    BufferLayout.u8('authorityType'),
    BufferLayout.u8('newAuthorityOption'),
    layout_1.publicKeyLayout('newAuthority'),
]), 'setAuthority');
LAYOUT.addVariant(7, BufferLayout.struct([BufferLayout.nu64('amount')]), 'mintTo');
LAYOUT.addVariant(8, BufferLayout.struct([BufferLayout.nu64('amount')]), 'burn');
LAYOUT.addVariant(9, BufferLayout.struct([]), 'closeAccount');
const instructionMaxSpan = Math.max(...Object.values(LAYOUT.registry).map((r) => r.span));
function encodeTokenInstructionData(instruction) {
    const b = Buffer.alloc(instructionMaxSpan);
    const span = LAYOUT.encode(instruction, b);
    return b.slice(0, span);
}
function decodeTokenInstructionData(instruction) {
    return LAYOUT.decode(instruction);
}
exports.decodeTokenInstructionData = decodeTokenInstructionData;
function initializeMint({ mint, decimals, mintAuthority, freezeAuthority = null, }) {
    const keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            initializeMint: {
                decimals,
                mintAuthority,
                freezeAuthorityOption: !!freezeAuthority,
                freezeAuthority: freezeAuthority || new web3_js_1.PublicKey(0),
            },
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.initializeMint = initializeMint;
function initializeAccount({ account, mint, owner }) {
    const keys = [
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            initializeAccount: {},
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.initializeAccount = initializeAccount;
function transfer({ source, destination, amount, owner }) {
    const keys = [
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            transfer: { amount },
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.transfer = transfer;
function approve({ source, delegate, amount, owner }) {
    const keys = [
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: delegate, isSigner: false, isWritable: false },
        { pubkey: owner, isSigner: true, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            approve: { amount },
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.approve = approve;
function revoke({ source, owner }) {
    const keys = [
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            revoke: {},
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.revoke = revoke;
function setAuthority({ target, currentAuthority, newAuthority, authorityType, }) {
    const keys = [
        { pubkey: target, isSigner: false, isWritable: true },
        { pubkey: currentAuthority, isSigner: true, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            setAuthority: {
                authorityType,
                newAuthorityOption: !!newAuthority,
                newAuthority,
            },
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.setAuthority = setAuthority;
function mintTo({ mint, destination, amount, mintAuthority }) {
    const keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
        { pubkey: mintAuthority, isSigner: true, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            mintTo: { amount },
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.mintTo = mintTo;
function closeAccount({ source, destination, owner }) {
    const keys = [
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            closeAccount: {},
        }),
        programId: exports.TOKEN_PROGRAM_ID,
    });
}
exports.closeAccount = closeAccount;
//# sourceMappingURL=token-instructions.js.map