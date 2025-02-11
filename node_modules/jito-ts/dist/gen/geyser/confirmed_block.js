"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockHeight = exports.UnixTimestamp = exports.Rewards = exports.Reward = exports.ReturnData = exports.UiTokenAmount = exports.TokenBalance = exports.CompiledInstruction = exports.InnerInstruction = exports.InnerInstructions = exports.TransactionError = exports.TransactionStatusMeta = exports.MessageAddressTableLookup = exports.MessageHeader = exports.Message = exports.Transaction = exports.ConfirmedTransaction = exports.ConfirmedBlock = exports.rewardTypeToJSON = exports.rewardTypeFromJSON = exports.RewardType = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "solana.storage.ConfirmedBlock";
var RewardType;
(function (RewardType) {
    RewardType[RewardType["Unspecified"] = 0] = "Unspecified";
    RewardType[RewardType["Fee"] = 1] = "Fee";
    RewardType[RewardType["Rent"] = 2] = "Rent";
    RewardType[RewardType["Staking"] = 3] = "Staking";
    RewardType[RewardType["Voting"] = 4] = "Voting";
    RewardType[RewardType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(RewardType = exports.RewardType || (exports.RewardType = {}));
function rewardTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "Unspecified":
            return RewardType.Unspecified;
        case 1:
        case "Fee":
            return RewardType.Fee;
        case 2:
        case "Rent":
            return RewardType.Rent;
        case 3:
        case "Staking":
            return RewardType.Staking;
        case 4:
        case "Voting":
            return RewardType.Voting;
        case -1:
        case "UNRECOGNIZED":
        default:
            return RewardType.UNRECOGNIZED;
    }
}
exports.rewardTypeFromJSON = rewardTypeFromJSON;
function rewardTypeToJSON(object) {
    switch (object) {
        case RewardType.Unspecified:
            return "Unspecified";
        case RewardType.Fee:
            return "Fee";
        case RewardType.Rent:
            return "Rent";
        case RewardType.Staking:
            return "Staking";
        case RewardType.Voting:
            return "Voting";
        case RewardType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.rewardTypeToJSON = rewardTypeToJSON;
function createBaseConfirmedBlock() {
    return {
        previousBlockhash: "",
        blockhash: "",
        parentSlot: 0,
        transactions: [],
        rewards: [],
        blockTime: undefined,
        blockHeight: undefined,
    };
}
exports.ConfirmedBlock = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.previousBlockhash !== "") {
            writer.uint32(10).string(message.previousBlockhash);
        }
        if (message.blockhash !== "") {
            writer.uint32(18).string(message.blockhash);
        }
        if (message.parentSlot !== 0) {
            writer.uint32(24).uint64(message.parentSlot);
        }
        for (const v of message.transactions) {
            exports.ConfirmedTransaction.encode(v, writer.uint32(34).fork()).ldelim();
        }
        for (const v of message.rewards) {
            exports.Reward.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.blockTime !== undefined) {
            exports.UnixTimestamp.encode(message.blockTime, writer.uint32(50).fork()).ldelim();
        }
        if (message.blockHeight !== undefined) {
            exports.BlockHeight.encode(message.blockHeight, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConfirmedBlock();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.previousBlockhash = reader.string();
                    break;
                case 2:
                    message.blockhash = reader.string();
                    break;
                case 3:
                    message.parentSlot = longToNumber(reader.uint64());
                    break;
                case 4:
                    message.transactions.push(exports.ConfirmedTransaction.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.rewards.push(exports.Reward.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.blockTime = exports.UnixTimestamp.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.blockHeight = exports.BlockHeight.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            previousBlockhash: isSet(object.previousBlockhash) ? String(object.previousBlockhash) : "",
            blockhash: isSet(object.blockhash) ? String(object.blockhash) : "",
            parentSlot: isSet(object.parentSlot) ? Number(object.parentSlot) : 0,
            transactions: Array.isArray(object === null || object === void 0 ? void 0 : object.transactions)
                ? object.transactions.map((e) => exports.ConfirmedTransaction.fromJSON(e))
                : [],
            rewards: Array.isArray(object === null || object === void 0 ? void 0 : object.rewards) ? object.rewards.map((e) => exports.Reward.fromJSON(e)) : [],
            blockTime: isSet(object.blockTime) ? exports.UnixTimestamp.fromJSON(object.blockTime) : undefined,
            blockHeight: isSet(object.blockHeight) ? exports.BlockHeight.fromJSON(object.blockHeight) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.previousBlockhash !== undefined && (obj.previousBlockhash = message.previousBlockhash);
        message.blockhash !== undefined && (obj.blockhash = message.blockhash);
        message.parentSlot !== undefined && (obj.parentSlot = Math.round(message.parentSlot));
        if (message.transactions) {
            obj.transactions = message.transactions.map((e) => e ? exports.ConfirmedTransaction.toJSON(e) : undefined);
        }
        else {
            obj.transactions = [];
        }
        if (message.rewards) {
            obj.rewards = message.rewards.map((e) => e ? exports.Reward.toJSON(e) : undefined);
        }
        else {
            obj.rewards = [];
        }
        message.blockTime !== undefined &&
            (obj.blockTime = message.blockTime ? exports.UnixTimestamp.toJSON(message.blockTime) : undefined);
        message.blockHeight !== undefined &&
            (obj.blockHeight = message.blockHeight ? exports.BlockHeight.toJSON(message.blockHeight) : undefined);
        return obj;
    },
    create(base) {
        return exports.ConfirmedBlock.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseConfirmedBlock();
        message.previousBlockhash = (_a = object.previousBlockhash) !== null && _a !== void 0 ? _a : "";
        message.blockhash = (_b = object.blockhash) !== null && _b !== void 0 ? _b : "";
        message.parentSlot = (_c = object.parentSlot) !== null && _c !== void 0 ? _c : 0;
        message.transactions = ((_d = object.transactions) === null || _d === void 0 ? void 0 : _d.map((e) => exports.ConfirmedTransaction.fromPartial(e))) || [];
        message.rewards = ((_e = object.rewards) === null || _e === void 0 ? void 0 : _e.map((e) => exports.Reward.fromPartial(e))) || [];
        message.blockTime = (object.blockTime !== undefined && object.blockTime !== null)
            ? exports.UnixTimestamp.fromPartial(object.blockTime)
            : undefined;
        message.blockHeight = (object.blockHeight !== undefined && object.blockHeight !== null)
            ? exports.BlockHeight.fromPartial(object.blockHeight)
            : undefined;
        return message;
    },
};
function createBaseConfirmedTransaction() {
    return { transaction: undefined, meta: undefined };
}
exports.ConfirmedTransaction = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.transaction !== undefined) {
            exports.Transaction.encode(message.transaction, writer.uint32(10).fork()).ldelim();
        }
        if (message.meta !== undefined) {
            exports.TransactionStatusMeta.encode(message.meta, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConfirmedTransaction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.transaction = exports.Transaction.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.meta = exports.TransactionStatusMeta.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            transaction: isSet(object.transaction) ? exports.Transaction.fromJSON(object.transaction) : undefined,
            meta: isSet(object.meta) ? exports.TransactionStatusMeta.fromJSON(object.meta) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.transaction !== undefined &&
            (obj.transaction = message.transaction ? exports.Transaction.toJSON(message.transaction) : undefined);
        message.meta !== undefined && (obj.meta = message.meta ? exports.TransactionStatusMeta.toJSON(message.meta) : undefined);
        return obj;
    },
    create(base) {
        return exports.ConfirmedTransaction.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseConfirmedTransaction();
        message.transaction = (object.transaction !== undefined && object.transaction !== null)
            ? exports.Transaction.fromPartial(object.transaction)
            : undefined;
        message.meta = (object.meta !== undefined && object.meta !== null)
            ? exports.TransactionStatusMeta.fromPartial(object.meta)
            : undefined;
        return message;
    },
};
function createBaseTransaction() {
    return { signatures: [], message: undefined };
}
exports.Transaction = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.signatures) {
            writer.uint32(10).bytes(v);
        }
        if (message.message !== undefined) {
            exports.Message.encode(message.message, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransaction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signatures.push(reader.bytes());
                    break;
                case 2:
                    message.message = exports.Message.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures) ? object.signatures.map((e) => bytesFromBase64(e)) : [],
            message: isSet(object.message) ? exports.Message.fromJSON(object.message) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.signatures = [];
        }
        message.message !== undefined && (obj.message = message.message ? exports.Message.toJSON(message.message) : undefined);
        return obj;
    },
    create(base) {
        return exports.Transaction.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTransaction();
        message.signatures = ((_a = object.signatures) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        message.message = (object.message !== undefined && object.message !== null)
            ? exports.Message.fromPartial(object.message)
            : undefined;
        return message;
    },
};
function createBaseMessage() {
    return {
        header: undefined,
        accountKeys: [],
        recentBlockhash: new Uint8Array(),
        instructions: [],
        versioned: false,
        addressTableLookups: [],
    };
}
exports.Message = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.header !== undefined) {
            exports.MessageHeader.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.accountKeys) {
            writer.uint32(18).bytes(v);
        }
        if (message.recentBlockhash.length !== 0) {
            writer.uint32(26).bytes(message.recentBlockhash);
        }
        for (const v of message.instructions) {
            exports.CompiledInstruction.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.versioned === true) {
            writer.uint32(40).bool(message.versioned);
        }
        for (const v of message.addressTableLookups) {
            exports.MessageAddressTableLookup.encode(v, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMessage();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.header = exports.MessageHeader.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.accountKeys.push(reader.bytes());
                    break;
                case 3:
                    message.recentBlockhash = reader.bytes();
                    break;
                case 4:
                    message.instructions.push(exports.CompiledInstruction.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.versioned = reader.bool();
                    break;
                case 6:
                    message.addressTableLookups.push(exports.MessageAddressTableLookup.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            header: isSet(object.header) ? exports.MessageHeader.fromJSON(object.header) : undefined,
            accountKeys: Array.isArray(object === null || object === void 0 ? void 0 : object.accountKeys) ? object.accountKeys.map((e) => bytesFromBase64(e)) : [],
            recentBlockhash: isSet(object.recentBlockhash) ? bytesFromBase64(object.recentBlockhash) : new Uint8Array(),
            instructions: Array.isArray(object === null || object === void 0 ? void 0 : object.instructions)
                ? object.instructions.map((e) => exports.CompiledInstruction.fromJSON(e))
                : [],
            versioned: isSet(object.versioned) ? Boolean(object.versioned) : false,
            addressTableLookups: Array.isArray(object === null || object === void 0 ? void 0 : object.addressTableLookups)
                ? object.addressTableLookups.map((e) => exports.MessageAddressTableLookup.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.header !== undefined && (obj.header = message.header ? exports.MessageHeader.toJSON(message.header) : undefined);
        if (message.accountKeys) {
            obj.accountKeys = message.accountKeys.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.accountKeys = [];
        }
        message.recentBlockhash !== undefined &&
            (obj.recentBlockhash = base64FromBytes(message.recentBlockhash !== undefined ? message.recentBlockhash : new Uint8Array()));
        if (message.instructions) {
            obj.instructions = message.instructions.map((e) => e ? exports.CompiledInstruction.toJSON(e) : undefined);
        }
        else {
            obj.instructions = [];
        }
        message.versioned !== undefined && (obj.versioned = message.versioned);
        if (message.addressTableLookups) {
            obj.addressTableLookups = message.addressTableLookups.map((e) => e ? exports.MessageAddressTableLookup.toJSON(e) : undefined);
        }
        else {
            obj.addressTableLookups = [];
        }
        return obj;
    },
    create(base) {
        return exports.Message.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseMessage();
        message.header = (object.header !== undefined && object.header !== null)
            ? exports.MessageHeader.fromPartial(object.header)
            : undefined;
        message.accountKeys = ((_a = object.accountKeys) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        message.recentBlockhash = (_b = object.recentBlockhash) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.instructions = ((_c = object.instructions) === null || _c === void 0 ? void 0 : _c.map((e) => exports.CompiledInstruction.fromPartial(e))) || [];
        message.versioned = (_d = object.versioned) !== null && _d !== void 0 ? _d : false;
        message.addressTableLookups = ((_e = object.addressTableLookups) === null || _e === void 0 ? void 0 : _e.map((e) => exports.MessageAddressTableLookup.fromPartial(e))) ||
            [];
        return message;
    },
};
function createBaseMessageHeader() {
    return { numRequiredSignatures: 0, numReadonlySignedAccounts: 0, numReadonlyUnsignedAccounts: 0 };
}
exports.MessageHeader = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.numRequiredSignatures !== 0) {
            writer.uint32(8).uint32(message.numRequiredSignatures);
        }
        if (message.numReadonlySignedAccounts !== 0) {
            writer.uint32(16).uint32(message.numReadonlySignedAccounts);
        }
        if (message.numReadonlyUnsignedAccounts !== 0) {
            writer.uint32(24).uint32(message.numReadonlyUnsignedAccounts);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMessageHeader();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.numRequiredSignatures = reader.uint32();
                    break;
                case 2:
                    message.numReadonlySignedAccounts = reader.uint32();
                    break;
                case 3:
                    message.numReadonlyUnsignedAccounts = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            numRequiredSignatures: isSet(object.numRequiredSignatures) ? Number(object.numRequiredSignatures) : 0,
            numReadonlySignedAccounts: isSet(object.numReadonlySignedAccounts) ? Number(object.numReadonlySignedAccounts) : 0,
            numReadonlyUnsignedAccounts: isSet(object.numReadonlyUnsignedAccounts)
                ? Number(object.numReadonlyUnsignedAccounts)
                : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.numRequiredSignatures !== undefined &&
            (obj.numRequiredSignatures = Math.round(message.numRequiredSignatures));
        message.numReadonlySignedAccounts !== undefined &&
            (obj.numReadonlySignedAccounts = Math.round(message.numReadonlySignedAccounts));
        message.numReadonlyUnsignedAccounts !== undefined &&
            (obj.numReadonlyUnsignedAccounts = Math.round(message.numReadonlyUnsignedAccounts));
        return obj;
    },
    create(base) {
        return exports.MessageHeader.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMessageHeader();
        message.numRequiredSignatures = (_a = object.numRequiredSignatures) !== null && _a !== void 0 ? _a : 0;
        message.numReadonlySignedAccounts = (_b = object.numReadonlySignedAccounts) !== null && _b !== void 0 ? _b : 0;
        message.numReadonlyUnsignedAccounts = (_c = object.numReadonlyUnsignedAccounts) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
function createBaseMessageAddressTableLookup() {
    return { accountKey: new Uint8Array(), writableIndexes: new Uint8Array(), readonlyIndexes: new Uint8Array() };
}
exports.MessageAddressTableLookup = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.accountKey.length !== 0) {
            writer.uint32(10).bytes(message.accountKey);
        }
        if (message.writableIndexes.length !== 0) {
            writer.uint32(18).bytes(message.writableIndexes);
        }
        if (message.readonlyIndexes.length !== 0) {
            writer.uint32(26).bytes(message.readonlyIndexes);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMessageAddressTableLookup();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accountKey = reader.bytes();
                    break;
                case 2:
                    message.writableIndexes = reader.bytes();
                    break;
                case 3:
                    message.readonlyIndexes = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            accountKey: isSet(object.accountKey) ? bytesFromBase64(object.accountKey) : new Uint8Array(),
            writableIndexes: isSet(object.writableIndexes) ? bytesFromBase64(object.writableIndexes) : new Uint8Array(),
            readonlyIndexes: isSet(object.readonlyIndexes) ? bytesFromBase64(object.readonlyIndexes) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.accountKey !== undefined &&
            (obj.accountKey = base64FromBytes(message.accountKey !== undefined ? message.accountKey : new Uint8Array()));
        message.writableIndexes !== undefined &&
            (obj.writableIndexes = base64FromBytes(message.writableIndexes !== undefined ? message.writableIndexes : new Uint8Array()));
        message.readonlyIndexes !== undefined &&
            (obj.readonlyIndexes = base64FromBytes(message.readonlyIndexes !== undefined ? message.readonlyIndexes : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.MessageAddressTableLookup.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMessageAddressTableLookup();
        message.accountKey = (_a = object.accountKey) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.writableIndexes = (_b = object.writableIndexes) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.readonlyIndexes = (_c = object.readonlyIndexes) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
function createBaseTransactionStatusMeta() {
    return {
        err: undefined,
        fee: 0,
        preBalances: [],
        postBalances: [],
        innerInstructions: [],
        innerInstructionsNone: false,
        logMessages: [],
        logMessagesNone: false,
        preTokenBalances: [],
        postTokenBalances: [],
        rewards: [],
        loadedWritableAddresses: [],
        loadedReadonlyAddresses: [],
        returnData: undefined,
        returnDataNone: false,
        computeUnitsConsumed: undefined,
    };
}
exports.TransactionStatusMeta = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.err !== undefined) {
            exports.TransactionError.encode(message.err, writer.uint32(10).fork()).ldelim();
        }
        if (message.fee !== 0) {
            writer.uint32(16).uint64(message.fee);
        }
        writer.uint32(26).fork();
        for (const v of message.preBalances) {
            writer.uint64(v);
        }
        writer.ldelim();
        writer.uint32(34).fork();
        for (const v of message.postBalances) {
            writer.uint64(v);
        }
        writer.ldelim();
        for (const v of message.innerInstructions) {
            exports.InnerInstructions.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.innerInstructionsNone === true) {
            writer.uint32(80).bool(message.innerInstructionsNone);
        }
        for (const v of message.logMessages) {
            writer.uint32(50).string(v);
        }
        if (message.logMessagesNone === true) {
            writer.uint32(88).bool(message.logMessagesNone);
        }
        for (const v of message.preTokenBalances) {
            exports.TokenBalance.encode(v, writer.uint32(58).fork()).ldelim();
        }
        for (const v of message.postTokenBalances) {
            exports.TokenBalance.encode(v, writer.uint32(66).fork()).ldelim();
        }
        for (const v of message.rewards) {
            exports.Reward.encode(v, writer.uint32(74).fork()).ldelim();
        }
        for (const v of message.loadedWritableAddresses) {
            writer.uint32(98).bytes(v);
        }
        for (const v of message.loadedReadonlyAddresses) {
            writer.uint32(106).bytes(v);
        }
        if (message.returnData !== undefined) {
            exports.ReturnData.encode(message.returnData, writer.uint32(114).fork()).ldelim();
        }
        if (message.returnDataNone === true) {
            writer.uint32(120).bool(message.returnDataNone);
        }
        if (message.computeUnitsConsumed !== undefined) {
            writer.uint32(128).uint64(message.computeUnitsConsumed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionStatusMeta();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.err = exports.TransactionError.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.fee = longToNumber(reader.uint64());
                    break;
                case 3:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.preBalances.push(longToNumber(reader.uint64()));
                        }
                    }
                    else {
                        message.preBalances.push(longToNumber(reader.uint64()));
                    }
                    break;
                case 4:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.postBalances.push(longToNumber(reader.uint64()));
                        }
                    }
                    else {
                        message.postBalances.push(longToNumber(reader.uint64()));
                    }
                    break;
                case 5:
                    message.innerInstructions.push(exports.InnerInstructions.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.innerInstructionsNone = reader.bool();
                    break;
                case 6:
                    message.logMessages.push(reader.string());
                    break;
                case 11:
                    message.logMessagesNone = reader.bool();
                    break;
                case 7:
                    message.preTokenBalances.push(exports.TokenBalance.decode(reader, reader.uint32()));
                    break;
                case 8:
                    message.postTokenBalances.push(exports.TokenBalance.decode(reader, reader.uint32()));
                    break;
                case 9:
                    message.rewards.push(exports.Reward.decode(reader, reader.uint32()));
                    break;
                case 12:
                    message.loadedWritableAddresses.push(reader.bytes());
                    break;
                case 13:
                    message.loadedReadonlyAddresses.push(reader.bytes());
                    break;
                case 14:
                    message.returnData = exports.ReturnData.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.returnDataNone = reader.bool();
                    break;
                case 16:
                    message.computeUnitsConsumed = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            err: isSet(object.err) ? exports.TransactionError.fromJSON(object.err) : undefined,
            fee: isSet(object.fee) ? Number(object.fee) : 0,
            preBalances: Array.isArray(object === null || object === void 0 ? void 0 : object.preBalances) ? object.preBalances.map((e) => Number(e)) : [],
            postBalances: Array.isArray(object === null || object === void 0 ? void 0 : object.postBalances) ? object.postBalances.map((e) => Number(e)) : [],
            innerInstructions: Array.isArray(object === null || object === void 0 ? void 0 : object.innerInstructions)
                ? object.innerInstructions.map((e) => exports.InnerInstructions.fromJSON(e))
                : [],
            innerInstructionsNone: isSet(object.innerInstructionsNone) ? Boolean(object.innerInstructionsNone) : false,
            logMessages: Array.isArray(object === null || object === void 0 ? void 0 : object.logMessages) ? object.logMessages.map((e) => String(e)) : [],
            logMessagesNone: isSet(object.logMessagesNone) ? Boolean(object.logMessagesNone) : false,
            preTokenBalances: Array.isArray(object === null || object === void 0 ? void 0 : object.preTokenBalances)
                ? object.preTokenBalances.map((e) => exports.TokenBalance.fromJSON(e))
                : [],
            postTokenBalances: Array.isArray(object === null || object === void 0 ? void 0 : object.postTokenBalances)
                ? object.postTokenBalances.map((e) => exports.TokenBalance.fromJSON(e))
                : [],
            rewards: Array.isArray(object === null || object === void 0 ? void 0 : object.rewards) ? object.rewards.map((e) => exports.Reward.fromJSON(e)) : [],
            loadedWritableAddresses: Array.isArray(object === null || object === void 0 ? void 0 : object.loadedWritableAddresses)
                ? object.loadedWritableAddresses.map((e) => bytesFromBase64(e))
                : [],
            loadedReadonlyAddresses: Array.isArray(object === null || object === void 0 ? void 0 : object.loadedReadonlyAddresses)
                ? object.loadedReadonlyAddresses.map((e) => bytesFromBase64(e))
                : [],
            returnData: isSet(object.returnData) ? exports.ReturnData.fromJSON(object.returnData) : undefined,
            returnDataNone: isSet(object.returnDataNone) ? Boolean(object.returnDataNone) : false,
            computeUnitsConsumed: isSet(object.computeUnitsConsumed) ? Number(object.computeUnitsConsumed) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.err !== undefined && (obj.err = message.err ? exports.TransactionError.toJSON(message.err) : undefined);
        message.fee !== undefined && (obj.fee = Math.round(message.fee));
        if (message.preBalances) {
            obj.preBalances = message.preBalances.map((e) => Math.round(e));
        }
        else {
            obj.preBalances = [];
        }
        if (message.postBalances) {
            obj.postBalances = message.postBalances.map((e) => Math.round(e));
        }
        else {
            obj.postBalances = [];
        }
        if (message.innerInstructions) {
            obj.innerInstructions = message.innerInstructions.map((e) => e ? exports.InnerInstructions.toJSON(e) : undefined);
        }
        else {
            obj.innerInstructions = [];
        }
        message.innerInstructionsNone !== undefined && (obj.innerInstructionsNone = message.innerInstructionsNone);
        if (message.logMessages) {
            obj.logMessages = message.logMessages.map((e) => e);
        }
        else {
            obj.logMessages = [];
        }
        message.logMessagesNone !== undefined && (obj.logMessagesNone = message.logMessagesNone);
        if (message.preTokenBalances) {
            obj.preTokenBalances = message.preTokenBalances.map((e) => e ? exports.TokenBalance.toJSON(e) : undefined);
        }
        else {
            obj.preTokenBalances = [];
        }
        if (message.postTokenBalances) {
            obj.postTokenBalances = message.postTokenBalances.map((e) => e ? exports.TokenBalance.toJSON(e) : undefined);
        }
        else {
            obj.postTokenBalances = [];
        }
        if (message.rewards) {
            obj.rewards = message.rewards.map((e) => e ? exports.Reward.toJSON(e) : undefined);
        }
        else {
            obj.rewards = [];
        }
        if (message.loadedWritableAddresses) {
            obj.loadedWritableAddresses = message.loadedWritableAddresses.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.loadedWritableAddresses = [];
        }
        if (message.loadedReadonlyAddresses) {
            obj.loadedReadonlyAddresses = message.loadedReadonlyAddresses.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.loadedReadonlyAddresses = [];
        }
        message.returnData !== undefined &&
            (obj.returnData = message.returnData ? exports.ReturnData.toJSON(message.returnData) : undefined);
        message.returnDataNone !== undefined && (obj.returnDataNone = message.returnDataNone);
        message.computeUnitsConsumed !== undefined && (obj.computeUnitsConsumed = Math.round(message.computeUnitsConsumed));
        return obj;
    },
    create(base) {
        return exports.TransactionStatusMeta.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const message = createBaseTransactionStatusMeta();
        message.err = (object.err !== undefined && object.err !== null)
            ? exports.TransactionError.fromPartial(object.err)
            : undefined;
        message.fee = (_a = object.fee) !== null && _a !== void 0 ? _a : 0;
        message.preBalances = ((_b = object.preBalances) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        message.postBalances = ((_c = object.postBalances) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        message.innerInstructions = ((_d = object.innerInstructions) === null || _d === void 0 ? void 0 : _d.map((e) => exports.InnerInstructions.fromPartial(e))) || [];
        message.innerInstructionsNone = (_e = object.innerInstructionsNone) !== null && _e !== void 0 ? _e : false;
        message.logMessages = ((_f = object.logMessages) === null || _f === void 0 ? void 0 : _f.map((e) => e)) || [];
        message.logMessagesNone = (_g = object.logMessagesNone) !== null && _g !== void 0 ? _g : false;
        message.preTokenBalances = ((_h = object.preTokenBalances) === null || _h === void 0 ? void 0 : _h.map((e) => exports.TokenBalance.fromPartial(e))) || [];
        message.postTokenBalances = ((_j = object.postTokenBalances) === null || _j === void 0 ? void 0 : _j.map((e) => exports.TokenBalance.fromPartial(e))) || [];
        message.rewards = ((_k = object.rewards) === null || _k === void 0 ? void 0 : _k.map((e) => exports.Reward.fromPartial(e))) || [];
        message.loadedWritableAddresses = ((_l = object.loadedWritableAddresses) === null || _l === void 0 ? void 0 : _l.map((e) => e)) || [];
        message.loadedReadonlyAddresses = ((_m = object.loadedReadonlyAddresses) === null || _m === void 0 ? void 0 : _m.map((e) => e)) || [];
        message.returnData = (object.returnData !== undefined && object.returnData !== null)
            ? exports.ReturnData.fromPartial(object.returnData)
            : undefined;
        message.returnDataNone = (_o = object.returnDataNone) !== null && _o !== void 0 ? _o : false;
        message.computeUnitsConsumed = (_p = object.computeUnitsConsumed) !== null && _p !== void 0 ? _p : undefined;
        return message;
    },
};
function createBaseTransactionError() {
    return { err: new Uint8Array() };
}
exports.TransactionError = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.err.length !== 0) {
            writer.uint32(10).bytes(message.err);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionError();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.err = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { err: isSet(object.err) ? bytesFromBase64(object.err) : new Uint8Array() };
    },
    toJSON(message) {
        const obj = {};
        message.err !== undefined &&
            (obj.err = base64FromBytes(message.err !== undefined ? message.err : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.TransactionError.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTransactionError();
        message.err = (_a = object.err) !== null && _a !== void 0 ? _a : new Uint8Array();
        return message;
    },
};
function createBaseInnerInstructions() {
    return { index: 0, instructions: [] };
}
exports.InnerInstructions = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.index !== 0) {
            writer.uint32(8).uint32(message.index);
        }
        for (const v of message.instructions) {
            exports.InnerInstruction.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInnerInstructions();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.index = reader.uint32();
                    break;
                case 2:
                    message.instructions.push(exports.InnerInstruction.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            index: isSet(object.index) ? Number(object.index) : 0,
            instructions: Array.isArray(object === null || object === void 0 ? void 0 : object.instructions)
                ? object.instructions.map((e) => exports.InnerInstruction.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.index !== undefined && (obj.index = Math.round(message.index));
        if (message.instructions) {
            obj.instructions = message.instructions.map((e) => e ? exports.InnerInstruction.toJSON(e) : undefined);
        }
        else {
            obj.instructions = [];
        }
        return obj;
    },
    create(base) {
        return exports.InnerInstructions.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseInnerInstructions();
        message.index = (_a = object.index) !== null && _a !== void 0 ? _a : 0;
        message.instructions = ((_b = object.instructions) === null || _b === void 0 ? void 0 : _b.map((e) => exports.InnerInstruction.fromPartial(e))) || [];
        return message;
    },
};
function createBaseInnerInstruction() {
    return { programIdIndex: 0, accounts: new Uint8Array(), data: new Uint8Array(), stackHeight: undefined };
}
exports.InnerInstruction = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.programIdIndex !== 0) {
            writer.uint32(8).uint32(message.programIdIndex);
        }
        if (message.accounts.length !== 0) {
            writer.uint32(18).bytes(message.accounts);
        }
        if (message.data.length !== 0) {
            writer.uint32(26).bytes(message.data);
        }
        if (message.stackHeight !== undefined) {
            writer.uint32(32).uint32(message.stackHeight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInnerInstruction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.programIdIndex = reader.uint32();
                    break;
                case 2:
                    message.accounts = reader.bytes();
                    break;
                case 3:
                    message.data = reader.bytes();
                    break;
                case 4:
                    message.stackHeight = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            programIdIndex: isSet(object.programIdIndex) ? Number(object.programIdIndex) : 0,
            accounts: isSet(object.accounts) ? bytesFromBase64(object.accounts) : new Uint8Array(),
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
            stackHeight: isSet(object.stackHeight) ? Number(object.stackHeight) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.programIdIndex !== undefined && (obj.programIdIndex = Math.round(message.programIdIndex));
        message.accounts !== undefined &&
            (obj.accounts = base64FromBytes(message.accounts !== undefined ? message.accounts : new Uint8Array()));
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        message.stackHeight !== undefined && (obj.stackHeight = Math.round(message.stackHeight));
        return obj;
    },
    create(base) {
        return exports.InnerInstruction.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseInnerInstruction();
        message.programIdIndex = (_a = object.programIdIndex) !== null && _a !== void 0 ? _a : 0;
        message.accounts = (_b = object.accounts) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.data = (_c = object.data) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.stackHeight = (_d = object.stackHeight) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
function createBaseCompiledInstruction() {
    return { programIdIndex: 0, accounts: new Uint8Array(), data: new Uint8Array() };
}
exports.CompiledInstruction = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.programIdIndex !== 0) {
            writer.uint32(8).uint32(message.programIdIndex);
        }
        if (message.accounts.length !== 0) {
            writer.uint32(18).bytes(message.accounts);
        }
        if (message.data.length !== 0) {
            writer.uint32(26).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCompiledInstruction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.programIdIndex = reader.uint32();
                    break;
                case 2:
                    message.accounts = reader.bytes();
                    break;
                case 3:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            programIdIndex: isSet(object.programIdIndex) ? Number(object.programIdIndex) : 0,
            accounts: isSet(object.accounts) ? bytesFromBase64(object.accounts) : new Uint8Array(),
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.programIdIndex !== undefined && (obj.programIdIndex = Math.round(message.programIdIndex));
        message.accounts !== undefined &&
            (obj.accounts = base64FromBytes(message.accounts !== undefined ? message.accounts : new Uint8Array()));
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.CompiledInstruction.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseCompiledInstruction();
        message.programIdIndex = (_a = object.programIdIndex) !== null && _a !== void 0 ? _a : 0;
        message.accounts = (_b = object.accounts) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.data = (_c = object.data) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
function createBaseTokenBalance() {
    return { accountIndex: 0, mint: "", uiTokenAmount: undefined, owner: "", programId: "" };
}
exports.TokenBalance = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.accountIndex !== 0) {
            writer.uint32(8).uint32(message.accountIndex);
        }
        if (message.mint !== "") {
            writer.uint32(18).string(message.mint);
        }
        if (message.uiTokenAmount !== undefined) {
            exports.UiTokenAmount.encode(message.uiTokenAmount, writer.uint32(26).fork()).ldelim();
        }
        if (message.owner !== "") {
            writer.uint32(34).string(message.owner);
        }
        if (message.programId !== "") {
            writer.uint32(42).string(message.programId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTokenBalance();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accountIndex = reader.uint32();
                    break;
                case 2:
                    message.mint = reader.string();
                    break;
                case 3:
                    message.uiTokenAmount = exports.UiTokenAmount.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.owner = reader.string();
                    break;
                case 5:
                    message.programId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            accountIndex: isSet(object.accountIndex) ? Number(object.accountIndex) : 0,
            mint: isSet(object.mint) ? String(object.mint) : "",
            uiTokenAmount: isSet(object.uiTokenAmount) ? exports.UiTokenAmount.fromJSON(object.uiTokenAmount) : undefined,
            owner: isSet(object.owner) ? String(object.owner) : "",
            programId: isSet(object.programId) ? String(object.programId) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.accountIndex !== undefined && (obj.accountIndex = Math.round(message.accountIndex));
        message.mint !== undefined && (obj.mint = message.mint);
        message.uiTokenAmount !== undefined &&
            (obj.uiTokenAmount = message.uiTokenAmount ? exports.UiTokenAmount.toJSON(message.uiTokenAmount) : undefined);
        message.owner !== undefined && (obj.owner = message.owner);
        message.programId !== undefined && (obj.programId = message.programId);
        return obj;
    },
    create(base) {
        return exports.TokenBalance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseTokenBalance();
        message.accountIndex = (_a = object.accountIndex) !== null && _a !== void 0 ? _a : 0;
        message.mint = (_b = object.mint) !== null && _b !== void 0 ? _b : "";
        message.uiTokenAmount = (object.uiTokenAmount !== undefined && object.uiTokenAmount !== null)
            ? exports.UiTokenAmount.fromPartial(object.uiTokenAmount)
            : undefined;
        message.owner = (_c = object.owner) !== null && _c !== void 0 ? _c : "";
        message.programId = (_d = object.programId) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseUiTokenAmount() {
    return { uiAmount: 0, decimals: 0, amount: "", uiAmountString: "" };
}
exports.UiTokenAmount = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.uiAmount !== 0) {
            writer.uint32(9).double(message.uiAmount);
        }
        if (message.decimals !== 0) {
            writer.uint32(16).uint32(message.decimals);
        }
        if (message.amount !== "") {
            writer.uint32(26).string(message.amount);
        }
        if (message.uiAmountString !== "") {
            writer.uint32(34).string(message.uiAmountString);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUiTokenAmount();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.uiAmount = reader.double();
                    break;
                case 2:
                    message.decimals = reader.uint32();
                    break;
                case 3:
                    message.amount = reader.string();
                    break;
                case 4:
                    message.uiAmountString = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            uiAmount: isSet(object.uiAmount) ? Number(object.uiAmount) : 0,
            decimals: isSet(object.decimals) ? Number(object.decimals) : 0,
            amount: isSet(object.amount) ? String(object.amount) : "",
            uiAmountString: isSet(object.uiAmountString) ? String(object.uiAmountString) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.uiAmount !== undefined && (obj.uiAmount = message.uiAmount);
        message.decimals !== undefined && (obj.decimals = Math.round(message.decimals));
        message.amount !== undefined && (obj.amount = message.amount);
        message.uiAmountString !== undefined && (obj.uiAmountString = message.uiAmountString);
        return obj;
    },
    create(base) {
        return exports.UiTokenAmount.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseUiTokenAmount();
        message.uiAmount = (_a = object.uiAmount) !== null && _a !== void 0 ? _a : 0;
        message.decimals = (_b = object.decimals) !== null && _b !== void 0 ? _b : 0;
        message.amount = (_c = object.amount) !== null && _c !== void 0 ? _c : "";
        message.uiAmountString = (_d = object.uiAmountString) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseReturnData() {
    return { programId: new Uint8Array(), data: new Uint8Array() };
}
exports.ReturnData = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.programId.length !== 0) {
            writer.uint32(10).bytes(message.programId);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseReturnData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.programId = reader.bytes();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            programId: isSet(object.programId) ? bytesFromBase64(object.programId) : new Uint8Array(),
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.programId !== undefined &&
            (obj.programId = base64FromBytes(message.programId !== undefined ? message.programId : new Uint8Array()));
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.ReturnData.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseReturnData();
        message.programId = (_a = object.programId) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.data = (_b = object.data) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBaseReward() {
    return { pubkey: "", lamports: 0, postBalance: 0, rewardType: 0, commission: "" };
}
exports.Reward = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pubkey !== "") {
            writer.uint32(10).string(message.pubkey);
        }
        if (message.lamports !== 0) {
            writer.uint32(16).int64(message.lamports);
        }
        if (message.postBalance !== 0) {
            writer.uint32(24).uint64(message.postBalance);
        }
        if (message.rewardType !== 0) {
            writer.uint32(32).int32(message.rewardType);
        }
        if (message.commission !== "") {
            writer.uint32(42).string(message.commission);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseReward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pubkey = reader.string();
                    break;
                case 2:
                    message.lamports = longToNumber(reader.int64());
                    break;
                case 3:
                    message.postBalance = longToNumber(reader.uint64());
                    break;
                case 4:
                    message.rewardType = reader.int32();
                    break;
                case 5:
                    message.commission = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
            lamports: isSet(object.lamports) ? Number(object.lamports) : 0,
            postBalance: isSet(object.postBalance) ? Number(object.postBalance) : 0,
            rewardType: isSet(object.rewardType) ? rewardTypeFromJSON(object.rewardType) : 0,
            commission: isSet(object.commission) ? String(object.commission) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.pubkey !== undefined && (obj.pubkey = message.pubkey);
        message.lamports !== undefined && (obj.lamports = Math.round(message.lamports));
        message.postBalance !== undefined && (obj.postBalance = Math.round(message.postBalance));
        message.rewardType !== undefined && (obj.rewardType = rewardTypeToJSON(message.rewardType));
        message.commission !== undefined && (obj.commission = message.commission);
        return obj;
    },
    create(base) {
        return exports.Reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseReward();
        message.pubkey = (_a = object.pubkey) !== null && _a !== void 0 ? _a : "";
        message.lamports = (_b = object.lamports) !== null && _b !== void 0 ? _b : 0;
        message.postBalance = (_c = object.postBalance) !== null && _c !== void 0 ? _c : 0;
        message.rewardType = (_d = object.rewardType) !== null && _d !== void 0 ? _d : 0;
        message.commission = (_e = object.commission) !== null && _e !== void 0 ? _e : "";
        return message;
    },
};
function createBaseRewards() {
    return { rewards: [] };
}
exports.Rewards = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.rewards) {
            exports.Reward.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRewards();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.rewards.push(exports.Reward.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { rewards: Array.isArray(object === null || object === void 0 ? void 0 : object.rewards) ? object.rewards.map((e) => exports.Reward.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.rewards) {
            obj.rewards = message.rewards.map((e) => e ? exports.Reward.toJSON(e) : undefined);
        }
        else {
            obj.rewards = [];
        }
        return obj;
    },
    create(base) {
        return exports.Rewards.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseRewards();
        message.rewards = ((_a = object.rewards) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Reward.fromPartial(e))) || [];
        return message;
    },
};
function createBaseUnixTimestamp() {
    return { timestamp: 0 };
}
exports.UnixTimestamp = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.timestamp !== 0) {
            writer.uint32(8).int64(message.timestamp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUnixTimestamp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.timestamp = longToNumber(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
        return obj;
    },
    create(base) {
        return exports.UnixTimestamp.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseUnixTimestamp();
        message.timestamp = (_a = object.timestamp) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseBlockHeight() {
    return { blockHeight: 0 };
}
exports.BlockHeight = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.blockHeight !== 0) {
            writer.uint32(8).uint64(message.blockHeight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockHeight();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.blockHeight = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.blockHeight !== undefined && (obj.blockHeight = Math.round(message.blockHeight));
        return obj;
    },
    create(base) {
        return exports.BlockHeight.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseBlockHeight();
        message.blockHeight = (_a = object.blockHeight) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
var tsProtoGlobalThis = (() => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
    if (tsProtoGlobalThis.Buffer) {
        return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = tsProtoGlobalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (tsProtoGlobalThis.Buffer) {
        return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(String.fromCharCode(byte));
        });
        return tsProtoGlobalThis.btoa(bin.join(""));
    }
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=confirmed_block.js.map