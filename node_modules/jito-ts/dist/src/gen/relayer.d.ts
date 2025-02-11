import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientReadableStream,
  ClientUnaryCall,
  handleServerStreamingCall,
  handleUnaryCall,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import * as _m0 from 'protobufjs/minimal';
import {PacketBatch} from './packet';
import {Header, Heartbeat, Socket} from './shared';
export declare const protobufPackage = 'relayer';
export interface GetTpuConfigsRequest {}
export interface GetTpuConfigsResponse {
  tpu: Socket | undefined;
  tpuForward: Socket | undefined;
}
export interface SubscribePacketsRequest {}
export interface SubscribePacketsResponse {
  header: Header | undefined;
  heartbeat?: Heartbeat | undefined;
  batch?: PacketBatch | undefined;
}
export declare const GetTpuConfigsRequest: {
  encode(_: GetTpuConfigsRequest, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): GetTpuConfigsRequest;
  fromJSON(_: any): GetTpuConfigsRequest;
  toJSON(_: GetTpuConfigsRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): GetTpuConfigsRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): GetTpuConfigsRequest;
};
export declare const GetTpuConfigsResponse: {
  encode(message: GetTpuConfigsResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetTpuConfigsResponse;
  fromJSON(object: any): GetTpuConfigsResponse;
  toJSON(message: GetTpuConfigsResponse): unknown;
  create<
    I extends {
      tpu?:
        | {
            ip?: string | undefined;
            port?: number | undefined;
          }
        | undefined;
      tpuForward?:
        | {
            ip?: string | undefined;
            port?: number | undefined;
          }
        | undefined;
    } & {
      tpu?:
        | ({
            ip?: string | undefined;
            port?: number | undefined;
          } & {
            ip?: string | undefined;
            port?: number | undefined;
          } & {[K in Exclude<keyof I['tpu'], keyof Socket>]: never})
        | undefined;
      tpuForward?:
        | ({
            ip?: string | undefined;
            port?: number | undefined;
          } & {
            ip?: string | undefined;
            port?: number | undefined;
          } & {[K_1 in Exclude<keyof I['tpuForward'], keyof Socket>]: never})
        | undefined;
    } & {[K_2 in Exclude<keyof I, keyof GetTpuConfigsResponse>]: never}
  >(
    base?: I | undefined
  ): GetTpuConfigsResponse;
  fromPartial<
    I_1 extends {
      tpu?:
        | {
            ip?: string | undefined;
            port?: number | undefined;
          }
        | undefined;
      tpuForward?:
        | {
            ip?: string | undefined;
            port?: number | undefined;
          }
        | undefined;
    } & {
      tpu?:
        | ({
            ip?: string | undefined;
            port?: number | undefined;
          } & {
            ip?: string | undefined;
            port?: number | undefined;
          } & {[K_3 in Exclude<keyof I_1['tpu'], keyof Socket>]: never})
        | undefined;
      tpuForward?:
        | ({
            ip?: string | undefined;
            port?: number | undefined;
          } & {
            ip?: string | undefined;
            port?: number | undefined;
          } & {[K_4 in Exclude<keyof I_1['tpuForward'], keyof Socket>]: never})
        | undefined;
    } & {[K_5 in Exclude<keyof I_1, keyof GetTpuConfigsResponse>]: never}
  >(
    object: I_1
  ): GetTpuConfigsResponse;
};
export declare const SubscribePacketsRequest: {
  encode(_: SubscribePacketsRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubscribePacketsRequest;
  fromJSON(_: any): SubscribePacketsRequest;
  toJSON(_: SubscribePacketsRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): SubscribePacketsRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): SubscribePacketsRequest;
};
export declare const SubscribePacketsResponse: {
  encode(message: SubscribePacketsResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubscribePacketsResponse;
  fromJSON(object: any): SubscribePacketsResponse;
  toJSON(message: SubscribePacketsResponse): unknown;
  create<
    I extends {
      header?:
        | {
            ts?: Date | undefined;
          }
        | undefined;
      heartbeat?:
        | {
            count?: number | undefined;
          }
        | undefined;
      batch?:
        | {
            packets?:
              | {
                  data?: Uint8Array | undefined;
                  meta?:
                    | {
                        size?: number | undefined;
                        addr?: string | undefined;
                        port?: number | undefined;
                        flags?:
                          | {
                              discard?: boolean | undefined;
                              forwarded?: boolean | undefined;
                              repair?: boolean | undefined;
                              simpleVoteTx?: boolean | undefined;
                              tracerPacket?: boolean | undefined;
                            }
                          | undefined;
                        senderStake?: number | undefined;
                      }
                    | undefined;
                }[]
              | undefined;
          }
        | undefined;
    } & {
      header?:
        | ({
            ts?: Date | undefined;
          } & {
            ts?: Date | undefined;
          } & {[K in Exclude<keyof I['header'], 'ts'>]: never})
        | undefined;
      heartbeat?:
        | ({
            count?: number | undefined;
          } & {
            count?: number | undefined;
          } & {[K_1 in Exclude<keyof I['heartbeat'], 'count'>]: never})
        | undefined;
      batch?:
        | ({
            packets?:
              | {
                  data?: Uint8Array | undefined;
                  meta?:
                    | {
                        size?: number | undefined;
                        addr?: string | undefined;
                        port?: number | undefined;
                        flags?:
                          | {
                              discard?: boolean | undefined;
                              forwarded?: boolean | undefined;
                              repair?: boolean | undefined;
                              simpleVoteTx?: boolean | undefined;
                              tracerPacket?: boolean | undefined;
                            }
                          | undefined;
                        senderStake?: number | undefined;
                      }
                    | undefined;
                }[]
              | undefined;
          } & {
            packets?:
              | ({
                  data?: Uint8Array | undefined;
                  meta?:
                    | {
                        size?: number | undefined;
                        addr?: string | undefined;
                        port?: number | undefined;
                        flags?:
                          | {
                              discard?: boolean | undefined;
                              forwarded?: boolean | undefined;
                              repair?: boolean | undefined;
                              simpleVoteTx?: boolean | undefined;
                              tracerPacket?: boolean | undefined;
                            }
                          | undefined;
                        senderStake?: number | undefined;
                      }
                    | undefined;
                }[] &
                  ({
                    data?: Uint8Array | undefined;
                    meta?:
                      | {
                          size?: number | undefined;
                          addr?: string | undefined;
                          port?: number | undefined;
                          flags?:
                            | {
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              }
                            | undefined;
                          senderStake?: number | undefined;
                        }
                      | undefined;
                  } & {
                    data?: Uint8Array | undefined;
                    meta?:
                      | ({
                          size?: number | undefined;
                          addr?: string | undefined;
                          port?: number | undefined;
                          flags?:
                            | {
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              }
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          size?: number | undefined;
                          addr?: string | undefined;
                          port?: number | undefined;
                          flags?:
                            | ({
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              } & {
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              } & {
                                [K_2 in Exclude<
                                  keyof I['batch']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_3 in Exclude<
                            keyof I['batch']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_4 in Exclude<
                      keyof I['batch']['packets'][number],
                      keyof import('./packet').Packet
                    >]: never;
                  })[] & {
                    [K_5 in Exclude<
                      keyof I['batch']['packets'],
                      keyof {
                        data?: Uint8Array | undefined;
                        meta?:
                          | {
                              size?: number | undefined;
                              addr?: string | undefined;
                              port?: number | undefined;
                              flags?:
                                | {
                                    discard?: boolean | undefined;
                                    forwarded?: boolean | undefined;
                                    repair?: boolean | undefined;
                                    simpleVoteTx?: boolean | undefined;
                                    tracerPacket?: boolean | undefined;
                                  }
                                | undefined;
                              senderStake?: number | undefined;
                            }
                          | undefined;
                      }[]
                    >]: never;
                  })
              | undefined;
          } & {[K_6 in Exclude<keyof I['batch'], 'packets'>]: never})
        | undefined;
    } & {[K_7 in Exclude<keyof I, keyof SubscribePacketsResponse>]: never}
  >(
    base?: I | undefined
  ): SubscribePacketsResponse;
  fromPartial<
    I_1 extends {
      header?:
        | {
            ts?: Date | undefined;
          }
        | undefined;
      heartbeat?:
        | {
            count?: number | undefined;
          }
        | undefined;
      batch?:
        | {
            packets?:
              | {
                  data?: Uint8Array | undefined;
                  meta?:
                    | {
                        size?: number | undefined;
                        addr?: string | undefined;
                        port?: number | undefined;
                        flags?:
                          | {
                              discard?: boolean | undefined;
                              forwarded?: boolean | undefined;
                              repair?: boolean | undefined;
                              simpleVoteTx?: boolean | undefined;
                              tracerPacket?: boolean | undefined;
                            }
                          | undefined;
                        senderStake?: number | undefined;
                      }
                    | undefined;
                }[]
              | undefined;
          }
        | undefined;
    } & {
      header?:
        | ({
            ts?: Date | undefined;
          } & {
            ts?: Date | undefined;
          } & {[K_8 in Exclude<keyof I_1['header'], 'ts'>]: never})
        | undefined;
      heartbeat?:
        | ({
            count?: number | undefined;
          } & {
            count?: number | undefined;
          } & {[K_9 in Exclude<keyof I_1['heartbeat'], 'count'>]: never})
        | undefined;
      batch?:
        | ({
            packets?:
              | {
                  data?: Uint8Array | undefined;
                  meta?:
                    | {
                        size?: number | undefined;
                        addr?: string | undefined;
                        port?: number | undefined;
                        flags?:
                          | {
                              discard?: boolean | undefined;
                              forwarded?: boolean | undefined;
                              repair?: boolean | undefined;
                              simpleVoteTx?: boolean | undefined;
                              tracerPacket?: boolean | undefined;
                            }
                          | undefined;
                        senderStake?: number | undefined;
                      }
                    | undefined;
                }[]
              | undefined;
          } & {
            packets?:
              | ({
                  data?: Uint8Array | undefined;
                  meta?:
                    | {
                        size?: number | undefined;
                        addr?: string | undefined;
                        port?: number | undefined;
                        flags?:
                          | {
                              discard?: boolean | undefined;
                              forwarded?: boolean | undefined;
                              repair?: boolean | undefined;
                              simpleVoteTx?: boolean | undefined;
                              tracerPacket?: boolean | undefined;
                            }
                          | undefined;
                        senderStake?: number | undefined;
                      }
                    | undefined;
                }[] &
                  ({
                    data?: Uint8Array | undefined;
                    meta?:
                      | {
                          size?: number | undefined;
                          addr?: string | undefined;
                          port?: number | undefined;
                          flags?:
                            | {
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              }
                            | undefined;
                          senderStake?: number | undefined;
                        }
                      | undefined;
                  } & {
                    data?: Uint8Array | undefined;
                    meta?:
                      | ({
                          size?: number | undefined;
                          addr?: string | undefined;
                          port?: number | undefined;
                          flags?:
                            | {
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              }
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          size?: number | undefined;
                          addr?: string | undefined;
                          port?: number | undefined;
                          flags?:
                            | ({
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              } & {
                                discard?: boolean | undefined;
                                forwarded?: boolean | undefined;
                                repair?: boolean | undefined;
                                simpleVoteTx?: boolean | undefined;
                                tracerPacket?: boolean | undefined;
                              } & {
                                [K_10 in Exclude<
                                  keyof I_1['batch']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_11 in Exclude<
                            keyof I_1['batch']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_12 in Exclude<
                      keyof I_1['batch']['packets'][number],
                      keyof import('./packet').Packet
                    >]: never;
                  })[] & {
                    [K_13 in Exclude<
                      keyof I_1['batch']['packets'],
                      keyof {
                        data?: Uint8Array | undefined;
                        meta?:
                          | {
                              size?: number | undefined;
                              addr?: string | undefined;
                              port?: number | undefined;
                              flags?:
                                | {
                                    discard?: boolean | undefined;
                                    forwarded?: boolean | undefined;
                                    repair?: boolean | undefined;
                                    simpleVoteTx?: boolean | undefined;
                                    tracerPacket?: boolean | undefined;
                                  }
                                | undefined;
                              senderStake?: number | undefined;
                            }
                          | undefined;
                      }[]
                    >]: never;
                  })
              | undefined;
          } & {[K_14 in Exclude<keyof I_1['batch'], 'packets'>]: never})
        | undefined;
    } & {[K_15 in Exclude<keyof I_1, keyof SubscribePacketsResponse>]: never}
  >(
    object: I_1
  ): SubscribePacketsResponse;
};
/**
 * / Relayers offer a TPU and TPU forward proxy for Solana validators.
 * / Validators can connect and fetch the TPU configuration for the relayer and start to advertise the
 * / relayer's information in gossip.
 * / They can also subscribe to packets which arrived on the TPU ports at the relayer
 */
export type RelayerService = typeof RelayerService;
export declare const RelayerService: {
  /**
   * The relayer has TPU and TPU forward sockets that validators can leverage.
   * A validator can fetch this config and change its TPU and TPU forward port in gossip.
   */
  readonly getTpuConfigs: {
    readonly path: '/relayer.Relayer/GetTpuConfigs';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: GetTpuConfigsRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => GetTpuConfigsRequest;
    readonly responseSerialize: (value: GetTpuConfigsResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => GetTpuConfigsResponse;
  };
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats
   */
  readonly subscribePackets: {
    readonly path: '/relayer.Relayer/SubscribePackets';
    readonly requestStream: false;
    readonly responseStream: true;
    readonly requestSerialize: (value: SubscribePacketsRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => SubscribePacketsRequest;
    readonly responseSerialize: (value: SubscribePacketsResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => SubscribePacketsResponse;
  };
};
export interface RelayerServer extends UntypedServiceImplementation {
  /**
   * The relayer has TPU and TPU forward sockets that validators can leverage.
   * A validator can fetch this config and change its TPU and TPU forward port in gossip.
   */
  getTpuConfigs: handleUnaryCall<GetTpuConfigsRequest, GetTpuConfigsResponse>;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats
   */
  subscribePackets: handleServerStreamingCall<
    SubscribePacketsRequest,
    SubscribePacketsResponse
  >;
}
export interface RelayerClient extends Client {
  /**
   * The relayer has TPU and TPU forward sockets that validators can leverage.
   * A validator can fetch this config and change its TPU and TPU forward port in gossip.
   */
  getTpuConfigs(
    request: GetTpuConfigsRequest,
    callback: (
      error: ServiceError | null,
      response: GetTpuConfigsResponse
    ) => void
  ): ClientUnaryCall;
  getTpuConfigs(
    request: GetTpuConfigsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetTpuConfigsResponse
    ) => void
  ): ClientUnaryCall;
  getTpuConfigs(
    request: GetTpuConfigsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetTpuConfigsResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats
   */
  subscribePackets(
    request: SubscribePacketsRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<SubscribePacketsResponse>;
  subscribePackets(
    request: SubscribePacketsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<SubscribePacketsResponse>;
}
export declare const RelayerClient: {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>
  ): RelayerClient;
  service: typeof RelayerService;
};
type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & {
      [K in keyof P]: Exact<P[K], I[K]>;
    } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };
export {};
