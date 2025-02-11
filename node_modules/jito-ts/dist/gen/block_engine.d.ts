import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientDuplexStream,
  ClientOptions,
  ClientReadableStream,
  ClientUnaryCall,
  handleBidiStreamingCall,
  handleServerStreamingCall,
  handleUnaryCall,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import * as _m0 from 'protobufjs/minimal';
import {BundleUuid} from './bundle';
import {PacketBatch} from './packet';
import {Header, Heartbeat} from './shared';
export declare const protobufPackage = 'block_engine';
export interface SubscribePacketsRequest {}
export interface SubscribePacketsResponse {
  header: Header | undefined;
  batch: PacketBatch | undefined;
}
export interface SubscribeBundlesRequest {}
export interface SubscribeBundlesResponse {
  bundles: BundleUuid[];
}
export interface BlockBuilderFeeInfoRequest {}
export interface BlockBuilderFeeInfoResponse {
  pubkey: string;
  /** commission (0-100) */
  commission: number;
}
export interface AccountsOfInterest {
  /** use * for all accounts */
  accounts: string[];
}
export interface AccountsOfInterestRequest {}
export interface AccountsOfInterestUpdate {
  accounts: string[];
}
/**
 * A series of packets with an expiration attached to them.
 * The header contains a timestamp for when this packet was generated.
 * The expiry is how long the packet batches have before they expire and are forwarded to the validator.
 * This provides a more censorship resistant method to MEV than block engines receiving packets directly.
 */
export interface ExpiringPacketBatch {
  header: Header | undefined;
  batch: PacketBatch | undefined;
  expiryMs: number;
}
/**
 * Packets and heartbeats are sent over the same stream.
 * ExpiringPacketBatches have an expiration attached to them so the block engine can track
 * how long it has until the relayer forwards the packets to the validator.
 * Heartbeats contain a timestamp from the system and is used as a simple and naive time-sync mechanism
 * so the block engine has some idea on how far their clocks are apart.
 */
export interface PacketBatchUpdate {
  batches?: ExpiringPacketBatch | undefined;
  heartbeat?: Heartbeat | undefined;
}
export interface StartExpiringPacketStreamResponse {
  heartbeat: Heartbeat | undefined;
}
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
                                [K_1 in Exclude<
                                  keyof I['batch']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_2 in Exclude<
                            keyof I['batch']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_3 in Exclude<
                      keyof I['batch']['packets'][number],
                      keyof import('./packet').Packet
                    >]: never;
                  })[] & {
                    [K_4 in Exclude<
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
          } & {[K_5 in Exclude<keyof I['batch'], 'packets'>]: never})
        | undefined;
    } & {[K_6 in Exclude<keyof I, keyof SubscribePacketsResponse>]: never}
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
          } & {[K_7 in Exclude<keyof I_1['header'], 'ts'>]: never})
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
                                [K_8 in Exclude<
                                  keyof I_1['batch']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_9 in Exclude<
                            keyof I_1['batch']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_10 in Exclude<
                      keyof I_1['batch']['packets'][number],
                      keyof import('./packet').Packet
                    >]: never;
                  })[] & {
                    [K_11 in Exclude<
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
          } & {[K_12 in Exclude<keyof I_1['batch'], 'packets'>]: never})
        | undefined;
    } & {[K_13 in Exclude<keyof I_1, keyof SubscribePacketsResponse>]: never}
  >(
    object: I_1
  ): SubscribePacketsResponse;
};
export declare const SubscribeBundlesRequest: {
  encode(_: SubscribeBundlesRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubscribeBundlesRequest;
  fromJSON(_: any): SubscribeBundlesRequest;
  toJSON(_: SubscribeBundlesRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): SubscribeBundlesRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): SubscribeBundlesRequest;
};
export declare const SubscribeBundlesResponse: {
  encode(message: SubscribeBundlesResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SubscribeBundlesResponse;
  fromJSON(object: any): SubscribeBundlesResponse;
  toJSON(message: SubscribeBundlesResponse): unknown;
  create<
    I extends {
      bundles?:
        | {
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
            uuid?: string | undefined;
          }[]
        | undefined;
    } & {
      bundles?:
        | ({
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
            uuid?: string | undefined;
          }[] &
            ({
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
              uuid?: string | undefined;
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
                          [K in Exclude<
                            keyof I['bundles'][number]['bundle']['header'],
                            'ts'
                          >]: never;
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
                                        [K_1 in Exclude<
                                          keyof I['bundles'][number]['bundle']['packets'][number]['meta']['flags'],
                                          keyof import('./packet').PacketFlags
                                        >]: never;
                                      })
                                    | undefined;
                                  senderStake?: number | undefined;
                                } & {
                                  [K_2 in Exclude<
                                    keyof I['bundles'][number]['bundle']['packets'][number]['meta'],
                                    keyof import('./packet').Meta
                                  >]: never;
                                })
                              | undefined;
                          } & {
                            [K_3 in Exclude<
                              keyof I['bundles'][number]['bundle']['packets'][number],
                              keyof import('./packet').Packet
                            >]: never;
                          })[] & {
                            [K_4 in Exclude<
                              keyof I['bundles'][number]['bundle']['packets'],
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
                  } & {
                    [K_5 in Exclude<
                      keyof I['bundles'][number]['bundle'],
                      keyof import('./bundle').Bundle
                    >]: never;
                  })
                | undefined;
              uuid?: string | undefined;
            } & {
              [K_6 in Exclude<
                keyof I['bundles'][number],
                keyof BundleUuid
              >]: never;
            })[] & {
              [K_7 in Exclude<
                keyof I['bundles'],
                keyof {
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
                  uuid?: string | undefined;
                }[]
              >]: never;
            })
        | undefined;
    } & {[K_8 in Exclude<keyof I, 'bundles'>]: never}
  >(
    base?: I | undefined
  ): SubscribeBundlesResponse;
  fromPartial<
    I_1 extends {
      bundles?:
        | {
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
            uuid?: string | undefined;
          }[]
        | undefined;
    } & {
      bundles?:
        | ({
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
            uuid?: string | undefined;
          }[] &
            ({
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
              uuid?: string | undefined;
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
                          [K_9 in Exclude<
                            keyof I_1['bundles'][number]['bundle']['header'],
                            'ts'
                          >]: never;
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
                                        [K_10 in Exclude<
                                          keyof I_1['bundles'][number]['bundle']['packets'][number]['meta']['flags'],
                                          keyof import('./packet').PacketFlags
                                        >]: never;
                                      })
                                    | undefined;
                                  senderStake?: number | undefined;
                                } & {
                                  [K_11 in Exclude<
                                    keyof I_1['bundles'][number]['bundle']['packets'][number]['meta'],
                                    keyof import('./packet').Meta
                                  >]: never;
                                })
                              | undefined;
                          } & {
                            [K_12 in Exclude<
                              keyof I_1['bundles'][number]['bundle']['packets'][number],
                              keyof import('./packet').Packet
                            >]: never;
                          })[] & {
                            [K_13 in Exclude<
                              keyof I_1['bundles'][number]['bundle']['packets'],
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
                  } & {
                    [K_14 in Exclude<
                      keyof I_1['bundles'][number]['bundle'],
                      keyof import('./bundle').Bundle
                    >]: never;
                  })
                | undefined;
              uuid?: string | undefined;
            } & {
              [K_15 in Exclude<
                keyof I_1['bundles'][number],
                keyof BundleUuid
              >]: never;
            })[] & {
              [K_16 in Exclude<
                keyof I_1['bundles'],
                keyof {
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
                  uuid?: string | undefined;
                }[]
              >]: never;
            })
        | undefined;
    } & {[K_17 in Exclude<keyof I_1, 'bundles'>]: never}
  >(
    object: I_1
  ): SubscribeBundlesResponse;
};
export declare const BlockBuilderFeeInfoRequest: {
  encode(_: BlockBuilderFeeInfoRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): BlockBuilderFeeInfoRequest;
  fromJSON(_: any): BlockBuilderFeeInfoRequest;
  toJSON(_: BlockBuilderFeeInfoRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): BlockBuilderFeeInfoRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): BlockBuilderFeeInfoRequest;
};
export declare const BlockBuilderFeeInfoResponse: {
  encode(message: BlockBuilderFeeInfoResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): BlockBuilderFeeInfoResponse;
  fromJSON(object: any): BlockBuilderFeeInfoResponse;
  toJSON(message: BlockBuilderFeeInfoResponse): unknown;
  create<
    I extends {
      pubkey?: string | undefined;
      commission?: number | undefined;
    } & {
      pubkey?: string | undefined;
      commission?: number | undefined;
    } & {[K in Exclude<keyof I, keyof BlockBuilderFeeInfoResponse>]: never}
  >(
    base?: I | undefined
  ): BlockBuilderFeeInfoResponse;
  fromPartial<
    I_1 extends {
      pubkey?: string | undefined;
      commission?: number | undefined;
    } & {
      pubkey?: string | undefined;
      commission?: number | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof BlockBuilderFeeInfoResponse>]: never}
  >(
    object: I_1
  ): BlockBuilderFeeInfoResponse;
};
export declare const AccountsOfInterest: {
  encode(message: AccountsOfInterest, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): AccountsOfInterest;
  fromJSON(object: any): AccountsOfInterest;
  toJSON(message: AccountsOfInterest): unknown;
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
  ): AccountsOfInterest;
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
  ): AccountsOfInterest;
};
export declare const AccountsOfInterestRequest: {
  encode(_: AccountsOfInterestRequest, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AccountsOfInterestRequest;
  fromJSON(_: any): AccountsOfInterestRequest;
  toJSON(_: AccountsOfInterestRequest): unknown;
  create<I extends {} & {} & {[K in Exclude<keyof I, never>]: never}>(
    base?: I | undefined
  ): AccountsOfInterestRequest;
  fromPartial<
    I_1 extends {} & {} & {[K_1 in Exclude<keyof I_1, never>]: never}
  >(
    _: I_1
  ): AccountsOfInterestRequest;
};
export declare const AccountsOfInterestUpdate: {
  encode(message: AccountsOfInterestUpdate, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AccountsOfInterestUpdate;
  fromJSON(object: any): AccountsOfInterestUpdate;
  toJSON(message: AccountsOfInterestUpdate): unknown;
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
  ): AccountsOfInterestUpdate;
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
  ): AccountsOfInterestUpdate;
};
export declare const ExpiringPacketBatch: {
  encode(message: ExpiringPacketBatch, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): ExpiringPacketBatch;
  fromJSON(object: any): ExpiringPacketBatch;
  toJSON(message: ExpiringPacketBatch): unknown;
  create<
    I extends {
      header?:
        | {
            ts?: Date | undefined;
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
      expiryMs?: number | undefined;
    } & {
      header?:
        | ({
            ts?: Date | undefined;
          } & {
            ts?: Date | undefined;
          } & {[K in Exclude<keyof I['header'], 'ts'>]: never})
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
                                [K_1 in Exclude<
                                  keyof I['batch']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_2 in Exclude<
                            keyof I['batch']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_3 in Exclude<
                      keyof I['batch']['packets'][number],
                      keyof import('./packet').Packet
                    >]: never;
                  })[] & {
                    [K_4 in Exclude<
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
          } & {[K_5 in Exclude<keyof I['batch'], 'packets'>]: never})
        | undefined;
      expiryMs?: number | undefined;
    } & {[K_6 in Exclude<keyof I, keyof ExpiringPacketBatch>]: never}
  >(
    base?: I | undefined
  ): ExpiringPacketBatch;
  fromPartial<
    I_1 extends {
      header?:
        | {
            ts?: Date | undefined;
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
      expiryMs?: number | undefined;
    } & {
      header?:
        | ({
            ts?: Date | undefined;
          } & {
            ts?: Date | undefined;
          } & {[K_7 in Exclude<keyof I_1['header'], 'ts'>]: never})
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
                                [K_8 in Exclude<
                                  keyof I_1['batch']['packets'][number]['meta']['flags'],
                                  keyof import('./packet').PacketFlags
                                >]: never;
                              })
                            | undefined;
                          senderStake?: number | undefined;
                        } & {
                          [K_9 in Exclude<
                            keyof I_1['batch']['packets'][number]['meta'],
                            keyof import('./packet').Meta
                          >]: never;
                        })
                      | undefined;
                  } & {
                    [K_10 in Exclude<
                      keyof I_1['batch']['packets'][number],
                      keyof import('./packet').Packet
                    >]: never;
                  })[] & {
                    [K_11 in Exclude<
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
          } & {[K_12 in Exclude<keyof I_1['batch'], 'packets'>]: never})
        | undefined;
      expiryMs?: number | undefined;
    } & {[K_13 in Exclude<keyof I_1, keyof ExpiringPacketBatch>]: never}
  >(
    object: I_1
  ): ExpiringPacketBatch;
};
export declare const PacketBatchUpdate: {
  encode(message: PacketBatchUpdate, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): PacketBatchUpdate;
  fromJSON(object: any): PacketBatchUpdate;
  toJSON(message: PacketBatchUpdate): unknown;
  create<
    I extends {
      batches?:
        | {
            header?:
              | {
                  ts?: Date | undefined;
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
            expiryMs?: number | undefined;
          }
        | undefined;
      heartbeat?:
        | {
            count?: number | undefined;
          }
        | undefined;
    } & {
      batches?:
        | ({
            header?:
              | {
                  ts?: Date | undefined;
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
            expiryMs?: number | undefined;
          } & {
            header?:
              | ({
                  ts?: Date | undefined;
                } & {
                  ts?: Date | undefined;
                } & {[K in Exclude<keyof I['batches']['header'], 'ts'>]: never})
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
                                      [K_1 in Exclude<
                                        keyof I['batches']['batch']['packets'][number]['meta']['flags'],
                                        keyof import('./packet').PacketFlags
                                      >]: never;
                                    })
                                  | undefined;
                                senderStake?: number | undefined;
                              } & {
                                [K_2 in Exclude<
                                  keyof I['batches']['batch']['packets'][number]['meta'],
                                  keyof import('./packet').Meta
                                >]: never;
                              })
                            | undefined;
                        } & {
                          [K_3 in Exclude<
                            keyof I['batches']['batch']['packets'][number],
                            keyof import('./packet').Packet
                          >]: never;
                        })[] & {
                          [K_4 in Exclude<
                            keyof I['batches']['batch']['packets'],
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
                } & {
                  [K_5 in Exclude<
                    keyof I['batches']['batch'],
                    'packets'
                  >]: never;
                })
              | undefined;
            expiryMs?: number | undefined;
          } & {
            [K_6 in Exclude<
              keyof I['batches'],
              keyof ExpiringPacketBatch
            >]: never;
          })
        | undefined;
      heartbeat?:
        | ({
            count?: number | undefined;
          } & {
            count?: number | undefined;
          } & {[K_7 in Exclude<keyof I['heartbeat'], 'count'>]: never})
        | undefined;
    } & {[K_8 in Exclude<keyof I, keyof PacketBatchUpdate>]: never}
  >(
    base?: I | undefined
  ): PacketBatchUpdate;
  fromPartial<
    I_1 extends {
      batches?:
        | {
            header?:
              | {
                  ts?: Date | undefined;
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
            expiryMs?: number | undefined;
          }
        | undefined;
      heartbeat?:
        | {
            count?: number | undefined;
          }
        | undefined;
    } & {
      batches?:
        | ({
            header?:
              | {
                  ts?: Date | undefined;
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
            expiryMs?: number | undefined;
          } & {
            header?:
              | ({
                  ts?: Date | undefined;
                } & {
                  ts?: Date | undefined;
                } & {
                  [K_9 in Exclude<keyof I_1['batches']['header'], 'ts'>]: never;
                })
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
                                        keyof I_1['batches']['batch']['packets'][number]['meta']['flags'],
                                        keyof import('./packet').PacketFlags
                                      >]: never;
                                    })
                                  | undefined;
                                senderStake?: number | undefined;
                              } & {
                                [K_11 in Exclude<
                                  keyof I_1['batches']['batch']['packets'][number]['meta'],
                                  keyof import('./packet').Meta
                                >]: never;
                              })
                            | undefined;
                        } & {
                          [K_12 in Exclude<
                            keyof I_1['batches']['batch']['packets'][number],
                            keyof import('./packet').Packet
                          >]: never;
                        })[] & {
                          [K_13 in Exclude<
                            keyof I_1['batches']['batch']['packets'],
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
                } & {
                  [K_14 in Exclude<
                    keyof I_1['batches']['batch'],
                    'packets'
                  >]: never;
                })
              | undefined;
            expiryMs?: number | undefined;
          } & {
            [K_15 in Exclude<
              keyof I_1['batches'],
              keyof ExpiringPacketBatch
            >]: never;
          })
        | undefined;
      heartbeat?:
        | ({
            count?: number | undefined;
          } & {
            count?: number | undefined;
          } & {[K_16 in Exclude<keyof I_1['heartbeat'], 'count'>]: never})
        | undefined;
    } & {[K_17 in Exclude<keyof I_1, keyof PacketBatchUpdate>]: never}
  >(
    object: I_1
  ): PacketBatchUpdate;
};
export declare const StartExpiringPacketStreamResponse: {
  encode(
    message: StartExpiringPacketStreamResponse,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): StartExpiringPacketStreamResponse;
  fromJSON(object: any): StartExpiringPacketStreamResponse;
  toJSON(message: StartExpiringPacketStreamResponse): unknown;
  create<
    I extends {
      heartbeat?:
        | {
            count?: number | undefined;
          }
        | undefined;
    } & {
      heartbeat?:
        | ({
            count?: number | undefined;
          } & {
            count?: number | undefined;
          } & {[K in Exclude<keyof I['heartbeat'], 'count'>]: never})
        | undefined;
    } & {[K_1 in Exclude<keyof I, 'heartbeat'>]: never}
  >(
    base?: I | undefined
  ): StartExpiringPacketStreamResponse;
  fromPartial<
    I_1 extends {
      heartbeat?:
        | {
            count?: number | undefined;
          }
        | undefined;
    } & {
      heartbeat?:
        | ({
            count?: number | undefined;
          } & {
            count?: number | undefined;
          } & {[K_2 in Exclude<keyof I_1['heartbeat'], 'count'>]: never})
        | undefined;
    } & {[K_3 in Exclude<keyof I_1, 'heartbeat'>]: never}
  >(
    object: I_1
  ): StartExpiringPacketStreamResponse;
};
/** / Validators can connect to Block Engines to receive packets and bundles. */
export type BlockEngineValidatorService = typeof BlockEngineValidatorService;
export declare const BlockEngineValidatorService: {
  /** / Validators can subscribe to the block engine to receive a stream of packets */
  readonly subscribePackets: {
    readonly path: '/block_engine.BlockEngineValidator/SubscribePackets';
    readonly requestStream: false;
    readonly responseStream: true;
    readonly requestSerialize: (value: SubscribePacketsRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => SubscribePacketsRequest;
    readonly responseSerialize: (value: SubscribePacketsResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => SubscribePacketsResponse;
  };
  /** / Validators can subscribe to the block engine to receive a stream of simulated and profitable bundles */
  readonly subscribeBundles: {
    readonly path: '/block_engine.BlockEngineValidator/SubscribeBundles';
    readonly requestStream: false;
    readonly responseStream: true;
    readonly requestSerialize: (value: SubscribeBundlesRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => SubscribeBundlesRequest;
    readonly responseSerialize: (value: SubscribeBundlesResponse) => Buffer;
    readonly responseDeserialize: (value: Buffer) => SubscribeBundlesResponse;
  };
  /**
   * Block builders can optionally collect fees. This returns fee information if a block builder wants to
   * collect one.
   */
  readonly getBlockBuilderFeeInfo: {
    readonly path: '/block_engine.BlockEngineValidator/GetBlockBuilderFeeInfo';
    readonly requestStream: false;
    readonly responseStream: false;
    readonly requestSerialize: (value: BlockBuilderFeeInfoRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => BlockBuilderFeeInfoRequest;
    readonly responseSerialize: (value: BlockBuilderFeeInfoResponse) => Buffer;
    readonly responseDeserialize: (
      value: Buffer
    ) => BlockBuilderFeeInfoResponse;
  };
};
export interface BlockEngineValidatorServer
  extends UntypedServiceImplementation {
  /** / Validators can subscribe to the block engine to receive a stream of packets */
  subscribePackets: handleServerStreamingCall<
    SubscribePacketsRequest,
    SubscribePacketsResponse
  >;
  /** / Validators can subscribe to the block engine to receive a stream of simulated and profitable bundles */
  subscribeBundles: handleServerStreamingCall<
    SubscribeBundlesRequest,
    SubscribeBundlesResponse
  >;
  /**
   * Block builders can optionally collect fees. This returns fee information if a block builder wants to
   * collect one.
   */
  getBlockBuilderFeeInfo: handleUnaryCall<
    BlockBuilderFeeInfoRequest,
    BlockBuilderFeeInfoResponse
  >;
}
export interface BlockEngineValidatorClient extends Client {
  /** / Validators can subscribe to the block engine to receive a stream of packets */
  subscribePackets(
    request: SubscribePacketsRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<SubscribePacketsResponse>;
  subscribePackets(
    request: SubscribePacketsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<SubscribePacketsResponse>;
  /** / Validators can subscribe to the block engine to receive a stream of simulated and profitable bundles */
  subscribeBundles(
    request: SubscribeBundlesRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<SubscribeBundlesResponse>;
  subscribeBundles(
    request: SubscribeBundlesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<SubscribeBundlesResponse>;
  /**
   * Block builders can optionally collect fees. This returns fee information if a block builder wants to
   * collect one.
   */
  getBlockBuilderFeeInfo(
    request: BlockBuilderFeeInfoRequest,
    callback: (
      error: ServiceError | null,
      response: BlockBuilderFeeInfoResponse
    ) => void
  ): ClientUnaryCall;
  getBlockBuilderFeeInfo(
    request: BlockBuilderFeeInfoRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: BlockBuilderFeeInfoResponse
    ) => void
  ): ClientUnaryCall;
  getBlockBuilderFeeInfo(
    request: BlockBuilderFeeInfoRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: BlockBuilderFeeInfoResponse
    ) => void
  ): ClientUnaryCall;
}
export declare const BlockEngineValidatorClient: {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>
  ): BlockEngineValidatorClient;
  service: typeof BlockEngineValidatorService;
};
/**
 * / Relayers can forward packets to Block Engines.
 * / Block Engines provide an AccountsOfInterest field to only send transactions that are of interest.
 */
export type BlockEngineRelayerService = typeof BlockEngineRelayerService;
export declare const BlockEngineRelayerService: {
  /**
   * / The block engine feeds accounts of interest (AOI) updates to the relayer periodically.
   * / For all transactions the relayer receives, it forwards transactions to the block engine which write-lock
   * / any of the accounts in the AOI.
   */
  readonly subscribeAccountsOfInterest: {
    readonly path: '/block_engine.BlockEngineRelayer/SubscribeAccountsOfInterest';
    readonly requestStream: false;
    readonly responseStream: true;
    readonly requestSerialize: (value: AccountsOfInterestRequest) => Buffer;
    readonly requestDeserialize: (value: Buffer) => AccountsOfInterestRequest;
    readonly responseSerialize: (value: AccountsOfInterestUpdate) => Buffer;
    readonly responseDeserialize: (value: Buffer) => AccountsOfInterestUpdate;
  };
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats.
   * NOTE: This is a bi-directional stream due to a bug with how Envoy handles half closed client-side streams.
   * The issue is being tracked here: https://github.com/envoyproxy/envoy/issues/22748. In the meantime, the
   * server will stream heartbeats to clients at some reasonable cadence.
   */
  readonly startExpiringPacketStream: {
    readonly path: '/block_engine.BlockEngineRelayer/StartExpiringPacketStream';
    readonly requestStream: true;
    readonly responseStream: true;
    readonly requestSerialize: (value: PacketBatchUpdate) => Buffer;
    readonly requestDeserialize: (value: Buffer) => PacketBatchUpdate;
    readonly responseSerialize: (
      value: StartExpiringPacketStreamResponse
    ) => Buffer;
    readonly responseDeserialize: (
      value: Buffer
    ) => StartExpiringPacketStreamResponse;
  };
};
export interface BlockEngineRelayerServer extends UntypedServiceImplementation {
  /**
   * / The block engine feeds accounts of interest (AOI) updates to the relayer periodically.
   * / For all transactions the relayer receives, it forwards transactions to the block engine which write-lock
   * / any of the accounts in the AOI.
   */
  subscribeAccountsOfInterest: handleServerStreamingCall<
    AccountsOfInterestRequest,
    AccountsOfInterestUpdate
  >;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats.
   * NOTE: This is a bi-directional stream due to a bug with how Envoy handles half closed client-side streams.
   * The issue is being tracked here: https://github.com/envoyproxy/envoy/issues/22748. In the meantime, the
   * server will stream heartbeats to clients at some reasonable cadence.
   */
  startExpiringPacketStream: handleBidiStreamingCall<
    PacketBatchUpdate,
    StartExpiringPacketStreamResponse
  >;
}
export interface BlockEngineRelayerClient extends Client {
  /**
   * / The block engine feeds accounts of interest (AOI) updates to the relayer periodically.
   * / For all transactions the relayer receives, it forwards transactions to the block engine which write-lock
   * / any of the accounts in the AOI.
   */
  subscribeAccountsOfInterest(
    request: AccountsOfInterestRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<AccountsOfInterestUpdate>;
  subscribeAccountsOfInterest(
    request: AccountsOfInterestRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<AccountsOfInterestUpdate>;
  /**
   * Validators can subscribe to packets from the relayer and receive a multiplexed signal that contains a mixture
   * of packets and heartbeats.
   * NOTE: This is a bi-directional stream due to a bug with how Envoy handles half closed client-side streams.
   * The issue is being tracked here: https://github.com/envoyproxy/envoy/issues/22748. In the meantime, the
   * server will stream heartbeats to clients at some reasonable cadence.
   */
  startExpiringPacketStream(): ClientDuplexStream<
    PacketBatchUpdate,
    StartExpiringPacketStreamResponse
  >;
  startExpiringPacketStream(
    options: Partial<CallOptions>
  ): ClientDuplexStream<PacketBatchUpdate, StartExpiringPacketStreamResponse>;
  startExpiringPacketStream(
    metadata: Metadata,
    options?: Partial<CallOptions>
  ): ClientDuplexStream<PacketBatchUpdate, StartExpiringPacketStreamResponse>;
}
export declare const BlockEngineRelayerClient: {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>
  ): BlockEngineRelayerClient;
  service: typeof BlockEngineRelayerService;
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
