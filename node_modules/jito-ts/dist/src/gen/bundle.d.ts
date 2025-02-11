import * as _m0 from 'protobufjs/minimal';
import {Packet} from './packet';
import {Header} from './shared';
export declare const protobufPackage = 'bundle';
export interface Bundle {
  header: Header | undefined;
  packets: Packet[];
}
export interface BundleUuid {
  bundle: Bundle | undefined;
  uuid: string;
}
/**
 * Indicates the bundle was accepted and forwarded to a validator.
 * NOTE: A single bundle may have multiple events emitted if forwarded to many validators.
 */
export interface Accepted {
  /** Slot at which bundle was forwarded. */
  slot: number;
  /** Validator identity bundle was forwarded to. */
  validatorIdentity: string;
}
/** Indicates the bundle was dropped and therefore not forwarded to any validator. */
export interface Rejected {
  stateAuctionBidRejected?: StateAuctionBidRejected | undefined;
  winningBatchBidRejected?: WinningBatchBidRejected | undefined;
  simulationFailure?: SimulationFailure | undefined;
  internalError?: InternalError | undefined;
}
/**
 * Indicates the bundle's bid was high enough to win its state auction.
 * However, not high enough relative to other state auction winners and therefore excluded from being forwarded.
 */
export interface WinningBatchBidRejected {
  /** Auction's unique identifier. */
  auctionId: string;
  /** Bundle's simulated bid. */
  simulatedBidLamports: number;
  msg?: string | undefined;
}
/** Indicates the bundle's bid was __not__ high enough to be included in its state auction's set of winners. */
export interface StateAuctionBidRejected {
  /** Auction's unique identifier. */
  auctionId: string;
  /** Bundle's simulated bid. */
  simulatedBidLamports: number;
  msg?: string | undefined;
}
/** Bundle dropped due to simulation failure. */
export interface SimulationFailure {
  /** Signature of the offending transaction. */
  txSignature: string;
  msg?: string | undefined;
}
/** Bundle dropped due to an internal error. */
export interface InternalError {
  msg: string;
}
export interface BundleResult {
  /** Bundle's Uuid. */
  bundleId: string;
  accepted?: Accepted | undefined;
  rejected?: Rejected | undefined;
}
export declare const Bundle: {
  encode(message: Bundle, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Bundle;
  fromJSON(object: any): Bundle;
  toJSON(message: Bundle): unknown;
  create<
    I extends {
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
          } & {[K in Exclude<keyof I['header'], 'ts'>]: never})
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
                            keyof I['packets'][number]['meta']['flags'],
                            keyof import('./packet').PacketFlags
                          >]: never;
                        })
                      | undefined;
                    senderStake?: number | undefined;
                  } & {
                    [K_2 in Exclude<
                      keyof I['packets'][number]['meta'],
                      keyof import('./packet').Meta
                    >]: never;
                  })
                | undefined;
            } & {
              [K_3 in Exclude<keyof I['packets'][number], keyof Packet>]: never;
            })[] & {
              [K_4 in Exclude<
                keyof I['packets'],
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
    } & {[K_5 in Exclude<keyof I, keyof Bundle>]: never}
  >(
    base?: I | undefined
  ): Bundle;
  fromPartial<
    I_1 extends {
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
          } & {[K_6 in Exclude<keyof I_1['header'], 'ts'>]: never})
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
                          [K_7 in Exclude<
                            keyof I_1['packets'][number]['meta']['flags'],
                            keyof import('./packet').PacketFlags
                          >]: never;
                        })
                      | undefined;
                    senderStake?: number | undefined;
                  } & {
                    [K_8 in Exclude<
                      keyof I_1['packets'][number]['meta'],
                      keyof import('./packet').Meta
                    >]: never;
                  })
                | undefined;
            } & {
              [K_9 in Exclude<
                keyof I_1['packets'][number],
                keyof Packet
              >]: never;
            })[] & {
              [K_10 in Exclude<
                keyof I_1['packets'],
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
    } & {[K_11 in Exclude<keyof I_1, keyof Bundle>]: never}
  >(
    object: I_1
  ): Bundle;
};
export declare const BundleUuid: {
  encode(message: BundleUuid, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): BundleUuid;
  fromJSON(object: any): BundleUuid;
  toJSON(message: BundleUuid): unknown;
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
      uuid?: string | undefined;
    } & {[K_6 in Exclude<keyof I, keyof BundleUuid>]: never}
  >(
    base?: I | undefined
  ): BundleUuid;
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
      uuid?: string | undefined;
    } & {[K_13 in Exclude<keyof I_1, keyof BundleUuid>]: never}
  >(
    object: I_1
  ): BundleUuid;
};
export declare const Accepted: {
  encode(message: Accepted, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Accepted;
  fromJSON(object: any): Accepted;
  toJSON(message: Accepted): unknown;
  create<
    I extends {
      slot?: number | undefined;
      validatorIdentity?: string | undefined;
    } & {
      slot?: number | undefined;
      validatorIdentity?: string | undefined;
    } & {[K in Exclude<keyof I, keyof Accepted>]: never}
  >(
    base?: I | undefined
  ): Accepted;
  fromPartial<
    I_1 extends {
      slot?: number | undefined;
      validatorIdentity?: string | undefined;
    } & {
      slot?: number | undefined;
      validatorIdentity?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof Accepted>]: never}
  >(
    object: I_1
  ): Accepted;
};
export declare const Rejected: {
  encode(message: Rejected, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Rejected;
  fromJSON(object: any): Rejected;
  toJSON(message: Rejected): unknown;
  create<
    I extends {
      stateAuctionBidRejected?:
        | {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          }
        | undefined;
      winningBatchBidRejected?:
        | {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          }
        | undefined;
      simulationFailure?:
        | {
            txSignature?: string | undefined;
            msg?: string | undefined;
          }
        | undefined;
      internalError?:
        | {
            msg?: string | undefined;
          }
        | undefined;
    } & {
      stateAuctionBidRejected?:
        | ({
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            [K in Exclude<
              keyof I['stateAuctionBidRejected'],
              keyof StateAuctionBidRejected
            >]: never;
          })
        | undefined;
      winningBatchBidRejected?:
        | ({
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            [K_1 in Exclude<
              keyof I['winningBatchBidRejected'],
              keyof WinningBatchBidRejected
            >]: never;
          })
        | undefined;
      simulationFailure?:
        | ({
            txSignature?: string | undefined;
            msg?: string | undefined;
          } & {
            txSignature?: string | undefined;
            msg?: string | undefined;
          } & {
            [K_2 in Exclude<
              keyof I['simulationFailure'],
              keyof SimulationFailure
            >]: never;
          })
        | undefined;
      internalError?:
        | ({
            msg?: string | undefined;
          } & {
            msg?: string | undefined;
          } & {[K_3 in Exclude<keyof I['internalError'], 'msg'>]: never})
        | undefined;
    } & {[K_4 in Exclude<keyof I, keyof Rejected>]: never}
  >(
    base?: I | undefined
  ): Rejected;
  fromPartial<
    I_1 extends {
      stateAuctionBidRejected?:
        | {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          }
        | undefined;
      winningBatchBidRejected?:
        | {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          }
        | undefined;
      simulationFailure?:
        | {
            txSignature?: string | undefined;
            msg?: string | undefined;
          }
        | undefined;
      internalError?:
        | {
            msg?: string | undefined;
          }
        | undefined;
    } & {
      stateAuctionBidRejected?:
        | ({
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            [K_5 in Exclude<
              keyof I_1['stateAuctionBidRejected'],
              keyof StateAuctionBidRejected
            >]: never;
          })
        | undefined;
      winningBatchBidRejected?:
        | ({
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            auctionId?: string | undefined;
            simulatedBidLamports?: number | undefined;
            msg?: string | undefined;
          } & {
            [K_6 in Exclude<
              keyof I_1['winningBatchBidRejected'],
              keyof WinningBatchBidRejected
            >]: never;
          })
        | undefined;
      simulationFailure?:
        | ({
            txSignature?: string | undefined;
            msg?: string | undefined;
          } & {
            txSignature?: string | undefined;
            msg?: string | undefined;
          } & {
            [K_7 in Exclude<
              keyof I_1['simulationFailure'],
              keyof SimulationFailure
            >]: never;
          })
        | undefined;
      internalError?:
        | ({
            msg?: string | undefined;
          } & {
            msg?: string | undefined;
          } & {[K_8 in Exclude<keyof I_1['internalError'], 'msg'>]: never})
        | undefined;
    } & {[K_9 in Exclude<keyof I_1, keyof Rejected>]: never}
  >(
    object: I_1
  ): Rejected;
};
export declare const WinningBatchBidRejected: {
  encode(message: WinningBatchBidRejected, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): WinningBatchBidRejected;
  fromJSON(object: any): WinningBatchBidRejected;
  toJSON(message: WinningBatchBidRejected): unknown;
  create<
    I extends {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {[K in Exclude<keyof I, keyof WinningBatchBidRejected>]: never}
  >(
    base?: I | undefined
  ): WinningBatchBidRejected;
  fromPartial<
    I_1 extends {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof WinningBatchBidRejected>]: never}
  >(
    object: I_1
  ): WinningBatchBidRejected;
};
export declare const StateAuctionBidRejected: {
  encode(message: StateAuctionBidRejected, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): StateAuctionBidRejected;
  fromJSON(object: any): StateAuctionBidRejected;
  toJSON(message: StateAuctionBidRejected): unknown;
  create<
    I extends {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {[K in Exclude<keyof I, keyof StateAuctionBidRejected>]: never}
  >(
    base?: I | undefined
  ): StateAuctionBidRejected;
  fromPartial<
    I_1 extends {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {
      auctionId?: string | undefined;
      simulatedBidLamports?: number | undefined;
      msg?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof StateAuctionBidRejected>]: never}
  >(
    object: I_1
  ): StateAuctionBidRejected;
};
export declare const SimulationFailure: {
  encode(message: SimulationFailure, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): SimulationFailure;
  fromJSON(object: any): SimulationFailure;
  toJSON(message: SimulationFailure): unknown;
  create<
    I extends {
      txSignature?: string | undefined;
      msg?: string | undefined;
    } & {
      txSignature?: string | undefined;
      msg?: string | undefined;
    } & {[K in Exclude<keyof I, keyof SimulationFailure>]: never}
  >(
    base?: I | undefined
  ): SimulationFailure;
  fromPartial<
    I_1 extends {
      txSignature?: string | undefined;
      msg?: string | undefined;
    } & {
      txSignature?: string | undefined;
      msg?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, keyof SimulationFailure>]: never}
  >(
    object: I_1
  ): SimulationFailure;
};
export declare const InternalError: {
  encode(message: InternalError, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): InternalError;
  fromJSON(object: any): InternalError;
  toJSON(message: InternalError): unknown;
  create<
    I extends {
      msg?: string | undefined;
    } & {
      msg?: string | undefined;
    } & {[K in Exclude<keyof I, 'msg'>]: never}
  >(
    base?: I | undefined
  ): InternalError;
  fromPartial<
    I_1 extends {
      msg?: string | undefined;
    } & {
      msg?: string | undefined;
    } & {[K_1 in Exclude<keyof I_1, 'msg'>]: never}
  >(
    object: I_1
  ): InternalError;
};
export declare const BundleResult: {
  encode(message: BundleResult, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): BundleResult;
  fromJSON(object: any): BundleResult;
  toJSON(message: BundleResult): unknown;
  create<
    I extends {
      bundleId?: string | undefined;
      accepted?:
        | {
            slot?: number | undefined;
            validatorIdentity?: string | undefined;
          }
        | undefined;
      rejected?:
        | {
            stateAuctionBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            winningBatchBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            simulationFailure?:
              | {
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            internalError?:
              | {
                  msg?: string | undefined;
                }
              | undefined;
          }
        | undefined;
    } & {
      bundleId?: string | undefined;
      accepted?:
        | ({
            slot?: number | undefined;
            validatorIdentity?: string | undefined;
          } & {
            slot?: number | undefined;
            validatorIdentity?: string | undefined;
          } & {[K in Exclude<keyof I['accepted'], keyof Accepted>]: never})
        | undefined;
      rejected?:
        | ({
            stateAuctionBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            winningBatchBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            simulationFailure?:
              | {
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            internalError?:
              | {
                  msg?: string | undefined;
                }
              | undefined;
          } & {
            stateAuctionBidRejected?:
              | ({
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  [K_1 in Exclude<
                    keyof I['rejected']['stateAuctionBidRejected'],
                    keyof StateAuctionBidRejected
                  >]: never;
                })
              | undefined;
            winningBatchBidRejected?:
              | ({
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  [K_2 in Exclude<
                    keyof I['rejected']['winningBatchBidRejected'],
                    keyof WinningBatchBidRejected
                  >]: never;
                })
              | undefined;
            simulationFailure?:
              | ({
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                } & {
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                } & {
                  [K_3 in Exclude<
                    keyof I['rejected']['simulationFailure'],
                    keyof SimulationFailure
                  >]: never;
                })
              | undefined;
            internalError?:
              | ({
                  msg?: string | undefined;
                } & {
                  msg?: string | undefined;
                } & {
                  [K_4 in Exclude<
                    keyof I['rejected']['internalError'],
                    'msg'
                  >]: never;
                })
              | undefined;
          } & {[K_5 in Exclude<keyof I['rejected'], keyof Rejected>]: never})
        | undefined;
    } & {[K_6 in Exclude<keyof I, keyof BundleResult>]: never}
  >(
    base?: I | undefined
  ): BundleResult;
  fromPartial<
    I_1 extends {
      bundleId?: string | undefined;
      accepted?:
        | {
            slot?: number | undefined;
            validatorIdentity?: string | undefined;
          }
        | undefined;
      rejected?:
        | {
            stateAuctionBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            winningBatchBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            simulationFailure?:
              | {
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            internalError?:
              | {
                  msg?: string | undefined;
                }
              | undefined;
          }
        | undefined;
    } & {
      bundleId?: string | undefined;
      accepted?:
        | ({
            slot?: number | undefined;
            validatorIdentity?: string | undefined;
          } & {
            slot?: number | undefined;
            validatorIdentity?: string | undefined;
          } & {[K_7 in Exclude<keyof I_1['accepted'], keyof Accepted>]: never})
        | undefined;
      rejected?:
        | ({
            stateAuctionBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            winningBatchBidRejected?:
              | {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            simulationFailure?:
              | {
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                }
              | undefined;
            internalError?:
              | {
                  msg?: string | undefined;
                }
              | undefined;
          } & {
            stateAuctionBidRejected?:
              | ({
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  [K_8 in Exclude<
                    keyof I_1['rejected']['stateAuctionBidRejected'],
                    keyof StateAuctionBidRejected
                  >]: never;
                })
              | undefined;
            winningBatchBidRejected?:
              | ({
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  auctionId?: string | undefined;
                  simulatedBidLamports?: number | undefined;
                  msg?: string | undefined;
                } & {
                  [K_9 in Exclude<
                    keyof I_1['rejected']['winningBatchBidRejected'],
                    keyof WinningBatchBidRejected
                  >]: never;
                })
              | undefined;
            simulationFailure?:
              | ({
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                } & {
                  txSignature?: string | undefined;
                  msg?: string | undefined;
                } & {
                  [K_10 in Exclude<
                    keyof I_1['rejected']['simulationFailure'],
                    keyof SimulationFailure
                  >]: never;
                })
              | undefined;
            internalError?:
              | ({
                  msg?: string | undefined;
                } & {
                  msg?: string | undefined;
                } & {
                  [K_11 in Exclude<
                    keyof I_1['rejected']['internalError'],
                    'msg'
                  >]: never;
                })
              | undefined;
          } & {[K_12 in Exclude<keyof I_1['rejected'], keyof Rejected>]: never})
        | undefined;
    } & {[K_13 in Exclude<keyof I_1, keyof BundleResult>]: never}
  >(
    object: I_1
  ): BundleResult;
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
