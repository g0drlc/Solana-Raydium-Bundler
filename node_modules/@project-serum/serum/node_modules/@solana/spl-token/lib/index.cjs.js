'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var buffer = require('buffer');
var assert = require('assert');
var BN = require('bn.js');
var BufferLayout = require('buffer-layout');
var web3_js = require('@solana/web3.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var BN__default = /*#__PURE__*/_interopDefaultLegacy(BN);
var BufferLayout__namespace = /*#__PURE__*/_interopNamespace(BufferLayout);

//      
/**
 * Layout for a public key
 */

const publicKey = (property = 'publicKey') => {
  return BufferLayout__namespace.blob(32, property);
};
/**
 * Layout for a 64bit unsigned value
 */

const uint64 = (property = 'uint64') => {
  return BufferLayout__namespace.blob(8, property);
};

//      
function sendAndConfirmTransaction(title, connection, transaction, ...signers) {
  return web3_js.sendAndConfirmTransaction(connection, transaction, signers, {
    skipPreflight: false
  });
}

const TOKEN_PROGRAM_ID = new web3_js.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new web3_js.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const FAILED_TO_FIND_ACCOUNT = 'Failed to find account';
const INVALID_ACCOUNT_OWNER = 'Invalid account owner';
/**
 * Unfortunately, BufferLayout.encode uses an `instanceof` check for `Buffer`
 * which fails when using `publicKey.toBuffer()` directly because the bundled `Buffer`
 * class in `@solana/web3.js` is different from the bundled `Buffer` class in this package
 */

function pubkeyToBuffer(publicKey) {
  return buffer.Buffer.from(publicKey.toBuffer());
}
/**
 * 64-bit value
 */


class u64 extends BN__default['default'] {
  /**
   * Convert to Buffer representation
   */
  toBuffer() {
    const a = super.toArray().reverse();
    const b = buffer.Buffer.from(a);

    if (b.length === 8) {
      return b;
    }

    assert__default['default'](b.length < 8, 'u64 too large');
    const zeroPad = buffer.Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }
  /**
   * Construct a u64 from Buffer representation
   */


  static fromBuffer(buffer) {
    assert__default['default'](buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
    return new u64([...buffer].reverse().map(i => `00${i.toString(16)}`.slice(-2)).join(''), 16);
  }

}

function isAccount(accountOrPublicKey) {
  return 'publicKey' in accountOrPublicKey;
}

const AuthorityTypeCodes = {
  MintTokens: 0,
  FreezeAccount: 1,
  AccountOwner: 2,
  CloseAccount: 3
}; // The address of the special mint for wrapped native token.

const NATIVE_MINT = new web3_js.PublicKey('So11111111111111111111111111111111111111112');
/**
 * Information about the mint
 */

const MintLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u32('mintAuthorityOption'), publicKey('mintAuthority'), uint64('supply'), BufferLayout__namespace.u8('decimals'), BufferLayout__namespace.u8('isInitialized'), BufferLayout__namespace.u32('freezeAuthorityOption'), publicKey('freezeAuthority')]);
/**
 * Information about an account
 */

/**
 * @private
 */

const AccountLayout = BufferLayout__namespace.struct([publicKey('mint'), publicKey('owner'), uint64('amount'), BufferLayout__namespace.u32('delegateOption'), publicKey('delegate'), BufferLayout__namespace.u8('state'), BufferLayout__namespace.u32('isNativeOption'), uint64('isNative'), uint64('delegatedAmount'), BufferLayout__namespace.u32('closeAuthorityOption'), publicKey('closeAuthority')]);
/**
 * Information about an multisig
 */

/**
 * @private
 */

const MultisigLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('m'), BufferLayout__namespace.u8('n'), BufferLayout__namespace.u8('is_initialized'), publicKey('signer1'), publicKey('signer2'), publicKey('signer3'), publicKey('signer4'), publicKey('signer5'), publicKey('signer6'), publicKey('signer7'), publicKey('signer8'), publicKey('signer9'), publicKey('signer10'), publicKey('signer11')]);
/**
 * An ERC20-like Token
 */

class Token {
  /**
   * @private
   */

  /**
   * The public key identifying this mint
   */

  /**
   * Program Identifier for the Token program
   */

  /**
   * Program Identifier for the Associated Token program
   */

  /**
   * Fee payer
   */

  /**
   * Create a Token object attached to the specific mint
   *
   * @param connection The connection to use
   * @param token Public key of the mint
   * @param programId token programId
   * @param payer Payer of fees
   */
  constructor(connection, publicKey, programId, payer) {
    _defineProperty__default['default'](this, "connection", void 0);

    _defineProperty__default['default'](this, "publicKey", void 0);

    _defineProperty__default['default'](this, "programId", void 0);

    _defineProperty__default['default'](this, "associatedProgramId", void 0);

    _defineProperty__default['default'](this, "payer", void 0);

    Object.assign(this, {
      connection,
      publicKey,
      programId,
      payer,
      // Hard code is ok; Overriding is needed only for tests
      associatedProgramId: ASSOCIATED_TOKEN_PROGRAM_ID
    });
  }
  /**
   * Get the minimum balance for the mint to be rent exempt
   *
   * @return Number of lamports required
   */


  static async getMinBalanceRentForExemptMint(connection) {
    return await connection.getMinimumBalanceForRentExemption(MintLayout.span);
  }
  /**
   * Get the minimum balance for the account to be rent exempt
   *
   * @return Number of lamports required
   */


  static async getMinBalanceRentForExemptAccount(connection) {
    return await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
  }
  /**
   * Get the minimum balance for the multsig to be rent exempt
   *
   * @return Number of lamports required
   */


  static async getMinBalanceRentForExemptMultisig(connection) {
    return await connection.getMinimumBalanceForRentExemption(MultisigLayout.span);
  }
  /**
   * Create and initialize a token.
   *
   * @param connection The connection to use
   * @param payer Fee payer for transaction
   * @param mintAuthority Account or multisig that will control minting
   * @param freezeAuthority Optional account or multisig that can freeze token accounts
   * @param decimals Location of the decimal place
   * @param programId Optional token programId, uses the system programId by default
   * @return Token object for the newly minted token
   */


  static async createMint(connection, payer, mintAuthority, freezeAuthority, decimals, programId) {
    const mintAccount = web3_js.Keypair.generate();
    const token = new Token(connection, mintAccount.publicKey, programId, payer); // Allocate memory for the account

    const balanceNeeded = await Token.getMinBalanceRentForExemptMint(connection);
    const transaction = new web3_js.Transaction();
    transaction.add(web3_js.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintAccount.publicKey,
      lamports: balanceNeeded,
      space: MintLayout.span,
      programId
    }));
    transaction.add(Token.createInitMintInstruction(programId, mintAccount.publicKey, decimals, mintAuthority, freezeAuthority)); // Send the two instructions

    await sendAndConfirmTransaction('createAccount and InitializeMint', connection, transaction, payer, mintAccount);
    return token;
  }
  /**
   * Create and initialize a new account.
   *
   * This account may then be used as a `transfer()` or `approve()` destination
   *
   * @param owner User account that will own the new account
   * @return Public key of the new empty account
   */


  async createAccount(owner) {
    // Allocate memory for the account
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(this.connection);
    const newAccount = web3_js.Keypair.generate();
    const transaction = new web3_js.Transaction();
    transaction.add(web3_js.SystemProgram.createAccount({
      fromPubkey: this.payer.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: balanceNeeded,
      space: AccountLayout.span,
      programId: this.programId
    }));
    const mintPublicKey = this.publicKey;
    transaction.add(Token.createInitAccountInstruction(this.programId, mintPublicKey, newAccount.publicKey, owner)); // Send the two instructions

    await sendAndConfirmTransaction('createAccount and InitializeAccount', this.connection, transaction, this.payer, newAccount);
    return newAccount.publicKey;
  }
  /**
   * Create and initialize the associated account.
   *
   * This account may then be used as a `transfer()` or `approve()` destination
   *
   * @param owner User account that will own the new account
   * @return Public key of the new associated account
   */


  async createAssociatedTokenAccount(owner) {
    const associatedAddress = await Token.getAssociatedTokenAddress(this.associatedProgramId, this.programId, this.publicKey, owner);
    return this.createAssociatedTokenAccountInternal(owner, associatedAddress);
  }

  async createAssociatedTokenAccountInternal(owner, associatedAddress) {
    await sendAndConfirmTransaction('CreateAssociatedTokenAccount', this.connection, new web3_js.Transaction().add(Token.createAssociatedTokenAccountInstruction(this.associatedProgramId, this.programId, this.publicKey, associatedAddress, owner, this.payer.publicKey)), this.payer);
    return associatedAddress;
  }
  /**
   * Retrieve the associated account or create one if not found.
   *
   * This account may then be used as a `transfer()` or `approve()` destination
   *
   * @param owner User account that will own the new account
   * @return The new associated account
   */


  async getOrCreateAssociatedAccountInfo(owner) {
    const associatedAddress = await Token.getAssociatedTokenAddress(this.associatedProgramId, this.programId, this.publicKey, owner); // This is the optimum logic, considering TX fee, client-side computation,
    // RPC roundtrips and guaranteed idempotent.
    // Sadly we can't do this atomically;

    try {
      return await this.getAccountInfo(associatedAddress);
    } catch (err) {
      // INVALID_ACCOUNT_OWNER can be possible if the associatedAddress has
      // already been received some lamports (= became system accounts).
      // Assuming program derived addressing is safe, this is the only case
      // for the INVALID_ACCOUNT_OWNER in this code-path
      if (err.message === FAILED_TO_FIND_ACCOUNT || err.message === INVALID_ACCOUNT_OWNER) {
        // as this isn't atomic, it's possible others can create associated
        // accounts meanwhile
        try {
          await this.createAssociatedTokenAccountInternal(owner, associatedAddress);
        } catch (err) {// ignore all errors; for now there is no API compatible way to
          // selectively ignore the expected instruction error if the
          // associated account is existing already.
        } // Now this should always succeed


        return await this.getAccountInfo(associatedAddress);
      } else {
        throw err;
      }
    }
  }
  /**
   * Create and initialize a new account on the special native token mint.
   *
   * In order to be wrapped, the account must have a balance of native tokens
   * when it is initialized with the token program.
   *
   * This function sends lamports to the new account before initializing it.
   *
   * @param connection A solana web3 connection
   * @param programId The token program ID
   * @param owner The owner of the new token account
   * @param payer The source of the lamports to initialize, and payer of the initialization fees.
   * @param amount The amount of lamports to wrap
   * @return {Promise<PublicKey>} The new token account
   */


  static async createWrappedNativeAccount(connection, programId, owner, payer, amount) {
    // Allocate memory for the account
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(connection); // Create a new account

    const newAccount = web3_js.Keypair.generate();
    const transaction = new web3_js.Transaction();
    transaction.add(web3_js.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: balanceNeeded,
      space: AccountLayout.span,
      programId
    })); // Send lamports to it (these will be wrapped into native tokens by the token program)

    transaction.add(web3_js.SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newAccount.publicKey,
      lamports: amount
    })); // Assign the new account to the native token mint.
    // the account will be initialized with a balance equal to the native token balance.
    // (i.e. amount)

    transaction.add(Token.createInitAccountInstruction(programId, NATIVE_MINT, newAccount.publicKey, owner)); // Send the three instructions

    await sendAndConfirmTransaction('createAccount, transfer, and initializeAccount', connection, transaction, payer, newAccount);
    return newAccount.publicKey;
  }
  /**
   * Create and initialize a new multisig.
   *
   * This account may then be used for multisignature verification
   *
   * @param m Number of required signatures
   * @param signers Full set of signers
   * @return Public key of the new multisig account
   */


  async createMultisig(m, signers) {
    const multisigAccount = web3_js.Keypair.generate(); // Allocate memory for the account

    const balanceNeeded = await Token.getMinBalanceRentForExemptMultisig(this.connection);
    const transaction = new web3_js.Transaction();
    transaction.add(web3_js.SystemProgram.createAccount({
      fromPubkey: this.payer.publicKey,
      newAccountPubkey: multisigAccount.publicKey,
      lamports: balanceNeeded,
      space: MultisigLayout.span,
      programId: this.programId
    })); // create the new account

    let keys = [{
      pubkey: multisigAccount.publicKey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: web3_js.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }];
    signers.forEach(signer => keys.push({
      pubkey: signer,
      isSigner: false,
      isWritable: false
    }));
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), BufferLayout__namespace.u8('m')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 2,
      // InitializeMultisig instruction
      m
    }, data);
    transaction.add({
      keys,
      programId: this.programId,
      data
    }); // Send the two instructions

    await sendAndConfirmTransaction('createAccount and InitializeMultisig', this.connection, transaction, this.payer, multisigAccount);
    return multisigAccount.publicKey;
  }
  /**
   * Retrieve mint information
   */


  async getMintInfo() {
    const info = await this.connection.getAccountInfo(this.publicKey);

    if (info === null) {
      throw new Error('Failed to find mint account');
    }

    if (!info.owner.equals(this.programId)) {
      throw new Error(`Invalid mint owner: ${JSON.stringify(info.owner)}`);
    }

    if (info.data.length != MintLayout.span) {
      throw new Error(`Invalid mint size`);
    }

    const data = buffer.Buffer.from(info.data);
    const mintInfo = MintLayout.decode(data);

    if (mintInfo.mintAuthorityOption === 0) {
      mintInfo.mintAuthority = null;
    } else {
      mintInfo.mintAuthority = new web3_js.PublicKey(mintInfo.mintAuthority);
    }

    mintInfo.supply = u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized != 0;

    if (mintInfo.freezeAuthorityOption === 0) {
      mintInfo.freezeAuthority = null;
    } else {
      mintInfo.freezeAuthority = new web3_js.PublicKey(mintInfo.freezeAuthority);
    }

    return mintInfo;
  }
  /**
   * Retrieve account information
   *
   * @param account Public key of the account
   */


  async getAccountInfo(account, commitment) {
    const info = await this.connection.getAccountInfo(account, commitment);

    if (info === null) {
      throw new Error(FAILED_TO_FIND_ACCOUNT);
    }

    if (!info.owner.equals(this.programId)) {
      throw new Error(INVALID_ACCOUNT_OWNER);
    }

    if (info.data.length != AccountLayout.span) {
      throw new Error(`Invalid account size`);
    }

    const data = buffer.Buffer.from(info.data);
    const accountInfo = AccountLayout.decode(data);
    accountInfo.address = account;
    accountInfo.mint = new web3_js.PublicKey(accountInfo.mint);
    accountInfo.owner = new web3_js.PublicKey(accountInfo.owner);
    accountInfo.amount = u64.fromBuffer(accountInfo.amount);

    if (accountInfo.delegateOption === 0) {
      accountInfo.delegate = null;
      accountInfo.delegatedAmount = new u64();
    } else {
      accountInfo.delegate = new web3_js.PublicKey(accountInfo.delegate);
      accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
    }

    accountInfo.isInitialized = accountInfo.state !== 0;
    accountInfo.isFrozen = accountInfo.state === 2;

    if (accountInfo.isNativeOption === 1) {
      accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
      accountInfo.isNative = true;
    } else {
      accountInfo.rentExemptReserve = null;
      accountInfo.isNative = false;
    }

    if (accountInfo.closeAuthorityOption === 0) {
      accountInfo.closeAuthority = null;
    } else {
      accountInfo.closeAuthority = new web3_js.PublicKey(accountInfo.closeAuthority);
    }

    if (!accountInfo.mint.equals(this.publicKey)) {
      throw new Error(`Invalid account mint: ${JSON.stringify(accountInfo.mint)} !== ${JSON.stringify(this.publicKey)}`);
    }

    return accountInfo;
  }
  /**
   * Retrieve Multisig information
   *
   * @param multisig Public key of the account
   */


  async getMultisigInfo(multisig) {
    const info = await this.connection.getAccountInfo(multisig);

    if (info === null) {
      throw new Error('Failed to find multisig');
    }

    if (!info.owner.equals(this.programId)) {
      throw new Error(`Invalid multisig owner`);
    }

    if (info.data.length != MultisigLayout.span) {
      throw new Error(`Invalid multisig size`);
    }

    const data = buffer.Buffer.from(info.data);
    const multisigInfo = MultisigLayout.decode(data);
    multisigInfo.signer1 = new web3_js.PublicKey(multisigInfo.signer1);
    multisigInfo.signer2 = new web3_js.PublicKey(multisigInfo.signer2);
    multisigInfo.signer3 = new web3_js.PublicKey(multisigInfo.signer3);
    multisigInfo.signer4 = new web3_js.PublicKey(multisigInfo.signer4);
    multisigInfo.signer5 = new web3_js.PublicKey(multisigInfo.signer5);
    multisigInfo.signer6 = new web3_js.PublicKey(multisigInfo.signer6);
    multisigInfo.signer7 = new web3_js.PublicKey(multisigInfo.signer7);
    multisigInfo.signer8 = new web3_js.PublicKey(multisigInfo.signer8);
    multisigInfo.signer9 = new web3_js.PublicKey(multisigInfo.signer9);
    multisigInfo.signer10 = new web3_js.PublicKey(multisigInfo.signer10);
    multisigInfo.signer11 = new web3_js.PublicKey(multisigInfo.signer11);
    return multisigInfo;
  }
  /**
   * Transfer tokens to another account
   *
   * @param source Source account
   * @param destination Destination account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Number of tokens to transfer
   */


  async transfer(source, destination, owner, multiSigners, amount) {
    let ownerPublicKey;
    let signers;

    if (isAccount(owner)) {
      ownerPublicKey = owner.publicKey;
      signers = [owner];
    } else {
      ownerPublicKey = owner;
      signers = multiSigners;
    }

    return await sendAndConfirmTransaction('Transfer', this.connection, new web3_js.Transaction().add(Token.createTransferInstruction(this.programId, source, destination, ownerPublicKey, multiSigners, amount)), this.payer, ...signers);
  }
  /**
   * Grant a third-party permission to transfer up the specified number of tokens from an account
   *
   * @param account Public key of the account
   * @param delegate Account authorized to perform a transfer tokens from the source account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Maximum number of tokens the delegate may transfer
   */


  async approve(account, delegate, owner, multiSigners, amount) {
    let ownerPublicKey;
    let signers;

    if (isAccount(owner)) {
      ownerPublicKey = owner.publicKey;
      signers = [owner];
    } else {
      ownerPublicKey = owner;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('Approve', this.connection, new web3_js.Transaction().add(Token.createApproveInstruction(this.programId, account, delegate, ownerPublicKey, multiSigners, amount)), this.payer, ...signers);
  }
  /**
   * Remove approval for the transfer of any remaining tokens
   *
   * @param account Public key of the account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   */


  async revoke(account, owner, multiSigners) {
    let ownerPublicKey;
    let signers;

    if (isAccount(owner)) {
      ownerPublicKey = owner.publicKey;
      signers = [owner];
    } else {
      ownerPublicKey = owner;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('Revoke', this.connection, new web3_js.Transaction().add(Token.createRevokeInstruction(this.programId, account, ownerPublicKey, multiSigners)), this.payer, ...signers);
  }
  /**
   * Assign a new authority to the account
   *
   * @param account Public key of the account
   * @param newAuthority New authority of the account
   * @param authorityType Type of authority to set
   * @param currentAuthority Current authority of the account
   * @param multiSigners Signing accounts if `currentAuthority` is a multiSig
   */


  async setAuthority(account, newAuthority, authorityType, currentAuthority, multiSigners) {
    let currentAuthorityPublicKey;
    let signers;

    if (isAccount(currentAuthority)) {
      currentAuthorityPublicKey = currentAuthority.publicKey;
      signers = [currentAuthority];
    } else {
      currentAuthorityPublicKey = currentAuthority;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('SetAuthority', this.connection, new web3_js.Transaction().add(Token.createSetAuthorityInstruction(this.programId, account, newAuthority, authorityType, currentAuthorityPublicKey, multiSigners)), this.payer, ...signers);
  }
  /**
   * Mint new tokens
   *
   * @param dest Public key of the account to mint to
   * @param authority Minting authority
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount Amount to mint
   */


  async mintTo(dest, authority, multiSigners, amount) {
    let ownerPublicKey;
    let signers;

    if (isAccount(authority)) {
      ownerPublicKey = authority.publicKey;
      signers = [authority];
    } else {
      ownerPublicKey = authority;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('MintTo', this.connection, new web3_js.Transaction().add(Token.createMintToInstruction(this.programId, this.publicKey, dest, ownerPublicKey, multiSigners, amount)), this.payer, ...signers);
  }
  /**
   * Burn tokens
   *
   * @param account Account to burn tokens from
   * @param owner Account owner
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Amount to burn
   */


  async burn(account, owner, multiSigners, amount) {
    let ownerPublicKey;
    let signers;

    if (isAccount(owner)) {
      ownerPublicKey = owner.publicKey;
      signers = [owner];
    } else {
      ownerPublicKey = owner;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('Burn', this.connection, new web3_js.Transaction().add(Token.createBurnInstruction(this.programId, this.publicKey, account, ownerPublicKey, multiSigners, amount)), this.payer, ...signers);
  }
  /**
   * Close account
   *
   * @param account Account to close
   * @param dest Account to receive the remaining balance of the closed account
   * @param authority Authority which is allowed to close the account
   * @param multiSigners Signing accounts if `authority` is a multiSig
   */


  async closeAccount(account, dest, authority, multiSigners) {
    let authorityPublicKey;
    let signers;

    if (isAccount(authority)) {
      authorityPublicKey = authority.publicKey;
      signers = [authority];
    } else {
      authorityPublicKey = authority;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('CloseAccount', this.connection, new web3_js.Transaction().add(Token.createCloseAccountInstruction(this.programId, account, dest, authorityPublicKey, multiSigners)), this.payer, ...signers);
  }
  /**
   * Freeze account
   *
   * @param account Account to freeze
   * @param authority The mint freeze authority
   * @param multiSigners Signing accounts if `authority` is a multiSig
   */


  async freezeAccount(account, authority, multiSigners) {
    let authorityPublicKey;
    let signers;

    if (isAccount(authority)) {
      authorityPublicKey = authority.publicKey;
      signers = [authority];
    } else {
      authorityPublicKey = authority;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('FreezeAccount', this.connection, new web3_js.Transaction().add(Token.createFreezeAccountInstruction(this.programId, account, this.publicKey, authorityPublicKey, multiSigners)), this.payer, ...signers);
  }
  /**
   * Thaw account
   *
   * @param account Account to thaw
   * @param authority The mint freeze authority
   * @param multiSigners Signing accounts if `authority` is a multiSig
   */


  async thawAccount(account, authority, multiSigners) {
    let authorityPublicKey;
    let signers;

    if (isAccount(authority)) {
      authorityPublicKey = authority.publicKey;
      signers = [authority];
    } else {
      authorityPublicKey = authority;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('ThawAccount', this.connection, new web3_js.Transaction().add(Token.createThawAccountInstruction(this.programId, account, this.publicKey, authorityPublicKey, multiSigners)), this.payer, ...signers);
  }
  /**
   * Transfer tokens to another account, asserting the token mint and decimals
   *
   * @param source Source account
   * @param destination Destination account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Number of tokens to transfer
   * @param decimals Number of decimals in transfer amount
   */


  async transferChecked(source, destination, owner, multiSigners, amount, decimals) {
    let ownerPublicKey;
    let signers;

    if (isAccount(owner)) {
      ownerPublicKey = owner.publicKey;
      signers = [owner];
    } else {
      ownerPublicKey = owner;
      signers = multiSigners;
    }

    return await sendAndConfirmTransaction('TransferChecked', this.connection, new web3_js.Transaction().add(Token.createTransferCheckedInstruction(this.programId, source, this.publicKey, destination, ownerPublicKey, multiSigners, amount, decimals)), this.payer, ...signers);
  }
  /**
   * Grant a third-party permission to transfer up the specified number of tokens from an account,
   * asserting the token mint and decimals
   *
   * @param account Public key of the account
   * @param delegate Account authorized to perform a transfer tokens from the source account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Maximum number of tokens the delegate may transfer
   * @param decimals Number of decimals in approve amount
   */


  async approveChecked(account, delegate, owner, multiSigners, amount, decimals) {
    let ownerPublicKey;
    let signers;

    if (isAccount(owner)) {
      ownerPublicKey = owner.publicKey;
      signers = [owner];
    } else {
      ownerPublicKey = owner;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('ApproveChecked', this.connection, new web3_js.Transaction().add(Token.createApproveCheckedInstruction(this.programId, account, this.publicKey, delegate, ownerPublicKey, multiSigners, amount, decimals)), this.payer, ...signers);
  }
  /**
   * Mint new tokens, asserting the token mint and decimals
   *
   * @param dest Public key of the account to mint to
   * @param authority Minting authority
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount Amount to mint
   * @param decimals Number of decimals in amount to mint
   */


  async mintToChecked(dest, authority, multiSigners, amount, decimals) {
    let ownerPublicKey;
    let signers;

    if (isAccount(authority)) {
      ownerPublicKey = authority.publicKey;
      signers = [authority];
    } else {
      ownerPublicKey = authority;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('MintToChecked', this.connection, new web3_js.Transaction().add(Token.createMintToCheckedInstruction(this.programId, this.publicKey, dest, ownerPublicKey, multiSigners, amount, decimals)), this.payer, ...signers);
  }
  /**
   * Burn tokens, asserting the token mint and decimals
   *
   * @param account Account to burn tokens from
   * @param owner Account owner
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Amount to burn
   * @param decimals Number of decimals in amount to burn
   */


  async burnChecked(account, owner, multiSigners, amount, decimals) {
    let ownerPublicKey;
    let signers;

    if (isAccount(owner)) {
      ownerPublicKey = owner.publicKey;
      signers = [owner];
    } else {
      ownerPublicKey = owner;
      signers = multiSigners;
    }

    await sendAndConfirmTransaction('BurnChecked', this.connection, new web3_js.Transaction().add(Token.createBurnCheckedInstruction(this.programId, this.publicKey, account, ownerPublicKey, multiSigners, amount, decimals)), this.payer, ...signers);
  }
  /**
   * Sync amount in native SPL token account to underlying lamports
   *
   * @param nativeAccount Account to sync
   */


  async syncNative(nativeAccount) {
    await sendAndConfirmTransaction('SyncNative', this.connection, new web3_js.Transaction().add(Token.createSyncNativeInstruction(this.programId, nativeAccount)), this.payer);
  }
  /**
   * Construct an InitializeMint instruction
   *
   * @param programId SPL Token program account
   * @param mint Token mint account
   * @param decimals Number of decimals in token account amounts
   * @param mintAuthority Minting authority
   * @param freezeAuthority Optional authority that can freeze token accounts
   */


  static createInitMintInstruction(programId, mint, decimals, mintAuthority, freezeAuthority) {
    let keys = [{
      pubkey: mint,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: web3_js.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }];
    const commandDataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), BufferLayout__namespace.u8('decimals'), publicKey('mintAuthority'), BufferLayout__namespace.u8('option'), publicKey('freezeAuthority')]);
    let data = buffer.Buffer.alloc(1024);
    {
      const encodeLength = commandDataLayout.encode({
        instruction: 0,
        // InitializeMint instruction
        decimals,
        mintAuthority: pubkeyToBuffer(mintAuthority),
        option: freezeAuthority === null ? 0 : 1,
        freezeAuthority: pubkeyToBuffer(freezeAuthority || new web3_js.PublicKey(0))
      }, data);
      data = data.slice(0, encodeLength);
    }
    return new web3_js.TransactionInstruction({
      keys,
      programId,
      data
    });
  }
  /**
   * Construct an InitializeAccount instruction
   *
   * @param programId SPL Token program account
   * @param mint Token mint account
   * @param account New account
   * @param owner Owner of the new account
   */


  static createInitAccountInstruction(programId, mint, account, owner) {
    const keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: owner,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: web3_js.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }];
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 1 // InitializeAccount instruction

    }, data);
    return new web3_js.TransactionInstruction({
      keys,
      programId,
      data
    });
  }
  /**
   * Construct a Transfer instruction
   *
   * @param programId SPL Token program account
   * @param source Source account
   * @param destination Destination account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount Number of tokens to transfer
   */


  static createTransferInstruction(programId, source, destination, owner, multiSigners, amount) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 3,
      // Transfer instruction
      amount: new u64(amount).toBuffer()
    }, data);
    let keys = [{
      pubkey: source,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: destination,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct an Approve instruction
   *
   * @param programId SPL Token program account
   * @param account Public key of the account
   * @param delegate Account authorized to perform a transfer of tokens from the source account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Maximum number of tokens the delegate may transfer
   */


  static createApproveInstruction(programId, account, delegate, owner, multiSigners, amount) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 4,
      // Approve instruction
      amount: new u64(amount).toBuffer()
    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: delegate,
      isSigner: false,
      isWritable: false
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a Revoke instruction
   *
   * @param programId SPL Token program account
   * @param account Public key of the account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   */


  static createRevokeInstruction(programId, account, owner, multiSigners) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 5 // Approve instruction

    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a SetAuthority instruction
   *
   * @param programId SPL Token program account
   * @param account Public key of the account
   * @param newAuthority New authority of the account
   * @param authorityType Type of authority to set
   * @param currentAuthority Current authority of the specified type
   * @param multiSigners Signing accounts if `currentAuthority` is a multiSig
   */


  static createSetAuthorityInstruction(programId, account, newAuthority, authorityType, currentAuthority, multiSigners) {
    const commandDataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), BufferLayout__namespace.u8('authorityType'), BufferLayout__namespace.u8('option'), publicKey('newAuthority')]);
    let data = buffer.Buffer.alloc(1024);
    {
      const encodeLength = commandDataLayout.encode({
        instruction: 6,
        // SetAuthority instruction
        authorityType: AuthorityTypeCodes[authorityType],
        option: newAuthority === null ? 0 : 1,
        newAuthority: pubkeyToBuffer(newAuthority || new web3_js.PublicKey(0))
      }, data);
      data = data.slice(0, encodeLength);
    }
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: currentAuthority,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: currentAuthority,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a MintTo instruction
   *
   * @param programId SPL Token program account
   * @param mint Public key of the mint
   * @param dest Public key of the account to mint to
   * @param authority The mint authority
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount Amount to mint
   */


  static createMintToInstruction(programId, mint, dest, authority, multiSigners, amount) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 7,
      // MintTo instruction
      amount: new u64(amount).toBuffer()
    }, data);
    let keys = [{
      pubkey: mint,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: dest,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: authority,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: authority,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a Burn instruction
   *
   * @param programId SPL Token program account
   * @param mint Mint for the account
   * @param account Account to burn tokens from
   * @param owner Owner of the account
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount amount to burn
   */


  static createBurnInstruction(programId, mint, account, owner, multiSigners, amount) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 8,
      // Burn instruction
      amount: new u64(amount).toBuffer()
    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a Close instruction
   *
   * @param programId SPL Token program account
   * @param account Account to close
   * @param dest Account to receive the remaining balance of the closed account
   * @param authority Account Close authority
   * @param multiSigners Signing accounts if `owner` is a multiSig
   */


  static createCloseAccountInstruction(programId, account, dest, owner, multiSigners) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 9 // CloseAccount instruction

    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: dest,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a Freeze instruction
   *
   * @param programId SPL Token program account
   * @param account Account to freeze
   * @param mint Mint account
   * @param authority Mint freeze authority
   * @param multiSigners Signing accounts if `owner` is a multiSig
   */


  static createFreezeAccountInstruction(programId, account, mint, authority, multiSigners) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 10 // FreezeAccount instruction

    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: false
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: authority,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: authority,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a Thaw instruction
   *
   * @param programId SPL Token program account
   * @param account Account to thaw
   * @param mint Mint account
   * @param authority Mint freeze authority
   * @param multiSigners Signing accounts if `owner` is a multiSig
   */


  static createThawAccountInstruction(programId, account, mint, authority, multiSigners) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 11 // ThawAccount instruction

    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: false
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: authority,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: authority,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a TransferChecked instruction
   *
   * @param programId SPL Token program account
   * @param source Source account
   * @param mint Mint account
   * @param destination Destination account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount Number of tokens to transfer
   * @param decimals Number of decimals in transfer amount
   */


  static createTransferCheckedInstruction(programId, source, mint, destination, owner, multiSigners, amount, decimals) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount'), BufferLayout__namespace.u8('decimals')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 12,
      // TransferChecked instruction
      amount: new u64(amount).toBuffer(),
      decimals
    }, data);
    let keys = [{
      pubkey: source,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: destination,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct an ApproveChecked instruction
   *
   * @param programId SPL Token program account
   * @param account Public key of the account
   * @param mint Mint account
   * @param delegate Account authorized to perform a transfer of tokens from the source account
   * @param owner Owner of the source account
   * @param multiSigners Signing accounts if `owner` is a multiSig
   * @param amount Maximum number of tokens the delegate may transfer
   * @param decimals Number of decimals in approve amount
   */


  static createApproveCheckedInstruction(programId, account, mint, delegate, owner, multiSigners, amount, decimals) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount'), BufferLayout__namespace.u8('decimals')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 13,
      // ApproveChecked instruction
      amount: new u64(amount).toBuffer(),
      decimals
    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: delegate,
      isSigner: false,
      isWritable: false
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a MintToChecked instruction
   *
   * @param programId SPL Token program account
   * @param mint Public key of the mint
   * @param dest Public key of the account to mint to
   * @param authority The mint authority
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount Amount to mint
   * @param decimals Number of decimals in amount to mint
   */


  static createMintToCheckedInstruction(programId, mint, dest, authority, multiSigners, amount, decimals) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount'), BufferLayout__namespace.u8('decimals')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 14,
      // MintToChecked instruction
      amount: new u64(amount).toBuffer(),
      decimals
    }, data);
    let keys = [{
      pubkey: mint,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: dest,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: authority,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: authority,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a BurnChecked instruction
   *
   * @param programId SPL Token program account
   * @param mint Mint for the account
   * @param account Account to burn tokens from
   * @param owner Owner of the account
   * @param multiSigners Signing accounts if `authority` is a multiSig
   * @param amount amount to burn
   */


  static createBurnCheckedInstruction(programId, mint, account, owner, multiSigners, amount, decimals) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction'), uint64('amount'), BufferLayout__namespace.u8('decimals')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 15,
      // BurnChecked instruction
      amount: new u64(amount).toBuffer(),
      decimals
    }, data);
    let keys = [{
      pubkey: account,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: true
    }];

    if (multiSigners.length === 0) {
      keys.push({
        pubkey: owner,
        isSigner: true,
        isWritable: false
      });
    } else {
      keys.push({
        pubkey: owner,
        isSigner: false,
        isWritable: false
      });
      multiSigners.forEach(signer => keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      }));
    }

    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Construct a SyncNative instruction
   *
   * @param programId SPL Token program account
   * @param nativeAccount Account to sync lamports from
   */


  static createSyncNativeInstruction(programId, nativeAccount) {
    const dataLayout = BufferLayout__namespace.struct([BufferLayout__namespace.u8('instruction')]);
    const data = buffer.Buffer.alloc(dataLayout.span);
    dataLayout.encode({
      instruction: 17 // SyncNative instruction

    }, data);
    let keys = [{
      pubkey: nativeAccount,
      isSigner: false,
      isWritable: true
    }];
    return new web3_js.TransactionInstruction({
      keys,
      programId: programId,
      data
    });
  }
  /**
   * Get the address for the associated token account
   *
   * @param associatedProgramId SPL Associated Token program account
   * @param programId SPL Token program account
   * @param mint Token mint account
   * @param owner Owner of the new account
   * @return Public key of the associated token account
   */


  static async getAssociatedTokenAddress(associatedProgramId, programId, mint, owner, allowOwnerOffCurve = false) {
    if (!allowOwnerOffCurve && !web3_js.PublicKey.isOnCurve(owner.toBuffer())) {
      throw new Error(`Owner cannot sign: ${owner.toString()}`);
    }

    return (await web3_js.PublicKey.findProgramAddress([owner.toBuffer(), programId.toBuffer(), mint.toBuffer()], associatedProgramId))[0];
  }
  /**
   * Construct the AssociatedTokenProgram instruction to create the associated
   * token account
   *
   * @param associatedProgramId SPL Associated Token program account
   * @param programId SPL Token program account
   * @param mint Token mint account
   * @param associatedAccount New associated account
   * @param owner Owner of the new account
   * @param payer Payer of fees
   */


  static createAssociatedTokenAccountInstruction(associatedProgramId, programId, mint, associatedAccount, owner, payer) {
    const data = buffer.Buffer.alloc(0);
    let keys = [{
      pubkey: payer,
      isSigner: true,
      isWritable: true
    }, {
      pubkey: associatedAccount,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: owner,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: mint,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: web3_js.SystemProgram.programId,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: programId,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: web3_js.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }];
    return new web3_js.TransactionInstruction({
      keys,
      programId: associatedProgramId,
      data
    });
  }

}

exports.ASSOCIATED_TOKEN_PROGRAM_ID = ASSOCIATED_TOKEN_PROGRAM_ID;
exports.AccountLayout = AccountLayout;
exports.MintLayout = MintLayout;
exports.NATIVE_MINT = NATIVE_MINT;
exports.TOKEN_PROGRAM_ID = TOKEN_PROGRAM_ID;
exports.Token = Token;
exports.u64 = u64;
//# sourceMappingURL=index.cjs.js.map
