# geyser-grpc-plugin

A lightweight gRPC service for streaming account and slot updates to subscribers.

## Setup
1. [Compile](#helper-scripts) or [download a release](https://github.com/jito-foundation/geyser-grpc-plugin/releases) for your specific validator version
   - **NOTE**: Be sure to use the branch matching the major & minor versions of your RPC node. This includes using Solana Foundation or Jito validator
2. Copy and edit the [config json file](./server/example-config.json) to suit your validator
3. Add startup arg to solana validator
    - Example: `--geyser-plugin-config geyser.json`
4. Restart validator
5. Check logs for `Starting GeyserPluginService from config files` or `geyser_grpc_plugin_server::server`

## Directories

### [server](./server)

This where the server side logic lives i.e. implements the geyser-plugin-interface, wires up the gRPC service, and manages connections.
Note, what accounts are streamed is based on the configuration of the plugin via a [config json file](./server/example-config.json).

#### API

The following functions are exposed for clients to use. See **[geyser.proto](./proto/proto/geyser.proto)** for more details.

##### get_heartbeat_interval

Returns the server's configured heartbeat interval. Clients should consider the server unhealthy if some N consecutive heartbeats are missed.

##### subscribe_account_updates

Subscribe to this endpoint if you're interested in receiving the entire account payload including the account's data bytes.

##### subscribe_partial_account_updates

This endpoint streams account updates similar to `subscribe_account_updates` except consuming much less bandwidth. You may want to
use this when you only care to be notified when an account is updated and don't necessarily care to what the actual state transition was.

##### subscribe_slot_updates

Notifies subscribers of slot state transitions i.e. processed, confirmed, rooted.

#### Necessary Assumptions

The following assumptions __must__ be made:

* Clients may receive data for slots out of order.
* Clients may receive account updates for a given slot out of order.

### [proto](./proto)

Contains the protobuf API definitions.

### [client](./client)

A simple gRPC client wrapper that takes an opinionated approach to how account updates shall be consumed.
Clients using this consumer can expect the following:

1. Account updates will be streamed in monotonically; i.e. updates for older slots are discarded in the event that they were streamed by the server late.
2. Account updates received out of order will trigger an error.

### Helper Scripts

For your convenience:

* Run `./s` script to rsync to a server.
* Run `./f` to build the binary within a container and spit out to a `container-output` folder.
* Run `./f jito-solana` if you plan on running it with a `jito-solana` node.
  - Be sure to use the same `rustc` version used to build your RPC node as was used to build this.
