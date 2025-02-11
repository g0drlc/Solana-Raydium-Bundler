import { EventEmitter } from 'eventemitter3';
import NodeWebSocket from 'ws';

type BrowserWebSocketType = InstanceType<typeof WebSocket>;
type NodeWebSocketType = InstanceType<typeof NodeWebSocket>;
type NodeWebSocketTypeOptions = NodeWebSocket.ClientOptions;
interface IWSClientAdditionalOptions {
    autoconnect?: boolean;
    reconnect?: boolean;
    reconnect_interval?: number;
    max_reconnects?: number;
}
interface ICommonWebSocketFactory {
    (address: string, options: IWSClientAdditionalOptions): ICommonWebSocket;
}
interface ICommonWebSocket {
    send: (data: Parameters<BrowserWebSocketType["send"]>[0], optionsOrCallback: ((error?: Error) => void) | Parameters<NodeWebSocketType["send"]>[1], callback?: (error?: Error) => void) => void;
    close: (code?: number, reason?: string) => void;
    addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
}

interface DataPack<T, R extends string | ArrayBufferLike | Blob | ArrayBufferView> {
    encode(value: T): R;
    decode(value: R): T;
}
declare class DefaultDataPack implements DataPack<Object, string> {
    encode(value: Object): string;
    decode(value: string): Object;
}

/**
 * "Client" wraps "ws" or a browser-implemented "WebSocket" library
 * according to the environment providing JSON RPC 2.0 support on top.
 * @module Client
 */

interface IQueueElement {
    promise: [
        Parameters<ConstructorParameters<typeof Promise>[0]>[0],
        Parameters<ConstructorParameters<typeof Promise>[0]>[1]
    ];
    timeout?: ReturnType<typeof setTimeout>;
}
interface IQueue {
    [x: number]: IQueueElement;
}
interface IWSRequestParams {
    [x: string]: any;
    [x: number]: any;
}
declare class CommonClient extends EventEmitter {
    private address;
    private rpc_id;
    private queue;
    private options;
    private autoconnect;
    private ready;
    private reconnect;
    private reconnect_timer_id;
    private reconnect_interval;
    private max_reconnects;
    private rest_options;
    private current_reconnects;
    private generate_request_id;
    private socket;
    private webSocketFactory;
    private dataPack;
    /**
   * Instantiate a Client class.
   * @constructor
   * @param {webSocketFactory} webSocketFactory - factory method for WebSocket
   * @param {String} address - url to a websocket server
   * @param {Object} options - ws options object with reconnect parameters
   * @param {Function} generate_request_id - custom generation request Id
   * @param {DataPack} dataPack - data pack contains encoder and decoder
   * @return {CommonClient}
   */
    constructor(webSocketFactory: ICommonWebSocketFactory, address?: string, { autoconnect, reconnect, reconnect_interval, max_reconnects, ...rest_options }?: {
        autoconnect?: boolean;
        reconnect?: boolean;
        reconnect_interval?: number;
        max_reconnects?: number;
    }, generate_request_id?: (method: string, params: object | Array<any>) => number, dataPack?: DataPack<object, string>);
    /**
   * Connects to a defined server if not connected already.
   * @method
   * @return {Undefined}
   */
    connect(): void;
    /**
   * Calls a registered RPC method on server.
   * @method
   * @param {String} method - RPC method name
   * @param {Object|Array} params - optional method parameters
   * @param {Number} timeout - RPC reply timeout value
   * @param {Object} ws_opts - options passed to ws
   * @return {Promise}
   */
    call(method: string, params?: IWSRequestParams, timeout?: number, ws_opts?: Parameters<NodeWebSocketType["send"]>[1]): Promise<unknown>;
    /**
   * Logins with the other side of the connection.
   * @method
   * @param {Object} params - Login credentials object
   * @return {Promise}
   */
    login(params: IWSRequestParams): Promise<unknown>;
    /**
   * Fetches a list of client's methods registered on server.
   * @method
   * @return {Array}
   */
    listMethods(): Promise<unknown>;
    /**
   * Sends a JSON-RPC 2.0 notification to server.
   * @method
   * @param {String} method - RPC method name
   * @param {Object} params - optional method parameters
   * @return {Promise}
   */
    notify(method: string, params?: IWSRequestParams): Promise<void>;
    /**
   * Subscribes for a defined event.
   * @method
   * @param {String|Array} event - event name
   * @return {Undefined}
   * @throws {Error}
   */
    subscribe(event: string | Array<string>): Promise<unknown>;
    /**
   * Unsubscribes from a defined event.
   * @method
   * @param {String|Array} event - event name
   * @return {Undefined}
   * @throws {Error}
   */
    unsubscribe(event: string | Array<string>): Promise<unknown>;
    /**
   * Closes a WebSocket connection gracefully.
   * @method
   * @param {Number} code - socket close code
   * @param {String} data - optional data to be sent before closing
   * @return {Undefined}
   */
    close(code?: number, data?: string): void;
    /**
   * Enable / disable automatic reconnection.
   * @method
   * @param {Boolean} reconnect - enable / disable reconnection
   * @return {Undefined}
   */
    setAutoReconnect(reconnect: boolean): void;
    /**
   * Set the interval between reconnection attempts.
   * @method
   * @param {Number} interval - reconnection interval in milliseconds
   * @return {Undefined}
   */
    setReconnectInterval(interval: number): void;
    /**
   * Set the maximum number of reconnection attempts.
   * @method
   * @param {Number} max_reconnects - maximum reconnection attempts
   * @return {Undefined}
   */
    setMaxReconnects(max_reconnects: number): void;
    /**
   * Connection/Message handler.
   * @method
   * @private
   * @param {String} address - WebSocket API address
   * @param {Object} options - ws options object
   * @return {Undefined}
   */
    private _connect;
}

/**
 * WebSocket implements a browser-side WebSocket specification.
 * @module Client
 */

declare class WebSocketBrowserImpl extends EventEmitter {
    socket: BrowserWebSocketType;
    /** Instantiate a WebSocket class
   * @constructor
   * @param {String} address - url to a websocket server
   * @param {(Object)} options - websocket options
   * @param {(String|Array)} protocols - a list of protocols
   * @return {WebSocketBrowserImpl} - returns a WebSocket instance
   */
    constructor(address: string, options: {}, protocols?: string | string[]);
    /**
   * Sends data through a websocket connection
   * @method
   * @param {(String|Object)} data - data to be sent via websocket
   * @param {Object} optionsOrCallback - ws options
   * @param {Function} callback - a callback called once the data is sent
   * @return {Undefined}
   */
    send(data: Parameters<BrowserWebSocketType["send"]>[0], optionsOrCallback: (error?: Error) => void | Parameters<NodeWebSocketType["send"]>[1], callback?: () => void): void;
    /**
   * Closes an underlying socket
   * @method
   * @param {Number} code - status code explaining why the connection is being closed
   * @param {String} reason - a description why the connection is closing
   * @return {Undefined}
   * @throws {Error}
   */
    close(code?: number, reason?: string): void;
    addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
}
/**
 * factory method for common WebSocket instance
 * @method
 * @param {String} address - url to a websocket server
 * @param {(Object)} options - websocket options
 * @return {Undefined}
 */
declare function WebSocket$1(address: string, options: IWSClientAdditionalOptions): WebSocketBrowserImpl;

declare class Client extends CommonClient {
    constructor(address?: string, { autoconnect, reconnect, reconnect_interval, max_reconnects, }?: IWSClientAdditionalOptions, generate_request_id?: (method: string, params: object | Array<any>) => number);
}

export { type BrowserWebSocketType, Client, CommonClient, type DataPack, DefaultDataPack, type ICommonWebSocket, type ICommonWebSocketFactory, type IQueue, type IWSClientAdditionalOptions, type IWSRequestParams, type NodeWebSocketType, type NodeWebSocketTypeOptions, WebSocket$1 as WebSocket };
