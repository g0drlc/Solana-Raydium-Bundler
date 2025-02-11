"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.Client = void 0;
const websocket_1 = __importDefault(require("./lib/client/websocket"));
const client_1 = __importDefault(require("./lib/client"));
class Client extends client_1.default {
    constructor(address = "ws://localhost:8080", { autoconnect = true, reconnect = true, reconnect_interval = 1000, max_reconnects = 5, ...rest_options } = {}, generate_request_id) {
        super(websocket_1.default, address, {
            autoconnect,
            reconnect,
            reconnect_interval,
            max_reconnects,
            ...rest_options
        }, generate_request_id);
    }
}
exports.Client = Client;
var server_1 = require("./lib/server");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return __importDefault(server_1).default; } });
