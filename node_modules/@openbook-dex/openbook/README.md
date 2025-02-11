[![npm (scoped)](https://img.shields.io/npm/v/@project-serum/serum)](https://www.npmjs.com/package/@openbook-dex/openbook)

# Serum JS Client Library

JavaScript client library for interacting with the OpenBook DEX

## Installation

Using npm:

```
npm install @solana/web3.js @openbook-dex/openbook
```

Using yarn:

```
yarn add @solana/web3.js @openbook-dex/openbook
```

## Usage

```js
import { Account, Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@openbook-dex/openbook';

let connection = new Connection('https://testnet.solana.com');
let marketAddress = new PublicKey('...');
let programAddress = new PublicKey('...');
let market = await Market.load(connection, marketAddress, {}, programAddress);

// Fetching orderbooks
let bids = await market.loadBids(connection);
let asks = await market.loadAsks(connection);
// L2 orderbook data
for (let [price, size] of bids.getL2(20)) {
  console.log(price, size);
}
// Full orderbook data
for (let order of asks) {
  console.log(
    order.orderId,
    order.price,
    order.size,
    order.side, // 'buy' or 'sell'
  );
}

// Placing orders
let owner = new Account('...');
let payer = new PublicKey('...'); // spl-token account
await market.placeOrder(connection, {
  owner,
  payer,
  side: 'buy', // 'buy' or 'sell'
  price: 123.45,
  size: 17.0,
  orderType: 'limit', // 'limit', 'ioc', 'postOnly'
});

// Retrieving open orders by owner
let myOrders = await market.loadOrdersForOwner(connection, owner.publicKey);

// Cancelling orders
for (let order of myOrders) {
  await market.cancelOrder(connection, owner, order);
}

// Retrieving fills
for (let fill of await market.loadFills(connection)) {
  console.log(fill.orderId, fill.price, fill.size, fill.side);
}

// Settle funds
for (let openOrders of await market.findOpenOrdersAccountsForOwner(
  connection,
  owner.publicKey,
)) {
  if (openOrders.baseTokenFree > 0 || openOrders.quoteTokenFree > 0) {
    // spl-token accounts to which to send the proceeds from trades
    let baseTokenAccount = new PublicKey('...');
    let quoteTokenAccount = new PublicKey('...');

    await market.settleFunds(
      connection,
      owner,
      openOrders,
      baseTokenAccount,
      quoteTokenAccount,
    );
  }
}
```
