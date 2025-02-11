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
import {Bundle, BundleResult} from './bundle';
import {Packet} from './packet';
export declare const protobufPackage = 'searcher';
export interface SlotList {
  slots: number[];
}
export interface SendBundleRequest {
  bundle: Bundle | undefined;
}
export interface SendBundleResponse {
  /** server uuid for the bundle */
  uuid: string;
}
export interface PendingTxSubscriptionRequest {
  /**
   * list of accounts to subscribe to
   * NOTE: the block-engine will only forward transactions that write lock the provided accounts here.
   */
  accounts: string[];
}
export interface PendingTxNotification {
  /** server-side timestamp the transactions were generated at (for debugging/profiling purposes) */
  serverSideTs: Date | undefined;
  /** expiration time of the packet */
  expirationTime: Date | undefined;
  /** list of pending transactions */
  transactions: Packet[];
}
export interface NextScheduledLeaderRequest {}
export interface NextScheduledLeaderResponse {
  /** the current slot the backend is on */
  currentSlot: number;
  /** the slot and identity of the next leader */
  nextLeaderSlot: number;
  nextLeaderIdentity: string;
}
export interface ConnectedLeadersRequest {}
export interface ConnectedLeadersResponse {
  connectedValidators: {
    [key: string]: SlotList;
  };
}
export interface ConnectedLeadersResponse_ConnectedValidatorsEntry {
  key: string;
  value: SlotList | undefined;
}
export interface GetTipAccountsRequest {}
export interface GetTipAccountsResponse {
  accounts: string[];
}
export interface SubscribeBundleResultsRequest {}
export declare const SlotList: {
  encode(message: SlotList, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): SlotList;
  fromJSON(object: any): SlotList;
  toJSON(message: SlotList): unknown;
  create<
    I extends {
      slots?: number[] | undefined;
    } & {
      slots?:
        | (number[] &
            number[] & {
              [K in Exclude<keyof I['slots'], keyof number[]>]: never;
            })
        | undefined;
    } & {[K_1 in Exclude<keyof I, 'slots'>]: never}
  >(
    base?: I | undefined
  ): SlotList;
  fromPartial<
    I_1 extends {
      slots?: number[] | undefined;
    } & {
      slots?:
        | (number[] &
            number[] & {
              [K_2 in Exclude<keyof I_1['slots'], keyof number[]>]: never;
            })
        | undefined;
    } & {[K_3 in Exclude<keyof I_1, 'slots'>]: never}
  >(
    object: I_1
  ): SlotList;
};
export declare const SendBundleRequest: {
  encode(message: SendBundleRequest, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): SendBundleRequest;
  fromJSON(object: any): SendBundleRequest;
  toJSON(message: SendBundleRequest): unknown;
  create<
    I extends {
      bundle?:
        | {
            header?:
              | {
                  ts?: Date | undefined;
                }
              | undefined;
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
      bundle?:
        | ({
            header?:
              | {
                  ts?: Date | undefined;
                }
              | undefined;
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
            header?:
              | ({
                  ts?: Date | undefined;
                } & {
                  ts?: Date | undefined;
                } & {[K in Exclude<keyof I['bundle']['header'], 'ts'>]: never})
              | undefined;
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
                                [K_1 in Exclude<
                                  keyof I['bundle']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_2 in Exclude<
                            keyof I['bundle']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_3 in Exclude<
                      keyof I['bundle']['packets'][number],
                      keyof Packet
                    >]: never;
                  })[] & {
                    [K_4 in Exclude<
                      keyof I['bundle']['packets'],
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
          } & {[K_5 in Exclude<keyof I['bundle'], keyof Bundle>]: never})
        | undefined;
    } & {[K_6 in Exclude<keyof I, 'bundle'>]: never}
  >(
    base?: I | undefined
  ): SendBundleRequest;
  fromPartial<
    I_1 extends {
      bundle?:
        | {
            header?:
              | {
                  ts?: Date | undefined;
                }
              | undefined;
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
      bundle?:
        | ({
            header?:
              | {
                  ts?: Date | undefined;
                }
              | undefined;
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
            header?:
              | ({
                  ts?: Date | undefined;
                } & {
                  ts?: Date | undefined;
                } & {
                  [K_7 in Exclude<keyof I_1['bundle']['header'], 'ts'>]: never;
                })
              | undefined;
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
                                [K_8 in Exclude<
                                  keyof I_1['bundle']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_9 in Exclude<
                            keyof I_1['bundle']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_10 in Exclude<
                      keyof I_1['bundle']['packets'][number],
                      keyof Packet
                    >]: never;
                  })[] & {
                    [K_11 in Exclude<
                      keyof I_1['bundle']['packets'],
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
          } & {[K_12 in Exclude<keyof I_1['bundle'], keyof Bundle>]: never})
        | undefined;
    } & {[K_13 in Exclude<keyof I_1, 'bundle'>]: never}
  >(
    object: I_1
  ): SendBundleRequest;
};
export declare const SendBundleResponse: {
  encode(message: SendBundleResponse, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): SendBundleResponse;
  fromJSON(object: any): SendBundleResponse;
  toJSON(message: SendBundleResponse): unknown;
  create<
    I extends {
      uuid?: string | undefined;
    } & {
      uuid?: string | undefined;
    } & {[K in Exclude<keyof I, 'uuid'>]: never}
  >(
    base?: I | undefined
  ): SendBundleResponse;
  fromPartial<
    I_1 extends {
      uuid?: string | undefined;
    } & {
      uuid?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, 'uuid'>]: never}
  >(
    object: I_1
  ): SendBundleResponse;
};
export declare const PendingTxSubscriptionRequest: {
  encode(
    message: PendingTxSubscriptionRequest,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): PendingTxSubscriptionRequest;
  fromJSON(object: any): PendingTxSubscriptionRequest;
  toJSON(message: PendingTxSubscriptionRequest): unknown;
  create<
    I extends {
      accounts?: string[] | undefined;
    } & {
      accounts?:
        | (string[] &
            string[] & {
              [K in Exclude<keyof I['accounts'], keyof string[]>]: never;
            })
        | undefined;
    } & {[K_1 in Exclude<keyof I, 'accounts'>]: never}
  >(
    base?: I | undefined
  ): PendingTxSubscriptionRequest;
  fromPartial<
    I_1 extends {
      accounts?: string[] | undefined;
    } & {
      accounts?:
        | (string[] &
            string[] & {
              [K_2 in Exclude<keyof I_1['accounts'], keyof string[]>]: never;
            })
        | undefined;
    } & {[K_3 in Exclude<keyof I_1, 'accounts'>]: never}
  >(
    object: I_1
  ): PendingTxSubscriptionRequest;
};
export declare const PendingTxNotification: {
  encode(message: PendingTxNotification, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): PendingTxNotification;
  fromJSON(object: any): PendingTxNotification;
  toJSON(message: PendingTxNotification): unknown;
  create<
    I extends {
      serverSideTs?: Date | undefined;
      expirationTime?: Date | undefined;
      transactions?:
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
      serverSideTs?: Date | undefined;
      expirationTime?: Date | undefined;
      transactions?:
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
                          [K in Exclude<
                            keyof I['transactions'][number]['meta']['flags'],
                            keyof import('./packet').PacketFlags
                          >]: never;
                        })
                      | undefined;
                    senderStake?: number | undefined;
                  } & {
                    [K_1 in Exclude<
                      keyof I['transactions'][number]['meta'],
                      keyof import('./packet').Meta
                    >]: never;
                  })
                | undefined;
            } & {
              [K_2 in Exclude<
                keyof I['transactions'][number],
                keyof Packet
              >]: never;
            })[] & {
              [K_3 in Exclude<
                keyof I['transactions'],
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
    } & {[K_4 in Exclude<keyof I, keyof PendingTxNotification>]: never}
  >(
    base?: I | undefined
  ): PendingTxNotification;
  fromPartial<
    I_1 extends {
      serverSideTs?: Date | undefined;
      expirationTime?: Date | undefined;
      transactions?:
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
      serverSideTs?: Date | undefined;
      expirationTime?: Date | undefined;
      transactions?:
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
                          [K_5 in Exclude<
                            keyof I_1['transactions'][number]['meta']['flags'],
                            keyof import('./packet').PacketFlags
                          >]: never;
                        })
                      | undefined;
                    senderStake?: number | undefined;
                  } & {
                    [K_6 in Exclude<
                      keyof I_1['transactions'][number]['meta'],
                      keyof import('./packet').Meta
                    >]: never;
                  })
                | undefined;
            } & {
              [K_7 in Exclude<
                keyof I_1['transactions'][number],
                keyof Packet
              >]: never;
            })[] & {
              [K_8 in Exclude<
                keyof I_1['transactions'],
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
    } & {[K_9 in Exclude<keyof I_1, keyof PendingTxNotification>]: never}
  >(
    object: I_1
  ): PendingTxNotification;
};
export declare const NextScheduledLeaderRequest: {
  encode(_: NextScheduledLeaderRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): NextScheduledLeaderRequest;
  fromJSON(_: any): NextScheduledLeaderRequest;
  toJSON(_: NextScheduledLeaderRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): NextScheduledLeaderRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): NextScheduledLeaderRequest;
};
export declare const NextScheduledLeaderResponse: {
  encode(message: NextScheduledLeaderResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): NextScheduledLeaderResponse;
  fromJSON(object: any): NextScheduledLeaderResponse;
  toJSON(message: NextScheduledLeaderResponse): unknown;
  create<
    I extends {
      currentSlot?: number | undefined;
      nextLeaderSlot?: number | undefined;
      nextLeaderIdentity?: string | undefined;
    } & {
      currentSlot?: number | undefined;
      nextLeaderSlot?: number | undefined;
      nextLeaderIdentity?: string | undefined;
    } & {[K in Exclude<keyof I, keyof NextScheduledLeaderResponse>]: never}
  >(
    base?: I | undefined
  ): NextScheduledLeaderResponse;
  fromPartial<
    I_1 extends {
      currentSlot?: number | undefined;
      nextLeaderSlot?: number | undefined;
      nextLeaderIdentity?: string | undefined;
    } & {
      currentSlot?: number | undefined;
      nextLeaderSlot?: number | undefined;
      nextLeaderIdentity?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof NextScheduledLeaderResponse>]: never}
  >(
    object: I_1
  ): NextScheduledLeaderResponse;
};
export declare const ConnectedLeadersRequest: {
  encode(_: ConnectedLeadersRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConnectedLeadersRequest;
  fromJSON(_: any): ConnectedLeadersRequest;
  toJSON(_: ConnectedLeadersRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): ConnectedLeadersRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): ConnectedLeadersRequest;
};
export declare const ConnectedLeadersResponse: {
  encode(message: ConnectedLeadersResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConnectedLeadersResponse;
  fromJSON(object: any): ConnectedLeadersResponse;
  toJSON(message: ConnectedLeadersResponse): unknown;
  create<
    I extends {
      connectedValidators?:
        | {
            [x: string]:
              | {
                  slots?: number[] | undefined;
                }
              | undefined;
          }
        | undefined;
    } & {
      connectedValidators?:
        | ({
            [x: string]:
              | {
                  slots?: number[] | undefined;
                }
              | undefined;
          } & {
            [x: string]:
              | ({
                  slots?: number[] | undefined;
                } & {
                  slots?:
                    | (number[] &
                        number[] & {
                          [K in Exclude<
                            keyof I['connectedValidators'][string]['slots'],
                            keyof number[]
                          >]: never;
                        })
                    | undefined;
                } & {
                  [K_1 in Exclude<
                    keyof I['connectedValidators'][string],
                    'slots'
                  >]: never;
                })
              | undefined;
          } & {
            [K_2 in Exclude<
              keyof I['connectedValidators'],
              string | number
            >]: never;
          })
        | undefined;
    } & {[K_3 in Exclude<keyof I, 'connectedValidators'>]: never}
  >(
    base?: I | undefined
  ): ConnectedLeadersResponse;
  fromPartial<
    I_1 extends {
      connectedValidators?:
        | {
            [x: string]:
              | {
                  slots?: number[] | undefined;
                }
              | undefined;
          }
        | undefined;
    } & {
      connectedValidators?:
        | ({
            [x: string]:
              | {
                  slots?: number[] | undefined;
                }
              | undefined;
          } & {
            [x: string]:
              | ({
                  slots?: number[] | undefined;
                } & {
                  slots?:
                    | (number[] &
                        number[] & {
                          [K_4 in Exclude<
                            keyof I_1['connectedValidators'][string]['slots'],
                            keyof number[]
                          >]: never;
                        })
                    | undefined;
                } & {
                  [K_5 in Exclude<
                    keyof I_1['connectedValidators'][string],
                    'slots'
                  >]: never;
                })
              | undefined;
          } & {
            [K_6 in Exclude<
              keyof I_1['connectedValidators'],
              string | number
            >]: never;
          })
        | undefined;
    } & {[K_7 in Exclude<keyof I_1, 'connectedValidators'>]: never}
  >(
    object: I_1
  ): ConnectedLeadersResponse;
};
export declare const ConnectedLeadersResponse_ConnectedValidatorsEntry: {
  encode(
    message: ConnectedLeadersResponse_ConnectedValidatorsEntry,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConnectedLeadersResponse_ConnectedValidatorsEntry;
  fromJSON(object: any): ConnectedLeadersResponse_ConnectedValidatorsEntry;
  toJSON(message: ConnectedLeadersResponse_ConnectedValidatorsEntry): unknown;
  create<
    I extends {
      key?: string | undefined;
      value?:
        | {
            slots?: number[] | undefined;
          }
        | undefined;
    } & {
      key?: string | undefined;
      value?:
        | ({
            slots?: number[] | undefined;
          } & {
            slots?:
              | (number[] &
                  number[] & {
                    [K in Exclude<
                      keyof I['value']['slots'],
                      keyof number[]
                    >]: never;
                  })
              | undefined;
          } & {[K_1 in Exclude<keyof I['value'], 'slots'>]: never})
        | undefined;
    } & {
      [K_2 in Exclude<
        keyof I,
        keyof ConnectedLeadersResponse_ConnectedValidatorsEntry
      >]: never;
    }
  >(
    base?: I | undefined
  ): ConnectedLeadersResponse_ConnectedValidatorsEntry;
  fromPartial<
    I_1 extends {
      key?: string | undefined;
      value?:
        | {
            slots?: number[] | undefined;
          }
        | undefined;
    } & {
      key?: string | undefined;
      value?:
        | ({
            slots?: number[] | undefined;
          } & {
            slots?:
              | (number[] &
                  number[] & {
                    [K_3 in Exclude<
                      keyof I_1['value']['slots'],
                      keyof number[]
                    >]: never;
                  })
              | undefined;
          } & {[K_4 in Exclude<keyof I_1['value'], 'slots'>]: never})
        | undefined;
    } & {
      [K_5 in Exclude<
        keyof I_1,
        keyof ConnectedLeadersResponse_ConnectedValidatorsEntry
      >]: never;
    }
  >(
    object: I_1
  ): ConnectedLeadersResponse_ConnectedValidatorsEntry;
};
export declare const GetTipAccountsRequest: {
  encode(_: GetTipAccountsRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetTipAccountsRequest;
  fromJSON(_: any): GetTipAccountsRequest;
  toJSON(_: GetTipAccountsRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): GetTipAccountsRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): GetTipAccountsRequest;
};
export declare const GetTipAccountsResponse: {
  encode(message: GetTipAccountsResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetTipAccountsResponse;
  fromJSON(object: any): GetTipAccountsResponse;
  toJSON(message: GetTipAccountsResponse): unknown;
  create<
    I extends {
      accounts?: string[] | undefined;
    } & {
      accounts?:
        | (string[] &
            string[] & {
              [K in Exclude<keyof I['accounts'], keyof string[]>]: never;
            })
        | undefined;
    } & {[K_1 in Exclude<keyof I, 'accounts'>]: never}
  >(
    base?: I | undefined
  ): GetTipAccountsResponse;
  fromPartial<
    I_1 extends {
      accounts?: string[] | undefined;
    } & {
      accounts?:
        | (string[] &
            string[] & {
              [K_2 in Exclude<keyof I_1['accounts'], keyof string[]>]: never;
            })
        | undefined;
    } & {[K_3 in Exclude<keyof I_1, 'accounts'>]: never}
  >(
    object: I_1
  ): GetTipAccountsResponse;
};
export declare const SubscribeBundleResultsRequest: {
  encode(_: SubscribeBundleResultsRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubscribeBundleResultsRequest;
  fromJSON(_: any): SubscribeBundleResultsRequest;
  toJSON(_: SubscribeBundleResultsRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): SubscribeBundleResultsRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): SubscribeBundleResultsRequest;
};
export type SearcherServiceService = typeof SearcherServiceService;
export declare const SearcherServiceService: {
  /**
   * Searchers can invoke this endpoint to subscribe to their respective bundle results.
   * A success result would indicate the bundle won its state auction and was submitted to the validator.
   */
  readonly subscribeBundleResults: {
    readonly path: '/searcher.SearcherService/SubscribeBundleResults';
    readonly requestStream: false;
    readonly responseStream: true;
    readonly requestSerialize: (value: SubscribeBundleResultsRequest) => Buffer;
    readonly requestDeserialize: (
      value: Buffer
    ) => SubscribeBundleResultsRequest;
    readonly responseSerialize: (value: BundleResult) => Buffer;
    readonly responseDeserialize: (value: Buffer) => BundleResult;
  };
  /**
   * RPC endpoint to subscribe to pending transactions. Clients can provide a list of base58 encoded accounts.
   * Any transactions that write-lock the provided accounts will be streamed to the searcher.
   */
  readonly subscribePendingTransactions: {
    readonly path: '/searcher.SearcherService/SubscribePendingTransactions';
    readonly requestStream: false;
    readonly responseStream: true;
    readonly requestSerialize: (value: PendingTxSubscriptionRequest) => Buffer;
    readonly requestDeserialize: (
      value: Buffer
    ) => PendingTxSubscriptionRequest;
    readonly responseSerialize: (value: PendingTxNotification) => Buffer;
    readonly responseDeserialize: (value: Buffer) => PendingTxNotification;
  };
  readonly sendBundle: {
    readonly path: '/searcher.SearcherService/SendBundle';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: SendBundleRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => SendBundleRequest;
    readonly responseSerialize: (value: SendBundleResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => SendBundleResponse;
  };
  /** Returns the next scheduled leader connected to the block engine. */
  readonly getNextScheduledLeader: {
    readonly path: '/searcher.SearcherService/GetNextScheduledLeader';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: NextScheduledLeaderRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => NextScheduledLeaderRequest;
    readonly responseSerialize: (value: NextScheduledLeaderResponse) => Buffer;
    readonly responseDeserialize: (
      value: Buffer
    ) => NextScheduledLeaderResponse;
  };
  /** Returns information on connected leader slots */
  readonly getConnectedLeaders: {
    readonly path: '/searcher.SearcherService/GetConnectedLeaders';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: ConnectedLeadersRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => ConnectedLeadersRequest;
    readonly responseSerialize: (value: ConnectedLeadersResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => ConnectedLeadersResponse;
  };
  /** Returns the tip accounts searchers shall transfer funds to for the leader to claim. */
  readonly getTipAccounts: {
    readonly path: '/searcher.SearcherService/GetTipAccounts';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: GetTipAccountsRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => GetTipAccountsRequest;
    readonly responseSerialize: (value: GetTipAccountsResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => GetTipAccountsResponse;
  };
};
export interface SearcherServiceServer extends UntypedServiceImplementation {
  /**
   * Searchers can invoke this endpoint to subscribe to their respective bundle results.
   * A success result would indicate the bundle won its state auction and was submitted to the validator.
   */
  subscribeBundleResults: handleServerStreamingCall<
    SubscribeBundleResultsRequest,
    BundleResult
  >;
  /**
   * RPC endpoint to subscribe to pending transactions. Clients can provide a list of base58 encoded accounts.
   * Any transactions that write-lock the provided accounts will be streamed to the searcher.
   */
  subscribePendingTransactions: handleServerStreamingCall<
    PendingTxSubscriptionRequest,
    PendingTxNotification
  >;
  sendBundle: handleUnaryCall<SendBundleRequest, SendBundleResponse>;
  /** Returns the next scheduled leader connected to the block engine. */
  getNextScheduledLeader: handleUnaryCall<
    NextScheduledLeaderRequest,
    NextScheduledLeaderResponse
  >;
  /** Returns information on connected leader slots */
  getConnectedLeaders: handleUnaryCall<
    ConnectedLeadersRequest,
    ConnectedLeadersResponse
  >;
  /** Returns the tip accounts searchers shall transfer funds to for the leader to claim. */
  getTipAccounts: handleUnaryCall<
    GetTipAccountsRequest,
    GetTipAccountsResponse
  >;
}
export interface SearcherServiceClient extends Client {
  /**
   * Searchers can invoke this endpoint to subscribe to their respective bundle results.
   * A success result would indicate the bundle won its state auction and was submitted to the validator.
   */
  subscribeBundleResults(
    request: SubscribeBundleResultsRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<BundleResult>;
  subscribeBundleResults(
    request: SubscribeBundleResultsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<BundleResult>;
  /**
   * RPC endpoint to subscribe to pending transactions. Clients can provide a list of base58 encoded accounts.
   * Any transactions that write-lock the provided accounts will be streamed to the searcher.
   */
  subscribePendingTransactions(
    request: PendingTxSubscriptionRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<PendingTxNotification>;
  subscribePendingTransactions(
    request: PendingTxSubscriptionRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<PendingTxNotification>;
  sendBundle(
    request: SendBundleRequest,
    callback: (error: ServiceError | null, response: SendBundleResponse) => void
  ): ClientUnaryCall;
  sendBundle(
    request: SendBundleRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: SendBundleResponse) => void
  ): ClientUnaryCall;
  sendBundle(
    request: SendBundleRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: SendBundleResponse) => void
  ): ClientUnaryCall;
  /** Returns the next scheduled leader connected to the block engine. */
  getNextScheduledLeader(
    request: NextScheduledLeaderRequest,
    callback: (
      error: ServiceError | null,
      response: NextScheduledLeaderResponse
    ) => void
  ): ClientUnaryCall;
  getNextScheduledLeader(
    request: NextScheduledLeaderRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: NextScheduledLeaderResponse
    ) => void
  ): ClientUnaryCall;
  getNextScheduledLeader(
    request: NextScheduledLeaderRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: NextScheduledLeaderResponse
    ) => void
  ): ClientUnaryCall;
  /** Returns information on connected leader slots */
  getConnectedLeaders(
    request: ConnectedLeadersRequest,
    callback: (
      error: ServiceError | null,
      response: ConnectedLeadersResponse
    ) => void
  ): ClientUnaryCall;
  getConnectedLeaders(
    request: ConnectedLeadersRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ConnectedLeadersResponse
    ) => void
  ): ClientUnaryCall;
  getConnectedLeaders(
    request: ConnectedLeadersRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ConnectedLeadersResponse
    ) => void
  ): ClientUnaryCall;
  /** Returns the tip accounts searchers shall transfer funds to for the leader to claim. */
  getTipAccounts(
    request: GetTipAccountsRequest,
    callback: (
      error: ServiceError | null,
      response: GetTipAccountsResponse
    ) => void
  ): ClientUnaryCall;
  getTipAccounts(
    request: GetTipAccountsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetTipAccountsResponse
    ) => void
  ): ClientUnaryCall;
  getTipAccounts(
    request: GetTipAccountsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetTipAccountsResponse
    ) => void
  ): ClientUnaryCall;
}
export declare const SearcherServiceClient: {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>
  ): SearcherServiceClient;
  service: typeof SearcherServiceService;
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
