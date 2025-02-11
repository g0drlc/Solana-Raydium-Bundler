"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventParser = exports.EventManager = void 0;
const assert = __importStar(require("assert"));
const PROGRAM_LOG = "Program log: ";
const PROGRAM_DATA = "Program data: ";
const PROGRAM_LOG_START_INDEX = PROGRAM_LOG.length;
const PROGRAM_DATA_START_INDEX = PROGRAM_DATA.length;
class EventManager {
    constructor(programId, provider, coder) {
        this._programId = programId;
        this._provider = provider;
        this._eventParser = new EventParser(programId, coder);
        this._eventCallbacks = new Map();
        this._eventListeners = new Map();
        this._listenerIdCount = 0;
    }
    addEventListener(eventName, callback) {
        var _a;
        let listener = this._listenerIdCount;
        this._listenerIdCount += 1;
        // Store the listener into the event map.
        if (!this._eventListeners.has(eventName)) {
            this._eventListeners.set(eventName, []);
        }
        this._eventListeners.set(eventName, ((_a = this._eventListeners.get(eventName)) !== null && _a !== void 0 ? _a : []).concat(listener));
        // Store the callback into the listener map.
        this._eventCallbacks.set(listener, [eventName, callback]);
        // Create the subscription singleton, if needed.
        if (this._onLogsSubscriptionId !== undefined) {
            return listener;
        }
        this._onLogsSubscriptionId = this._provider.connection.onLogs(this._programId, (logs, ctx) => {
            if (logs.err) {
                return;
            }
            for (const event of this._eventParser.parseLogs(logs.logs)) {
                const allListeners = this._eventListeners.get(event.name);
                if (allListeners) {
                    allListeners.forEach((listener) => {
                        const listenerCb = this._eventCallbacks.get(listener);
                        if (listenerCb) {
                            const [, callback] = listenerCb;
                            callback(event.data, ctx.slot, logs.signature);
                        }
                    });
                }
            }
        });
        return listener;
    }
    async removeEventListener(listener) {
        // Get the callback.
        const callback = this._eventCallbacks.get(listener);
        if (!callback) {
            throw new Error(`Event listener ${listener} doesn't exist!`);
        }
        const [eventName] = callback;
        // Get the listeners.
        let listeners = this._eventListeners.get(eventName);
        if (!listeners) {
            throw new Error(`Event listeners don't exist for ${eventName}!`);
        }
        // Update both maps.
        this._eventCallbacks.delete(listener);
        listeners = listeners.filter((l) => l !== listener);
        this._eventListeners.set(eventName, listeners);
        if (listeners.length === 0) {
            this._eventListeners.delete(eventName);
        }
        // Kill the websocket connection if all listeners have been removed.
        if (this._eventCallbacks.size == 0) {
            assert.ok(this._eventListeners.size === 0);
            if (this._onLogsSubscriptionId !== undefined) {
                await this._provider.connection.removeOnLogsListener(this._onLogsSubscriptionId);
                this._onLogsSubscriptionId = undefined;
            }
        }
    }
}
exports.EventManager = EventManager;
class EventParser {
    constructor(programId, coder) {
        this.coder = coder;
        this.programId = programId;
    }
    // Each log given, represents an array of messages emitted by
    // a single transaction, which can execute many different programs across
    // CPI boundaries. However, the subscription is only interested in the
    // events emitted by *this* program. In achieving this, we keep track of the
    // program execution context by parsing each log and looking for a CPI
    // `invoke` call. If one exists, we know a new program is executing. So we
    // push the programId onto a stack and switch the program context. This
    // allows us to track, for a given log, which program was executing during
    // its emission, thereby allowing us to know if a given log event was
    // emitted by *this* program. If it was, then we parse the raw string and
    // emit the event if the string matches the event being subscribed to.
    *parseLogs(logs, errorOnDecodeFailure = false) {
        const logScanner = new LogScanner(logs);
        const execution = new ExecutionContext();
        let log = logScanner.next();
        while (log !== null) {
            let [event, newProgram, didPop] = this.handleLog(execution, log, errorOnDecodeFailure);
            if (event) {
                yield event;
            }
            if (newProgram) {
                execution.push(newProgram);
            }
            if (didPop) {
                execution.pop();
            }
            log = logScanner.next();
        }
    }
    // Main log handler. Returns a three element array of the event, the
    // next program that was invoked for CPI, and a boolean indicating if
    // a program has completed execution (and thus should be popped off the
    // execution stack).
    handleLog(execution, log, errorOnDecodeFailure) {
        // Executing program is this program.
        if (execution.stack.length > 0 &&
            execution.program() === this.programId.toString()) {
            return this.handleProgramLog(log, errorOnDecodeFailure);
        }
        // Executing program is not this program.
        else {
            return [null, ...this.handleSystemLog(log)];
        }
    }
    // Handles logs from *this* program.
    handleProgramLog(log, errorOnDecodeFailure) {
        // This is a `msg!` log or a `sol_log_data` log.
        if (log.startsWith(PROGRAM_LOG) || log.startsWith(PROGRAM_DATA)) {
            const logStr = log.startsWith(PROGRAM_LOG)
                ? log.slice(PROGRAM_LOG_START_INDEX)
                : log.slice(PROGRAM_DATA_START_INDEX);
            const event = this.coder.events.decode(logStr);
            if (errorOnDecodeFailure && event === null) {
                throw new Error(`Unable to decode event ${logStr}`);
            }
            return [event, null, false];
        }
        // System log.
        else {
            return [null, ...this.handleSystemLog(log)];
        }
    }
    // Handles logs when the current program being executing is *not* this.
    handleSystemLog(log) {
        // System component.
        const logStart = log.split(":")[0];
        // Did the program finish executing?
        if (logStart.match(/^Program (.*) success/g) !== null) {
            return [null, true];
            // Recursive call.
        }
        else if (logStart.startsWith(`Program ${this.programId.toString()} invoke`)) {
            return [this.programId.toString(), false];
        }
        // CPI call.
        else if (logStart.includes("invoke")) {
            return ["cpi", false]; // Any string will do.
        }
        else {
            return [null, false];
        }
    }
}
exports.EventParser = EventParser;
// Stack frame execution context, allowing one to track what program is
// executing for a given log.
class ExecutionContext {
    constructor() {
        this.stack = [];
    }
    program() {
        assert.ok(this.stack.length > 0);
        return this.stack[this.stack.length - 1];
    }
    push(newProgram) {
        this.stack.push(newProgram);
    }
    pop() {
        assert.ok(this.stack.length > 0);
        this.stack.pop();
    }
}
class LogScanner {
    constructor(logs) {
        this.logs = logs;
    }
    next() {
        if (this.logs.length === 0) {
            return null;
        }
        let l = this.logs[0];
        this.logs = this.logs.slice(1);
        return l;
    }
}
//# sourceMappingURL=event.js.map