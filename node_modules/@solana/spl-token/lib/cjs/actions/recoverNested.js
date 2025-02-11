"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverNested = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_js_1 = require("../constants.js");
const associatedTokenAccount_js_1 = require("../instructions/associatedTokenAccount.js");
const mint_js_1 = require("../state/mint.js");
/**
 * Recover funds funds in an associated token account which is owned by an associated token account
 *
 * @param connection               Connection to use
 * @param payer                    Payer of the transaction and initialization fees
 * @param owner                    Owner of original ATA
 * @param mint                     Mint for the original ATA
 * @param nestedMint               Mint for the nested ATA
 * @param confirmOptions           Options for confirming the transaction
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Signature of the confirmed transaction
 */
function recoverNested(connection, payer, owner, mint, nestedMint, confirmOptions, programId = constants_js_1.TOKEN_PROGRAM_ID, associatedTokenProgramId = constants_js_1.ASSOCIATED_TOKEN_PROGRAM_ID) {
    return __awaiter(this, void 0, void 0, function* () {
        const ownerAssociatedToken = (0, mint_js_1.getAssociatedTokenAddressSync)(mint, owner.publicKey, false, programId, associatedTokenProgramId);
        const destinationAssociatedToken = (0, mint_js_1.getAssociatedTokenAddressSync)(nestedMint, owner.publicKey, false, programId, associatedTokenProgramId);
        const nestedAssociatedToken = (0, mint_js_1.getAssociatedTokenAddressSync)(nestedMint, ownerAssociatedToken, true, programId, associatedTokenProgramId);
        const transaction = new web3_js_1.Transaction().add((0, associatedTokenAccount_js_1.createRecoverNestedInstruction)(nestedAssociatedToken, nestedMint, destinationAssociatedToken, ownerAssociatedToken, mint, owner.publicKey, programId, associatedTokenProgramId));
        return yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [payer, owner], confirmOptions);
    });
}
exports.recoverNested = recoverNested;
//# sourceMappingURL=recoverNested.js.map