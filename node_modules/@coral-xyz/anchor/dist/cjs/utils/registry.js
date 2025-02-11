"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeUpgradeableLoaderState = exports.fetchData = exports.verifiedBuild = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const borsh = __importStar(require("@coral-xyz/borsh"));
/**
 * Returns a verified build from the anchor registry. null if no such
 * verified build exists, e.g., if the program has been upgraded since the
 * last verified build.
 */
async function verifiedBuild(connection, programId, limit = 5) {
    const url = `https://api.apr.dev/api/v0/program/${programId.toString()}/latest?limit=${limit}`;
    const [programData, latestBuildsResp] = await Promise.all([
        fetchData(connection, programId),
        (0, cross_fetch_1.default)(url),
    ]);
    // Filter out all non successful builds.
    const latestBuilds = (await latestBuildsResp.json()).filter((b) => !b.aborted && b.state === "Built" && b.verified === "Verified");
    if (latestBuilds.length === 0) {
        return null;
    }
    // Get the latest build.
    const build = latestBuilds[0];
    // Has the program been upgraded since the last build?
    if (programData.slot.toNumber() !== build.verified_slot) {
        return null;
    }
    // Success.
    return build;
}
exports.verifiedBuild = verifiedBuild;
/**
 * Returns the program data account for this program, containing the
 * metadata for this program, e.g., the upgrade authority.
 */
async function fetchData(connection, programId) {
    const accountInfo = await connection.getAccountInfo(programId);
    if (accountInfo === null) {
        throw new Error("program account not found");
    }
    const { program } = decodeUpgradeableLoaderState(accountInfo.data);
    const programdataAccountInfo = await connection.getAccountInfo(program.programdataAddress);
    if (programdataAccountInfo === null) {
        throw new Error("program data account not found");
    }
    const { programData } = decodeUpgradeableLoaderState(programdataAccountInfo.data);
    return programData;
}
exports.fetchData = fetchData;
const UPGRADEABLE_LOADER_STATE_LAYOUT = borsh.rustEnum([
    borsh.struct([], "uninitialized"),
    borsh.struct([borsh.option(borsh.publicKey(), "authorityAddress")], "buffer"),
    borsh.struct([borsh.publicKey("programdataAddress")], "program"),
    borsh.struct([
        borsh.u64("slot"),
        borsh.option(borsh.publicKey(), "upgradeAuthorityAddress"),
    ], "programData"),
], undefined, borsh.u32());
function decodeUpgradeableLoaderState(data) {
    return UPGRADEABLE_LOADER_STATE_LAYOUT.decode(data);
}
exports.decodeUpgradeableLoaderState = decodeUpgradeableLoaderState;
//# sourceMappingURL=registry.js.map