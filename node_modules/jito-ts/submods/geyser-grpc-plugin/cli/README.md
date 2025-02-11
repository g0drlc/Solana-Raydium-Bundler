# Starrider Geyser Example

Allows one to exercise functionality of this geyser implementation

## Access Tokens
If you'd like to access Jito's load-balanced RPC cluster at https://mainnet.rpc.jito.wtf, email support@jito.wtf or create a support ticket in the discord. Please be kind and don't abuse.

## Building
```bash
cargo run --release --bin jito-geyser-cli
```

## Exploring Subscriptions
The CLI consists of a few subscriptions the geyser feed can offer. If connecting to Jito's RPC cluster, one can export the ACCESS_TOKEN environment variable. Proxies can support authenticating an access token provided in the header.
```asm
export ACCESS_TOKEN=<access_token>
```

### Slots
Subscribe to slot confirmation levels.
```bash
cargo run --release --bin jito-geyser-cli -- --access-token "${ACCESS_TOKEN}" slots
```

### Account Updates
Similar to the websocket equivalent, accountSubscribe, provide a list of accounts to receive updates from. The following subscribes to the SOL/USD price on pyth.
```bash
cargo run --release --bin jito-geyser-cli -- --access-token "${ACCESS_TOKEN}" accounts H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG
```

### Program Updates
Similar to programSubscribe, provides updates to accounts owned by any of the programs provided on the command line. The following subscribes to accounts owned by the Pyth program.
```bash
cargo run --release --bin jito-geyser-cli -- --access-token "${ACCESS_TOKEN}" programs FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH
```

### Get Heartbeat Interval
```bash
cargo run --release --bin jito-geyser-cli -- --access-token "${ACCESS_TOKEN}" get-heartbeat-interval
```

### Subscribe to partial account updates
This is helpful for getting low latency access to account updates without the data.
```bash
cargo run --release --bin jito-geyser-cli -- --access-token "${ACCESS_TOKEN}" partial-accounts
```

### Subscribe to transactions
```bash
cargo run --release --bin jito-geyser-cli -- --access-token "${ACCESS_TOKEN}" transactions
```

### Subscribe to blocks
```bash
cargo run --release --bin jito-geyser-cli -- --access-token "${ACCESS_TOKEN}" blocks
```

## Skew
The skew can be helpful for showing skew in time between the two servers.
