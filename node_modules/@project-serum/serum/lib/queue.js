"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_QUEUE_LAYOUT = exports.REQUEST_QUEUE_LAYOUT = exports.decodeEventQueue = exports.decodeRequestQueue = exports.decodeEventsSince = void 0;
const buffer_layout_1 = require("buffer-layout");
const layout_1 = require("./layout");
const REQUEST_QUEUE_HEADER = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    buffer_layout_1.u32('head'),
    layout_1.zeros(4),
    buffer_layout_1.u32('count'),
    layout_1.zeros(4),
    buffer_layout_1.u32('nextSeqNum'),
    layout_1.zeros(4),
]);
const REQUEST_FLAGS = buffer_layout_1.bits(buffer_layout_1.u8(), false, 'requestFlags');
REQUEST_FLAGS.addBoolean('newOrder');
REQUEST_FLAGS.addBoolean('cancelOrder');
REQUEST_FLAGS.addBoolean('bid');
REQUEST_FLAGS.addBoolean('postOnly');
REQUEST_FLAGS.addBoolean('ioc');
const REQUEST = buffer_layout_1.struct([
    REQUEST_FLAGS,
    buffer_layout_1.u8('openOrdersSlot'),
    buffer_layout_1.u8('feeTier'),
    buffer_layout_1.blob(5),
    layout_1.u64('maxBaseSizeOrCancelId'),
    layout_1.u64('nativeQuoteQuantityLocked'),
    layout_1.u128('orderId'),
    layout_1.publicKeyLayout('openOrders'),
    layout_1.u64('clientOrderId'),
]);
const EVENT_QUEUE_HEADER = buffer_layout_1.struct([
    buffer_layout_1.blob(5),
    layout_1.accountFlagsLayout('accountFlags'),
    buffer_layout_1.u32('head'),
    layout_1.zeros(4),
    buffer_layout_1.u32('count'),
    layout_1.zeros(4),
    buffer_layout_1.u32('seqNum'),
    layout_1.zeros(4),
]);
const EVENT_FLAGS = buffer_layout_1.bits(buffer_layout_1.u8(), false, 'eventFlags');
EVENT_FLAGS.addBoolean('fill');
EVENT_FLAGS.addBoolean('out');
EVENT_FLAGS.addBoolean('bid');
EVENT_FLAGS.addBoolean('maker');
const EVENT = buffer_layout_1.struct([
    EVENT_FLAGS,
    buffer_layout_1.u8('openOrdersSlot'),
    buffer_layout_1.u8('feeTier'),
    buffer_layout_1.blob(5),
    layout_1.u64('nativeQuantityReleased'),
    layout_1.u64('nativeQuantityPaid'),
    layout_1.u64('nativeFeeOrRebate'),
    layout_1.u128('orderId'),
    layout_1.publicKeyLayout('openOrders'),
    layout_1.u64('clientOrderId'),
]);
function decodeQueueItem(headerLayout, nodeLayout, buffer, nodeIndex) {
    return nodeLayout.decode(buffer, headerLayout.span + nodeIndex * nodeLayout.span);
}
function decodeQueue(headerLayout, nodeLayout, buffer, history) {
    const header = headerLayout.decode(buffer);
    const allocLen = Math.floor((buffer.length - headerLayout.span) / nodeLayout.span);
    const nodes = [];
    if (history) {
        for (let i = 0; i < Math.min(history, allocLen); ++i) {
            const nodeIndex = (header.head + header.count + allocLen - 1 - i) % allocLen;
            nodes.push(decodeQueueItem(headerLayout, nodeLayout, buffer, nodeIndex));
        }
    }
    else {
        for (let i = 0; i < header.count; ++i) {
            const nodeIndex = (header.head + i) % allocLen;
            nodes.push(decodeQueueItem(headerLayout, nodeLayout, buffer, nodeIndex));
        }
    }
    return { header, nodes };
}
function decodeEventsSince(buffer, lastSeqNum) {
    const header = EVENT_QUEUE_HEADER.decode(buffer);
    const allocLen = Math.floor((buffer.length - EVENT_QUEUE_HEADER.span) / EVENT.span);
    // calculate number of missed events
    // account for u32 & ringbuffer overflows
    const modulo32Uint = 0x100000000;
    let missedEvents = (header.seqNum - lastSeqNum + modulo32Uint) % modulo32Uint;
    if (missedEvents > allocLen) {
        missedEvents = allocLen - 1;
    }
    const startSeq = (header.seqNum - missedEvents + modulo32Uint) % modulo32Uint;
    // define boundary indexes in ring buffer [start;end)
    const endIndex = (header.head + header.count) % allocLen;
    const startIndex = (endIndex - missedEvents + allocLen) % allocLen;
    const results = [];
    for (let i = 0; i < missedEvents; ++i) {
        const nodeIndex = (startIndex + i) % allocLen;
        const event = decodeQueueItem(EVENT_QUEUE_HEADER, EVENT, buffer, nodeIndex);
        event.seqNum = (startSeq + i) % modulo32Uint;
        results.push(event);
    }
    return results;
}
exports.decodeEventsSince = decodeEventsSince;
function decodeRequestQueue(buffer, history) {
    const { header, nodes } = decodeQueue(REQUEST_QUEUE_HEADER, REQUEST, buffer, history);
    if (!header.accountFlags.initialized || !header.accountFlags.requestQueue) {
        throw new Error('Invalid requests queue');
    }
    return nodes;
}
exports.decodeRequestQueue = decodeRequestQueue;
function decodeEventQueue(buffer, history) {
    const { header, nodes } = decodeQueue(EVENT_QUEUE_HEADER, EVENT, buffer, history);
    if (!header.accountFlags.initialized || !header.accountFlags.eventQueue) {
        throw new Error('Invalid events queue');
    }
    return nodes;
}
exports.decodeEventQueue = decodeEventQueue;
exports.REQUEST_QUEUE_LAYOUT = {
    HEADER: REQUEST_QUEUE_HEADER,
    NODE: REQUEST,
};
exports.EVENT_QUEUE_LAYOUT = {
    HEADER: EVENT_QUEUE_HEADER,
    NODE: EVENT,
};
//# sourceMappingURL=queue.js.map