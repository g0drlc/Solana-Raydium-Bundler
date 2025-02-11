# Changelog

### 1.1.0-beta.0 (2022-03-14)

- Add
  - Build mjs & cjs
- Change
  - Fix swap fee currency

### 1.0.1-beta.46 (2022-03-14)

- Change
  - Fix stable price

### 1.0.1-beta.45 (2022-03-14)

- Change
  - Fix stable price

### 1.0.1-beta.44 (2022-03-14)

- Change
  - Fix price impact

### 1.0.1-beta.43 (2022-03-14)

- Change
  - Fix adjust price impact
  - Return swap fee

### 1.0.1-beta.42 (2022-03-11)

- Change
  - Fix init stable model layout

### 1.0.1-beta.41 (2022-03-11)

- Change
  - Fix startTime

### 1.0.1-beta.40 (2022-03-11)

- Add
  - Return `startTime` for `Liquidity.fetchMultipleInfo`

### 1.0.1-beta.39 (2022-03-11)

- Add
  - Stable layout

### 1.0.1-beta.38 (2022-03-10)

- Add
  - Stable and route for stable

### 1.0.1-beta.37 (2022-02-25)

- Change
  - Fix route pools bug

### 1.0.1-beta.36 (2022-02-24)

- Add
  - `executionPrice` for `Route`

### 1.0.1-beta.35 (2022-02-24)

- Add
  - `priceImpact` for `Route`

### 1.0.1-beta.34 (2022-02-22)

- Change
  - Fix route bug

### 1.0.1-beta.33 (2022-02-21)

- Change
  - Trade return data structure

### 1.0.1-beta.32 (2022-02-21)

- Change
  - Fixes route

### 1.0.1-beta.31 (2022-02-20)

- Add
  - `getEnabledFeatures` for `Liquidity`
  - `computeAmountOut` for `Route`
- Change
  - Rename `computeQuotePrice` to `getRate` of `Liquidity`
  - Amount calculation is consistent with on-chain
  - Route program ID and instructions

### 1.0.1-beta.30 (2022-02-16)

- Add
  - `makeCreatePoolTransaction` for `Liquidity`
  - `makeInitPoolTransaction` for `Liquidity`
- Change
  - Update dev dependencies

### 1.0.1-beta.29 (2022-02-10)

- Change
  - Fixes bugs
  - Update dev dependencies

### 1.0.1-beta.28 (2022-02-03)

- Change
  - Optional param `startTime` of `Liquidity.makeInitPoolInstruction`

### 1.0.1-beta.27 (2022-02-03)

- Add
  - Add param `startTime` of `Liquidity.makeInitPoolInstruction`
- Change
  - Fixes bugs
  - Update dev dependencies

### 1.0.1-beta.26 (2022-01-18)

- Change
  - Fixes bugs

### 1.0.1-beta.25 (2022-01-17)

- Change
  - Accept token accounts to replace the original specified account when make transaction

### 1.0.1-beta.24 (2022-01-15)

- Change
  - Fixes
  - Update dev dependencies

### 1.0.1-beta.23 (2022-01-15)

- Add
  - Return `priceImpact` for `Liquidity.computeCurrencyAmountOut` and `Liquidity.computeCurrencyAmountIn`
- Change
  - Fixes

### 1.0.1-beta.22 (2022-01-15)

- Change
  - Fixes

### 1.0.1-beta.21 (2022-01-14)

- Add
  - `makeSwapInstruction` for `Liquidity`
  - `gt` and `lt` for `CurrencyAmount`

### 1.0.1-beta.19 (2022-01-12)

- Add
  - `makeRemoveLiquidityTransaction` for `Liquidity`
- Change
  - Rename params of `Liquidity.makeAddLiquidityTransaction`
  - Rename params of `Liquidity.makeAddLiquidityInstructionV4`
  - Rename `computeAnotherTokenAmount` to `computeAnotherCurrencyAmount` of `Liquidity`
  - Rename params of `Liquidity.computeAnotherCurrencyAmount`
  - Rename `computeTokenAmountOut` to `computeCurrencyAmountOut` of `Liquidity`
  - Rename params of `Liquidity.computeCurrencyAmountOut`
  - Rename `computeTokenAmountIn` to `computeCurrencyAmountIn` of `Liquidity`
  - Rename params of `Liquidity.computeCurrencyAmountIn`

### 1.0.1-beta.18 (2022-01-12)

- Add
  - `makeAddLiquidityTransaction` for `Liquidity`
  - `fetchInfo` for `Liquidity`
- Change
  - Rename `getPools` to `fetchAllPoolKeys` of `Liquidity`
  - Rename `getMultipleInfo` to `fetchMultipleInfo` of `Liquidity`
  - Rename `getAmountB` to `computeAnotherTokenAmount` of `Liquidity`
  - Rename `getAmountOut` to `computeTokenAmountOut` of `Liquidity`
  - Rename `getAmountIn` to `computeTokenAmountIn` of `Liquidity`
  - Update dev dependencies

### 1.0.1-beta.17 (2022-01-10)

- Add
  - `makeSwapFixedOutInstructionV4` for `Liquidity`
- Change
  - Rename `makeSwapInstructionV4` to `makeSwapFixedInInstructionV4` of `Liquidity`
  - Rename params `side` to `tradeSide` of `Liquidity`
  - Update dev dependencies

### 1.0.1-beta.15 (2022-01-09)

- Add
  - `getQuote` for `Liquidity`
  - `getAmountB` for `Liquidity`
  - `getAmountOut` for `Liquidity`
  - `getAmountIn` for `Liquidity`
- Change
  - Rename `getOutputAmount` to `getAmountOut` of `Liquidity`
  - Update dev dependencies

### 1.0.1-beta.14 (2021-12-21)

- Change
  - Fix `pendingRewards` calculating for `Farm` stake pool

### 1.0.1-beta.11 (2021-12-17)

- Add
  - ledger PDA for `Farm v3`
- Change
  - Raising the priority of `version` parameters
  - Return `Object` instead of `Array` whenever possible, but the order of the `Object` will be consistent with the `Array`, use a unique value for the key, such as `id` or `mint` or something else, etc.
  - Don't calculate ATA / PDA in function
  - Rename type `PublicKeyIsh` to `PublicKeyish`
  - Rename type `BigNumberIsh` to `BigNumberish`
  - Rename `marketVaultSigner` to `marketAuthority` for `poolKeys`
  - Rename `getAssociatedVaultSigner` to `getAssociatedAuthority` for `Market`
  - Update dev dependencies

### 1.0.1-beta.10 (2021-12-11)

- Change
  - Fix `Spl` functions amount params
  - Update dev dependencies

### 1.0.1-beta.9 (2021-12-08)

- Add
  - `makeCreatePoolInstruction` and `makeInitPoolInstruction` for `Liquidity`
- Change
  - Rename all getAssociated functions
  - Rename `tempLpVault` to `lpVault`
  - Rename `getAssociatedTokenAddress` to `getAssociatedTokenAccount` of `Spl`
  - Return `nonce` for `Liquidity.getAssociatedAuthority`
  - Fix `Farm` ledger PDA
  - Update dev dependencies

### 1.0.1-beta.8 (2021-12-07)

- Add
  - getMultipleInfo for `Liquidity`
- Change
  - Fix `Farm` v5 instructions
  - Update dev dependencies

### 1.0.1-beta.7 (2021-12-05)

- Add
  - Calculate `pendingRewards` for `Farm.getMultipleInfo`
- Change
  - Fix `Farm` ledger PDA algorithm
  - Fix `Farm` layout versions
  - Update dev dependencies

### 1.0.1-beta.6 (2021-12-02)

- Change
  - Fix typo

### 1.0.1-beta.5 (2021-12-02)

- Add
  - `poolKeys2JsonInfo` (convert poolKeys to JsonInfo)
- Change
  - Fix `CurrencyAmount`
  - Update dev dependencies

### 1.0.1-beta.4 (2021-11-29)

- Add
  - `getOutputAmount` static function for `Liquidity`
- Change
  - Rename and change the types of `MAINNET_LIQUIDITY_POOLS`, `TESTNET_LIQUIDITY_POOLS`, `DEVNET_LIQUIDITY_POOLS`
  - Return variable names of `Liquidity.getInfo`: `baseBalance` to `baseReserve`, `quoteBalance` to `quoteReserve`

### 1.0.1-beta.3 (2021-11-28)

- Add
  - `getPools` static function for `Liquidity` (fetch pools on-chain)
- Change
  - Flat params of `Liquidity.getInfo`
  - Rename all layouts types
  - Change version types to `number` in all `poolKeys`
  - Update peer dependencies
  - Update dev dependencies
- Remove
  - `getInfo` static function for `Liquidity`

### 1.0.1-beta.1 (2021-11-21)

- Add
  - `getInfo` static function for `Liquidity` (simulate way)
- Change
  - Update dev dependencies

### 1.0.1-beta.0 (2021-11-19)

- Add
  - `isRaw` param for `TokenAmount`
- Change
  - Directory tree
  - Exported program ids as `PublicKey`
  - Update dev dependencies
