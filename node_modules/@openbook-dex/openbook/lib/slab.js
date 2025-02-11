"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slab = exports.SLAB_LAYOUT = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_layout_1 = require("buffer-layout");
const layout_1 = require("./layout");
const SLAB_HEADER_LAYOUT = (0, buffer_layout_1.struct)([
    // Number of modified slab nodes
    (0, buffer_layout_1.u32)('bumpIndex'),
    (0, layout_1.zeros)(4),
    // Linked list of unused nodes
    (0, buffer_layout_1.u32)('freeListLen'),
    (0, layout_1.zeros)(4),
    (0, buffer_layout_1.u32)('freeListHead'),
    (0, buffer_layout_1.u32)('root'),
    (0, buffer_layout_1.u32)('leafCount'),
    (0, layout_1.zeros)(4),
], 'header');
const SLAB_NODE_LAYOUT = (0, buffer_layout_1.union)((0, buffer_layout_1.u32)('tag'), (0, buffer_layout_1.blob)(68), 'node');
SLAB_NODE_LAYOUT.addVariant(0, (0, buffer_layout_1.struct)([]), 'uninitialized');
SLAB_NODE_LAYOUT.addVariant(1, (0, buffer_layout_1.struct)([
    // Only the first prefixLen high-order bits of key are meaningful
    (0, buffer_layout_1.u32)('prefixLen'),
    (0, layout_1.u128)('key'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.u32)(), 2, 'children'),
]), 'innerNode');
SLAB_NODE_LAYOUT.addVariant(2, (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('ownerSlot'),
    (0, buffer_layout_1.u8)('feeTier'),
    (0, buffer_layout_1.blob)(2),
    (0, layout_1.u128)('key'),
    (0, layout_1.publicKeyLayout)('owner'),
    (0, layout_1.u64)('quantity'),
    (0, layout_1.u64)('clientOrderId'),
]), 'leafNode');
SLAB_NODE_LAYOUT.addVariant(3, (0, buffer_layout_1.struct)([(0, buffer_layout_1.u32)('next')]), 'freeNode');
SLAB_NODE_LAYOUT.addVariant(4, (0, buffer_layout_1.struct)([]), 'lastFreeNode');
exports.SLAB_LAYOUT = (0, buffer_layout_1.struct)([
    SLAB_HEADER_LAYOUT,
    (0, buffer_layout_1.seq)(SLAB_NODE_LAYOUT, (0, buffer_layout_1.offset)(SLAB_HEADER_LAYOUT.layoutFor('bumpIndex'), SLAB_HEADER_LAYOUT.offsetOf('bumpIndex') - SLAB_HEADER_LAYOUT.span), 'nodes'),
]);
class Slab {
    constructor(header, nodes) {
        this.header = header;
        this.nodes = nodes;
    }
    static decode(buffer) {
        return exports.SLAB_LAYOUT.decode(buffer);
    }
    get(searchKey) {
        if (this.header.leafCount === 0) {
            return null;
        }
        if (!(searchKey instanceof bn_js_1.default)) {
            searchKey = new bn_js_1.default(searchKey);
        }
        let index = this.header.root;
        while (true) {
            const { leafNode, innerNode } = this.nodes[index];
            if (leafNode) {
                if (leafNode.key.eq(searchKey)) {
                    return leafNode;
                }
                return null;
            }
            else if (innerNode) {
                if (!innerNode.key
                    .xor(searchKey)
                    .iushrn(128 - innerNode.prefixLen)
                    .isZero()) {
                    return null;
                }
                index =
                    innerNode.children[searchKey.testn(128 - innerNode.prefixLen - 1) ? 1 : 0];
            }
            else {
                throw new Error('Invalid slab');
            }
        }
    }
    [Symbol.iterator]() {
        return this.items(false);
    }
    *items(descending = false) {
        if (this.header.leafCount === 0) {
            return;
        }
        const stack = [this.header.root];
        while (stack.length > 0) {
            const index = stack.pop();
            const { leafNode, innerNode } = this.nodes[index];
            if (leafNode) {
                yield leafNode;
            }
            else if (innerNode) {
                if (descending) {
                    stack.push(innerNode.children[0], innerNode.children[1]);
                }
                else {
                    stack.push(innerNode.children[1], innerNode.children[0]);
                }
            }
        }
    }
}
exports.Slab = Slab;
(0, layout_1.setLayoutDecoder)(exports.SLAB_LAYOUT, ({ header, nodes }) => new Slab(header, nodes));
