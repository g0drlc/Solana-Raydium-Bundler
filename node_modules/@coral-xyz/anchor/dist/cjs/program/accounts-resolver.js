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
exports.AccountStore = exports.AccountsResolver = exports.isAccountsGeneric = void 0;
const camelcase_1 = __importDefault(require("camelcase"));
const web3_js_1 = require("@solana/web3.js");
const idl_js_1 = require("../idl.js");
const utf8 = __importStar(require("../utils/bytes/utf8.js"));
const token_js_1 = require("../utils/token.js");
const token_account_layout_1 = require("./token-account-layout");
const index_js_1 = require("./index.js");
const methods_1 = require("./namespace/methods");
function isAccountsGeneric(accounts) {
    return !(accounts instanceof web3_js_1.PublicKey);
}
exports.isAccountsGeneric = isAccountsGeneric;
// Populates a given accounts context with PDAs and common missing accounts.
class AccountsResolver {
    constructor(_args, _accounts, _provider, _programId, _idlIx, _accountNamespace, _idlTypes, _customResolver) {
        this._accounts = _accounts;
        this._provider = _provider;
        this._programId = _programId;
        this._idlIx = _idlIx;
        this._idlTypes = _idlTypes;
        this._customResolver = _customResolver;
        this._args = _args;
        this._accountStore = new AccountStore(_provider, _accountNamespace, this._programId);
    }
    args(_args) {
        this._args = _args;
    }
    // Note: We serially resolve PDAs one by one rather than doing them
    //       in parallel because there can be dependencies between
    //       addresses. That is, one PDA can be used as a seed in another.
    async resolve() {
        await this.resolveConst(this._idlIx.accounts);
        this._resolveEventCpi(this._idlIx.accounts);
        // Auto populate pdas and relations until we stop finding new accounts
        while ((await this.resolvePdas(this._idlIx.accounts)) +
            (await this.resolveRelations(this._idlIx.accounts)) +
            (await this.resolveCustom()) >
            0) { }
    }
    async resolveCustom() {
        if (this._customResolver) {
            const { accounts, resolved } = await this._customResolver({
                args: this._args,
                accounts: this._accounts,
                provider: this._provider,
                programId: this._programId,
                idlIx: this._idlIx,
            });
            this._accounts = accounts;
            return resolved;
        }
        return 0;
    }
    resolveOptionalsHelper(partialAccounts, accountItems) {
        const nestedAccountsGeneric = {};
        // Looping through accountItem array instead of on partialAccounts, so
        // we only traverse array once
        for (const accountItem of accountItems) {
            const accountName = accountItem.name;
            const partialAccount = partialAccounts[accountName];
            // Skip if the account isn't included (thus would be undefined)
            if (partialAccount === undefined)
                continue;
            if ((0, methods_1.isPartialAccounts)(partialAccount)) {
                // is compound accounts, recurse one level deeper
                if ((0, idl_js_1.isIdlAccounts)(accountItem)) {
                    nestedAccountsGeneric[accountName] = this.resolveOptionalsHelper(partialAccount, accountItem["accounts"]);
                }
                else {
                    // Here we try our best to recover gracefully. If there are optionals we can't check, we will fail then.
                    nestedAccountsGeneric[accountName] = (0, methods_1.flattenPartialAccounts)(partialAccount, true);
                }
            }
            else {
                // if not compound accounts, do null/optional check and proceed
                if (partialAccount !== null) {
                    nestedAccountsGeneric[accountName] = (0, index_js_1.translateAddress)(partialAccount);
                }
                else if (accountItem["isOptional"]) {
                    nestedAccountsGeneric[accountName] = this._programId;
                }
            }
        }
        return nestedAccountsGeneric;
    }
    resolveOptionals(accounts) {
        Object.assign(this._accounts, this.resolveOptionalsHelper(accounts, this._idlIx.accounts));
    }
    get(path) {
        // Only return if pubkey
        const ret = path.reduce((acc, subPath) => acc && acc[subPath], this._accounts);
        if (ret && ret.toBase58) {
            return ret;
        }
    }
    set(path, value) {
        let curr = this._accounts;
        path.forEach((p, idx) => {
            const isLast = idx == path.length - 1;
            if (isLast) {
                curr[p] = value;
            }
            curr[p] = curr[p] || {};
            curr = curr[p];
        });
    }
    async resolveConst(accounts, path = []) {
        for (let k = 0; k < accounts.length; k += 1) {
            const accountDescOrAccounts = accounts[k];
            const subAccounts = accountDescOrAccounts.accounts;
            if (subAccounts) {
                await this.resolveConst(subAccounts, [
                    ...path,
                    (0, camelcase_1.default)(accountDescOrAccounts.name),
                ]);
            }
            const accountDesc = accountDescOrAccounts;
            const accountDescName = (0, camelcase_1.default)(accountDescOrAccounts.name);
            // Signers default to the provider.
            if (accountDesc.isSigner && !this.get([...path, accountDescName])) {
                // @ts-expect-error
                if (this._provider.wallet === undefined) {
                    throw new Error("This function requires the Provider interface implementor to have a 'wallet' field.");
                }
                // @ts-expect-error
                this.set([...path, accountDescName], this._provider.wallet.publicKey);
            }
            // Common accounts are auto populated with magic names by convention.
            if (Reflect.has(AccountsResolver.CONST_ACCOUNTS, accountDescName) &&
                !this.get([...path, accountDescName])) {
                this.set([...path, accountDescName], AccountsResolver.CONST_ACCOUNTS[accountDescName]);
            }
        }
    }
    /**
     * Resolve event CPI accounts `eventAuthority` and `program`.
     *
     * Accounts will only be resolved if they are declared next to each other to
     * reduce the chance of name collision.
     */
    _resolveEventCpi(accounts, path = []) {
        for (const i in accounts) {
            const accountDescOrAccounts = accounts[i];
            const subAccounts = accountDescOrAccounts.accounts;
            if (subAccounts) {
                this._resolveEventCpi(subAccounts, [
                    ...path,
                    (0, camelcase_1.default)(accountDescOrAccounts.name),
                ]);
            }
            // Validate next index exists
            const nextIndex = +i + 1;
            if (nextIndex === accounts.length)
                return;
            const currentName = (0, camelcase_1.default)(accounts[i].name);
            const nextName = (0, camelcase_1.default)(accounts[nextIndex].name);
            // Populate event CPI accounts if they exist
            if (currentName === "eventAuthority" && nextName === "program") {
                const currentPath = [...path, currentName];
                const nextPath = [...path, nextName];
                if (!this.get(currentPath)) {
                    this.set(currentPath, web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], this._programId)[0]);
                }
                if (!this.get(nextPath)) {
                    this.set(nextPath, this._programId);
                }
                return;
            }
        }
    }
    async resolvePdas(accounts, path = []) {
        let found = 0;
        for (let k = 0; k < accounts.length; k += 1) {
            const accountDesc = accounts[k];
            const subAccounts = accountDesc.accounts;
            if (subAccounts) {
                found += await this.resolvePdas(subAccounts, [
                    ...path,
                    (0, camelcase_1.default)(accountDesc.name),
                ]);
            }
            const accountDescCasted = accountDesc;
            const accountDescName = (0, camelcase_1.default)(accountDesc.name);
            // PDA derived from IDL seeds.
            if (accountDescCasted.pda &&
                accountDescCasted.pda.seeds.length > 0 &&
                !this.get([...path, accountDescName])) {
                if (Boolean(await this.autoPopulatePda(accountDescCasted, path))) {
                    found += 1;
                }
            }
        }
        return found;
    }
    async resolveRelations(accounts, path = []) {
        let found = 0;
        for (let k = 0; k < accounts.length; k += 1) {
            const accountDesc = accounts[k];
            const subAccounts = accountDesc.accounts;
            if (subAccounts) {
                found += await this.resolveRelations(subAccounts, [
                    ...path,
                    (0, camelcase_1.default)(accountDesc.name),
                ]);
            }
            const relations = accountDesc.relations || [];
            const accountDescName = (0, camelcase_1.default)(accountDesc.name);
            const newPath = [...path, accountDescName];
            // If we have this account and there's some missing accounts that are relations to this account, fetch them
            const accountKey = this.get(newPath);
            if (accountKey) {
                const matching = relations.filter((rel) => !this.get([...path, (0, camelcase_1.default)(rel)]));
                found += matching.length;
                if (matching.length > 0) {
                    const account = await this._accountStore.fetchAccount({
                        publicKey: accountKey,
                    });
                    await Promise.all(matching.map(async (rel) => {
                        const relName = (0, camelcase_1.default)(rel);
                        this.set([...path, relName], account[relName]);
                        return account[relName];
                    }));
                }
            }
        }
        return found;
    }
    async autoPopulatePda(accountDesc, path = []) {
        if (!accountDesc.pda || !accountDesc.pda.seeds)
            throw new Error("Must have seeds");
        const seeds = await Promise.all(accountDesc.pda.seeds.map((seedDesc) => this.toBuffer(seedDesc, path)));
        if (seeds.some((seed) => typeof seed == "undefined")) {
            return;
        }
        const programId = await this.parseProgramId(accountDesc, path);
        if (!programId) {
            return;
        }
        const [pubkey] = await web3_js_1.PublicKey.findProgramAddress(seeds, programId);
        this.set([...path, (0, camelcase_1.default)(accountDesc.name)], pubkey);
    }
    async parseProgramId(accountDesc, path = []) {
        var _a;
        if (!((_a = accountDesc.pda) === null || _a === void 0 ? void 0 : _a.programId)) {
            return this._programId;
        }
        switch (accountDesc.pda.programId.kind) {
            case "const":
                return new web3_js_1.PublicKey(this.toBufferConst(accountDesc.pda.programId.value));
            case "arg":
                return this.argValue(accountDesc.pda.programId);
            case "account":
                return await this.accountValue(accountDesc.pda.programId, path);
            default:
                throw new Error(`Unexpected program seed kind: ${accountDesc.pda.programId.kind}`);
        }
    }
    async toBuffer(seedDesc, path = []) {
        switch (seedDesc.kind) {
            case "const":
                return this.toBufferConst(seedDesc);
            case "arg":
                return await this.toBufferArg(seedDesc);
            case "account":
                return await this.toBufferAccount(seedDesc, path);
            default:
                throw new Error(`Unexpected seed kind: ${seedDesc.kind}`);
        }
    }
    /**
     * Recursively get the type at some path of either a primitive or a user defined struct.
     */
    getType(type, path = []) {
        if (path.length > 0 && type.defined) {
            const subType = this._idlTypes.find((t) => t.name === type.defined);
            if (!subType) {
                throw new Error(`Cannot find type ${type.defined}`);
            }
            const structType = subType.type; // enum not supported yet
            const field = structType.fields.find((field) => field.name === path[0]);
            return this.getType(field.type, path.slice(1));
        }
        return type;
    }
    toBufferConst(seedDesc) {
        return this.toBufferValue(this.getType(seedDesc.type, (seedDesc.path || "").split(".").slice(1)), seedDesc.value);
    }
    async toBufferArg(seedDesc) {
        const argValue = this.argValue(seedDesc);
        if (typeof argValue === "undefined") {
            return;
        }
        return this.toBufferValue(this.getType(seedDesc.type, (seedDesc.path || "").split(".").slice(1)), argValue);
    }
    argValue(seedDesc) {
        const split = seedDesc.path.split(".");
        const seedArgName = (0, camelcase_1.default)(split[0]);
        const idlArgPosition = this._idlIx.args.findIndex((argDesc) => argDesc.name === seedArgName);
        if (idlArgPosition === -1) {
            throw new Error(`Unable to find argument for seed: ${seedArgName}`);
        }
        return split
            .slice(1)
            .reduce((curr, path) => (curr || {})[path], this._args[idlArgPosition]);
    }
    async toBufferAccount(seedDesc, path = []) {
        const accountValue = await this.accountValue(seedDesc, path);
        if (!accountValue) {
            return;
        }
        return this.toBufferValue(seedDesc.type, accountValue);
    }
    async accountValue(seedDesc, path = []) {
        const pathComponents = seedDesc.path.split(".");
        const fieldName = pathComponents[0];
        const fieldPubkey = this.get([...path, (0, camelcase_1.default)(fieldName)]);
        if (fieldPubkey === null) {
            throw new Error(`fieldPubkey is null`);
        }
        // The seed is a pubkey of the account.
        if (pathComponents.length === 1) {
            return fieldPubkey;
        }
        // The key is account data.
        //
        // Fetch and deserialize it.
        const account = await this._accountStore.fetchAccount({
            publicKey: fieldPubkey,
            name: seedDesc.account,
        });
        // Dereference all fields in the path to get the field value
        // used in the seed.
        const fieldValue = this.parseAccountValue(account, pathComponents.slice(1));
        return fieldValue;
    }
    parseAccountValue(account, path) {
        let accountField;
        while (path.length > 0) {
            accountField = account[(0, camelcase_1.default)(path[0])];
            path = path.slice(1);
        }
        return accountField;
    }
    // Converts the given idl valaue into a Buffer. The values here must be
    // primitives. E.g. no structs.
    //
    // TODO: add more types here as needed.
    toBufferValue(type, value) {
        switch (type) {
            case "u8":
                return Buffer.from([value]);
            case "u16":
                let b = Buffer.alloc(2);
                b.writeUInt16LE(value);
                return b;
            case "u32":
                let buf = Buffer.alloc(4);
                buf.writeUInt32LE(value);
                return buf;
            case "u64":
                let bU64 = Buffer.alloc(8);
                bU64.writeBigUInt64LE(BigInt(value));
                return bU64;
            case "string":
                return Buffer.from(utf8.encode(value));
            case "publicKey":
                return value.toBuffer();
            default:
                if (type.array) {
                    return Buffer.from(value);
                }
                throw new Error(`Unexpected seed type: ${type}`);
        }
    }
}
exports.AccountsResolver = AccountsResolver;
AccountsResolver.CONST_ACCOUNTS = {
    associatedTokenProgram: token_js_1.ASSOCIATED_PROGRAM_ID,
    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
    systemProgram: web3_js_1.SystemProgram.programId,
    tokenProgram: token_js_1.TOKEN_PROGRAM_ID,
    clock: web3_js_1.SYSVAR_CLOCK_PUBKEY,
};
// TODO: this should be configureable to avoid unnecessary requests.
class AccountStore {
    // todo: don't use the progrma use the account namespace.
    constructor(_provider, _accounts, _programId) {
        this._provider = _provider;
        this._programId = _programId;
        this._cache = new Map();
        this._idls = {};
        this._idls[_programId.toBase58()] = _accounts;
    }
    async ensureIdl(programId) {
        if (!this._idls[programId.toBase58()]) {
            const idl = await index_js_1.Program.fetchIdl(programId, this._provider);
            if (idl) {
                const program = new index_js_1.Program(idl, programId, this._provider);
                this._idls[programId.toBase58()] = program.account;
            }
        }
        return this._idls[programId.toBase58()];
    }
    async fetchAccount({ publicKey, name, programId = this._programId, }) {
        const address = publicKey.toString();
        if (!this._cache.has(address)) {
            if (name === "TokenAccount") {
                const accountInfo = await this._provider.connection.getAccountInfo(publicKey);
                if (accountInfo === null) {
                    throw new Error(`invalid account info for ${address}`);
                }
                const data = (0, token_account_layout_1.decodeTokenAccount)(accountInfo.data);
                this._cache.set(address, data);
            }
            else if (name) {
                const accounts = await this.ensureIdl(programId);
                if (accounts) {
                    const accountFetcher = accounts[(0, camelcase_1.default)(name)];
                    if (accountFetcher) {
                        const account = await accountFetcher.fetch(publicKey);
                        this._cache.set(address, account);
                    }
                }
            }
            else {
                const account = await this._provider.connection.getAccountInfo(publicKey);
                if (account === null) {
                    throw new Error(`invalid account info for ${address}`);
                }
                const data = account.data;
                const accounts = await this.ensureIdl(account.owner);
                if (accounts) {
                    const firstAccountLayout = Object.values(accounts)[0];
                    if (!firstAccountLayout) {
                        throw new Error("No accounts for this program");
                    }
                    const result = firstAccountLayout.coder.accounts.decodeAny(data);
                    this._cache.set(address, result);
                }
            }
        }
        return this._cache.get(address);
    }
}
exports.AccountStore = AccountStore;
//# sourceMappingURL=accounts-resolver.js.map