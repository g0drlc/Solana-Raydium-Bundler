'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.searcherClient = exports.SearcherClient = void 0;
const grpc_js_1 = require('@grpc/grpc-js');
const auth_1 = require('../gen/block-engine/auth');
const searcher_1 = require('../gen/block-engine/searcher');
const auth_2 = require('./auth');
const utils_1 = require('./utils');
class SearcherClient {
  constructor(client) {
    this.client = client;
  }
  // Submits a bundle to the block-engine.
  // Returns a promise yielding the bundle's uuid.
  async sendBundle(bundle) {
    return new Promise((resolve, reject) => {
      this.client.sendBundle(
        {
          bundle,
        },
        async (e, resp) => {
          if (e) {
            reject(e);
          } else {
            resolve(resp.uuid);
          }
        }
      );
    });
  }
  async getTipAccounts() {
    return new Promise((resolve, reject) => {
      this.client.getTipAccounts({}, async (e, resp) => {
        if (e) {
          reject(e);
        } else {
          resolve(resp.accounts);
        }
      });
    });
  }
  // Returns a map of validator identity keys to their respective slot lists.
  // These are validators connected to the block-engine.
  async getConnectedLeaders() {
    return new Promise((resolve, reject) => {
      this.client.getConnectedLeaders({}, async (e, resp) => {
        if (e) {
          reject(e);
        } else {
          resolve(resp.connectedValidators);
        }
      });
    });
  }
  // Returns the next scheduled leader connected to the block-engine.
  async getNextScheduledLeader() {
    return new Promise((resolve, reject) => {
      this.client.getNextScheduledLeader({}, async (e, resp) => {
        if (e) {
          reject(e);
        } else {
          resolve(resp);
        }
      });
    });
  }
  // Accepts a list of accounts and filters transactions that write lock any of the accounts.
  onPendingTransactions(accounts, successCallback, errorCallback) {
    const stream = this.client.subscribePendingTransactions({
      accounts,
    });
    stream.on('readable', () => {
      successCallback(
        (0, utils_1.deserializeTransactions)(stream.read(1).transactions)
      );
    });
    stream.on('error', () => errorCallback(new Error('Stream error')));
  }
  // Subscribes to bundle results.
  onBundleResult(successCallback, errorCallback) {
    const stream = this.client.subscribeBundleResults({});
    stream.on('readable', () => {
      successCallback(stream.read(1));
    });
    stream.on('error', () => errorCallback(new Error('Stream error')));
  }
}
exports.SearcherClient = SearcherClient;
const searcherClient = (url, authKeypair) => {
  const authProvider = new auth_2.AuthProvider(
    new auth_1.AuthServiceClient(url, grpc_js_1.ChannelCredentials.createSsl()),
    authKeypair
  );
  const client = new searcher_1.SearcherServiceClient(
    url,
    grpc_js_1.ChannelCredentials.createSsl(),
    {interceptors: [(0, auth_2.authInterceptor)(authProvider)]}
  );
  return new SearcherClient(client);
};
exports.searcherClient = searcherClient;
//# sourceMappingURL=searcher.js.map
