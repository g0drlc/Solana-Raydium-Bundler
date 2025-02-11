import { Buffer as Buffer$1 } from 'buffer';
import { PublicKey, Transaction, TransactionInstruction, SendTransactionError, NONCE_ACCOUNT_LENGTH, SystemProgram, SYSVAR_RENT_PUBKEY, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import * as web3_js from '@solana/web3.js';
export { web3_js as web3 };
import BN from 'bn.js';
export { default as BN } from 'bn.js';
import bs58$1 from 'bs58';
import camelCase from 'camelcase';
import * as borsh from '@coral-xyz/borsh';
import { sha256 as sha256$1 } from '@noble/hashes/sha256';
import { inflate } from 'pako';
import EventEmitter from 'eventemitter3';

/**
 * Splits an array into chunks
 *
 * @param array Array of objects to chunk.
 * @param size The max size of a chunk.
 * @returns A two dimensional array where each T[] length is < the provided size.
 */
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
}
/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
const isVersionedTransaction = (tx) => {
    return "version" in tx;
};

function encode$3(data) {
    return data.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "0x");
}
function decode$3(data) {
    if (data.indexOf("0x") === 0) {
        data = data.substr(2);
    }
    if (data.length % 2 === 1) {
        data = "0" + data;
    }
    let key = data.match(/.{2}/g);
    if (key === null) {
        return Buffer$1.from([]);
    }
    return Buffer$1.from(key.map((byte) => parseInt(byte, 16)));
}

var hex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    encode: encode$3,
    decode: decode$3
});

function decode$2(array) {
    const decoder = new TextDecoder("utf-8") // Browser https://caniuse.com/textencoder.
        ; // Node.
    return decoder.decode(array);
}
function encode$2(input) {
    const encoder = new TextEncoder() // Browser.
        ; // Node.
    return encoder.encode(input);
}

var utf8 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode$2,
    encode: encode$2
});

function encode$1(data) {
    return bs58$1.encode(data);
}
function decode$1(data) {
    return bs58$1.decode(data);
}

var bs58 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    encode: encode$1,
    decode: decode$1
});

function encode(data) {
    return data.toString("base64");
}
function decode(data) {
    return Buffer$1.from(data, "base64");
}

var base64 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    encode: encode,
    decode: decode
});

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hex: hex,
    utf8: utf8,
    bs58: bs58,
    base64: base64
});

function parseIdlErrors(idl) {
    const errors = new Map();
    if (idl.errors) {
        idl.errors.forEach((e) => {
            var _a;
            let msg = (_a = e.msg) !== null && _a !== void 0 ? _a : e.name;
            errors.set(e.code, msg);
        });
    }
    return errors;
}
// Allow either IdLInstruction or IdlStateMethod since the types share fields.
function toInstruction(idlIx, ...args) {
    if (idlIx.args.length != args.length) {
        throw new Error("Invalid argument length");
    }
    const ix = {};
    let idx = 0;
    idlIx.args.forEach((ixArg) => {
        ix[ixArg.name] = args[idx];
        idx += 1;
    });
    return ix;
}
// Throws error if any account required for the `ix` is not given.
function validateAccounts(ixAccounts, accounts = {}) {
    ixAccounts.forEach((acc) => {
        if ("accounts" in acc) {
            validateAccounts(acc.accounts, accounts[acc.name]);
        }
        else {
            if (accounts[acc.name] === undefined) {
                throw new Error(`Invalid arguments: ${acc.name} not provided.`);
            }
        }
    });
}
// Translates an address to a Pubkey.
function translateAddress(address) {
    return address instanceof PublicKey ? address : new PublicKey(address);
}

/**
 * A `StructFailure` represents a single specific failure in validation.
 */

/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */
class StructError extends TypeError {
  constructor(failure, failures) {
    let cached;
    const {
      message,
      ...rest
    } = failure;
    const {
      path
    } = failure;
    const msg = path.length === 0 ? message : "At path: " + path.join('.') + " -- " + message;
    super(msg);
    this.value = void 0;
    this.key = void 0;
    this.type = void 0;
    this.refinement = void 0;
    this.path = void 0;
    this.branch = void 0;
    this.failures = void 0;
    Object.assign(this, rest);
    this.name = this.constructor.name;

    this.failures = () => {
      var _cached;

      return (_cached = cached) != null ? _cached : cached = [failure, ...failures()];
    };
  }

}

/**
 * Check if a value is an iterator.
 */
function isIterable(x) {
  return isObject(x) && typeof x[Symbol.iterator] === 'function';
}
/**
 * Check if a value is a plain object.
 */


function isObject(x) {
  return typeof x === 'object' && x != null;
}
/**
 * Return a value as a printable string.
 */

function print(value) {
  return typeof value === 'string' ? JSON.stringify(value) : "" + value;
}
/**
 * Shifts (removes and returns) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 */

function shiftIterator(input) {
  const {
    done,
    value
  } = input.next();
  return done ? undefined : value;
}
/**
 * Convert a single validation result to a failure.
 */

function toFailure(result, context, struct, value) {
  if (result === true) {
    return;
  } else if (result === false) {
    result = {};
  } else if (typeof result === 'string') {
    result = {
      message: result
    };
  }

  const {
    path,
    branch
  } = context;
  const {
    type
  } = struct;
  const {
    refinement,
    message = "Expected a value of type `" + type + "`" + (refinement ? " with refinement `" + refinement + "`" : '') + ", but received: `" + print(value) + "`"
  } = result;
  return {
    value,
    type,
    refinement,
    key: path[path.length - 1],
    path,
    branch,
    ...result,
    message
  };
}
/**
 * Convert a validation result to an iterable of failures.
 */

function* toFailures(result, context, struct, value) {
  if (!isIterable(result)) {
    result = [result];
  }

  for (const r of result) {
    const failure = toFailure(r, context, struct, value);

    if (failure) {
      yield failure;
    }
  }
}
/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 */

function* run(value, struct, options) {
  if (options === void 0) {
    options = {};
  }

  const {
    path = [],
    branch = [value],
    coerce = false,
    mask = false
  } = options;
  const ctx = {
    path,
    branch
  };

  if (coerce) {
    value = struct.coercer(value, ctx);

    if (mask && struct.type !== 'type' && isObject(struct.schema) && isObject(value) && !Array.isArray(value)) {
      for (const key in value) {
        if (struct.schema[key] === undefined) {
          delete value[key];
        }
      }
    }
  }

  let valid = true;

  for (const failure of struct.validator(value, ctx)) {
    valid = false;
    yield [failure, undefined];
  }

  for (let [k, v, s] of struct.entries(value, ctx)) {
    const ts = run(v, s, {
      path: k === undefined ? path : [...path, k],
      branch: k === undefined ? branch : [...branch, v],
      coerce,
      mask
    });

    for (const t of ts) {
      if (t[0]) {
        valid = false;
        yield [t[0], undefined];
      } else if (coerce) {
        v = t[1];

        if (k === undefined) {
          value = v;
        } else if (value instanceof Map) {
          value.set(k, v);
        } else if (value instanceof Set) {
          value.add(v);
        } else if (isObject(value)) {
          value[k] = v;
        }
      }
    }
  }

  if (valid) {
    for (const failure of struct.refiner(value, ctx)) {
      valid = false;
      yield [failure, undefined];
    }
  }

  if (valid) {
    yield [undefined, value];
  }
}

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */

class Struct {
  constructor(props) {
    this.TYPE = void 0;
    this.type = void 0;
    this.schema = void 0;
    this.coercer = void 0;
    this.validator = void 0;
    this.refiner = void 0;
    this.entries = void 0;
    const {
      type,
      schema,
      validator,
      refiner,
      coercer = value => value,
      entries = function* () {}
    } = props;
    this.type = type;
    this.schema = schema;
    this.entries = entries;
    this.coercer = coercer;

    if (validator) {
      this.validator = (value, context) => {
        const result = validator(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.validator = () => [];
    }

    if (refiner) {
      this.refiner = (value, context) => {
        const result = refiner(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.refiner = () => [];
    }
  }
  /**
   * Assert that a value passes the struct's validation, throwing if it doesn't.
   */


  assert(value) {
    return assert(value, this);
  }
  /**
   * Create a value with the struct's coercion logic, then validate it.
   */


  create(value) {
    return create(value, this);
  }
  /**
   * Check if a value passes the struct's validation.
   */


  is(value) {
    return is(value, this);
  }
  /**
   * Mask a value, coercing and validating it, but returning only the subset of
   * properties defined by the struct's schema.
   */


  mask(value) {
    return mask(value, this);
  }
  /**
   * Validate a value with the struct's validation logic, returning a tuple
   * representing the result.
   *
   * You may optionally pass `true` for the `withCoercion` argument to coerce
   * the value before attempting to validate it. If you do, the result will
   * contain the coerced result when successful.
   */


  validate(value, options) {
    if (options === void 0) {
      options = {};
    }

    return validate(value, this, options);
  }

}
/**
 * Assert that a value passes a struct, throwing if it doesn't.
 */

function assert(value, struct) {
  const result = validate(value, struct);

  if (result[0]) {
    throw result[0];
  }
}
/**
 * Create a value with the coercion logic of struct and validate it.
 */

function create(value, struct) {
  const result = validate(value, struct, {
    coerce: true
  });

  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
/**
 * Mask a value, returning only the subset of properties defined by a struct.
 */

function mask(value, struct) {
  const result = validate(value, struct, {
    coerce: true,
    mask: true
  });

  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
/**
 * Check if a value passes a struct.
 */

function is(value, struct) {
  const result = validate(value, struct);
  return !result[0];
}
/**
 * Validate a value against a struct, returning an error if invalid, or the
 * value (with potential coercion) if valid.
 */

function validate(value, struct, options) {
  if (options === void 0) {
    options = {};
  }

  const tuples = run(value, struct, options);
  const tuple = shiftIterator(tuples);

  if (tuple[0]) {
    const error = new StructError(tuple[0], function* () {
      for (const t of tuples) {
        if (t[0]) {
          yield t[0];
        }
      }
    });
    return [error, undefined];
  } else {
    const v = tuple[1];
    return [undefined, v];
  }
}
/**
 * Define a new struct type with a custom validation function.
 */

function define(name, validator) {
  return new Struct({
    type: name,
    schema: null,
    validator
  });
}

/**
 * Ensure that any value passes validation.
 */

function any() {
  return define('any', () => true);
}
function array(Element) {
  return new Struct({
    type: 'array',
    schema: Element,

    *entries(value) {
      if (Element && Array.isArray(value)) {
        for (const [i, v] of value.entries()) {
          yield [i, v, Element];
        }
      }
    },

    coercer(value) {
      return Array.isArray(value) ? value.slice() : value;
    },

    validator(value) {
      return Array.isArray(value) || "Expected an array value, but received: " + print(value);
    }

  });
}
/**
 * Ensure that a value is a boolean.
 */

function boolean() {
  return define('boolean', value => {
    return typeof value === 'boolean';
  });
}
function literal(constant) {
  const description = print(constant);
  const t = typeof constant;
  return new Struct({
    type: 'literal',
    schema: t === 'string' || t === 'number' || t === 'boolean' ? constant : null,

    validator(value) {
      return value === constant || "Expected the literal `" + description + "`, but received: " + print(value);
    }

  });
}
/**
 * Augment an existing struct to allow `null` values.
 */

function nullable(struct) {
  return new Struct({ ...struct,
    validator: (value, ctx) => value === null || struct.validator(value, ctx),
    refiner: (value, ctx) => value === null || struct.refiner(value, ctx)
  });
}
/**
 * Ensure that a value is a number.
 */

function number() {
  return define('number', value => {
    return typeof value === 'number' && !isNaN(value) || "Expected a number, but received: " + print(value);
  });
}
/**
 * Augment a struct to allow `undefined` values.
 */

function optional(struct) {
  return new Struct({ ...struct,
    validator: (value, ctx) => value === undefined || struct.validator(value, ctx),
    refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx)
  });
}
/**
 * Ensure that a value is a string.
 */

function string() {
  return define('string', value => {
    return typeof value === 'string' || "Expected a string, but received: " + print(value);
  });
}
/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 */

function type(schema) {
  const keys = Object.keys(schema);
  return new Struct({
    type: 'type',
    schema,

    *entries(value) {
      if (isObject(value)) {
        for (const k of keys) {
          yield [k, value[k], schema[k]];
        }
      }
    },

    validator(value) {
      return isObject(value) || "Expected an object, but received: " + print(value);
    }

  });
}
/**
 * Ensure that a value matches one of a set of types.
 */

function union$1(Structs) {
  const description = Structs.map(s => s.type).join(' | ');
  return new Struct({
    type: 'union',
    schema: null,

    coercer(value, ctx) {
      const firstMatch = Structs.find(s => {
        const [e] = s.validate(value, {
          coerce: true
        });
        return !e;
      }) || unknown();
      return firstMatch.coercer(value, ctx);
    },

    validator(value, ctx) {
      const failures = [];

      for (const S of Structs) {
        const [...tuples] = run(value, S, ctx);
        const [first] = tuples;

        if (!first[0]) {
          return [];
        } else {
          for (const [failure] of tuples) {
            if (failure) {
              failures.push(failure);
            }
          }
        }
      }

      return ["Expected the value to satisfy a union of `" + description + "`, but received: " + print(value), ...failures];
    }

  });
}
/**
 * Ensure that any value passes validation, without widening its type to `any`.
 */

function unknown() {
  return define('unknown', () => true);
}

/**
 * Augment a `Struct` to add an additional coercion step to its input.
 *
 * This allows you to transform input data before validating it, to increase the
 * likelihood that it passes validation—for example for default values, parsing
 * different formats, etc.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

function coerce(struct, condition, coercer) {
  return new Struct({ ...struct,
    coercer: (value, ctx) => {
      return is(value, condition) ? struct.coercer(coercer(value, ctx), ctx) : struct.coercer(value, ctx);
    }
  });
}

/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
async function invoke(programId, accounts, data, provider) {
    programId = translateAddress(programId);
    if (!provider) {
        provider = getProvider();
    }
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        programId,
        keys: accounts !== null && accounts !== void 0 ? accounts : [],
        data,
    }));
    if (provider.sendAndConfirm === undefined) {
        throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
    }
    return await provider.sendAndConfirm(tx, []);
}
const GET_MULTIPLE_ACCOUNTS_LIMIT = 99;
async function getMultipleAccounts(connection, publicKeys, commitment) {
    const results = await getMultipleAccountsAndContext(connection, publicKeys, commitment);
    return results.map((result) => {
        return result
            ? { publicKey: result.publicKey, account: result.account }
            : null;
    });
}
async function getMultipleAccountsAndContext(connection, publicKeys, commitment) {
    if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
        return await getMultipleAccountsAndContextCore(connection, publicKeys, commitment);
    }
    else {
        const batches = chunks(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT);
        const results = await Promise.all(batches.map((batch) => getMultipleAccountsAndContextCore(connection, batch, commitment)));
        return results.flat();
    }
}
async function getMultipleAccountsAndContextCore(connection, publicKeys, commitmentOverride) {
    const commitment = commitmentOverride !== null && commitmentOverride !== void 0 ? commitmentOverride : connection.commitment;
    const { value: accountInfos, context } = await connection.getMultipleAccountsInfoAndContext(publicKeys, commitment);
    const accounts = accountInfos.map((account, idx) => {
        if (account === null) {
            return null;
        }
        return {
            publicKey: publicKeys[idx],
            account,
            context,
        };
    });
    return accounts;
}
// copy from @solana/web3.js that has a commitment param
async function simulateTransaction(connection, transaction, signers, commitment, includeAccounts) {
    var _a;
    if (signers && signers.length > 0) {
        transaction.sign(...signers);
    }
    // @ts-expect-error
    const message = transaction._compile();
    const signData = message.serialize();
    // @ts-expect-error
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = {
        encoding: "base64",
        commitment: commitment !== null && commitment !== void 0 ? commitment : connection.commitment,
    };
    if (includeAccounts) {
        const addresses = (Array.isArray(includeAccounts) ? includeAccounts : message.nonProgramIds()).map((key) => key.toBase58());
        config["accounts"] = {
            encoding: "base64",
            addresses,
        };
    }
    if (signers) {
        config.sigVerify = true;
    }
    const args = [encodedTransaction, config];
    // @ts-expect-error
    const unsafeRes = await connection._rpcRequest("simulateTransaction", args);
    const res = create(unsafeRes, SimulatedTransactionResponseStruct);
    if ("error" in res) {
        let logs;
        if ("data" in res.error) {
            logs = (_a = res.error.data) === null || _a === void 0 ? void 0 : _a.logs;
            if (logs && Array.isArray(logs)) {
                const traceIndent = "\n    ";
                const logTrace = traceIndent + logs.join(traceIndent);
                console.error(res.error.message, logTrace);
            }
        }
        throw new SendTransactionError("failed to simulate transaction: " + res.error.message, logs);
    }
    return res.result;
}
// copy from @solana/web3.js
function jsonRpcResult(schema) {
    return coerce(createRpcResult(schema), UnknownRpcResult, (value) => {
        if ("error" in value) {
            return value;
        }
        else {
            return {
                ...value,
                result: create(value.result, schema),
            };
        }
    });
}
// copy from @solana/web3.js
const UnknownRpcResult = createRpcResult(unknown());
// copy from @solana/web3.js
function createRpcResult(result) {
    return union$1([
        type({
            jsonrpc: literal("2.0"),
            id: string(),
            result,
        }),
        type({
            jsonrpc: literal("2.0"),
            id: string(),
            error: type({
                code: unknown(),
                message: string(),
                data: optional(any()),
            }),
        }),
    ]);
}
// copy from @solana/web3.js
function jsonRpcResultAndContext(value) {
    return jsonRpcResult(type({
        context: type({
            slot: number(),
        }),
        value,
    }));
}
// copy from @solana/web3.js
const SimulatedTransactionResponseStruct = jsonRpcResultAndContext(type({
    err: nullable(union$1([type({}), string()])),
    logs: nullable(array(string())),
    accounts: optional(nullable(array(nullable(type({
        executable: boolean(),
        owner: string(),
        lamports: number(),
        data: array(string()),
        rentEpoch: optional(number()),
    }))))),
    unitsConsumed: optional(number()),
}));

var rpc = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invoke: invoke,
    getMultipleAccounts: getMultipleAccounts,
    getMultipleAccountsAndContext: getMultipleAccountsAndContext,
    simulateTransaction: simulateTransaction
});

/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */
class AnchorProvider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */
    constructor(connection, wallet, opts) {
        this.connection = connection;
        this.wallet = wallet;
        this.opts = opts;
        this.publicKey = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey;
    }
    static defaultOptions() {
        return {
            preflightCommitment: "processed",
            commitment: "processed",
        };
    }
    /**
     * Returns a `Provider` with a wallet read from the local filesystem.
     *
     * @param url  The network cluster url.
     * @param opts The default transaction confirmation options.
     *
     * (This api is for Node only.)
     */
    static local(url, opts) {
        {
            throw new Error(`Provider local is not available on browser.`);
        }
    }
    /**
     * Returns a `Provider` read from the `ANCHOR_PROVIDER_URL` environment
     * variable
     *
     * (This api is for Node only.)
     */
    static env() {
        {
            throw new Error(`Provider env is not available on browser.`);
        }
    }
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The signers of the transaction.
     * @param opts    Transaction confirmation options.
     */
    async sendAndConfirm(tx, signers, opts) {
        var _a, _b, _c, _d;
        if (opts === undefined) {
            opts = this.opts;
        }
        if (isVersionedTransaction(tx)) {
            if (signers) {
                tx.sign(signers);
            }
        }
        else {
            tx.feePayer = (_a = tx.feePayer) !== null && _a !== void 0 ? _a : this.wallet.publicKey;
            tx.recentBlockhash = (await this.connection.getLatestBlockhash(opts.preflightCommitment)).blockhash;
            if (signers) {
                for (const signer of signers) {
                    tx.partialSign(signer);
                }
            }
        }
        tx = await this.wallet.signTransaction(tx);
        const rawTx = tx.serialize();
        try {
            return await sendAndConfirmRawTransaction(this.connection, rawTx, opts);
        }
        catch (err) {
            // thrown if the underlying 'confirmTransaction' encounters a failed tx
            // the 'confirmTransaction' error does not return logs so we make another rpc call to get them
            if (err instanceof ConfirmError) {
                // choose the shortest available commitment for 'getTransaction'
                // (the json RPC does not support any shorter than "confirmed" for 'getTransaction')
                // because that will see the tx sent with `sendAndConfirmRawTransaction` no matter which
                // commitment `sendAndConfirmRawTransaction` used
                const txSig = encode$1(isVersionedTransaction(tx)
                    ? ((_b = tx.signatures) === null || _b === void 0 ? void 0 : _b[0]) || new Uint8Array()
                    : (_c = tx.signature) !== null && _c !== void 0 ? _c : new Uint8Array());
                const failedTx = await this.connection.getTransaction(txSig, {
                    commitment: "confirmed",
                });
                if (!failedTx) {
                    throw err;
                }
                else {
                    const logs = (_d = failedTx.meta) === null || _d === void 0 ? void 0 : _d.logMessages;
                    throw !logs ? err : new SendTransactionError(err.message, logs);
                }
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Similar to `send`, but for an array of transactions and signers.
     * All transactions need to be of the same type, it doesn't support a mix of `VersionedTransaction`s and `Transaction`s.
     *
     * @param txWithSigners Array of transactions and signers.
     * @param opts          Transaction confirmation options.
     */
    async sendAll(txWithSigners, opts) {
        var _a, _b, _c;
        if (opts === undefined) {
            opts = this.opts;
        }
        const recentBlockhash = (await this.connection.getLatestBlockhash(opts.preflightCommitment)).blockhash;
        let txs = txWithSigners.map((r) => {
            var _a, _b;
            if (isVersionedTransaction(r.tx)) {
                let tx = r.tx;
                if (r.signers) {
                    tx.sign(r.signers);
                }
                return tx;
            }
            else {
                let tx = r.tx;
                let signers = (_a = r.signers) !== null && _a !== void 0 ? _a : [];
                tx.feePayer = (_b = tx.feePayer) !== null && _b !== void 0 ? _b : this.wallet.publicKey;
                tx.recentBlockhash = recentBlockhash;
                signers.forEach((kp) => {
                    tx.partialSign(kp);
                });
                return tx;
            }
        });
        const signedTxs = await this.wallet.signAllTransactions(txs);
        const sigs = [];
        for (let k = 0; k < txs.length; k += 1) {
            const tx = signedTxs[k];
            const rawTx = tx.serialize();
            try {
                sigs.push(await sendAndConfirmRawTransaction(this.connection, rawTx, opts));
            }
            catch (err) {
                // thrown if the underlying 'confirmTransaction' encounters a failed tx
                // the 'confirmTransaction' error does not return logs so we make another rpc call to get them
                if (err instanceof ConfirmError) {
                    // choose the shortest available commitment for 'getTransaction'
                    // (the json RPC does not support any shorter than "confirmed" for 'getTransaction')
                    // because that will see the tx sent with `sendAndConfirmRawTransaction` no matter which
                    // commitment `sendAndConfirmRawTransaction` used
                    const txSig = encode$1(isVersionedTransaction(tx)
                        ? ((_a = tx.signatures) === null || _a === void 0 ? void 0 : _a[0]) || new Uint8Array()
                        : (_b = tx.signature) !== null && _b !== void 0 ? _b : new Uint8Array());
                    const failedTx = await this.connection.getTransaction(txSig, {
                        commitment: "confirmed",
                    });
                    if (!failedTx) {
                        throw err;
                    }
                    else {
                        const logs = (_c = failedTx.meta) === null || _c === void 0 ? void 0 : _c.logMessages;
                        throw !logs ? err : new SendTransactionError(err.message, logs);
                    }
                }
                else {
                    throw err;
                }
            }
        }
        return sigs;
    }
    /**
     * Simulates the given transaction, returning emitted logs from execution.
     *
     * @param tx      The transaction to send.
     * @param signers The signers of the transaction. If unset, the transaction
     *                will be simulated with the "sigVerify: false" option. This
     *                allows for simulation of transactions without asking the
     *                wallet for a signature.
     * @param opts    Transaction confirmation options.
     */
    async simulate(tx, signers, commitment, includeAccounts) {
        let recentBlockhash = (await this.connection.getLatestBlockhash(commitment !== null && commitment !== void 0 ? commitment : this.connection.commitment)).blockhash;
        let result;
        if (isVersionedTransaction(tx)) {
            if (signers) {
                tx.sign(signers);
                tx = await this.wallet.signTransaction(tx);
            }
            // Doesn't support includeAccounts which has been changed to something
            // else in later versions of this function.
            result = await this.connection.simulateTransaction(tx, { commitment });
        }
        else {
            tx.feePayer = tx.feePayer || this.wallet.publicKey;
            tx.recentBlockhash = recentBlockhash;
            if (signers) {
                tx = await this.wallet.signTransaction(tx);
            }
            result = await simulateTransaction(this.connection, tx, signers, commitment, includeAccounts);
        }
        if (result.value.err) {
            throw new SimulateError(result.value);
        }
        return result.value;
    }
}
class SimulateError extends Error {
    constructor(simulationResponse, message) {
        super(message);
        this.simulationResponse = simulationResponse;
    }
}
// Copy of Connection.sendAndConfirmRawTransaction that throws
// a better error if 'confirmTransaction` returns an error status
async function sendAndConfirmRawTransaction(connection, rawTransaction, options) {
    const sendOptions = options && {
        skipPreflight: options.skipPreflight,
        preflightCommitment: options.preflightCommitment || options.commitment,
    };
    const signature = await connection.sendRawTransaction(rawTransaction, sendOptions);
    const status = (await connection.confirmTransaction(signature, options && options.commitment)).value;
    if (status.err) {
        throw new ConfirmError(`Raw transaction ${signature} failed (${JSON.stringify(status)})`);
    }
    return signature;
}
class ConfirmError extends Error {
    constructor(message) {
        super(message);
    }
}
/**
 * Sets the default provider on the client.
 */
function setProvider(provider) {
    _provider = provider;
}
/**
 * Returns the default provider being used by the client.
 */
function getProvider() {
    if (_provider === null) {
        return AnchorProvider.local();
    }
    return _provider;
}
// Global provider used as the default when a provider is not given.
let _provider = null;

const _AVAILABLE_FEATURES = new Set(["anchor-deprecated-state", "debug-logs"]);
const _FEATURES = new Map();
function set(key) {
    if (!_AVAILABLE_FEATURES.has(key)) {
        throw new Error("Invalid feature");
    }
    _FEATURES.set(key, true);
}
function isSet(key) {
    return _FEATURES.get(key) !== undefined;
}

var features = /*#__PURE__*/Object.freeze({
    __proto__: null,
    set: set,
    isSet: isSet
});

class IdlError extends Error {
    constructor(message) {
        super(message);
        this.name = "IdlError";
    }
}
class ProgramErrorStack {
    constructor(stack) {
        this.stack = stack;
    }
    static parse(logs) {
        var _a;
        const programKeyRegex = /^Program (\w*) invoke/;
        const successRegex = /^Program \w* success/;
        const programStack = [];
        for (let i = 0; i < logs.length; i++) {
            if (successRegex.exec(logs[i])) {
                programStack.pop();
                continue;
            }
            const programKey = (_a = programKeyRegex.exec(logs[i])) === null || _a === void 0 ? void 0 : _a[1];
            if (!programKey) {
                continue;
            }
            programStack.push(new PublicKey(programKey));
        }
        return new ProgramErrorStack(programStack);
    }
}
class AnchorError extends Error {
    constructor(errorCode, errorMessage, errorLogs, logs, origin, comparedValues) {
        super(errorLogs.join("\n").replace("Program log: ", ""));
        this.errorLogs = errorLogs;
        this.logs = logs;
        this.error = { errorCode, errorMessage, comparedValues, origin };
        this._programErrorStack = ProgramErrorStack.parse(logs);
    }
    static parse(logs) {
        if (!logs) {
            return null;
        }
        const anchorErrorLogIndex = logs.findIndex((log) => log.startsWith("Program log: AnchorError"));
        if (anchorErrorLogIndex === -1) {
            return null;
        }
        const anchorErrorLog = logs[anchorErrorLogIndex];
        const errorLogs = [anchorErrorLog];
        let comparedValues;
        if (anchorErrorLogIndex + 1 < logs.length) {
            // This catches the comparedValues where the following is logged
            // <AnchorError>
            // Left:
            // <Pubkey>
            // Right:
            // <Pubkey>
            if (logs[anchorErrorLogIndex + 1] === "Program log: Left:") {
                const pubkeyRegex = /^Program log: (.*)$/;
                const leftPubkey = pubkeyRegex.exec(logs[anchorErrorLogIndex + 2])[1];
                const rightPubkey = pubkeyRegex.exec(logs[anchorErrorLogIndex + 4])[1];
                comparedValues = [
                    new PublicKey(leftPubkey),
                    new PublicKey(rightPubkey),
                ];
                errorLogs.push(...logs.slice(anchorErrorLogIndex + 1, anchorErrorLogIndex + 5));
            }
            // This catches the comparedValues where the following is logged
            // <AnchorError>
            // Left: <value>
            // Right: <value>
            else if (logs[anchorErrorLogIndex + 1].startsWith("Program log: Left:")) {
                const valueRegex = /^Program log: (Left|Right): (.*)$/;
                const leftValue = valueRegex.exec(logs[anchorErrorLogIndex + 1])[2];
                const rightValue = valueRegex.exec(logs[anchorErrorLogIndex + 2])[2];
                errorLogs.push(...logs.slice(anchorErrorLogIndex + 1, anchorErrorLogIndex + 3));
                comparedValues = [leftValue, rightValue];
            }
        }
        const regexNoInfo = /^Program log: AnchorError occurred\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./;
        const noInfoAnchorErrorLog = regexNoInfo.exec(anchorErrorLog);
        const regexFileLine = /^Program log: AnchorError thrown in (.*):(\d*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./;
        const fileLineAnchorErrorLog = regexFileLine.exec(anchorErrorLog);
        const regexAccountName = /^Program log: AnchorError caused by account: (.*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./;
        const accountNameAnchorErrorLog = regexAccountName.exec(anchorErrorLog);
        if (noInfoAnchorErrorLog) {
            const [errorCodeString, errorNumber, errorMessage] = noInfoAnchorErrorLog.slice(1, 4);
            const errorCode = {
                code: errorCodeString,
                number: parseInt(errorNumber),
            };
            return new AnchorError(errorCode, errorMessage, errorLogs, logs, undefined, comparedValues);
        }
        else if (fileLineAnchorErrorLog) {
            const [file, line, errorCodeString, errorNumber, errorMessage] = fileLineAnchorErrorLog.slice(1, 6);
            const errorCode = {
                code: errorCodeString,
                number: parseInt(errorNumber),
            };
            const fileLine = { file, line: parseInt(line) };
            return new AnchorError(errorCode, errorMessage, errorLogs, logs, fileLine, comparedValues);
        }
        else if (accountNameAnchorErrorLog) {
            const [accountName, errorCodeString, errorNumber, errorMessage] = accountNameAnchorErrorLog.slice(1, 5);
            const origin = accountName;
            const errorCode = {
                code: errorCodeString,
                number: parseInt(errorNumber),
            };
            return new AnchorError(errorCode, errorMessage, errorLogs, logs, origin, comparedValues);
        }
        else {
            return null;
        }
    }
    get program() {
        return this._programErrorStack.stack[this._programErrorStack.stack.length - 1];
    }
    get programErrorStack() {
        return this._programErrorStack.stack;
    }
    toString() {
        return this.message;
    }
}
// An error from a user defined program.
class ProgramError extends Error {
    constructor(code, msg, logs) {
        super();
        this.code = code;
        this.msg = msg;
        this.logs = logs;
        if (logs) {
            this._programErrorStack = ProgramErrorStack.parse(logs);
        }
    }
    static parse(err, idlErrors) {
        const errString = err.toString();
        // TODO: don't rely on the error string. web3.js should preserve the error
        //       code information instead of giving us an untyped string.
        let unparsedErrorCode;
        if (errString.includes("custom program error:")) {
            let components = errString.split("custom program error: ");
            if (components.length !== 2) {
                return null;
            }
            else {
                unparsedErrorCode = components[1];
            }
        }
        else {
            const matches = errString.match(/"Custom":([0-9]+)}/g);
            if (!matches || matches.length > 1) {
                return null;
            }
            unparsedErrorCode = matches[0].match(/([0-9]+)/g)[0];
        }
        let errorCode;
        try {
            errorCode = parseInt(unparsedErrorCode);
        }
        catch (parseErr) {
            return null;
        }
        // Parse user error.
        let errorMsg = idlErrors.get(errorCode);
        if (errorMsg !== undefined) {
            return new ProgramError(errorCode, errorMsg, err.logs);
        }
        // Parse framework internal error.
        errorMsg = LangErrorMessage.get(errorCode);
        if (errorMsg !== undefined) {
            return new ProgramError(errorCode, errorMsg, err.logs);
        }
        // Unable to parse the error. Just return the untranslated error.
        return null;
    }
    get program() {
        var _a;
        return (_a = this._programErrorStack) === null || _a === void 0 ? void 0 : _a.stack[this._programErrorStack.stack.length - 1];
    }
    get programErrorStack() {
        var _a;
        return (_a = this._programErrorStack) === null || _a === void 0 ? void 0 : _a.stack;
    }
    toString() {
        return this.msg;
    }
}
function translateError(err, idlErrors) {
    if (isSet("debug-logs")) {
        console.log("Translating error:", err);
    }
    const anchorError = AnchorError.parse(err.logs);
    if (anchorError) {
        return anchorError;
    }
    const programError = ProgramError.parse(err, idlErrors);
    if (programError) {
        return programError;
    }
    if (err.logs) {
        const handler = {
            get: function (target, prop) {
                if (prop === "programErrorStack") {
                    return target.programErrorStack.stack;
                }
                else if (prop === "program") {
                    return target.programErrorStack.stack[err.programErrorStack.stack.length - 1];
                }
                else {
                    // this is the normal way to return all other props
                    // without modifying them.
                    // @ts-expect-error
                    return Reflect.get(...arguments);
                }
            },
        };
        err.programErrorStack = ProgramErrorStack.parse(err.logs);
        return new Proxy(err, handler);
    }
    return err;
}
const LangErrorCode = {
    // Instructions.
    InstructionMissing: 100,
    InstructionFallbackNotFound: 101,
    InstructionDidNotDeserialize: 102,
    InstructionDidNotSerialize: 103,
    // IDL instructions.
    IdlInstructionStub: 1000,
    IdlInstructionInvalidProgram: 1001,
    // Constraints.
    ConstraintMut: 2000,
    ConstraintHasOne: 2001,
    ConstraintSigner: 2002,
    ConstraintRaw: 2003,
    ConstraintOwner: 2004,
    ConstraintRentExempt: 2005,
    ConstraintSeeds: 2006,
    ConstraintExecutable: 2007,
    ConstraintState: 2008,
    ConstraintAssociated: 2009,
    ConstraintAssociatedInit: 2010,
    ConstraintClose: 2011,
    ConstraintAddress: 2012,
    ConstraintZero: 2013,
    ConstraintTokenMint: 2014,
    ConstraintTokenOwner: 2015,
    ConstraintMintMintAuthority: 2016,
    ConstraintMintFreezeAuthority: 2017,
    ConstraintMintDecimals: 2018,
    ConstraintSpace: 2019,
    ConstraintAccountIsNone: 2020,
    // Require.
    RequireViolated: 2500,
    RequireEqViolated: 2501,
    RequireKeysEqViolated: 2502,
    RequireNeqViolated: 2503,
    RequireKeysNeqViolated: 2504,
    RequireGtViolated: 2505,
    RequireGteViolated: 2506,
    // Accounts.
    AccountDiscriminatorAlreadySet: 3000,
    AccountDiscriminatorNotFound: 3001,
    AccountDiscriminatorMismatch: 3002,
    AccountDidNotDeserialize: 3003,
    AccountDidNotSerialize: 3004,
    AccountNotEnoughKeys: 3005,
    AccountNotMutable: 3006,
    AccountOwnedByWrongProgram: 3007,
    InvalidProgramId: 3008,
    InvalidProgramExecutable: 3009,
    AccountNotSigner: 3010,
    AccountNotSystemOwned: 3011,
    AccountNotInitialized: 3012,
    AccountNotProgramData: 3013,
    AccountNotAssociatedTokenAccount: 3014,
    AccountSysvarMismatch: 3015,
    AccountReallocExceedsLimit: 3016,
    AccountDuplicateReallocs: 3017,
    // Miscellaneous
    DeclaredProgramIdMismatch: 4100,
    // Used for APIs that shouldn't be used anymore.
    Deprecated: 5000,
};
const LangErrorMessage = new Map([
    // Instructions.
    [
        LangErrorCode.InstructionMissing,
        "8 byte instruction identifier not provided",
    ],
    [
        LangErrorCode.InstructionFallbackNotFound,
        "Fallback functions are not supported",
    ],
    [
        LangErrorCode.InstructionDidNotDeserialize,
        "The program could not deserialize the given instruction",
    ],
    [
        LangErrorCode.InstructionDidNotSerialize,
        "The program could not serialize the given instruction",
    ],
    // Idl instructions.
    [
        LangErrorCode.IdlInstructionStub,
        "The program was compiled without idl instructions",
    ],
    [
        LangErrorCode.IdlInstructionInvalidProgram,
        "The transaction was given an invalid program for the IDL instruction",
    ],
    // Constraints.
    [LangErrorCode.ConstraintMut, "A mut constraint was violated"],
    [LangErrorCode.ConstraintHasOne, "A has one constraint was violated"],
    [LangErrorCode.ConstraintSigner, "A signer constraint was violated"],
    [LangErrorCode.ConstraintRaw, "A raw constraint was violated"],
    [LangErrorCode.ConstraintOwner, "An owner constraint was violated"],
    [
        LangErrorCode.ConstraintRentExempt,
        "A rent exemption constraint was violated",
    ],
    [LangErrorCode.ConstraintSeeds, "A seeds constraint was violated"],
    [LangErrorCode.ConstraintExecutable, "An executable constraint was violated"],
    [
        LangErrorCode.ConstraintState,
        "Deprecated Error, feel free to replace with something else",
    ],
    [LangErrorCode.ConstraintAssociated, "An associated constraint was violated"],
    [
        LangErrorCode.ConstraintAssociatedInit,
        "An associated init constraint was violated",
    ],
    [LangErrorCode.ConstraintClose, "A close constraint was violated"],
    [LangErrorCode.ConstraintAddress, "An address constraint was violated"],
    [LangErrorCode.ConstraintZero, "Expected zero account discriminant"],
    [LangErrorCode.ConstraintTokenMint, "A token mint constraint was violated"],
    [LangErrorCode.ConstraintTokenOwner, "A token owner constraint was violated"],
    [
        LangErrorCode.ConstraintMintMintAuthority,
        "A mint mint authority constraint was violated",
    ],
    [
        LangErrorCode.ConstraintMintFreezeAuthority,
        "A mint freeze authority constraint was violated",
    ],
    [
        LangErrorCode.ConstraintMintDecimals,
        "A mint decimals constraint was violated",
    ],
    [LangErrorCode.ConstraintSpace, "A space constraint was violated"],
    [
        LangErrorCode.ConstraintAccountIsNone,
        "A required account for the constraint is None",
    ],
    // Require.
    [LangErrorCode.RequireViolated, "A require expression was violated"],
    [LangErrorCode.RequireEqViolated, "A require_eq expression was violated"],
    [
        LangErrorCode.RequireKeysEqViolated,
        "A require_keys_eq expression was violated",
    ],
    [LangErrorCode.RequireNeqViolated, "A require_neq expression was violated"],
    [
        LangErrorCode.RequireKeysNeqViolated,
        "A require_keys_neq expression was violated",
    ],
    [LangErrorCode.RequireGtViolated, "A require_gt expression was violated"],
    [LangErrorCode.RequireGteViolated, "A require_gte expression was violated"],
    // Accounts.
    [
        LangErrorCode.AccountDiscriminatorAlreadySet,
        "The account discriminator was already set on this account",
    ],
    [
        LangErrorCode.AccountDiscriminatorNotFound,
        "No 8 byte discriminator was found on the account",
    ],
    [
        LangErrorCode.AccountDiscriminatorMismatch,
        "8 byte discriminator did not match what was expected",
    ],
    [LangErrorCode.AccountDidNotDeserialize, "Failed to deserialize the account"],
    [LangErrorCode.AccountDidNotSerialize, "Failed to serialize the account"],
    [
        LangErrorCode.AccountNotEnoughKeys,
        "Not enough account keys given to the instruction",
    ],
    [LangErrorCode.AccountNotMutable, "The given account is not mutable"],
    [
        LangErrorCode.AccountOwnedByWrongProgram,
        "The given account is owned by a different program than expected",
    ],
    [LangErrorCode.InvalidProgramId, "Program ID was not as expected"],
    [LangErrorCode.InvalidProgramExecutable, "Program account is not executable"],
    [LangErrorCode.AccountNotSigner, "The given account did not sign"],
    [
        LangErrorCode.AccountNotSystemOwned,
        "The given account is not owned by the system program",
    ],
    [
        LangErrorCode.AccountNotInitialized,
        "The program expected this account to be already initialized",
    ],
    [
        LangErrorCode.AccountNotProgramData,
        "The given account is not a program data account",
    ],
    [
        LangErrorCode.AccountNotAssociatedTokenAccount,
        "The given account is not the associated token account",
    ],
    [
        LangErrorCode.AccountSysvarMismatch,
        "The given public key does not match the required sysvar",
    ],
    [
        LangErrorCode.AccountReallocExceedsLimit,
        "The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit",
    ],
    [
        LangErrorCode.AccountDuplicateReallocs,
        "The account was duplicated for more than one reallocation",
    ],
    // Miscellaneous
    [
        LangErrorCode.DeclaredProgramIdMismatch,
        "The declared program id does not match the actual program id",
    ],
    // Deprecated
    [
        LangErrorCode.Deprecated,
        "The API being used is deprecated and should no longer be used",
    ],
]);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}

function dotCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: "." }, options));
}

function snakeCase(input, options) {
    if (options === void 0) { options = {}; }
    return dotCase(input, __assign$1({ delimiter: "_" }, options));
}

class IdlCoder {
    static fieldLayout(field, types) {
        const fieldName = field.name !== undefined ? camelCase(field.name) : undefined;
        switch (field.type) {
            case "bool": {
                return borsh.bool(fieldName);
            }
            case "u8": {
                return borsh.u8(fieldName);
            }
            case "i8": {
                return borsh.i8(fieldName);
            }
            case "u16": {
                return borsh.u16(fieldName);
            }
            case "i16": {
                return borsh.i16(fieldName);
            }
            case "u32": {
                return borsh.u32(fieldName);
            }
            case "i32": {
                return borsh.i32(fieldName);
            }
            case "f32": {
                return borsh.f32(fieldName);
            }
            case "u64": {
                return borsh.u64(fieldName);
            }
            case "i64": {
                return borsh.i64(fieldName);
            }
            case "f64": {
                return borsh.f64(fieldName);
            }
            case "u128": {
                return borsh.u128(fieldName);
            }
            case "i128": {
                return borsh.i128(fieldName);
            }
            case "u256": {
                return borsh.u256(fieldName);
            }
            case "i256": {
                return borsh.i256(fieldName);
            }
            case "bytes": {
                return borsh.vecU8(fieldName);
            }
            case "string": {
                return borsh.str(fieldName);
            }
            case "publicKey": {
                return borsh.publicKey(fieldName);
            }
            default: {
                if ("vec" in field.type) {
                    return borsh.vec(IdlCoder.fieldLayout({
                        name: undefined,
                        type: field.type.vec,
                    }, types), fieldName);
                }
                else if ("option" in field.type) {
                    return borsh.option(IdlCoder.fieldLayout({
                        name: undefined,
                        type: field.type.option,
                    }, types), fieldName);
                }
                else if ("defined" in field.type) {
                    // User defined type.
                    if (!types) {
                        throw new IdlError("User defined types not provided");
                    }
                    const defined = field.type.defined;
                    const filtered = types.filter((t) => t.name === defined);
                    if (filtered.length !== 1) {
                        throw new IdlError(`Type not found: ${JSON.stringify(field)}`);
                    }
                    return IdlCoder.typeDefLayout(filtered[0], types, fieldName);
                }
                else if ("array" in field.type) {
                    let arrayTy = field.type.array[0];
                    let arrayLen = field.type.array[1];
                    let innerLayout = IdlCoder.fieldLayout({
                        name: undefined,
                        type: arrayTy,
                    }, types);
                    return borsh.array(innerLayout, arrayLen, fieldName);
                }
                else {
                    throw new Error(`Not yet implemented: ${field}`);
                }
            }
        }
    }
    static typeDefLayout(typeDef, types = [], name) {
        switch (typeDef.type.kind) {
            case "struct": {
                const fieldLayouts = typeDef.type.fields.map((field) => {
                    return IdlCoder.fieldLayout(field, types);
                });
                return borsh.struct(fieldLayouts, name);
            }
            case "enum": {
                let variants = typeDef.type.variants.map((variant) => {
                    const name = camelCase(variant.name);
                    if (!variant.fields) {
                        return borsh.struct([], name);
                    }
                    const fieldLayouts = variant.fields.map((f, i) => {
                        if (f === null || f === void 0 ? void 0 : f.name) {
                            return IdlCoder.fieldLayout(f, types);
                        }
                        return IdlCoder.fieldLayout({ type: f, name: i.toString() }, types);
                    });
                    return borsh.struct(fieldLayouts, name);
                });
                if (name !== undefined) {
                    // Buffer-layout lib requires the name to be null (on construction)
                    // when used as a field.
                    return borsh.rustEnum(variants).replicate(name);
                }
                return borsh.rustEnum(variants, name);
            }
            case "alias": {
                return IdlCoder.fieldLayout({ type: typeDef.type.value, name: typeDef.name }, types);
            }
        }
    }
}

/**
 * Namespace for global instruction function signatures (i.e. functions
 * that aren't namespaced by the state or any of its trait implementations).
 */
const SIGHASH_GLOBAL_NAMESPACE = "global";
/**
 * Encodes and decodes program instructions.
 */
class BorshInstructionCoder {
    constructor(idl) {
        this.idl = idl;
        this.ixLayout = BorshInstructionCoder.parseIxLayout(idl);
        const sighashLayouts = new Map();
        idl.instructions.forEach((ix) => {
            const sh = sighash(SIGHASH_GLOBAL_NAMESPACE, ix.name);
            sighashLayouts.set(bs58$1.encode(sh), {
                layout: this.ixLayout.get(ix.name),
                name: ix.name,
            });
        });
        this.sighashLayouts = sighashLayouts;
    }
    /**
     * Encodes a program instruction.
     */
    encode(ixName, ix) {
        return this._encode(SIGHASH_GLOBAL_NAMESPACE, ixName, ix);
    }
    _encode(nameSpace, ixName, ix) {
        const buffer = Buffer$1.alloc(1000); // TODO: use a tighter buffer.
        const methodName = camelCase(ixName);
        const layout = this.ixLayout.get(methodName);
        if (!layout) {
            throw new Error(`Unknown method: ${methodName}`);
        }
        const len = layout.encode(ix, buffer);
        const data = buffer.slice(0, len);
        return Buffer$1.concat([sighash(nameSpace, ixName), data]);
    }
    static parseIxLayout(idl) {
        const ixLayouts = idl.instructions.map((ix) => {
            let fieldLayouts = ix.args.map((arg) => {
                var _a, _b;
                return IdlCoder.fieldLayout(arg, Array.from([...((_a = idl.accounts) !== null && _a !== void 0 ? _a : []), ...((_b = idl.types) !== null && _b !== void 0 ? _b : [])]));
            });
            const name = camelCase(ix.name);
            return [name, borsh.struct(fieldLayouts, name)];
        });
        return new Map(ixLayouts);
    }
    /**
     * Decodes a program instruction.
     */
    decode(ix, encoding = "hex") {
        if (typeof ix === "string") {
            ix = encoding === "hex" ? Buffer$1.from(ix, "hex") : bs58$1.decode(ix);
        }
        let sighash = bs58$1.encode(ix.slice(0, 8));
        let data = ix.slice(8);
        const decoder = this.sighashLayouts.get(sighash);
        if (!decoder) {
            return null;
        }
        return {
            data: decoder.layout.decode(data),
            name: decoder.name,
        };
    }
    /**
     * Returns a formatted table of all the fields in the given instruction data.
     */
    format(ix, accountMetas) {
        return InstructionFormatter.format(ix, accountMetas, this.idl);
    }
}
class InstructionFormatter {
    static format(ix, accountMetas, idl) {
        const idlIx = idl.instructions.filter((i) => ix.name === i.name)[0];
        if (idlIx === undefined) {
            console.error("Invalid instruction given");
            return null;
        }
        const args = idlIx.args.map((idlField) => {
            return {
                name: idlField.name,
                type: InstructionFormatter.formatIdlType(idlField.type),
                data: InstructionFormatter.formatIdlData(idlField, ix.data[idlField.name], idl.types),
            };
        });
        const flatIdlAccounts = InstructionFormatter.flattenIdlAccounts(idlIx.accounts);
        const accounts = accountMetas.map((meta, idx) => {
            if (idx < flatIdlAccounts.length) {
                return {
                    name: flatIdlAccounts[idx].name,
                    ...meta,
                };
            }
            // "Remaining accounts" are unnamed in Anchor.
            else {
                return {
                    name: undefined,
                    ...meta,
                };
            }
        });
        return {
            args,
            accounts,
        };
    }
    static formatIdlType(idlType) {
        if (typeof idlType === "string") {
            return idlType;
        }
        if ("vec" in idlType) {
            return `Vec<${this.formatIdlType(idlType.vec)}>`;
        }
        if ("option" in idlType) {
            return `Option<${this.formatIdlType(idlType.option)}>`;
        }
        if ("defined" in idlType) {
            return idlType.defined;
        }
        if ("array" in idlType) {
            return `Array<${idlType.array[0]}; ${idlType.array[1]}>`;
        }
        throw new Error(`Unknown IDL type: ${idlType}`);
    }
    static formatIdlData(idlField, data, types) {
        if (typeof idlField.type === "string") {
            return data.toString();
        }
        if (idlField.type.hasOwnProperty("vec")) {
            return ("[" +
                data
                    .map((d) => this.formatIdlData({ name: "", type: idlField.type.vec }, d))
                    .join(", ") +
                "]");
        }
        if (idlField.type.hasOwnProperty("option")) {
            return data === null
                ? "null"
                : this.formatIdlData({ name: "", type: idlField.type.option }, data, types);
        }
        if (idlField.type.hasOwnProperty("defined")) {
            if (types === undefined) {
                throw new Error("User defined types not provided");
            }
            const filtered = types.filter((t) => t.name === idlField.type.defined);
            if (filtered.length !== 1) {
                throw new Error(`Type not found: ${idlField.type.defined}`);
            }
            return InstructionFormatter.formatIdlDataDefined(filtered[0], data, types);
        }
        return "unknown";
    }
    static formatIdlDataDefined(typeDef, data, types) {
        switch (typeDef.type.kind) {
            case "struct": {
                const struct = typeDef.type;
                const fields = Object.keys(data)
                    .map((k) => {
                    const field = struct.fields.find((f) => f.name === k);
                    if (!field) {
                        throw new Error("Unable to find type");
                    }
                    return (k +
                        ": " +
                        InstructionFormatter.formatIdlData(field, data[k], types));
                })
                    .join(", ");
                return "{ " + fields + " }";
            }
            case "enum": {
                if (typeDef.type.variants.length === 0) {
                    return "{}";
                }
                // Struct enum.
                if (typeDef.type.variants[0].name) {
                    const variants = typeDef.type.variants;
                    const variant = Object.keys(data)[0];
                    const enumType = data[variant];
                    const namedFields = Object.keys(enumType)
                        .map((f) => {
                        var _a;
                        const fieldData = enumType[f];
                        const idlField = (_a = variants[variant]) === null || _a === void 0 ? void 0 : _a.find((v) => v.name === f);
                        if (!idlField) {
                            throw new Error("Unable to find variant");
                        }
                        return (f +
                            ": " +
                            InstructionFormatter.formatIdlData(idlField, fieldData, types));
                    })
                        .join(", ");
                    const variantName = camelCase(variant, { pascalCase: true });
                    if (namedFields.length === 0) {
                        return variantName;
                    }
                    return `${variantName} { ${namedFields} }`;
                }
                // Tuple enum.
                else {
                    // TODO.
                    return "Tuple formatting not yet implemented";
                }
            }
            case "alias": {
                return InstructionFormatter.formatIdlType(typeDef.type.value);
            }
        }
    }
    static flattenIdlAccounts(accounts, prefix) {
        return accounts
            .map((account) => {
            const accName = sentenceCase(account.name);
            if (account.hasOwnProperty("accounts")) {
                const newPrefix = prefix ? `${prefix} > ${accName}` : accName;
                return InstructionFormatter.flattenIdlAccounts(account.accounts, newPrefix);
            }
            else {
                return {
                    ...account,
                    name: prefix ? `${prefix} > ${accName}` : accName,
                };
            }
        })
            .flat();
    }
}
function sentenceCase(field) {
    const result = field.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}
// Not technically sighash, since we don't include the arguments, as Rust
// doesn't allow function overloading.
function sighash(nameSpace, ixName) {
    let name = snakeCase(ixName);
    let preimage = `${nameSpace}:${name}`;
    return Buffer$1.from(sha256$1(preimage).slice(0, 8));
}

function accountSize(idl, idlAccount) {
    switch (idlAccount.type.kind) {
        case "struct": {
            return idlAccount.type.fields
                .map((f) => typeSize(idl, f.type))
                .reduce((acc, size) => acc + size, 0);
        }
        case "enum": {
            const variantSizes = idlAccount.type.variants.map((variant) => {
                if (!variant.fields) {
                    return 0;
                }
                return variant.fields
                    .map((f) => {
                    // Unnamed enum variant
                    if (!(typeof f === "object" && "name" in f)) {
                        return typeSize(idl, f);
                    }
                    // Named enum variant
                    return typeSize(idl, f.type);
                })
                    .reduce((acc, size) => acc + size, 0);
            });
            return Math.max(...variantSizes) + 1;
        }
        case "alias": {
            return typeSize(idl, idlAccount.type.value);
        }
    }
}
// Returns the size of the type in bytes. For variable length types, just return
// 1. Users should override this value in such cases.
function typeSize(idl, ty) {
    var _a, _b;
    switch (ty) {
        case "bool":
            return 1;
        case "u8":
            return 1;
        case "i8":
            return 1;
        case "i16":
            return 2;
        case "u16":
            return 2;
        case "u32":
            return 4;
        case "i32":
            return 4;
        case "f32":
            return 4;
        case "u64":
            return 8;
        case "i64":
            return 8;
        case "f64":
            return 8;
        case "u128":
            return 16;
        case "i128":
            return 16;
        case "u256":
            return 32;
        case "i256":
            return 32;
        case "bytes":
            return 1;
        case "string":
            return 1;
        case "publicKey":
            return 32;
        default:
            if ("vec" in ty) {
                return 1;
            }
            if ("option" in ty) {
                return 1 + typeSize(idl, ty.option);
            }
            if ("coption" in ty) {
                return 4 + typeSize(idl, ty.coption);
            }
            if ("defined" in ty) {
                const filtered = (_b = (_a = idl.types) === null || _a === void 0 ? void 0 : _a.filter((t) => t.name === ty.defined)) !== null && _b !== void 0 ? _b : [];
                if (filtered.length !== 1) {
                    throw new IdlError(`Type not found: ${JSON.stringify(ty)}`);
                }
                let typeDef = filtered[0];
                return accountSize(idl, typeDef);
            }
            if ("array" in ty) {
                let arrayTy = ty.array[0];
                let arraySize = ty.array[1];
                return typeSize(idl, arrayTy) * arraySize;
            }
            throw new Error(`Invalid type ${JSON.stringify(ty)}`);
    }
}

/**
 * Number of bytes in anchor discriminators
 */
const DISCRIMINATOR_SIZE = 8;
function discriminator(preimage) {
    return Buffer.from(sha256$1(preimage).slice(0, DISCRIMINATOR_SIZE));
}

/**
 * Encodes and decodes account objects.
 */
class BorshAccountsCoder {
    constructor(idl) {
        if (idl.accounts === undefined) {
            this.accountLayouts = new Map();
            return;
        }
        const layouts = idl.accounts.map((acc) => {
            return [acc.name, IdlCoder.typeDefLayout(acc, idl.types)];
        });
        this.accountLayouts = new Map(layouts);
        this.idl = idl;
    }
    async encode(accountName, account) {
        const buffer = Buffer$1.alloc(1000); // TODO: use a tighter buffer.
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error(`Unknown account: ${accountName}`);
        }
        const len = layout.encode(account, buffer);
        let accountData = buffer.slice(0, len);
        let discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
        return Buffer$1.concat([discriminator, accountData]);
    }
    decode(accountName, data) {
        // Assert the account discriminator is correct.
        const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
        if (discriminator.compare(data.slice(0, 8))) {
            throw new Error("Invalid account discriminator");
        }
        return this.decodeUnchecked(accountName, data);
    }
    decodeAny(data) {
        const accountDescriminator = data.slice(0, 8);
        const accountName = Array.from(this.accountLayouts.keys()).find((key) => BorshAccountsCoder.accountDiscriminator(key).equals(accountDescriminator));
        if (!accountName) {
            throw new Error("Account descriminator not found");
        }
        return this.decodeUnchecked(accountName, data);
    }
    decodeUnchecked(accountName, ix) {
        // Chop off the discriminator before decoding.
        const data = ix.subarray(DISCRIMINATOR_SIZE);
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error(`Unknown account: ${accountName}`);
        }
        return layout.decode(data);
    }
    memcmp(accountName, appendData) {
        const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
        return {
            offset: 0,
            bytes: bs58$1.encode(appendData ? Buffer$1.concat([discriminator, appendData]) : discriminator),
        };
    }
    size(idlAccount) {
        var _a;
        return DISCRIMINATOR_SIZE + ((_a = accountSize(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Calculates and returns a unique 8 byte discriminator prepended to all anchor accounts.
     *
     * @param name The name of the account to calculate the discriminator.
     */
    static accountDiscriminator(name) {
        const discriminatorPreimage = `account:${camelCase(name, {
            pascalCase: true,
            preserveConsecutiveUppercase: true,
        })}`;
        return discriminator(discriminatorPreimage);
    }
}

class BorshEventCoder {
    constructor(idl) {
        if (idl.events === undefined) {
            this.layouts = new Map();
            return;
        }
        const layouts = idl.events.map((event) => {
            let eventTypeDef = {
                name: event.name,
                type: {
                    kind: "struct",
                    fields: event.fields.map((f) => {
                        return { name: f.name, type: f.type };
                    }),
                },
            };
            return [event.name, IdlCoder.typeDefLayout(eventTypeDef, idl.types)];
        });
        this.layouts = new Map(layouts);
        this.discriminators = new Map(idl.events === undefined
            ? []
            : idl.events.map((e) => [
                encode(eventDiscriminator(e.name)),
                e.name,
            ]));
    }
    decode(log) {
        let logArr;
        // This will throw if log length is not a multiple of 4.
        try {
            logArr = decode(log);
        }
        catch (e) {
            return null;
        }
        const disc = encode(logArr.slice(0, 8));
        // Only deserialize if the discriminator implies a proper event.
        const eventName = this.discriminators.get(disc);
        if (eventName === undefined) {
            return null;
        }
        const layout = this.layouts.get(eventName);
        if (!layout) {
            throw new Error(`Unknown event: ${eventName}`);
        }
        const data = layout.decode(logArr.slice(8));
        return { data, name: eventName };
    }
}
function eventDiscriminator(name) {
    return discriminator(`event:${name}`);
}

/**
 * Encodes and decodes user-defined types.
 */
class BorshTypesCoder {
    constructor(idl) {
        if (idl.types === undefined) {
            this.typeLayouts = new Map();
            return;
        }
        const layouts = idl.types.map((acc) => {
            return [acc.name, IdlCoder.typeDefLayout(acc, idl.types)];
        });
        this.typeLayouts = new Map(layouts);
        this.idl = idl;
    }
    encode(typeName, type) {
        const buffer = Buffer$1.alloc(1000); // TODO: use a tighter buffer.
        const layout = this.typeLayouts.get(typeName);
        if (!layout) {
            throw new Error(`Unknown type: ${typeName}`);
        }
        const len = layout.encode(type, buffer);
        return buffer.slice(0, len);
    }
    decode(typeName, typeData) {
        const layout = this.typeLayouts.get(typeName);
        if (!layout) {
            throw new Error(`Unknown type: ${typeName}`);
        }
        return layout.decode(typeData);
    }
}

/**
 * BorshCoder is the default Coder for Anchor programs implementing the
 * borsh based serialization interface.
 */
class BorshCoder {
    constructor(idl) {
        this.instruction = new BorshInstructionCoder(idl);
        this.accounts = new BorshAccountsCoder(idl);
        this.events = new BorshEventCoder(idl);
        this.types = new BorshTypesCoder(idl);
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/* The MIT License (MIT)
 *
 * Copyright 2015-2018 Peter A. Bigot
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Base class for layout objects.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
 * Layout#encode|encode} or {@link Layout#decode|decode} functions.
 *
 * @param {Number} span - Initializer for {@link Layout#span|span}.  The
 * parameter must be an integer; a negative value signifies that the
 * span is {@link Layout#getSpan|value-specific}.
 *
 * @param {string} [property] - Initializer for {@link
 * Layout#property|property}.
 *
 * @abstract
 */
class Layout {
  constructor(span, property) {
    if (!Number.isInteger(span)) {
      throw new TypeError('span must be an integer');
    }

    /** The span of the layout in bytes.
     *
     * Positive values are generally expected.
     *
     * Zero will only appear in {@link Constant}s and in {@link
     * Sequence}s where the {@link Sequence#count|count} is zero.
     *
     * A negative value indicates that the span is value-specific, and
     * must be obtained using {@link Layout#getSpan|getSpan}. */
    this.span = span;

    /** The property name used when this layout is represented in an
     * Object.
     *
     * Used only for layouts that {@link Layout#decode|decode} to Object
     * instances.  If left undefined the span of the unnamed layout will
     * be treated as padding: it will not be mutated by {@link
     * Layout#encode|encode} nor represented as a property in the
     * decoded Object. */
    this.property = property;
  }

  /** Function to create an Object into which decoded properties will
   * be written.
   *
   * Used only for layouts that {@link Layout#decode|decode} to Object
   * instances, which means:
   * * {@link Structure}
   * * {@link Union}
   * * {@link VariantLayout}
   * * {@link BitStructure}
   *
   * If left undefined the JavaScript representation of these layouts
   * will be Object instances.
   *
   * See {@link bindConstructorLayout}.
   */
  makeDestinationObject() {
    return {};
  }

  /**
   * Decode from a Buffer into an JavaScript value.
   *
   * @param {Buffer} b - the buffer from which encoded data is read.
   *
   * @param {Number} [offset] - the offset at which the encoded data
   * starts.  If absent a zero offset is inferred.
   *
   * @returns {(Number|Array|Object)} - the value of the decoded data.
   *
   * @abstract
   */
  decode(b, offset) {
    throw new Error('Layout is abstract');
  }

  /**
   * Encode a JavaScript value into a Buffer.
   *
   * @param {(Number|Array|Object)} src - the value to be encoded into
   * the buffer.  The type accepted depends on the (sub-)type of {@link
   * Layout}.
   *
   * @param {Buffer} b - the buffer into which encoded data will be
   * written.
   *
   * @param {Number} [offset] - the offset at which the encoded data
   * starts.  If absent a zero offset is inferred.
   *
   * @returns {Number} - the number of bytes encoded, including the
   * space skipped for internal padding, but excluding data such as
   * {@link Sequence#count|lengths} when stored {@link
   * ExternalLayout|externally}.  This is the adjustment to `offset`
   * producing the offset where data for the next layout would be
   * written.
   *
   * @abstract
   */
  encode(src, b, offset) {
    throw new Error('Layout is abstract');
  }

  /**
   * Calculate the span of a specific instance of a layout.
   *
   * @param {Buffer} b - the buffer that contains an encoded instance.
   *
   * @param {Number} [offset] - the offset at which the encoded instance
   * starts.  If absent a zero offset is inferred.
   *
   * @return {Number} - the number of bytes covered by the layout
   * instance.  If this method is not overridden in a subclass the
   * definition-time constant {@link Layout#span|span} will be
   * returned.
   *
   * @throws {RangeError} - if the length of the value cannot be
   * determined.
   */
  getSpan(b, offset) {
    if (0 > this.span) {
      throw new RangeError('indeterminate span');
    }
    return this.span;
  }

  /**
   * Replicate the layout using a new property.
   *
   * This function must be used to get a structurally-equivalent layout
   * with a different name since all {@link Layout} instances are
   * immutable.
   *
   * **NOTE** This is a shallow copy.  All fields except {@link
   * Layout#property|property} are strictly equal to the origin layout.
   *
   * @param {String} property - the value for {@link
   * Layout#property|property} in the replica.
   *
   * @returns {Layout} - the copy with {@link Layout#property|property}
   * set to `property`.
   */
  replicate(property) {
    const rv = Object.create(this.constructor.prototype);
    Object.assign(rv, this);
    rv.property = property;
    return rv;
  }

  /**
   * Create an object from layout properties and an array of values.
   *
   * **NOTE** This function returns `undefined` if invoked on a layout
   * that does not return its value as an Object.  Objects are
   * returned for things that are a {@link Structure}, which includes
   * {@link VariantLayout|variant layouts} if they are structures, and
   * excludes {@link Union}s.  If you want this feature for a union
   * you must use {@link Union.getVariant|getVariant} to select the
   * desired layout.
   *
   * @param {Array} values - an array of values that correspond to the
   * default order for properties.  As with {@link Layout#decode|decode}
   * layout elements that have no property name are skipped when
   * iterating over the array values.  Only the top-level properties are
   * assigned; arguments are not assigned to properties of contained
   * layouts.  Any unused values are ignored.
   *
   * @return {(Object|undefined)}
   */
  fromArray(values) {
    return undefined;
  }
}
var Layout_2 = Layout;

/* Provide text that carries a name (such as for a function that will
 * be throwing an error) annotated with the property of a given layout
 * (such as one for which the value was unacceptable).
 *
 * @ignore */
function nameWithProperty(name, lo) {
  if (lo.property) {
    return name + '[' + lo.property + ']';
  }
  return name;
}

/**
 * An object that behaves like a layout but does not consume space
 * within its containing layout.
 *
 * This is primarily used to obtain metadata about a member, such as a
 * {@link OffsetLayout} that can provide data about a {@link
 * Layout#getSpan|value-specific span}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support {@link
 * ExternalLayout#isCount|isCount} or other {@link Layout} functions.
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @abstract
 * @augments {Layout}
 */
class ExternalLayout extends Layout {
  /**
   * Return `true` iff the external layout decodes to an unsigned
   * integer layout.
   *
   * In that case it can be used as the source of {@link
   * Sequence#count|Sequence counts}, {@link Blob#length|Blob lengths},
   * or as {@link UnionLayoutDiscriminator#layout|external union
   * discriminators}.
   *
   * @abstract
   */
  isCount() {
    throw new Error('ExternalLayout is abstract');
  }
}

/**
 * An {@link ExternalLayout} that supports accessing a {@link Layout}
 * at a fixed offset from the start of another Layout.  The offset may
 * be before, within, or after the base layout.
 *
 * *Factory*: {@link module:Layout.offset|offset}
 *
 * @param {Layout} layout - initializer for {@link
 * OffsetLayout#layout|layout}, modulo `property`.
 *
 * @param {Number} [offset] - Initializes {@link
 * OffsetLayout#offset|offset}.  Defaults to zero.
 *
 * @param {string} [property] - Optional new property name for a
 * {@link Layout#replicate| replica} of `layout` to be used as {@link
 * OffsetLayout#layout|layout}.  If not provided the `layout` is used
 * unchanged.
 *
 * @augments {Layout}
 */
class OffsetLayout extends ExternalLayout {
  constructor(layout, offset, property) {
    if (!(layout instanceof Layout)) {
      throw new TypeError('layout must be a Layout');
    }

    if (undefined === offset) {
      offset = 0;
    } else if (!Number.isInteger(offset)) {
      throw new TypeError('offset must be integer or undefined');
    }

    super(layout.span, property || layout.property);

    /** The subordinated layout. */
    this.layout = layout;

    /** The location of {@link OffsetLayout#layout} relative to the
     * start of another layout.
     *
     * The value may be positive or negative, but an error will thrown
     * if at the point of use it goes outside the span of the Buffer
     * being accessed.  */
    this.offset = offset;
  }

  /** @override */
  isCount() {
    return ((this.layout instanceof UInt)
            || (this.layout instanceof UIntBE));
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return this.layout.decode(b, offset + this.offset);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return this.layout.encode(src, b, offset + this.offset);
  }
}

/**
 * Represent an unsigned integer in little-endian format.
 *
 * *Factory*: {@link module:Layout.u8|u8}, {@link
 *  module:Layout.u16|u16}, {@link module:Layout.u24|u24}, {@link
 *  module:Layout.u32|u32}, {@link module:Layout.u40|u40}, {@link
 *  module:Layout.u48|u48}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class UInt extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError('span must not exceed 6 bytes');
    }
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readUIntLE(offset, this.span);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeUIntLE(src, offset, this.span);
    return this.span;
  }
}

/**
 * Represent an unsigned integer in big-endian format.
 *
 * *Factory*: {@link module:Layout.u8be|u8be}, {@link
 * module:Layout.u16be|u16be}, {@link module:Layout.u24be|u24be},
 * {@link module:Layout.u32be|u32be}, {@link
 * module:Layout.u40be|u40be}, {@link module:Layout.u48be|u48be}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class UIntBE extends Layout {
  constructor(span, property) {
    super( span, property);
    if (6 < this.span) {
      throw new RangeError('span must not exceed 6 bytes');
    }
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readUIntBE(offset, this.span);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeUIntBE(src, offset, this.span);
    return this.span;
  }
}

const V2E32 = Math.pow(2, 32);

/* True modulus high and low 32-bit words, where low word is always
 * non-negative. */
function divmodInt64(src) {
  const hi32 = Math.floor(src / V2E32);
  const lo32 = src - (hi32 * V2E32);
  return {hi32, lo32};
}
/* Reconstruct Number from quotient and non-negative remainder */
function roundedInt64(hi32, lo32) {
  return hi32 * V2E32 + lo32;
}

/**
 * Represent an unsigned 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.nu64|nu64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
class NearUInt64 extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const lo32 = b.readUInt32LE(offset);
    const hi32 = b.readUInt32LE(offset + 4);
    return roundedInt64(hi32, lo32);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const split = divmodInt64(src);
    b.writeUInt32LE(split.lo32, offset);
    b.writeUInt32LE(split.hi32, offset + 4);
    return 8;
  }
}

/**
 * Represent a signed 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.ns64|ns64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
class NearInt64 extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const lo32 = b.readUInt32LE(offset);
    const hi32 = b.readInt32LE(offset + 4);
    return roundedInt64(hi32, lo32);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const split = divmodInt64(src);
    b.writeUInt32LE(split.lo32, offset);
    b.writeInt32LE(split.hi32, offset + 4);
    return 8;
  }
}

/**
 * Represent a contiguous sequence of arbitrary layout elements as an
 * Object.
 *
 * *Factory*: {@link module:Layout.struct|struct}
 *
 * **NOTE** The {@link Layout#span|span} of the structure is variable
 * if any layout in {@link Structure#fields|fields} has a variable
 * span.  When {@link Layout#encode|encoding} we must have a value for
 * all variable-length fields, or we wouldn't be able to figure out
 * how much space to use for storage.  We can only identify the value
 * for a field when it has a {@link Layout#property|property}.  As
 * such, although a structure may contain both unnamed fields and
 * variable-length fields, it cannot contain an unnamed
 * variable-length field.
 *
 * @param {Layout[]} fields - initializer for {@link
 * Structure#fields|fields}.  An error is raised if this contains a
 * variable-length field for which a {@link Layout#property|property}
 * is not defined.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @param {Boolean} [decodePrefixes] - initializer for {@link
 * Structure#decodePrefixes|property}.
 *
 * @throws {Error} - if `fields` contains an unnamed variable-length
 * layout.
 *
 * @augments {Layout}
 */
class Structure extends Layout {
  constructor(fields, property, decodePrefixes) {
    if (!(Array.isArray(fields)
          && fields.reduce((acc, v) => acc && (v instanceof Layout), true))) {
      throw new TypeError('fields must be array of Layout instances');
    }
    if (('boolean' === typeof property)
        && (undefined === decodePrefixes)) {
      decodePrefixes = property;
      property = undefined;
    }

    /* Verify absence of unnamed variable-length fields. */
    for (const fd of fields) {
      if ((0 > fd.span)
          && (undefined === fd.property)) {
        throw new Error('fields cannot contain unnamed variable-length layout');
      }
    }

    let span = -1;
    try {
      span = fields.reduce((span, fd) => span + fd.getSpan(), 0);
    } catch (e) {
    }
    super(span, property);

    /** The sequence of {@link Layout} values that comprise the
     * structure.
     *
     * The individual elements need not be the same type, and may be
     * either scalar or aggregate layouts.  If a member layout leaves
     * its {@link Layout#property|property} undefined the
     * corresponding region of the buffer associated with the element
     * will not be mutated.
     *
     * @type {Layout[]} */
    this.fields = fields;

    /** Control behavior of {@link Layout#decode|decode()} given short
     * buffers.
     *
     * In some situations a structure many be extended with additional
     * fields over time, with older installations providing only a
     * prefix of the full structure.  If this property is `true`
     * decoding will accept those buffers and leave subsequent fields
     * undefined, as long as the buffer ends at a field boundary.
     * Defaults to `false`. */
    this.decodePrefixes = !!decodePrefixes;
  }

  /** @override */
  getSpan(b, offset) {
    if (0 <= this.span) {
      return this.span;
    }
    if (undefined === offset) {
      offset = 0;
    }
    let span = 0;
    try {
      span = this.fields.reduce((span, fd) => {
        const fsp = fd.getSpan(b, offset);
        offset += fsp;
        return span + fsp;
      }, 0);
    } catch (e) {
      throw new RangeError('indeterminate span');
    }
    return span;
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const dest = this.makeDestinationObject();
    for (const fd of this.fields) {
      if (undefined !== fd.property) {
        dest[fd.property] = fd.decode(b, offset);
      }
      offset += fd.getSpan(b, offset);
      if (this.decodePrefixes
          && (b.length === offset)) {
        break;
      }
    }
    return dest;
  }

  /** Implement {@link Layout#encode|encode} for {@link Structure}.
   *
   * If `src` is missing a property for a member with a defined {@link
   * Layout#property|property} the corresponding region of the buffer is
   * left unmodified. */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const firstOffset = offset;
    let lastOffset = 0;
    let lastWrote = 0;
    for (const fd of this.fields) {
      let span = fd.span;
      lastWrote = (0 < span) ? span : 0;
      if (undefined !== fd.property) {
        const fv = src[fd.property];
        if (undefined !== fv) {
          lastWrote = fd.encode(fv, b, offset);
          if (0 > span) {
            /* Read the as-encoded span, which is not necessarily the
             * same as what we wrote. */
            span = fd.getSpan(b, offset);
          }
        }
      }
      lastOffset = offset;
      offset += span;
    }
    /* Use (lastOffset + lastWrote) instead of offset because the last
     * item may have had a dynamic length and we don't want to include
     * the padding between it and the end of the space reserved for
     * it. */
    return (lastOffset + lastWrote) - firstOffset;
  }

  /** @override */
  fromArray(values) {
    const dest = this.makeDestinationObject();
    for (const fd of this.fields) {
      if ((undefined !== fd.property)
          && (0 < values.length)) {
        dest[fd.property] = values.shift();
      }
    }
    return dest;
  }

  /**
   * Get access to the layout of a given property.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Layout} - the layout associated with `property`, or
   * undefined if there is no such property.
   */
  layoutFor(property) {
    if ('string' !== typeof property) {
      throw new TypeError('property must be string');
    }
    for (const fd of this.fields) {
      if (fd.property === property) {
        return fd;
      }
    }
  }

  /**
   * Get the offset of a structure member.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Number} - the offset in bytes to the start of `property`
   * within the structure, or undefined if `property` is not a field
   * within the structure.  If the property is a member but follows a
   * variable-length structure member a negative number will be
   * returned.
   */
  offsetOf(property) {
    if ('string' !== typeof property) {
      throw new TypeError('property must be string');
    }
    let offset = 0;
    for (const fd of this.fields) {
      if (fd.property === property) {
        return offset;
      }
      if (0 > fd.span) {
        offset = -1;
      } else if (0 <= offset) {
        offset += fd.span;
      }
    }
  }
}

/**
 * An object that can provide a {@link
 * Union#discriminator|discriminator} API for {@link Union}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
 * UnionDiscriminator#encode|encode} or {@link
 * UnionDiscriminator#decode|decode} functions.
 *
 * @param {string} [property] - Default for {@link
 * UnionDiscriminator#property|property}.
 *
 * @abstract
 */
class UnionDiscriminator {
  constructor(property) {
    /** The {@link Layout#property|property} to be used when the
     * discriminator is referenced in isolation (generally when {@link
     * Union#decode|Union decode} cannot delegate to a specific
     * variant). */
    this.property = property;
  }

  /** Analog to {@link Layout#decode|Layout decode} for union discriminators.
   *
   * The implementation of this method need not reference the buffer if
   * variant information is available through other means. */
  decode() {
    throw new Error('UnionDiscriminator is abstract');
  }

  /** Analog to {@link Layout#decode|Layout encode} for union discriminators.
   *
   * The implementation of this method need not store the value if
   * variant information is maintained through other means. */
  encode() {
    throw new Error('UnionDiscriminator is abstract');
  }
}

/**
 * An object that can provide a {@link
 * UnionDiscriminator|discriminator API} for {@link Union} using an
 * unsigned integral {@link Layout} instance located either inside or
 * outside the union.
 *
 * @param {ExternalLayout} layout - initializes {@link
 * UnionLayoutDiscriminator#layout|layout}.  Must satisfy {@link
 * ExternalLayout#isCount|isCount()}.
 *
 * @param {string} [property] - Default for {@link
 * UnionDiscriminator#property|property}, superseding the property
 * from `layout`, but defaulting to `variant` if neither `property`
 * nor layout provide a property name.
 *
 * @augments {UnionDiscriminator}
 */
class UnionLayoutDiscriminator extends UnionDiscriminator {
  constructor(layout, property) {
    if (!((layout instanceof ExternalLayout)
          && layout.isCount())) {
      throw new TypeError('layout must be an unsigned integer ExternalLayout');
    }

    super(property || layout.property || 'variant');

    /** The {@link ExternalLayout} used to access the discriminator
     * value. */
    this.layout = layout;
  }

  /** Delegate decoding to {@link UnionLayoutDiscriminator#layout|layout}. */
  decode(b, offset) {
    return this.layout.decode(b, offset);
  }

  /** Delegate encoding to {@link UnionLayoutDiscriminator#layout|layout}. */
  encode(src, b, offset) {
    return this.layout.encode(src, b, offset);
  }
}

/**
 * Represent any number of span-compatible layouts.
 *
 * *Factory*: {@link module:Layout.union|union}
 *
 * If the union has a {@link Union#defaultLayout|default layout} that
 * layout must have a non-negative {@link Layout#span|span}.  The span
 * of a fixed-span union includes its {@link
 * Union#discriminator|discriminator} if the variant is a {@link
 * Union#usesPrefixDiscriminator|prefix of the union}, plus the span
 * of its {@link Union#defaultLayout|default layout}.
 *
 * If the union does not have a default layout then the encoded span
 * of the union depends on the encoded span of its variant (which may
 * be fixed or variable).
 *
 * {@link VariantLayout#layout|Variant layout}s are added through
 * {@link Union#addVariant|addVariant}.  If the union has a default
 * layout, the span of the {@link VariantLayout#layout|layout
 * contained by the variant} must not exceed the span of the {@link
 * Union#defaultLayout|default layout} (minus the span of a {@link
 * Union#usesPrefixDiscriminator|prefix disriminator}, if used).  The
 * span of the variant will equal the span of the union itself.
 *
 * The variant for a buffer can only be identified from the {@link
 * Union#discriminator|discriminator} {@link
 * UnionDiscriminator#property|property} (in the case of the {@link
 * Union#defaultLayout|default layout}), or by using {@link
 * Union#getVariant|getVariant} and examining the resulting {@link
 * VariantLayout} instance.
 *
 * A variant compatible with a JavaScript object can be identified
 * using {@link Union#getSourceVariant|getSourceVariant}.
 *
 * @param {(UnionDiscriminator|ExternalLayout|Layout)} discr - How to
 * identify the layout used to interpret the union contents.  The
 * parameter must be an instance of {@link UnionDiscriminator}, an
 * {@link ExternalLayout} that satisfies {@link
 * ExternalLayout#isCount|isCount()}, or {@link UInt} (or {@link
 * UIntBE}).  When a non-external layout element is passed the layout
 * appears at the start of the union.  In all cases the (synthesized)
 * {@link UnionDiscriminator} instance is recorded as {@link
 * Union#discriminator|discriminator}.
 *
 * @param {(Layout|null)} defaultLayout - initializer for {@link
 * Union#defaultLayout|defaultLayout}.  If absent defaults to `null`.
 * If `null` there is no default layout: the union has data-dependent
 * length and attempts to decode or encode unrecognized variants will
 * throw an exception.  A {@link Layout} instance must have a
 * non-negative {@link Layout#span|span}, and if it lacks a {@link
 * Layout#property|property} the {@link
 * Union#defaultLayout|defaultLayout} will be a {@link
 * Layout#replicate|replica} with property `content`.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Union extends Layout {
  constructor(discr, defaultLayout, property) {
    const upv = ((discr instanceof UInt)
               || (discr instanceof UIntBE));
    if (upv) {
      discr = new UnionLayoutDiscriminator(new OffsetLayout(discr));
    } else if ((discr instanceof ExternalLayout)
               && discr.isCount()) {
      discr = new UnionLayoutDiscriminator(discr);
    } else if (!(discr instanceof UnionDiscriminator)) {
      throw new TypeError('discr must be a UnionDiscriminator '
                          + 'or an unsigned integer layout');
    }
    if (undefined === defaultLayout) {
      defaultLayout = null;
    }
    if (!((null === defaultLayout)
          || (defaultLayout instanceof Layout))) {
      throw new TypeError('defaultLayout must be null or a Layout');
    }
    if (null !== defaultLayout) {
      if (0 > defaultLayout.span) {
        throw new Error('defaultLayout must have constant span');
      }
      if (undefined === defaultLayout.property) {
        defaultLayout = defaultLayout.replicate('content');
      }
    }

    /* The union span can be estimated only if there's a default
     * layout.  The union spans its default layout, plus any prefix
     * variant layout.  By construction both layouts, if present, have
     * non-negative span. */
    let span = -1;
    if (defaultLayout) {
      span = defaultLayout.span;
      if ((0 <= span) && upv) {
        span += discr.layout.span;
      }
    }
    super(span, property);

    /** The interface for the discriminator value in isolation.
     *
     * This a {@link UnionDiscriminator} either passed to the
     * constructor or synthesized from the `discr` constructor
     * argument.  {@link
     * Union#usesPrefixDiscriminator|usesPrefixDiscriminator} will be
     * `true` iff the `discr` parameter was a non-offset {@link
     * Layout} instance. */
    this.discriminator = discr;

    /** `true` if the {@link Union#discriminator|discriminator} is the
     * first field in the union.
     *
     * If `false` the discriminator is obtained from somewhere
     * else. */
    this.usesPrefixDiscriminator = upv;

    /** The layout for non-discriminator content when the value of the
     * discriminator is not recognized.
     *
     * This is the value passed to the constructor.  It is
     * structurally equivalent to the second component of {@link
     * Union#layout|layout} but may have a different property
     * name. */
    this.defaultLayout = defaultLayout;

    /** A registry of allowed variants.
     *
     * The keys are unsigned integers which should be compatible with
     * {@link Union.discriminator|discriminator}.  The property value
     * is the corresponding {@link VariantLayout} instances assigned
     * to this union by {@link Union#addVariant|addVariant}.
     *
     * **NOTE** The registry remains mutable so that variants can be
     * {@link Union#addVariant|added} at any time.  Users should not
     * manipulate the content of this property. */
    this.registry = {};

    /* Private variable used when invoking getSourceVariant */
    let boundGetSourceVariant = this.defaultGetSourceVariant.bind(this);

    /** Function to infer the variant selected by a source object.
     *
     * Defaults to {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant} but may
     * be overridden using {@link
     * Union#configGetSourceVariant|configGetSourceVariant}.
     *
     * @param {Object} src - as with {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
     *
     * @returns {(undefined|VariantLayout)} The default variant
     * (`undefined`) or first registered variant that uses a property
     * available in `src`. */
    this.getSourceVariant = function(src) {
      return boundGetSourceVariant(src);
    };

    /** Function to override the implementation of {@link
     * Union#getSourceVariant|getSourceVariant}.
     *
     * Use this if the desired variant cannot be identified using the
     * algorithm of {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
     *
     * **NOTE** The provided function will be invoked bound to this
     * Union instance, providing local access to {@link
     * Union#registry|registry}.
     *
     * @param {Function} gsv - a function that follows the API of
     * {@link Union#defaultGetSourceVariant|defaultGetSourceVariant}. */
    this.configGetSourceVariant = function(gsv) {
      boundGetSourceVariant = gsv.bind(this);
    };
  }

  /** @override */
  getSpan(b, offset) {
    if (0 <= this.span) {
      return this.span;
    }
    if (undefined === offset) {
      offset = 0;
    }
    /* Default layouts always have non-negative span, so we don't have
     * one and we have to recognize the variant which will in turn
     * determine the span. */
    const vlo = this.getVariant(b, offset);
    if (!vlo) {
      throw new Error('unable to determine span for unrecognized variant');
    }
    return vlo.getSpan(b, offset);
  }

  /**
   * Method to infer a registered Union variant compatible with `src`.
   *
   * The first satisified rule in the following sequence defines the
   * return value:
   * * If `src` has properties matching the Union discriminator and
   *   the default layout, `undefined` is returned regardless of the
   *   value of the discriminator property (this ensures the default
   *   layout will be used);
   * * If `src` has a property matching the Union discriminator, the
   *   value of the discriminator identifies a registered variant, and
   *   either (a) the variant has no layout, or (b) `src` has the
   *   variant's property, then the variant is returned (because the
   *   source satisfies the constraints of the variant it identifies);
   * * If `src` does not have a property matching the Union
   *   discriminator, but does have a property matching a registered
   *   variant, then the variant is returned (because the source
   *   matches a variant without an explicit conflict);
   * * An error is thrown (because we either can't identify a variant,
   *   or we were explicitly told the variant but can't satisfy it).
   *
   * @param {Object} src - an object presumed to be compatible with
   * the content of the Union.
   *
   * @return {(undefined|VariantLayout)} - as described above.
   *
   * @throws {Error} - if `src` cannot be associated with a default or
   * registered variant.
   */
  defaultGetSourceVariant(src) {
    if (src.hasOwnProperty(this.discriminator.property)) {
      if (this.defaultLayout
          && src.hasOwnProperty(this.defaultLayout.property)) {
        return undefined;
      }
      const vlo = this.registry[src[this.discriminator.property]];
      if (vlo
          && ((!vlo.layout)
              || src.hasOwnProperty(vlo.property))) {
        return vlo;
      }
    } else {
      for (const tag in this.registry) {
        const vlo = this.registry[tag];
        if (src.hasOwnProperty(vlo.property)) {
          return vlo;
        }
      }
    }
    throw new Error('unable to infer src variant');
  }

  /** Implement {@link Layout#decode|decode} for {@link Union}.
   *
   * If the variant is {@link Union#addVariant|registered} the return
   * value is an instance of that variant, with no explicit
   * discriminator.  Otherwise the {@link Union#defaultLayout|default
   * layout} is used to decode the content. */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    let dest;
    const dlo = this.discriminator;
    const discr = dlo.decode(b, offset);
    let clo = this.registry[discr];
    if (undefined === clo) {
      let contentOffset = 0;
      clo = this.defaultLayout;
      if (this.usesPrefixDiscriminator) {
        contentOffset = dlo.layout.span;
      }
      dest = this.makeDestinationObject();
      dest[dlo.property] = discr;
      dest[clo.property] = this.defaultLayout.decode(b, offset + contentOffset);
    } else {
      dest = clo.decode(b, offset);
    }
    return dest;
  }

  /** Implement {@link Layout#encode|encode} for {@link Union}.
   *
   * This API assumes the `src` object is consistent with the union's
   * {@link Union#defaultLayout|default layout}.  To encode variants
   * use the appropriate variant-specific {@link VariantLayout#encode}
   * method. */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const vlo = this.getSourceVariant(src);
    if (undefined === vlo) {
      const dlo = this.discriminator;
      const clo = this.defaultLayout;
      let contentOffset = 0;
      if (this.usesPrefixDiscriminator) {
        contentOffset = dlo.layout.span;
      }
      dlo.encode(src[dlo.property], b, offset);
      return contentOffset + clo.encode(src[clo.property], b,
                                        offset + contentOffset);
    }
    return vlo.encode(src, b, offset);
  }

  /** Register a new variant structure within a union.  The newly
   * created variant is returned.
   *
   * @param {Number} variant - initializer for {@link
   * VariantLayout#variant|variant}.
   *
   * @param {Layout} layout - initializer for {@link
   * VariantLayout#layout|layout}.
   *
   * @param {String} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {VariantLayout} */
  addVariant(variant, layout, property) {
    const rv = new VariantLayout(this, variant, layout, property);
    this.registry[variant] = rv;
    return rv;
  }

  /**
   * Get the layout associated with a registered variant.
   *
   * If `vb` does not produce a registered variant the function returns
   * `undefined`.
   *
   * @param {(Number|Buffer)} vb - either the variant number, or a
   * buffer from which the discriminator is to be read.
   *
   * @param {Number} offset - offset into `vb` for the start of the
   * union.  Used only when `vb` is an instance of {Buffer}.
   *
   * @return {({VariantLayout}|undefined)}
   */
  getVariant(vb, offset) {
    let variant = vb;
    if (Buffer.isBuffer(vb)) {
      if (undefined === offset) {
        offset = 0;
      }
      variant = this.discriminator.decode(vb, offset);
    }
    return this.registry[variant];
  }
}

/**
 * Represent a specific variant within a containing union.
 *
 * **NOTE** The {@link Layout#span|span} of the variant may include
 * the span of the {@link Union#discriminator|discriminator} used to
 * identify it, but values read and written using the variant strictly
 * conform to the content of {@link VariantLayout#layout|layout}.
 *
 * **NOTE** User code should not invoke this constructor directly.  Use
 * the union {@link Union#addVariant|addVariant} helper method.
 *
 * @param {Union} union - initializer for {@link
 * VariantLayout#union|union}.
 *
 * @param {Number} variant - initializer for {@link
 * VariantLayout#variant|variant}.
 *
 * @param {Layout} [layout] - initializer for {@link
 * VariantLayout#layout|layout}.  If absent the variant carries no
 * data.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.  Unlike many other layouts, variant
 * layouts normally include a property name so they can be identified
 * within their containing {@link Union}.  The property identifier may
 * be absent only if `layout` is is absent.
 *
 * @augments {Layout}
 */
class VariantLayout extends Layout {
  constructor(union, variant, layout, property) {
    if (!(union instanceof Union)) {
      throw new TypeError('union must be a Union');
    }
    if ((!Number.isInteger(variant)) || (0 > variant)) {
      throw new TypeError('variant must be a (non-negative) integer');
    }
    if (('string' === typeof layout)
        && (undefined === property)) {
      property = layout;
      layout = null;
    }
    if (layout) {
      if (!(layout instanceof Layout)) {
        throw new TypeError('layout must be a Layout');
      }
      if ((null !== union.defaultLayout)
          && (0 <= layout.span)
          && (layout.span > union.defaultLayout.span)) {
        throw new Error('variant span exceeds span of containing union');
      }
      if ('string' !== typeof property) {
        throw new TypeError('variant must have a String property');
      }
    }
    let span = union.span;
    if (0 > union.span) {
      span = layout ? layout.span : 0;
      if ((0 <= span) && union.usesPrefixDiscriminator) {
        span += union.discriminator.layout.span;
      }
    }
    super(span, property);

    /** The {@link Union} to which this variant belongs. */
    this.union = union;

    /** The unsigned integral value identifying this variant within
     * the {@link Union#discriminator|discriminator} of the containing
     * union. */
    this.variant = variant;

    /** The {@link Layout} to be used when reading/writing the
     * non-discriminator part of the {@link
     * VariantLayout#union|union}.  If `null` the variant carries no
     * data. */
    this.layout = layout || null;
  }

  /** @override */
  getSpan(b, offset) {
    if (0 <= this.span) {
      /* Will be equal to the containing union span if that is not
       * variable. */
      return this.span;
    }
    if (undefined === offset) {
      offset = 0;
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    /* Span is defined solely by the variant (and prefix discriminator) */
    return contentOffset + this.layout.getSpan(b, offset + contentOffset);
  }

  /** @override */
  decode(b, offset) {
    const dest = this.makeDestinationObject();
    if (undefined === offset) {
      offset = 0;
    }
    if (this !== this.union.getVariant(b, offset)) {
      throw new Error('variant mismatch');
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    if (this.layout) {
      dest[this.property] = this.layout.decode(b, offset + contentOffset);
    } else if (this.property) {
      dest[this.property] = true;
    } else if (this.union.usesPrefixDiscriminator) {
      dest[this.union.discriminator.property] = this.variant;
    }
    return dest;
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    if (this.layout
        && (!src.hasOwnProperty(this.property))) {
      throw new TypeError('variant lacks property ' + this.property);
    }
    this.union.discriminator.encode(this.variant, b, offset);
    let span = contentOffset;
    if (this.layout) {
      this.layout.encode(src[this.property], b, offset + contentOffset);
      span += this.layout.getSpan(b, offset + contentOffset);
      if ((0 <= this.union.span)
          && (span > this.union.span)) {
        throw new Error('encoded variant overruns containing union');
      }
    }
    return span;
  }

  /** Delegate {@link Layout#fromArray|fromArray} to {@link
   * VariantLayout#layout|layout}. */
  fromArray(values) {
    if (this.layout) {
      return this.layout.fromArray(values);
    }
  }
}
/* eslint-enable no-extend-native */

/**
 * Contain a fixed-length block of arbitrary data, represented as a
 * Buffer.
 *
 * *Factory*: {@link module:Layout.blob|blob}
 *
 * @param {(Number|ExternalLayout)} length - initializes {@link
 * Blob#length|length}.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Blob$1 extends Layout {
  constructor(length, property) {
    if (!(((length instanceof ExternalLayout) && length.isCount())
          || (Number.isInteger(length) && (0 <= length)))) {
      throw new TypeError('length must be positive integer '
                          + 'or an unsigned integer ExternalLayout');
    }

    let span = -1;
    if (!(length instanceof ExternalLayout)) {
      span = length;
    }
    super(span, property);

    /** The number of bytes in the blob.
     *
     * This may be a non-negative integer, or an instance of {@link
     * ExternalLayout} that satisfies {@link
     * ExternalLayout#isCount|isCount()}. */
    this.length = length;
  }

  /** @override */
  getSpan(b, offset) {
    let span = this.span;
    if (0 > span) {
      span = this.length.decode(b, offset);
    }
    return span;
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    let span = this.span;
    if (0 > span) {
      span = this.length.decode(b, offset);
    }
    return b.slice(offset, offset + span);
  }

  /** Implement {@link Layout#encode|encode} for {@link Blob}.
   *
   * **NOTE** If {@link Layout#count|count} is an instance of {@link
   * ExternalLayout} then the length of `src` will be encoded as the
   * count after `src` is encoded. */
  encode(src, b, offset) {
    let span = this.length;
    if (this.length instanceof ExternalLayout) {
      span = src.length;
    }
    if (!(Buffer.isBuffer(src)
          && (span === src.length))) {
      throw new TypeError(nameWithProperty('Blob.encode', this)
                          + ' requires (length ' + span + ') Buffer as src');
    }
    if ((offset + span) > b.length) {
      throw new RangeError('encoding overruns Buffer');
    }
    b.write(src.toString('hex'), offset, span, 'hex');
    if (this.length instanceof ExternalLayout) {
      this.length.encode(span, b, offset);
    }
    return span;
  }
}

/** Factory for {@link OffsetLayout}. */
var offset = ((layout, offset, property) => new OffsetLayout(layout, offset, property));

/** Factory for {@link UInt|unsigned int layouts} spanning one
 * byte. */
var u8 = (property => new UInt(1, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning four bytes. */
var u32 = (property => new UInt(4, property));

/** Factory for {@link NearUInt64|little-endian unsigned int
 * layouts} interpreted as Numbers. */
var nu64 = (property => new NearUInt64(property));

/** Factory for {@link NearInt64|little-endian signed int layouts}
 * interpreted as Numbers. */
var ns64 = (property => new NearInt64(property));

/** Factory for {@link Structure} values. */
var struct = ((fields, property, decodePrefixes) => new Structure(fields, property, decodePrefixes));

/** Factory for {@link Union} values. */
var union = ((discr, defaultLayout, property) => new Union(discr, defaultLayout, property));

/** Factory for {@link Blob} values. */
var blob = ((length, property) => new Blob$1(length, property));

class SystemInstructionCoder {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(_) { }
    encode(ixName, ix) {
        switch (camelCase(ixName)) {
            case "createAccount": {
                return encodeCreateAccount(ix);
            }
            case "assign": {
                return encodeAssign(ix);
            }
            case "transfer": {
                return encodeTransfer(ix);
            }
            case "createAccountWithSeed": {
                return encodeCreateAccountWithSeed(ix);
            }
            case "advanceNonceAccount": {
                return encodeAdvanceNonceAccount(ix);
            }
            case "withdrawNonceAccount": {
                return encodeWithdrawNonceAccount(ix);
            }
            case "initializeNonceAccount": {
                return encodeInitializeNonceAccount(ix);
            }
            case "authorizeNonceAccount": {
                return encodeAuthorizeNonceAccount(ix);
            }
            case "allocate": {
                return encodeAllocate(ix);
            }
            case "allocateWithSeed": {
                return encodeAllocateWithSeed(ix);
            }
            case "assignWithSeed": {
                return encodeAssignWithSeed(ix);
            }
            case "transferWithSeed": {
                return encodeTransferWithSeed(ix);
            }
            default: {
                throw new Error(`Invalid instruction: ${ixName}`);
            }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("System does not have state");
    }
}
class RustStringLayout extends Layout_2 {
    constructor(property) {
        super(-1, property);
        this.property = property;
        this.layout = struct([
            u32("length"),
            u32("lengthPadding"),
            blob(offset(u32(), -8), "chars"),
        ], this.property);
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.layout.span;
        }
        const data = {
            chars: Buffer.from(src, "utf8"),
        };
        return this.layout.encode(data, b, offset);
    }
    decode(b, offset = 0) {
        const data = this.layout.decode(b, offset);
        return data["chars"].toString();
    }
    getSpan(b, offset = 0) {
        return (u32().span +
            u32().span +
            new BN(new Uint8Array(b).slice(offset, offset + 4), 10, "le").toNumber());
    }
}
function rustStringLayout(property) {
    return new RustStringLayout(property);
}
function publicKey$2(property) {
    return blob(32, property);
}
function encodeCreateAccount({ lamports, space, owner }) {
    return encodeData({
        createAccount: { lamports, space, owner: owner.toBuffer() },
    });
}
function encodeAssign({ owner }) {
    return encodeData({
        assign: { owner: owner.toBuffer() },
    });
}
function encodeTransfer({ lamports }) {
    return encodeData({
        transfer: { lamports },
    });
}
function encodeCreateAccountWithSeed({ base, seed, lamports, space, owner, }) {
    return encodeData({
        createAccountWithSeed: {
            base: base.toBuffer(),
            seed,
            lamports,
            space,
            owner: owner.toBuffer(),
        },
    }, LAYOUT.getVariant(3).span + seed.length);
}
function encodeInitializeNonceAccount({ authorized }) {
    return encodeData({
        initializeNonceAccount: { authorized: authorized.toBuffer() },
    });
}
function encodeAdvanceNonceAccount({ authorized }) {
    return encodeData({
        advanceNonceAccount: { authorized: authorized.toBuffer() },
    });
}
function encodeWithdrawNonceAccount({ lamports }) {
    return encodeData({
        withdrawNonceAccount: { lamports },
    });
}
function encodeAuthorizeNonceAccount({ authorized }) {
    return encodeData({
        authorizeNonceAccount: { authorized: authorized.toBuffer() },
    });
}
function encodeAllocate({ space }) {
    return encodeData({
        allocate: { space },
    });
}
function encodeAllocateWithSeed({ base, seed, space, owner }) {
    return encodeData({
        allocateWithSeed: {
            base: base.toBuffer(),
            seed,
            space,
            owner: owner.toBuffer(),
        },
    }, LAYOUT.getVariant(9).span + seed.length);
}
function encodeAssignWithSeed({ base, seed, owner }) {
    return encodeData({
        assignWithSeed: {
            base: base.toBuffer(),
            seed,
            owner: owner.toBuffer(),
        },
    }, LAYOUT.getVariant(10).span + seed.length);
}
function encodeTransferWithSeed({ lamports, seed, owner }) {
    return encodeData({
        transferWithSeed: {
            lamports,
            seed,
            owner: owner.toBuffer(),
        },
    }, LAYOUT.getVariant(11).span + seed.length);
}
const LAYOUT = union(u32("instruction"));
LAYOUT.addVariant(0, struct([
    ns64("lamports"),
    ns64("space"),
    publicKey$2("owner"),
]), "createAccount");
LAYOUT.addVariant(1, struct([publicKey$2("owner")]), "assign");
LAYOUT.addVariant(2, struct([ns64("lamports")]), "transfer");
LAYOUT.addVariant(3, struct([
    publicKey$2("base"),
    rustStringLayout("seed"),
    ns64("lamports"),
    ns64("space"),
    publicKey$2("owner"),
]), "createAccountWithSeed");
LAYOUT.addVariant(4, struct([publicKey$2("authorized")]), "advanceNonceAccount");
LAYOUT.addVariant(5, struct([ns64("lamports")]), "withdrawNonceAccount");
LAYOUT.addVariant(6, struct([publicKey$2("authorized")]), "initializeNonceAccount");
LAYOUT.addVariant(7, struct([publicKey$2("authorized")]), "authorizeNonceAccount");
LAYOUT.addVariant(8, struct([ns64("space")]), "allocate");
LAYOUT.addVariant(9, struct([
    publicKey$2("base"),
    rustStringLayout("seed"),
    ns64("space"),
    publicKey$2("owner"),
]), "allocateWithSeed");
LAYOUT.addVariant(10, struct([
    publicKey$2("base"),
    rustStringLayout("seed"),
    publicKey$2("owner"),
]), "assignWithSeed");
LAYOUT.addVariant(11, struct([
    ns64("lamports"),
    rustStringLayout("seed"),
    publicKey$2("owner"),
]), "transferWithSeed");
function encodeData(instruction, maxSpan) {
    const b = Buffer.alloc(maxSpan !== null && maxSpan !== void 0 ? maxSpan : instructionMaxSpan);
    const span = LAYOUT.encode(instruction, b);
    if (maxSpan === undefined) {
        return b.slice(0, span);
    }
    return b;
}
const instructionMaxSpan = Math.max(...Object.values(LAYOUT.registry).map((r) => r.span));

class SystemAccountsCoder {
    constructor(idl) {
        this.idl = idl;
    }
    async encode(accountName, account) {
        switch (accountName) {
            case "nonce": {
                const buffer = Buffer.alloc(NONCE_ACCOUNT_LENGTH);
                const len = NONCE_ACCOUNT_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch (accountName) {
            case "nonce": {
                return decodeNonceAccount(ix);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    // TODO: this won't use the appendData.
    memcmp(accountName, _appendData) {
        switch (accountName) {
            case "nonce": {
                return {
                    dataSize: NONCE_ACCOUNT_LENGTH,
                };
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(idlAccount) {
        var _a;
        return (_a = accountSize(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0;
    }
}
function decodeNonceAccount(ix) {
    return NONCE_ACCOUNT_LAYOUT.decode(ix);
}
class WrappedLayout$1 extends Layout_2 {
    constructor(layout, decoder, encoder, property) {
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
}
function publicKey$1(property) {
    return new WrappedLayout$1(blob(32), (b) => new PublicKey(b), (key) => key.toBuffer(), property);
}
const NONCE_ACCOUNT_LAYOUT = struct([
    u32("version"),
    u32("state"),
    publicKey$1("authorizedPubkey"),
    publicKey$1("nonce"),
    struct([nu64("lamportsPerSignature")], "feeCalculator"),
]);

class SystemEventsCoder {
    constructor(_idl) { }
    decode(_log) {
        throw new Error("System program does not have events");
    }
}

class SystemTypesCoder {
    constructor(_idl) { }
    encode(_name, _type) {
        throw new Error("System does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("System does not have user-defined types");
    }
}

/**
 * Coder for the System program.
 */
class SystemCoder {
    constructor(idl) {
        this.instruction = new SystemInstructionCoder(idl);
        this.accounts = new SystemAccountsCoder(idl);
        this.events = new SystemEventsCoder(idl);
        this.types = new SystemTypesCoder(idl);
    }
}

function hash(data) {
    return new TextDecoder().decode(sha256$1(data));
}

var sha256 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hash: hash
});

// Sync version of web3.PublicKey.createWithSeed.
function createWithSeedSync(fromPublicKey, seed, programId) {
    const buffer = Buffer$1.concat([
        fromPublicKey.toBuffer(),
        Buffer$1.from(seed),
        programId.toBuffer(),
    ]);
    return new PublicKey(sha256$1(buffer));
}
function associated(programId, ...args) {
    let seeds = [Buffer$1.from([97, 110, 99, 104, 111, 114])]; // b"anchor".
    args.forEach((arg) => {
        seeds.push(arg instanceof Buffer$1 ? arg : translateAddress(arg).toBuffer());
    });
    const [assoc] = PublicKey.findProgramAddressSync(seeds, translateAddress(programId));
    return assoc;
}

var pubkey = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createWithSeedSync: createWithSeedSync,
    associated: associated
});

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
function associatedAddress({ mint, owner, }) {
    return PublicKey.findProgramAddressSync([owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_PROGRAM_ID)[0];
}

var token = /*#__PURE__*/Object.freeze({
    __proto__: null,
    TOKEN_PROGRAM_ID: TOKEN_PROGRAM_ID,
    ASSOCIATED_PROGRAM_ID: ASSOCIATED_PROGRAM_ID,
    associatedAddress: associatedAddress
});

var browserPonyfill = {exports: {}};

(function (module, exports) {
var global = typeof self !== 'undefined' ? self : commonjsGlobal;
var __self__ = (function () {
function F() {
this.fetch = false;
this.DOMException = global.DOMException;
}
F.prototype = global;
return new F();
})();
(function(self) {

((function (exports) {

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}))({});
})(__self__);
__self__.fetch.ponyfill = true;
// Remove "polyfill" property added by whatwg-fetch
delete __self__.fetch.polyfill;
// Choose between native implementation (global) or custom implementation (__self__)
// var ctx = global.fetch ? global : __self__;
var ctx = __self__; // this line disable service worker support temporarily
exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
exports.Headers = ctx.Headers;
exports.Request = ctx.Request;
exports.Response = ctx.Response;
module.exports = exports;
}(browserPonyfill, browserPonyfill.exports));

var fetch = /*@__PURE__*/getDefaultExportFromCjs(browserPonyfill.exports);

/**
 * Returns a verified build from the anchor registry. null if no such
 * verified build exists, e.g., if the program has been upgraded since the
 * last verified build.
 */
async function verifiedBuild(connection, programId, limit = 5) {
    const url = `https://api.apr.dev/api/v0/program/${programId.toString()}/latest?limit=${limit}`;
    const [programData, latestBuildsResp] = await Promise.all([
        fetchData(connection, programId),
        fetch(url),
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

var registry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    verifiedBuild: verifiedBuild,
    fetchData: fetchData,
    decodeUpgradeableLoaderState: decodeUpgradeableLoaderState
});

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sha256: sha256,
    rpc: rpc,
    publicKey: pubkey,
    bytes: index$1,
    token: token,
    features: features,
    registry: registry
});

function isIdlAccounts(accountItem) {
    return "accounts" in accountItem;
}
// Deterministic IDL address as a function of the program id.
async function idlAddress(programId) {
    const base = (await PublicKey.findProgramAddress([], programId))[0];
    return await PublicKey.createWithSeed(base, seed(), programId);
}
// Seed for generating the idlAddress.
function seed() {
    return "anchor:idl";
}
const IDL_ACCOUNT_LAYOUT = borsh.struct([
    borsh.publicKey("authority"),
    borsh.vecU8("data"),
]);
function decodeIdlAccount(data) {
    return IDL_ACCOUNT_LAYOUT.decode(data);
}

function splitArgsAndCtx(idlIx, args) {
    var _a, _b;
    let options = {};
    const inputLen = idlIx.args ? idlIx.args.length : 0;
    if (args.length > inputLen) {
        if (args.length !== inputLen + 1) {
            throw new Error(`provided too many arguments ${args} to instruction ${idlIx === null || idlIx === void 0 ? void 0 : idlIx.name} expecting: ${(_b = (_a = idlIx.args) === null || _a === void 0 ? void 0 : _a.map((a) => a.name)) !== null && _b !== void 0 ? _b : []}`);
        }
        options = args.pop();
    }
    return [args, options];
}

class InstructionNamespaceFactory {
    static build(idlIx, encodeFn, programId) {
        if (idlIx.name === "_inner") {
            throw new IdlError("the _inner name is reserved");
        }
        const ix = (...args) => {
            const [ixArgs, ctx] = splitArgsAndCtx(idlIx, [...args]);
            validateAccounts(idlIx.accounts, ctx.accounts);
            validateInstruction(idlIx, ...args);
            const keys = ix.accounts(ctx.accounts);
            if (ctx.remainingAccounts !== undefined) {
                keys.push(...ctx.remainingAccounts);
            }
            if (isSet("debug-logs")) {
                console.log("Outgoing account metas:", keys);
            }
            return new TransactionInstruction({
                keys,
                programId,
                data: encodeFn(idlIx.name, toInstruction(idlIx, ...ixArgs)),
            });
        };
        // Utility fn for ordering the accounts for this instruction.
        ix["accounts"] = (accs) => {
            return InstructionNamespaceFactory.accountsArray(accs, idlIx.accounts, programId, idlIx.name);
        };
        return ix;
    }
    static accountsArray(ctx, accounts, programId, ixName) {
        if (!ctx) {
            return [];
        }
        return accounts
            .map((acc) => {
            // Nested accounts.
            const nestedAccounts = "accounts" in acc ? acc.accounts : undefined;
            if (nestedAccounts !== undefined) {
                const rpcAccs = ctx[acc.name];
                return InstructionNamespaceFactory.accountsArray(rpcAccs, acc.accounts, programId, ixName).flat();
            }
            else {
                const account = acc;
                let pubkey;
                try {
                    pubkey = translateAddress(ctx[acc.name]);
                }
                catch (err) {
                    throw new Error(`Wrong input type for account "${acc.name}" in the instruction accounts object${ixName !== undefined ? ' for instruction "' + ixName + '"' : ""}. Expected PublicKey or string.`);
                }
                const optional = account.isOptional && pubkey.equals(programId);
                const isWritable = account.isMut && !optional;
                const isSigner = account.isSigner && !optional;
                return {
                    pubkey,
                    isWritable,
                    isSigner,
                };
            }
        })
            .flat();
    }
}
// Throws error if any argument required for the `ix` is not given.
function validateInstruction(ix, ...args) {
    // todo
}

class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = (...args) => {
            var _a, _b, _c;
            const [, ctx] = splitArgsAndCtx(idlIx, [...args]);
            const tx = new Transaction();
            if (ctx.preInstructions && ctx.instructions) {
                throw new Error("instructions is deprecated, use preInstructions");
            }
            (_a = ctx.preInstructions) === null || _a === void 0 ? void 0 : _a.forEach((ix) => tx.add(ix));
            (_b = ctx.instructions) === null || _b === void 0 ? void 0 : _b.forEach((ix) => tx.add(ix));
            tx.add(ixFn(...args));
            (_c = ctx.postInstructions) === null || _c === void 0 ? void 0 : _c.forEach((ix) => tx.add(ix));
            return tx;
        };
        return txFn;
    }
}

class RpcFactory {
    static build(idlIx, txFn, idlErrors, provider) {
        const rpc = async (...args) => {
            var _a;
            const tx = txFn(...args);
            const [, ctx] = splitArgsAndCtx(idlIx, [...args]);
            if (provider.sendAndConfirm === undefined) {
                throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
            }
            try {
                return await provider.sendAndConfirm(tx, (_a = ctx.signers) !== null && _a !== void 0 ? _a : [], ctx.options);
            }
            catch (err) {
                throw translateError(err, idlErrors);
            }
        };
        return rpc;
    }
}

class AccountFactory {
    static build(idl, coder, programId, provider) {
        var _a;
        const accountFns = {};
        (_a = idl.accounts) === null || _a === void 0 ? void 0 : _a.forEach((idlAccount) => {
            const name = camelCase(idlAccount.name);
            accountFns[name] = new AccountClient(idl, idlAccount, programId, provider, coder);
        });
        return accountFns;
    }
}
class AccountClient {
    /**
     * Returns the number of bytes in this account.
     */
    get size() {
        return this._size;
    }
    /**
     * Returns the program ID owning all accounts.
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
     * Returns the idl account.
     */
    get idlAccount() {
        return this._idlAccount;
    }
    constructor(idl, idlAccount, programId, provider, coder) {
        this._idlAccount = idlAccount;
        this._programId = programId;
        this._provider = provider !== null && provider !== void 0 ? provider : getProvider();
        this._coder = coder !== null && coder !== void 0 ? coder : new BorshCoder(idl);
        this._size = this._coder.accounts.size(idlAccount);
    }
    /**
     * Returns a deserialized account, returning null if it doesn't exist.
     *
     * @param address The address of the account to fetch.
     */
    async fetchNullable(address, commitment) {
        const { data } = await this.fetchNullableAndContext(address, commitment);
        return data;
    }
    /**
     * Returns a deserialized account along with the associated rpc response context, returning null if it doesn't exist.
     *
     * @param address The address of the account to fetch.
     */
    async fetchNullableAndContext(address, commitment) {
        const accountInfo = await this.getAccountInfoAndContext(address, commitment);
        const { value, context } = accountInfo;
        return {
            data: value && value.data.length !== 0
                ? this._coder.accounts.decode(this._idlAccount.name, value.data)
                : null,
            context,
        };
    }
    /**
     * Returns a deserialized account.
     *
     * @param address The address of the account to fetch.
     */
    async fetch(address, commitment) {
        const { data } = await this.fetchNullableAndContext(address, commitment);
        if (data === null) {
            throw new Error(`Account does not exist or has no data ${address.toString()}`);
        }
        return data;
    }
    /**
     * Returns a deserialized account along with the associated rpc response context.
     *
     * @param address The address of the account to fetch.
     */
    async fetchAndContext(address, commitment) {
        const { data, context } = await this.fetchNullableAndContext(address, commitment);
        if (data === null) {
            throw new Error(`Account does not exist ${address.toString()}`);
        }
        return { data, context };
    }
    /**
     * Returns multiple deserialized accounts.
     * Accounts not found or with wrong discriminator are returned as null.
     *
     * @param addresses The addresses of the accounts to fetch.
     */
    async fetchMultiple(addresses, commitment) {
        const accounts = await this.fetchMultipleAndContext(addresses, commitment);
        return accounts.map((account) => (account ? account.data : null));
    }
    /**
     * Returns multiple deserialized accounts.
     * Accounts not found or with wrong discriminator are returned as null.
     *
     * @param addresses The addresses of the accounts to fetch.
     */
    async fetchMultipleAndContext(addresses, commitment) {
        const accounts = await getMultipleAccountsAndContext(this._provider.connection, addresses.map((address) => translateAddress(address)), commitment);
        // Decode accounts where discriminator is correct, null otherwise
        return accounts.map((result) => {
            if (result == null) {
                return null;
            }
            const { account, context } = result;
            return {
                data: this._coder.accounts.decode(this._idlAccount.name, account.data),
                context,
            };
        });
    }
    /**
     * Returns all instances of this account type for the program.
     *
     * @param filters User-provided filters to narrow the results from `connection.getProgramAccounts`.
     *
     *                When filters are not defined this method returns all
     *                the account instances.
     *
     *                When filters are of type `Buffer`, the filters are appended
     *                after the discriminator.
     *
     *                When filters are of type `GetProgramAccountsFilter[]`,
     *                filters are appended after the discriminator filter.
     */
    async all(filters) {
        const filter = this.coder.accounts.memcmp(this._idlAccount.name, filters instanceof Buffer ? filters : undefined);
        const coderFilters = [];
        if ((filter === null || filter === void 0 ? void 0 : filter.offset) != undefined && (filter === null || filter === void 0 ? void 0 : filter.bytes) != undefined) {
            coderFilters.push({
                memcmp: { offset: filter.offset, bytes: filter.bytes },
            });
        }
        if ((filter === null || filter === void 0 ? void 0 : filter.dataSize) != undefined) {
            coderFilters.push({ dataSize: filter.dataSize });
        }
        let resp = await this._provider.connection.getProgramAccounts(this._programId, {
            commitment: this._provider.connection.commitment,
            filters: [...coderFilters, ...(Array.isArray(filters) ? filters : [])],
        });
        return resp.map(({ pubkey, account }) => {
            return {
                publicKey: pubkey,
                account: this._coder.accounts.decode(this._idlAccount.name, account.data),
            };
        });
    }
    /**
     * Returns an `EventEmitter` emitting a "change" event whenever the account
     * changes.
     */
    subscribe(address, commitment) {
        const sub = subscriptions.get(address.toString());
        if (sub) {
            return sub.ee;
        }
        const ee = new EventEmitter();
        address = translateAddress(address);
        const listener = this._provider.connection.onAccountChange(address, (acc) => {
            const account = this._coder.accounts.decode(this._idlAccount.name, acc.data);
            ee.emit("change", account);
        }, commitment);
        subscriptions.set(address.toString(), {
            ee,
            listener,
        });
        return ee;
    }
    /**
     * Unsubscribes from the account at the given address.
     */
    async unsubscribe(address) {
        let sub = subscriptions.get(address.toString());
        if (!sub) {
            console.warn("Address is not subscribed");
            return;
        }
        if (subscriptions) {
            await this._provider.connection
                .removeAccountChangeListener(sub.listener)
                .then(() => {
                subscriptions.delete(address.toString());
            })
                .catch(console.error);
        }
    }
    /**
     * Returns an instruction for creating this account.
     */
    async createInstruction(signer, sizeOverride) {
        const size = this.size;
        if (this._provider.publicKey === undefined) {
            throw new Error("This function requires the Provider interface implementor to have a 'publicKey' field.");
        }
        return SystemProgram.createAccount({
            fromPubkey: this._provider.publicKey,
            newAccountPubkey: signer.publicKey,
            space: sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size,
            lamports: await this._provider.connection.getMinimumBalanceForRentExemption(sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size),
            programId: this._programId,
        });
    }
    /**
     * @deprecated since version 14.0.
     *
     * Function returning the associated account. Args are keys to associate.
     * Order matters.
     */
    async associated(...args) {
        const addr = await this.associatedAddress(...args);
        return await this.fetch(addr);
    }
    /**
     * @deprecated since version 14.0.
     *
     * Function returning the associated address. Args are keys to associate.
     * Order matters.
     */
    async associatedAddress(...args) {
        return await associated(this._programId, ...args);
    }
    async getAccountInfo(address, commitment) {
        return await this._provider.connection.getAccountInfo(translateAddress(address), commitment);
    }
    async getAccountInfoAndContext(address, commitment) {
        return await this._provider.connection.getAccountInfoAndContext(translateAddress(address), commitment);
    }
}
// Tracks all subscriptions.
const subscriptions = new Map();

const PROGRAM_LOG = "Program log: ";
const PROGRAM_DATA = "Program data: ";
const PROGRAM_LOG_START_INDEX = PROGRAM_LOG.length;
const PROGRAM_DATA_START_INDEX = PROGRAM_DATA.length;
class EventManager {
    constructor(programId, provider, coder) {
        this._programId = programId;
        this._provider = provider;
        this._eventParser = new EventParser(programId, coder);
        this._eventCallbacks = new Map();
        this._eventListeners = new Map();
        this._listenerIdCount = 0;
    }
    addEventListener(eventName, callback) {
        var _a;
        let listener = this._listenerIdCount;
        this._listenerIdCount += 1;
        // Store the listener into the event map.
        if (!this._eventListeners.has(eventName)) {
            this._eventListeners.set(eventName, []);
        }
        this._eventListeners.set(eventName, ((_a = this._eventListeners.get(eventName)) !== null && _a !== void 0 ? _a : []).concat(listener));
        // Store the callback into the listener map.
        this._eventCallbacks.set(listener, [eventName, callback]);
        // Create the subscription singleton, if needed.
        if (this._onLogsSubscriptionId !== undefined) {
            return listener;
        }
        this._onLogsSubscriptionId = this._provider.connection.onLogs(this._programId, (logs, ctx) => {
            if (logs.err) {
                return;
            }
            for (const event of this._eventParser.parseLogs(logs.logs)) {
                const allListeners = this._eventListeners.get(event.name);
                if (allListeners) {
                    allListeners.forEach((listener) => {
                        const listenerCb = this._eventCallbacks.get(listener);
                        if (listenerCb) {
                            const [, callback] = listenerCb;
                            callback(event.data, ctx.slot, logs.signature);
                        }
                    });
                }
            }
        });
        return listener;
    }
    async removeEventListener(listener) {
        // Get the callback.
        const callback = this._eventCallbacks.get(listener);
        if (!callback) {
            throw new Error(`Event listener ${listener} doesn't exist!`);
        }
        const [eventName] = callback;
        // Get the listeners.
        let listeners = this._eventListeners.get(eventName);
        if (!listeners) {
            throw new Error(`Event listeners don't exist for ${eventName}!`);
        }
        // Update both maps.
        this._eventCallbacks.delete(listener);
        listeners = listeners.filter((l) => l !== listener);
        this._eventListeners.set(eventName, listeners);
        if (listeners.length === 0) {
            this._eventListeners.delete(eventName);
        }
        // Kill the websocket connection if all listeners have been removed.
        if (this._eventCallbacks.size === 0) {
            if (this._eventListeners.size !== 0) {
                throw new Error(`Expected event listeners size to be 0 but got ${this._eventListeners.size}`);
            }
            if (this._onLogsSubscriptionId !== undefined) {
                await this._provider.connection.removeOnLogsListener(this._onLogsSubscriptionId);
                this._onLogsSubscriptionId = undefined;
            }
        }
    }
}
class EventParser {
    constructor(programId, coder) {
        this.coder = coder;
        this.programId = programId;
    }
    // Each log given, represents an array of messages emitted by
    // a single transaction, which can execute many different programs across
    // CPI boundaries. However, the subscription is only interested in the
    // events emitted by *this* program. In achieving this, we keep track of the
    // program execution context by parsing each log and looking for a CPI
    // `invoke` call. If one exists, we know a new program is executing. So we
    // push the programId onto a stack and switch the program context. This
    // allows us to track, for a given log, which program was executing during
    // its emission, thereby allowing us to know if a given log event was
    // emitted by *this* program. If it was, then we parse the raw string and
    // emit the event if the string matches the event being subscribed to.
    *parseLogs(logs, errorOnDecodeFailure = false) {
        const logScanner = new LogScanner(logs);
        const execution = new ExecutionContext();
        let log = logScanner.next();
        while (log !== null) {
            let [event, newProgram, didPop] = this.handleLog(execution, log, errorOnDecodeFailure);
            if (event) {
                yield event;
            }
            if (newProgram) {
                execution.push(newProgram);
            }
            if (didPop) {
                execution.pop();
            }
            log = logScanner.next();
        }
    }
    // Main log handler. Returns a three element array of the event, the
    // next program that was invoked for CPI, and a boolean indicating if
    // a program has completed execution (and thus should be popped off the
    // execution stack).
    handleLog(execution, log, errorOnDecodeFailure) {
        // Executing program is this program.
        if (execution.stack.length > 0 &&
            execution.program() === this.programId.toString()) {
            return this.handleProgramLog(log, errorOnDecodeFailure);
        }
        // Executing program is not this program.
        else {
            return [null, ...this.handleSystemLog(log)];
        }
    }
    // Handles logs from *this* program.
    handleProgramLog(log, errorOnDecodeFailure) {
        // This is a `msg!` log or a `sol_log_data` log.
        if (log.startsWith(PROGRAM_LOG) || log.startsWith(PROGRAM_DATA)) {
            const logStr = log.startsWith(PROGRAM_LOG)
                ? log.slice(PROGRAM_LOG_START_INDEX)
                : log.slice(PROGRAM_DATA_START_INDEX);
            const event = this.coder.events.decode(logStr);
            if (errorOnDecodeFailure && event === null) {
                throw new Error(`Unable to decode event ${logStr}`);
            }
            return [event, null, false];
        }
        // System log.
        else {
            return [null, ...this.handleSystemLog(log)];
        }
    }
    // Handles logs when the current program being executing is *not* this.
    handleSystemLog(log) {
        // System component.
        const logStart = log.split(":")[0];
        // Did the program finish executing?
        if (logStart.match(/^Program (.*) success/g) !== null) {
            return [null, true];
            // Recursive call.
        }
        else if (logStart.startsWith(`Program ${this.programId.toString()} invoke`)) {
            return [this.programId.toString(), false];
        }
        // CPI call.
        else if (logStart.includes("invoke")) {
            return ["cpi", false]; // Any string will do.
        }
        else {
            return [null, false];
        }
    }
}
// Stack frame execution context, allowing one to track what program is
// executing for a given log.
class ExecutionContext {
    constructor() {
        this.stack = [];
    }
    program() {
        if (!this.stack.length) {
            throw new Error("Expected the stack to have elements");
        }
        return this.stack[this.stack.length - 1];
    }
    push(newProgram) {
        this.stack.push(newProgram);
    }
    pop() {
        if (!this.stack.length) {
            throw new Error("Expected the stack to have elements");
        }
        this.stack.pop();
    }
}
class LogScanner {
    constructor(logs) {
        this.logs = logs;
    }
    next() {
        if (this.logs.length === 0) {
            return null;
        }
        let l = this.logs[0];
        this.logs = this.logs.slice(1);
        return l;
    }
}

class SimulateFactory {
    static build(idlIx, txFn, idlErrors, provider, coder, programId, idl) {
        const simulate = async (...args) => {
            var _a;
            const tx = txFn(...args);
            const [, ctx] = splitArgsAndCtx(idlIx, [...args]);
            let resp = undefined;
            if (provider.simulate === undefined) {
                throw new Error("This function requires 'Provider.simulate' to be implemented.");
            }
            try {
                resp = await provider.simulate(tx, ctx.signers, (_a = ctx.options) === null || _a === void 0 ? void 0 : _a.commitment);
            }
            catch (err) {
                throw translateError(err, idlErrors);
            }
            if (resp === undefined) {
                throw new Error("Unable to simulate transaction");
            }
            const logs = resp.logs;
            if (!logs) {
                throw new Error("Simulated logs not found");
            }
            const events = [];
            if (idl.events) {
                let parser = new EventParser(programId, coder);
                for (const event of parser.parseLogs(logs)) {
                    events.push(event);
                }
            }
            return { events, raw: logs };
        };
        return simulate;
    }
}

function uint64(property) {
    return new WrappedLayout(blob(8), (b) => u64.fromBuffer(b), (n) => n.toBuffer(), property);
}
function publicKey(property) {
    return new WrappedLayout(blob(32), (b) => new PublicKey(b), (key) => key.toBuffer(), property);
}
function coption(layout, property) {
    return new COptionLayout(layout, property);
}
class WrappedLayout extends Layout_2 {
    constructor(layout, decoder, encoder, property) {
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
}
class COptionLayout extends Layout_2 {
    constructor(layout, property) {
        super(-1, property);
        this.layout = layout;
        this.discriminator = u32();
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.layout.span + this.discriminator.encode(0, b, offset);
        }
        this.discriminator.encode(1, b, offset);
        return this.layout.encode(src, b, offset + 4) + 4;
    }
    decode(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return null;
        }
        else if (discriminator === 1) {
            return this.layout.decode(b, offset + 4);
        }
        throw new Error("Invalid coption " + this.layout.property);
    }
    getSpan(b, offset = 0) {
        return this.layout.getSpan(b, offset + 4) + 4;
    }
}
class u64 extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 8) {
            return b;
        }
        if (b.length >= 8) {
            throw new Error("u64 too large");
        }
        const zeroPad = Buffer.alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a u64 from Buffer representation
     */
    static fromBuffer(buffer) {
        if (buffer.length !== 8) {
            throw new Error(`Invalid buffer length: ${buffer.length}`);
        }
        return new u64([...buffer]
            .reverse()
            .map((i) => `00${i.toString(16)}`.slice(-2))
            .join(""), 16);
    }
}
const TOKEN_ACCOUNT_LAYOUT = struct([
    publicKey("mint"),
    publicKey("owner"),
    uint64("amount"),
    coption(publicKey(), "delegate"),
    ((p) => {
        const U = union(u8("discriminator"), null, p);
        U.addVariant(0, struct([]), "uninitialized");
        U.addVariant(1, struct([]), "initialized");
        U.addVariant(2, struct([]), "frozen");
        return U;
    })("state"),
    coption(uint64(), "isNative"),
    uint64("delegatedAmount"),
    coption(publicKey(), "closeAuthority"),
]);
function decodeTokenAccount(b) {
    return TOKEN_ACCOUNT_LAYOUT.decode(b);
}

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
            if (isPartialAccounts(partialAccount)) {
                // is compound accounts, recurse one level deeper
                if (isIdlAccounts(accountItem)) {
                    nestedAccountsGeneric[accountName] = this.resolveOptionalsHelper(partialAccount, accountItem["accounts"]);
                }
                else {
                    // Here we try our best to recover gracefully. If there are optionals we can't check, we will fail then.
                    nestedAccountsGeneric[accountName] = flattenPartialAccounts(partialAccount, true);
                }
            }
            else {
                // if not compound accounts, do null/optional check and proceed
                if (partialAccount !== null) {
                    nestedAccountsGeneric[accountName] = translateAddress(partialAccount);
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
                    camelCase(accountDescOrAccounts.name),
                ]);
            }
            const accountDesc = accountDescOrAccounts;
            const accountDescName = camelCase(accountDescOrAccounts.name);
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
                    camelCase(accountDescOrAccounts.name),
                ]);
            }
            // Validate next index exists
            const nextIndex = +i + 1;
            if (nextIndex === accounts.length)
                return;
            const currentName = camelCase(accounts[i].name);
            const nextName = camelCase(accounts[nextIndex].name);
            // Populate event CPI accounts if they exist
            if (currentName === "eventAuthority" && nextName === "program") {
                const currentPath = [...path, currentName];
                const nextPath = [...path, nextName];
                if (!this.get(currentPath)) {
                    this.set(currentPath, PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], this._programId)[0]);
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
                    camelCase(accountDesc.name),
                ]);
            }
            const accountDescCasted = accountDesc;
            const accountDescName = camelCase(accountDesc.name);
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
                    camelCase(accountDesc.name),
                ]);
            }
            const relations = accountDesc.relations || [];
            const accountDescName = camelCase(accountDesc.name);
            const newPath = [...path, accountDescName];
            // If we have this account and there's some missing accounts that are relations to this account, fetch them
            const accountKey = this.get(newPath);
            if (accountKey) {
                const matching = relations.filter((rel) => !this.get([...path, camelCase(rel)]));
                found += matching.length;
                if (matching.length > 0) {
                    const account = await this._accountStore.fetchAccount({
                        publicKey: accountKey,
                    });
                    await Promise.all(matching.map(async (rel) => {
                        const relName = camelCase(rel);
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
        const [pubkey] = await PublicKey.findProgramAddress(seeds, programId);
        this.set([...path, camelCase(accountDesc.name)], pubkey);
    }
    async parseProgramId(accountDesc, path = []) {
        var _a;
        if (!((_a = accountDesc.pda) === null || _a === void 0 ? void 0 : _a.programId)) {
            return this._programId;
        }
        switch (accountDesc.pda.programId.kind) {
            case "const":
                return new PublicKey(this.toBufferConst(accountDesc.pda.programId.value));
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
        const seedArgName = camelCase(split[0]);
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
        const fieldPubkey = this.get([...path, camelCase(fieldName)]);
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
            accountField = account[camelCase(path[0])];
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
                return Buffer.from(encode$2(value));
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
AccountsResolver.CONST_ACCOUNTS = {
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: SYSVAR_CLOCK_PUBKEY,
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
            const idl = await Program.fetchIdl(programId, this._provider);
            if (idl) {
                const program = new Program(idl, programId, this._provider);
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
                const data = decodeTokenAccount(accountInfo.data);
                this._cache.set(address, data);
            }
            else if (name) {
                const accounts = await this.ensureIdl(programId);
                if (accounts) {
                    const accountFetcher = accounts[camelCase(name)];
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

class MethodsBuilderFactory {
    static build(provider, programId, idlIx, ixFn, txFn, rpcFn, simulateFn, viewFn, accountNamespace, idlTypes, customResolver) {
        return (...args) => new MethodsBuilder(args, ixFn, txFn, rpcFn, simulateFn, viewFn, provider, programId, idlIx, accountNamespace, idlTypes, customResolver);
    }
}
function isPartialAccounts(partialAccount) {
    return (typeof partialAccount === "object" &&
        partialAccount !== null &&
        !("_bn" in partialAccount) // Ensures not a pubkey
    );
}
function flattenPartialAccounts(partialAccounts, throwOnNull) {
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
class MethodsBuilder {
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

class ViewFactory {
    static build(programId, idlIx, simulateFn, idl) {
        const isMut = idlIx.accounts.find((a) => a.isMut);
        const hasReturn = !!idlIx.returns;
        if (isMut || !hasReturn)
            return;
        const view = async (...args) => {
            var _a, _b;
            let simulationResult = await simulateFn(...args);
            const returnPrefix = `Program return: ${programId} `;
            let returnLog = simulationResult.raw.find((l) => l.startsWith(returnPrefix));
            if (!returnLog) {
                throw new Error("View expected return log");
            }
            let returnData = decode(returnLog.slice(returnPrefix.length));
            let returnType = idlIx.returns;
            if (!returnType) {
                throw new Error("View expected return type");
            }
            const coder = IdlCoder.fieldLayout({ type: returnType }, Array.from([...((_a = idl.accounts) !== null && _a !== void 0 ? _a : []), ...((_b = idl.types) !== null && _b !== void 0 ? _b : [])]));
            return coder.decode(returnData);
        };
        return view;
    }
}

class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */
    static build(idl, coder, programId, provider, getCustomResolver) {
        const rpc = {};
        const instruction = {};
        const transaction = {};
        const simulate = {};
        const methods = {};
        const view = {};
        const idlErrors = parseIdlErrors(idl);
        const account = idl.accounts
            ? AccountFactory.build(idl, coder, programId, provider)
            : {};
        idl.instructions.forEach((idlIx) => {
            const ixItem = InstructionNamespaceFactory.build(idlIx, (ixName, ix) => coder.instruction.encode(ixName, ix), programId);
            const txItem = TransactionFactory.build(idlIx, ixItem);
            const rpcItem = RpcFactory.build(idlIx, txItem, idlErrors, provider);
            const simulateItem = SimulateFactory.build(idlIx, txItem, idlErrors, provider, coder, programId, idl);
            const viewItem = ViewFactory.build(programId, idlIx, simulateItem, idl);
            const methodItem = MethodsBuilderFactory.build(provider, programId, idlIx, ixItem, txItem, rpcItem, simulateItem, viewItem, account, idl.types || [], getCustomResolver && getCustomResolver(idlIx));
            const name = camelCase(idlIx.name);
            instruction[name] = ixItem;
            transaction[name] = txItem;
            rpc[name] = rpcItem;
            simulate[name] = simulateItem;
            methods[name] = methodItem;
            if (viewItem) {
                view[name] = viewItem;
            }
        });
        return [
            rpc,
            instruction,
            transaction,
            account,
            simulate,
            methods,
            view,
        ];
    }
}

/**
 * ## Program
 *
 * Program provides the IDL deserialized client representation of an Anchor
 * program.
 *
 * This API is the one stop shop for all things related to communicating with
 * on-chain programs. Among other things, one can send transactions, fetch
 * deserialized accounts, decode instruction data, subscribe to account
 * changes, and listen to events.
 *
 * In addition to field accessors and methods, the object provides a set of
 * dynamically generated properties, also known as namespaces, that
 * map one-to-one to program methods and accounts. These namespaces generally
 *  can be used as follows:
 *
 * ## Usage
 *
 * ```javascript
 * program.<namespace>.<program-specific-method>
 * ```
 *
 * API specifics are namespace dependent. The examples used in the documentation
 * below will refer to the two counter examples found
 * [here](https://github.com/coral-xyz/anchor#examples).
 */
class Program {
    /**
     * Address of the program.
     */
    get programId() {
        return this._programId;
    }
    /**
     * IDL defining the program's interface.
     */
    get idl() {
        return this._idl;
    }
    /**
     * Coder for serializing requests.
     */
    get coder() {
        return this._coder;
    }
    /**
     * Wallet and network provider.
     */
    get provider() {
        return this._provider;
    }
    /**
     * @param idl       The interface definition.
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context to use. If not provided
     *                  then uses [[getProvider]].
     * @param getCustomResolver A function that returns a custom account resolver
     *                          for the given instruction. This is useful for resolving
     *                          public keys of missing accounts when building instructions
     */
    constructor(idl, programId, provider, coder, getCustomResolver) {
        programId = translateAddress(programId);
        if (!provider) {
            provider = getProvider();
        }
        // Fields.
        this._idl = idl;
        this._provider = provider;
        this._programId = programId;
        this._coder = coder !== null && coder !== void 0 ? coder : new BorshCoder(idl);
        this._events = new EventManager(this._programId, provider, this._coder);
        // Dynamic namespaces.
        const [rpc, instruction, transaction, account, simulate, methods, views] = NamespaceFactory.build(idl, this._coder, programId, provider, getCustomResolver !== null && getCustomResolver !== void 0 ? getCustomResolver : (() => undefined));
        this.rpc = rpc;
        this.instruction = instruction;
        this.transaction = transaction;
        this.account = account;
        this.simulate = simulate;
        this.methods = methods;
        this.views = views;
    }
    /**
     * Generates a Program client by fetching the IDL from the network.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static async at(address, provider) {
        const programId = translateAddress(address);
        const idl = await Program.fetchIdl(programId, provider);
        if (!idl) {
            throw new Error(`IDL not found for program: ${address.toString()}`);
        }
        return new Program(idl, programId, provider);
    }
    /**
     * Fetches an idl from the blockchain.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static async fetchIdl(address, provider) {
        provider = provider !== null && provider !== void 0 ? provider : getProvider();
        const programId = translateAddress(address);
        const idlAddr = await idlAddress(programId);
        const accountInfo = await provider.connection.getAccountInfo(idlAddr);
        if (!accountInfo) {
            return null;
        }
        // Chop off account discriminator.
        let idlAccount = decodeIdlAccount(accountInfo.data.slice(8));
        const inflatedIdl = inflate(idlAccount.data);
        return JSON.parse(decode$2(inflatedIdl));
    }
    /**
     * Invokes the given callback every time the given event is emitted.
     *
     * @param eventName The PascalCase name of the event, provided by the IDL.
     * @param callback  The function to invoke whenever the event is emitted from
     *                  program logs.
     */
    addEventListener(eventName, callback) {
        return this._events.addEventListener(eventName, callback);
    }
    /**
     * Unsubscribes from the given eventName.
     */
    async removeEventListener(listener) {
        return await this._events.removeEventListener(listener);
    }
}

const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
function program(provider) {
    return new Program(IDL, SYSTEM_PROGRAM_ID, provider, coder());
}
function coder() {
    return new SystemCoder(IDL);
}
const IDL = {
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

class Native {
    static system(provider) {
        return program(provider);
    }
}

export { AccountClient, AnchorError, AnchorProvider, BorshAccountsCoder, BorshCoder, BorshEventCoder, BorshInstructionCoder, DISCRIMINATOR_SIZE, EventManager, EventParser, IdlError, LangErrorCode, LangErrorMessage, MethodsBuilderFactory, Native, Program, ProgramError, ProgramErrorStack, SystemCoder, eventDiscriminator, getProvider, parseIdlErrors, setProvider, splitArgsAndCtx, toInstruction, translateAddress, translateError, index as utils, validateAccounts };
//# sourceMappingURL=index.js.map
