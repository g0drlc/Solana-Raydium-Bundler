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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateClient = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const camelcase_1 = __importDefault(require("camelcase"));
const web3_js_1 = require("@solana/web3.js");
const coder_1 = __importStar(require("../../coder"));
const __1 = require("../../");
const common_1 = require("../common");
const pubkey_1 = require("../../utils/pubkey");
const instruction_1 = __importDefault(require("./instruction"));
const rpc_1 = __importDefault(require("./rpc"));
const transaction_1 = __importDefault(require("./transaction"));
class StateFactory {
    static build(idl, coder, programId, provider) {
        if (idl.state === undefined) {
            return undefined;
        }
        return new StateClient(idl, programId, provider, coder);
    }
}
exports.default = StateFactory;
/**
 * A client for the program state. Similar to the base [[Program]] client,
 * one can use this to send transactions and read accounts for the state
 * abstraction.
 */
class StateClient {
    constructor(idl, programId, provider, coder) {
        this._idl = idl;
        this._programId = programId;
        this._address = programStateAddress(programId);
        this._provider = provider !== null && provider !== void 0 ? provider : __1.getProvider();
        this._coder = coder !== null && coder !== void 0 ? coder : new coder_1.default(idl);
        this._sub = null;
        // Build namespaces.
        const [instruction, transaction, rpc] = (() => {
            let instruction = {};
            let transaction = {};
            let rpc = {};
            idl.state.methods.forEach((m) => {
                // Build instruction method.
                const ixItem = instruction_1.default.build(m, (ixName, ix) => coder.instruction.encodeState(ixName, ix), programId);
                ixItem["accounts"] = (accounts) => {
                    const keys = stateInstructionKeys(programId, provider, m, accounts);
                    return keys.concat(instruction_1.default.accountsArray(accounts, m.accounts));
                };
                // Build transaction method.
                const txItem = transaction_1.default.build(m, ixItem);
                // Build RPC method.
                const rpcItem = rpc_1.default.build(m, txItem, common_1.parseIdlErrors(idl), provider);
                // Attach them all to their respective namespaces.
                const name = camelcase_1.default(m.name);
                instruction[name] = ixItem;
                transaction[name] = txItem;
                rpc[name] = rpcItem;
            });
            return [instruction, transaction, rpc];
        })();
        this.instruction = instruction;
        this.transaction = transaction;
        this.rpc = rpc;
    }
    /**
     * Returns the program ID owning the state.
     */
    get programId() {
        return this._programId;
    }
    /**
     * Returns the client's wallet and network provider.
     */
    get provider() {
        return this._provider;
    }
    /**
     * Returns the coder.
     */
    get coder() {
        return this._coder;
    }
    /**
     * Returns the deserialized state account.
     */
    async fetch() {
        const addr = this.address();
        const accountInfo = await this.provider.connection.getAccountInfo(addr);
        if (accountInfo === null) {
            throw new Error(`Account does not exist ${addr.toString()}`);
        }
        // Assert the account discriminator is correct.
        const expectedDiscriminator = await coder_1.stateDiscriminator(this._idl.state.struct.name);
        if (expectedDiscriminator.compare(accountInfo.data.slice(0, 8))) {
            throw new Error("Invalid account discriminator");
        }
        return this.coder.state.decode(accountInfo.data);
    }
    /**
     * Returns the state address.
     */
    address() {
        return this._address;
    }
    /**
     * Returns an `EventEmitter` with a `"change"` event that's fired whenever
     * the state account cahnges.
     */
    subscribe(commitment) {
        if (this._sub !== null) {
            return this._sub.ee;
        }
        const ee = new eventemitter3_1.default();
        const listener = this.provider.connection.onAccountChange(this.address(), (acc) => {
            const account = this.coder.state.decode(acc.data);
            ee.emit("change", account);
        }, commitment);
        this._sub = {
            ee,
            listener,
        };
        return ee;
    }
    /**
     * Unsubscribes to state changes.
     */
    unsubscribe() {
        if (this._sub !== null) {
            this.provider.connection
                .removeAccountChangeListener(this._sub.listener)
                .then(async () => {
                this._sub = null;
            })
                .catch(console.error);
        }
    }
}
exports.StateClient = StateClient;
// Calculates the deterministic address of the program's "state" account.
function programStateAddress(programId) {
    let [registrySigner] = pubkey_1.findProgramAddressSync([], programId);
    return pubkey_1.createWithSeedSync(registrySigner, "unversioned", programId);
}
// Returns the common keys that are prepended to all instructions targeting
// the "state" of a program.
function stateInstructionKeys(programId, provider, m, accounts) {
    if (m.name === "new") {
        // Ctor `new` method.
        const [programSigner] = pubkey_1.findProgramAddressSync([], programId);
        return [
            {
                pubkey: provider.wallet.publicKey,
                isWritable: false,
                isSigner: true,
            },
            {
                pubkey: programStateAddress(programId),
                isWritable: true,
                isSigner: false,
            },
            { pubkey: programSigner, isWritable: false, isSigner: false },
            {
                pubkey: web3_js_1.SystemProgram.programId,
                isWritable: false,
                isSigner: false,
            },
            { pubkey: programId, isWritable: false, isSigner: false },
            {
                pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                isWritable: false,
                isSigner: false,
            },
        ];
    }
    else {
        common_1.validateAccounts(m.accounts, accounts);
        return [
            {
                pubkey: programStateAddress(programId),
                isWritable: true,
                isSigner: false,
            },
        ];
    }
}
//# sourceMappingURL=state.js.map