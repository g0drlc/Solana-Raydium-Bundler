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
exports.createTransferCheckedWithFeeAndTransferHookInstruction = exports.createTransferCheckedWithTransferHookInstruction = exports.addExtraAccountsToInstruction = exports.createUpdateTransferHookInstruction = exports.updateTransferHookInstructionData = exports.createInitializeTransferHookInstruction = exports.initializeTransferHookInstructionData = exports.TransferHookInstruction = void 0;
const buffer_layout_1 = require("@solana/buffer-layout");
const web3_js_1 = require("@solana/web3.js");
const constants_js_1 = require("../../constants.js");
const errors_js_1 = require("../../errors.js");
const internal_js_1 = require("../../instructions/internal.js");
const types_js_1 = require("../../instructions/types.js");
const buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
const transferChecked_js_1 = require("../../instructions/transferChecked.js");
const instructions_js_1 = require("../transferFee/instructions.js");
const mint_js_1 = require("../../state/mint.js");
const state_js_1 = require("./state.js");
var TransferHookInstruction;
(function (TransferHookInstruction) {
    TransferHookInstruction[TransferHookInstruction["Initialize"] = 0] = "Initialize";
    TransferHookInstruction[TransferHookInstruction["Update"] = 1] = "Update";
})(TransferHookInstruction || (exports.TransferHookInstruction = TransferHookInstruction = {}));
/** The struct that represents the instruction data as it is read by the program */
exports.initializeTransferHookInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_1.u8)('transferHookInstruction'),
    (0, buffer_layout_utils_1.publicKey)('authority'),
    (0, buffer_layout_utils_1.publicKey)('transferHookProgramId'),
]);
/**
 * Construct an InitializeTransferHook instruction
 *
 * @param mint                  Token mint account
 * @param authority             Transfer hook authority account
 * @param transferHookProgramId Transfer hook program account
 * @param programId             SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createInitializeTransferHookInstruction(mint, authority, transferHookProgramId, programId) {
    if (!(0, constants_js_1.programSupportsExtensions)(programId)) {
        throw new errors_js_1.TokenUnsupportedInstructionError();
    }
    const keys = [{ pubkey: mint, isSigner: false, isWritable: true }];
    const data = Buffer.alloc(exports.initializeTransferHookInstructionData.span);
    exports.initializeTransferHookInstructionData.encode({
        instruction: types_js_1.TokenInstruction.TransferHookExtension,
        transferHookInstruction: TransferHookInstruction.Initialize,
        authority,
        transferHookProgramId,
    }, data);
    return new web3_js_1.TransactionInstruction({ keys, programId, data });
}
exports.createInitializeTransferHookInstruction = createInitializeTransferHookInstruction;
/** The struct that represents the instruction data as it is read by the program */
exports.updateTransferHookInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_1.u8)('transferHookInstruction'),
    (0, buffer_layout_utils_1.publicKey)('transferHookProgramId'),
]);
/**
 * Construct an UpdateTransferHook instruction
 *
 * @param mint                  Mint to update
 * @param authority             The mint's transfer hook authority
 * @param transferHookProgramId The new transfer hook program account
 * @param signers               The signer account(s) for a multisig
 * @param tokenProgramId        SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createUpdateTransferHookInstruction(mint, authority, transferHookProgramId, multiSigners = [], programId = constants_js_1.TOKEN_2022_PROGRAM_ID) {
    if (!(0, constants_js_1.programSupportsExtensions)(programId)) {
        throw new errors_js_1.TokenUnsupportedInstructionError();
    }
    const keys = (0, internal_js_1.addSigners)([{ pubkey: mint, isSigner: false, isWritable: true }], authority, multiSigners);
    const data = Buffer.alloc(exports.updateTransferHookInstructionData.span);
    exports.updateTransferHookInstructionData.encode({
        instruction: types_js_1.TokenInstruction.TransferHookExtension,
        transferHookInstruction: TransferHookInstruction.Update,
        transferHookProgramId,
    }, data);
    return new web3_js_1.TransactionInstruction({ keys, programId, data });
}
exports.createUpdateTransferHookInstruction = createUpdateTransferHookInstruction;
function deEscalateAccountMeta(accountMeta, accountMetas) {
    const maybeHighestPrivileges = accountMetas
        .filter((x) => x.pubkey === accountMeta.pubkey)
        .reduce((acc, x) => {
        if (!acc)
            return { isSigner: x.isSigner, isWritable: x.isWritable };
        return { isSigner: acc.isSigner || x.isSigner, isWritable: acc.isWritable || x.isWritable };
    }, undefined);
    if (maybeHighestPrivileges) {
        const { isSigner, isWritable } = maybeHighestPrivileges;
        if (!isSigner && isSigner !== accountMeta.isSigner) {
            accountMeta.isSigner = false;
        }
        if (!isWritable && isWritable !== accountMeta.isWritable) {
            accountMeta.isWritable = false;
        }
    }
    return accountMeta;
}
/**
 * Add extra accounts needed for transfer hook to an instruction
 *
 * @param connection      Connection to use
 * @param instruction     The transferChecked instruction to add accounts to
 * @param commitment      Commitment to use
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function addExtraAccountsToInstruction(connection, instruction, mint, commitment, programId = constants_js_1.TOKEN_PROGRAM_ID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, constants_js_1.programSupportsExtensions)(programId)) {
            throw new errors_js_1.TokenUnsupportedInstructionError();
        }
        const mintInfo = yield (0, mint_js_1.getMint)(connection, mint, commitment, programId);
        const transferHook = (0, state_js_1.getTransferHook)(mintInfo);
        if (transferHook == null) {
            return instruction;
        }
        const extraAccountsAccount = (0, state_js_1.getExtraAccountMetaAddress)(mint, transferHook.programId);
        const extraAccountsInfo = yield connection.getAccountInfo(extraAccountsAccount, commitment);
        if (extraAccountsInfo == null) {
            return instruction;
        }
        const extraAccountMetas = (0, state_js_1.getExtraAccountMetas)(extraAccountsInfo);
        const accountMetas = instruction.keys;
        for (const extraAccountMeta of extraAccountMetas) {
            const accountMetaUnchecked = yield (0, state_js_1.resolveExtraAccountMeta)(connection, extraAccountMeta, accountMetas, instruction.data, transferHook.programId);
            const accountMeta = deEscalateAccountMeta(accountMetaUnchecked, accountMetas);
            accountMetas.push(accountMeta);
        }
        accountMetas.push({ pubkey: transferHook.programId, isSigner: false, isWritable: false });
        accountMetas.push({ pubkey: extraAccountsAccount, isSigner: false, isWritable: false });
        return new web3_js_1.TransactionInstruction({ keys: accountMetas, programId, data: instruction.data });
    });
}
exports.addExtraAccountsToInstruction = addExtraAccountsToInstruction;
/**
 * Construct an transferChecked instruction with extra accounts for transfer hook
 *
 * @param connection            Connection to use
 * @param source                Source account
 * @param mint                  Mint to update
 * @param destination           Destination account
 * @param authority             The mint's transfer hook authority
 * @param amount                The amount of tokens to transfer
 * @param decimals              Number of decimals in transfer amount
 * @param multiSigners          The signer account(s) for a multisig
 * @param commitment            Commitment to use
 * @param programId             SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createTransferCheckedWithTransferHookInstruction(connection, source, mint, destination, authority, amount, decimals, multiSigners = [], commitment, programId = constants_js_1.TOKEN_PROGRAM_ID) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawInstruction = (0, transferChecked_js_1.createTransferCheckedInstruction)(source, mint, destination, authority, amount, decimals, multiSigners, programId);
        const hydratedInstruction = yield addExtraAccountsToInstruction(connection, rawInstruction, mint, commitment, programId);
        return hydratedInstruction;
    });
}
exports.createTransferCheckedWithTransferHookInstruction = createTransferCheckedWithTransferHookInstruction;
/**
 * Construct an transferChecked instruction with extra accounts for transfer hook
 *
 * @param connection            Connection to use
 * @param source                Source account
 * @param mint                  Mint to update
 * @param destination           Destination account
 * @param authority             The mint's transfer hook authority
 * @param amount                The amount of tokens to transfer
 * @param decimals              Number of decimals in transfer amount
 * @param fee                   The calculated fee for the transfer fee extension
 * @param multiSigners          The signer account(s) for a multisig
 * @param commitment            Commitment to use
 * @param programId             SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createTransferCheckedWithFeeAndTransferHookInstruction(connection, source, mint, destination, authority, amount, decimals, fee, multiSigners = [], commitment, programId = constants_js_1.TOKEN_PROGRAM_ID) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawInstruction = (0, instructions_js_1.createTransferCheckedWithFeeInstruction)(source, mint, destination, authority, amount, decimals, fee, multiSigners, programId);
        const hydratedInstruction = yield addExtraAccountsToInstruction(connection, rawInstruction, mint, commitment, programId);
        return hydratedInstruction;
    });
}
exports.createTransferCheckedWithFeeAndTransferHookInstruction = createTransferCheckedWithFeeAndTransferHookInstruction;
//# sourceMappingURL=instructions.js.map