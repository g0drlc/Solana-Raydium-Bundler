import { AccountsResolver, } from "../accounts-resolver.js";
import { translateAddress } from "../common.js";
export class MethodsBuilderFactory {
    static build(provider, programId, idlIx, ixFn, txFn, rpcFn, simulateFn, viewFn, accountNamespace, idlTypes, customResolver) {
        return (...args) => new MethodsBuilder(args, ixFn, txFn, rpcFn, simulateFn, viewFn, provider, programId, idlIx, accountNamespace, idlTypes, customResolver);
    }
}
export function isPartialAccounts(partialAccount) {
    return (typeof partialAccount === "object" &&
        partialAccount !== null &&
        !("_bn" in partialAccount) // Ensures not a pubkey
    );
}
export function flattenPartialAccounts(partialAccounts, throwOnNull) {
    const toReturn = {};
    for (const accountName in partialAccounts) {
        const account = partialAccounts[accountName];
        if (account === null) {
            if (throwOnNull)
                throw new Error("Failed to resolve optionals due to IDL type mismatch with input accounts!");
            continue;
        }
        toReturn[accountName] = isPartialAccounts(account)
            ? flattenPartialAccounts(account, true)
            : translateAddress(account);
    }
    return toReturn;
}
export class MethodsBuilder {
    constructor(_args, _ixFn, _txFn, _rpcFn, _simulateFn, _viewFn, _provider, _programId, _idlIx, _accountNamespace, _idlTypes, _customResolver) {
        this._ixFn = _ixFn;
        this._txFn = _txFn;
        this._rpcFn = _rpcFn;
        this._simulateFn = _simulateFn;
        this._viewFn = _viewFn;
        this._programId = _programId;
        this._accounts = {};
        this._remainingAccounts = [];
        this._signers = [];
        this._preInstructions = [];
        this._postInstructions = [];
        this._autoResolveAccounts = true;
        this._args = _args;
        this._accountsResolver = new AccountsResolver(_args, this._accounts, _provider, _programId, _idlIx, _accountNamespace, _idlTypes, _customResolver);
    }
    args(_args) {
        this._args = _args;
        this._accountsResolver.args(_args);
    }
    async pubkeys() {
        if (this._autoResolveAccounts) {
            await this._accountsResolver.resolve();
        }
        return this._accounts;
    }
    accounts(accounts) {
        this._autoResolveAccounts = true;
        this._accountsResolver.resolveOptionals(accounts);
        return this;
    }
    accountsStrict(accounts) {
        this._autoResolveAccounts = false;
        this._accountsResolver.resolveOptionals(accounts);
        return this;
    }
    signers(signers) {
        this._signers = this._signers.concat(signers);
        return this;
    }
    remainingAccounts(accounts) {
        this._remainingAccounts = this._remainingAccounts.concat(accounts);
        return this;
    }
    preInstructions(ixs) {
        this._preInstructions = this._preInstructions.concat(ixs);
        return this;
    }
    postInstructions(ixs) {
        this._postInstructions = this._postInstructions.concat(ixs);
        return this;
    }
    async rpc(options) {
        if (this._autoResolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._rpcFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options: options,
        });
    }
    async rpcAndKeys(options) {
        const pubkeys = await this.pubkeys();
        return {
            pubkeys,
            signature: await this.rpc(options),
        };
    }
    async view(options) {
        if (this._autoResolveAccounts) {
            await this._accountsResolver.resolve();
        }
        if (!this._viewFn) {
            throw new Error("Method does not support views");
        }
        // @ts-ignore
        return this._viewFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options: options,
        });
    }
    async simulate(options) {
        if (this._autoResolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._simulateFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options: options,
        });
    }
    async instruction() {
        if (this._autoResolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._ixFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
        });
    }
    /**
     * Convenient shortcut to get instructions and pubkeys via
     * const { pubkeys, instructions } = await prepare();
     */
    async prepare() {
        return {
            instruction: await this.instruction(),
            pubkeys: await this.pubkeys(),
            signers: await this._signers,
        };
    }
    async transaction() {
        if (this._autoResolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._txFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
        });
    }
}
//# sourceMappingURL=methods.js.map