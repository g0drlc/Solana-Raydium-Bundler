import { EventEmitter } from 'eventemitter3';
import NodeWebSocket, { WebSocketServer } from 'ws';

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
 * factory method for common WebSocket instance
 * @method
 * @param {String} address - url to a websocket server
 * @param {(Object)} options - websocket options
 * @return {Undefined}
 */
declare function WebSocket$1(address: string, options: IWSClientAdditionalOptions & NodeWebSocket.ClientOptions): NodeWebSocket;

/**
 * "Server" wraps the "ws" library providing JSON RPC 2.0 support on top.
 * @module Server
 */

interface INamespaceEvent {
    [x: string]: {
        sockets: Array<string>;
        protected: boolean;
    };
}
interface IMethod {
    public: () => void;
    protected: () => void;
}
interface IEvent {
    public: () => void;
    protected: () => void;
}
interface IRPCError {
    code: number;
    message: string;
    data?: string;
}
interface IRPCMethodParams {
    [x: string]: any;
}
interface IRPCMethod {
    [x: string]: {
        fn: (params: IRPCMethodParams, socket_id: string) => any;
        protected: boolean;
    };
}
interface IClientWebSocket extends NodeWebSocket {
    _id: string;
    _authenticated: boolean;
}
declare class Server extends EventEmitter {
    private namespaces;
    private dataPack;
    wss: InstanceType<typeof WebSocketServer>;
    /**
   * Instantiate a Server class.
   * @constructor
   * @param {Object} options - ws constructor's parameters with rpc
   * @param {DataPack} dataPack - data pack contains encoder and decoder
   * @return {Server} - returns a new Server instance
   */
    constructor(options: NodeWebSocket.ServerOptions, dataPack?: DataPack<object, string>);
    /**
   * Registers an RPC method.
   * @method
   * @param {String} name - method name
   * @param {Function} fn - a callee function
   * @param {String} ns - namespace identifier
   * @throws {TypeError}
   * @return {Object} - returns an IMethod object
   */
    register(name: string, fn: (params: IRPCMethodParams, socket_id: string) => void, ns?: string): IMethod;
    /**
   * Sets an auth method.
   * @method
   * @param {Function} fn - an arbitrary auth method
   * @param {String} ns - namespace identifier
   * @throws {TypeError}
   * @return {Undefined}
   */
    setAuth(fn: (params: IRPCMethodParams, socket_id: string) => Promise<boolean>, ns?: string): void;
    /**
   * Marks an RPC method as protected.
   * @method
   * @param {String} name - method name
   * @param {String} ns - namespace identifier
   * @return {Undefined}
   */
    private _makeProtectedMethod;
    /**
   * Marks an RPC method as public.
   * @method
   * @param {String} name - method name
   * @param {String} ns - namespace identifier
   * @return {Undefined}
   */
    private _makePublicMethod;
    /**
   * Marks an event as protected.
   * @method
   * @param {String} name - event name
   * @param {String} ns - namespace identifier
   * @return {Undefined}
   */
    private _makeProtectedEvent;
    /**
   * Marks an event as public.
   * @method
   * @param {String} name - event name
   * @param {String} ns - namespace identifier
   * @return {Undefined}
   */
    private _makePublicEvent;
    /**
   * Removes a namespace and closes all connections
   * @method
   * @param {String} ns - namespace identifier
   * @throws {TypeError}
   * @return {Undefined}
   */
    closeNamespace(ns: string): void;
    /**
   * Creates a new event that can be emitted to clients.
   * @method
   * @param {String} name - event name
   * @param {String} ns - namespace identifier
   * @throws {TypeError}
   * @return {Object} - returns an IEvent object
   */
    event(name: string, ns?: string): IEvent;
    /**
   * Returns a requested namespace object
   * @method
   * @param {String} name - namespace identifier
   * @throws {TypeError}
   * @return {Object} - namespace object
   */
    of(name: string): {
        register(fn_name: string, fn: (params: IRPCMethodParams) => void): IMethod;
        event(ev_name: string): IEvent;
        readonly eventList: string[];
        /**
   * Emits a specified event to this namespace.
   * @inner
   * @method
   * @param {String} event - event name
   * @param {Array} params - event parameters
   * @return {Undefined}
   */
        emit(event: string, ...params: Array<string>): void;
        /**
   * Returns a name of this namespace.
   * @inner
   * @method
   * @kind constant
   * @return {String}
   */
        readonly name: string;
        /**
   * Returns a hash of websocket objects connected to this namespace.
   * @inner
   * @method
   * @return {Object}
   */
        connected(): {};
        /**
   * Returns a list of client unique identifiers connected to this namespace.
   * @inner
   * @method
   * @return {Array}
   */
        clients(): {
            rpc_methods: IRPCMethod;
            clients: Map<string, IClientWebSocket>;
            events: INamespaceEvent;
        };
    };
    /**
   * Lists all created events in a given namespace. Defaults to "/".
   * @method
   * @param {String} ns - namespaces identifier
   * @readonly
   * @return {Array} - returns a list of created events
   */
    eventList(ns?: string): string[];
    /**
   * Creates a JSON-RPC 2.0 compliant error
   * @method
   * @param {Number} code - indicates the error type that occurred
   * @param {String} message - provides a short description of the error
   * @param {String|Object} data - details containing additional information about the error
   * @return {Object}
   */
    createError(code: number, message: string, data: string | object): {
        code: number;
        message: string;
        data: string | object;
    };
    /**
   * Closes the server and terminates all clients.
   * @method
   * @return {Promise}
   */
    close(): Promise<void>;
    /**
   * Handles all WebSocket JSON RPC 2.0 requests.
   * @private
   * @param {Object} socket - ws socket instance
   * @param {String} ns - namespaces identifier
   * @return {Undefined}
   */
    private _handleRPC;
    /**
   * Runs a defined RPC method.
   * @private
   * @param {Object} message - a message received
   * @param {Object} socket_id - user's socket id
   * @param {String} ns - namespaces identifier
   * @return {Object|undefined}
   */
    private _runMethod;
    /**
   * Generate a new namespace store.
   * Also preregister some special namespace methods.
   * @private
   * @param {String} name - namespaces identifier
   * @return {undefined}
   */
    private _generateNamespace;
}
/**
 * Creates a JSON-RPC 2.0-compliant error.
 * @param {Number} code - error code
 * @param {String} details - error details
 * @return {Object}
 */
declare function createError(code: number, details?: string): IRPCError;

declare class Client extends CommonClient {
    constructor(address?: string, { autoconnect, reconnect, reconnect_interval, max_reconnects, ...rest_options }?: IWSClientAdditionalOptions & NodeWebSocketTypeOptions, generate_request_id?: (method: string, params: object | Array<any>) => number);
}

export { type BrowserWebSocketType, Client, CommonClient, type DataPack, DefaultDataPack, type ICommonWebSocket, type ICommonWebSocketFactory, type IQueue, type IWSClientAdditionalOptions, type IWSRequestParams, type NodeWebSocketType, type NodeWebSocketTypeOptions, Server, WebSocket$1 as WebSocket, createError };
