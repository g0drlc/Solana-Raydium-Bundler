import * as _m0 from 'protobufjs/minimal';
export declare const protobufPackage = 'packet';
export interface PacketBatch {
  packets: Packet[];
}
export interface Packet {
  data: Uint8Array;
  meta: Meta | undefined;
}
export interface Meta {
  size: number;
  addr: string;
  port: number;
  flags: PacketFlags | undefined;
  senderStake: number;
}
export interface PacketFlags {
  discard: boolean;
  forwarded: boolean;
  repair: boolean;
  simpleVoteTx: boolean;
  tracerPacket: boolean;
}
export declare const PacketBatch: {
  encode(message: PacketBatch, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): PacketBatch;
  fromJSON(object: any): PacketBatch;
  toJSON(message: PacketBatch): unknown;
  create<
    I extends {
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
                          [K in Exclude<
                            keyof I['packets'][number]['meta']['flags'],
                            keyof PacketFlags
                          >]: never;
                        })
                      | undefined;
                    senderStake?: number | undefined;
                  } & {
                    [K_1 in Exclude<
                      keyof I['packets'][number]['meta'],
                      keyof Meta
                    >]: never;
                  })
                | undefined;
            } & {
              [K_2 in Exclude<keyof I['packets'][number], keyof Packet>]: never;
            })[] & {
              [K_3 in Exclude<
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
    } & {[K_4 in Exclude<keyof I, 'packets'>]: never}
  >(
    base?: I | undefined
  ): PacketBatch;
  fromPartial<
    I_1 extends {
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
                          [K_5 in Exclude<
                            keyof I_1['packets'][number]['meta']['flags'],
                            keyof PacketFlags
                          >]: never;
                        })
                      | undefined;
                    senderStake?: number | undefined;
                  } & {
                    [K_6 in Exclude<
                      keyof I_1['packets'][number]['meta'],
                      keyof Meta
                    >]: never;
                  })
                | undefined;
            } & {
              [K_7 in Exclude<
                keyof I_1['packets'][number],
                keyof Packet
              >]: never;
            })[] & {
              [K_8 in Exclude<
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
    } & {[K_9 in Exclude<keyof I_1, 'packets'>]: never}
  >(
    object: I_1
  ): PacketBatch;
};
export declare const Packet: {
  encode(message: Packet, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Packet;
  fromJSON(object: any): Packet;
  toJSON(message: Packet): unknown;
  create<
    I extends {
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
                    keyof I['meta']['flags'],
                    keyof PacketFlags
                  >]: never;
                })
              | undefined;
            senderStake?: number | undefined;
          } & {[K_1 in Exclude<keyof I['meta'], keyof Meta>]: never})
        | undefined;
    } & {[K_2 in Exclude<keyof I, keyof Packet>]: never}
  >(
    base?: I | undefined
  ): Packet;
  fromPartial<
    I_1 extends {
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
                  [K_3 in Exclude<
                    keyof I_1['meta']['flags'],
                    keyof PacketFlags
                  >]: never;
                })
              | undefined;
            senderStake?: number | undefined;
          } & {[K_4 in Exclude<keyof I_1['meta'], keyof Meta>]: never})
        | undefined;
    } & {[K_5 in Exclude<keyof I_1, keyof Packet>]: never}
  >(
    object: I_1
  ): Packet;
};
export declare const Meta: {
  encode(message: Meta, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Meta;
  fromJSON(object: any): Meta;
  toJSON(message: Meta): unknown;
  create<
    I extends {
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
          } & {[K in Exclude<keyof I['flags'], keyof PacketFlags>]: never})
        | undefined;
      senderStake?: number | undefined;
    } & {[K_1 in Exclude<keyof I, keyof Meta>]: never}
  >(
    base?: I | undefined
  ): Meta;
  fromPartial<
    I_1 extends {
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
          } & {[K_2 in Exclude<keyof I_1['flags'], keyof PacketFlags>]: never})
        | undefined;
      senderStake?: number | undefined;
    } & {[K_3 in Exclude<keyof I_1, keyof Meta>]: never}
  >(
    object: I_1
  ): Meta;
};
export declare const PacketFlags: {
  encode(message: PacketFlags, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): PacketFlags;
  fromJSON(object: any): PacketFlags;
  toJSON(message: PacketFlags): unknown;
  create<
    I extends {
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
    } & {[K in Exclude<keyof I, keyof PacketFlags>]: never}
  >(
    base?: I | undefined
  ): PacketFlags;
  fromPartial<
    I_1 extends {
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
    } & {[K_1 in Exclude<keyof I_1, keyof PacketFlags>]: never}
  >(
    object: I_1
  ): PacketFlags;
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
