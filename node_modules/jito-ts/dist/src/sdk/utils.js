'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.isError =
  exports.serializeTransactions =
  exports.deserializeTransactions =
  exports.unixTimestampFromDate =
    void 0;
const web3_js_1 = require('@solana/web3.js');
const unixTimestampFromDate = date => {
  return Math.floor(date.getTime() / 1000);
};
exports.unixTimestampFromDate = unixTimestampFromDate;
const deserializeTransactions = packets => {
  return packets.map(p => {
    return web3_js_1.Transaction.from(p.data);
  });
};
exports.deserializeTransactions = deserializeTransactions;
const serializeTransactions = txs => {
  return txs.map(tx => {
    const data = tx.serialize({
      requireAllSignatures: true,
      verifySignatures: true,
    });
    return {
      data,
      meta: {
        port: 0,
        addr: '0.0.0.0',
        senderStake: 0,
        size: data.length,
        flags: undefined,
      },
    };
  });
};
exports.serializeTransactions = serializeTransactions;
const isError = value => {
  return value instanceof Error;
};
exports.isError = isError;
//# sourceMappingURL=utils.js.map
