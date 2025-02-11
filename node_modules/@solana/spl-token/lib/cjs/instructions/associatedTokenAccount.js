"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecoverNestedInstruction = exports.createAssociatedTokenAccountIdempotentInstruction = exports.createAssociatedTokenAccountInstruction = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_js_1 = require("../constants.js");
/**
 * Construct a CreateAssociatedTokenAccount instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param associatedToken          New associated token account
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, programId = constants_js_1.TOKEN_PROGRAM_ID, associatedTokenProgramId = constants_js_1.ASSOCIATED_TOKEN_PROGRAM_ID) {
    return buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, Buffer.alloc(0), programId, associatedTokenProgramId);
}
exports.createAssociatedTokenAccountInstruction = createAssociatedTokenAccountInstruction;
/**
 * Construct a CreateAssociatedTokenAccountIdempotent instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param associatedToken          New associated token account
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createAssociatedTokenAccountIdempotentInstruction(payer, associatedToken, owner, mint, programId = constants_js_1.TOKEN_PROGRAM_ID, associatedTokenProgramId = constants_js_1.ASSOCIATED_TOKEN_PROGRAM_ID) {
    return buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, Buffer.from([1]), programId, associatedTokenProgramId);
}
exports.createAssociatedTokenAccountIdempotentInstruction = createAssociatedTokenAccountIdempotentInstruction;
function buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, instructionData, programId = constants_js_1.TOKEN_PROGRAM_ID, associatedTokenProgramId = constants_js_1.ASSOCIATED_TOKEN_PROGRAM_ID) {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedToken, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: programId, isSigner: false, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: associatedTokenProgramId,
        data: instructionData,
    });
}
/**
 * Construct a RecoverNested instruction
 *
 * @param nestedAssociatedToken             Nested associated token account (must be owned by `ownerAssociatedToken`)
 * @param nestedMint                        Token mint for the nested associated token account
 * @param destinationAssociatedToken        Wallet's associated token account
 * @param ownerAssociatedToken              Owner associated token account address (must be owned by `owner`)
 * @param ownerMint                         Token mint for the owner associated token account
 * @param owner                             Wallet address for the owner associated token account
 * @param programId                         SPL Token program account
 * @param associatedTokenProgramId          SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createRecoverNestedInstruction(nestedAssociatedToken, nestedMint, destinationAssociatedToken, ownerAssociatedToken, ownerMint, owner, programId = constants_js_1.TOKEN_PROGRAM_ID, associatedTokenProgramId = constants_js_1.ASSOCIATED_TOKEN_PROGRAM_ID) {
    const keys = [
        { pubkey: nestedAssociatedToken, isSigner: false, isWritable: true },
        { pubkey: nestedMint, isSigner: false, isWritable: false },
        { pubkey: destinationAssociatedToken, isSigner: false, isWritable: true },
        { pubkey: ownerAssociatedToken, isSigner: false, isWritable: true },
        { pubkey: ownerMint, isSigner: false, isWritable: false },
        { pubkey: owner, isSigner: true, isWritable: true },
        { pubkey: programId, isSigner: false, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: associatedTokenProgramId,
        data: Buffer.from([2]),
    });
}
exports.createRecoverNestedInstruction = createRecoverNestedInstruction;
//# sourceMappingURL=associatedTokenAccount.js.map