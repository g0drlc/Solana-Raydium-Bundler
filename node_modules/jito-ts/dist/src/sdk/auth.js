'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.AuthProvider = exports.Jwt = exports.authInterceptor = void 0;
const ed = require('@noble/ed25519');
const grpc_js_1 = require('@grpc/grpc-js');
const auth_1 = require('../gen/auth');
const utils_1 = require('./utils');
// Intercepts requests and sets the auth header.
const authInterceptor = authProvider => {
  return (opts, nextCall) => {
    return new grpc_js_1.InterceptingCall(nextCall(opts), {
      start: async function (metadata, listener, next) {
        const callback = accessToken => {
          metadata.set('authorization', `Bearer ${accessToken.token}`);
          next(metadata, listener);
        };
        authProvider.injectAccessToken(callback);
      },
    });
  };
};
exports.authInterceptor = authInterceptor;
// Represents server issued JWT tokens.
class Jwt {
  constructor(token, expiration) {
    this.token = token;
    this.expiration = expiration;
  }
  isExpired() {
    const now = (0, utils_1.unixTimestampFromDate)(new Date());
    return this.expiration <= now;
  }
}
exports.Jwt = Jwt;
// Handles requesting and refreshing tokens, providing them via callbacks.
class AuthProvider {
  constructor(client, authKeypair) {
    this.client = client;
    this.authKeypair = authKeypair;
  }
  // Injects the current access token into the provided callback.
  // If it's expired then refreshes, if the refresh token is expired then runs the full auth flow.
  injectAccessToken(callback) {
    let _a;
    if (!this.accessToken) {
      this.fullAuth((accessToken, refreshToken) => {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        callback(accessToken);
      });
      return;
    }
    if (
      !((_a = this.accessToken) === null || _a === void 0
        ? void 0
        : _a.isExpired())
    ) {
      callback(this.accessToken);
      return;
    }
    this.refreshAccessToken(callback);
  }
  // Refresh access token and inject into callback.
  refreshAccessToken(callback) {
    let _a;
    this.client.refreshAccessToken(
      {
        refreshToken:
          (_a = this.refreshToken) === null || _a === void 0
            ? void 0
            : _a.token,
      },
      async (e, resp) => {
        let _a, _b;
        if (e) {
          throw e;
        }
        if (!AuthProvider.isValidToken(resp.accessToken)) {
          throw `received invalid access token ${resp.accessToken}`;
        }
        callback(
          new Jwt(
            ((_a = resp.accessToken) === null || _a === void 0
              ? void 0
              : _a.value) || '',
            (0, utils_1.unixTimestampFromDate)(
              ((_b = resp.accessToken) === null || _b === void 0
                ? void 0
                : _b.expiresAtUtc) || new Date()
            )
          )
        );
      }
    );
  }
  // Creates an AuthService object, and asynchronously performs full authentication flow.
  static async create(client, authKeypair) {
    const provider = new AuthProvider(client, authKeypair);
    await provider.fullAuth((accessToken, refreshToken) => {
      provider.accessToken = accessToken;
      provider.refreshToken = refreshToken;
    });
    return provider;
  }
  // Run entire auth flow:
  // - fetch a server generated challenge
  // - sign the challenge and submit in exchange for an access and refresh token
  // - inject the tokens into the provided callback
  fullAuth(callback) {
    this.client.generateAuthChallenge(
      {
        role: auth_1.Role.SEARCHER,
        pubkey: this.authKeypair.publicKey.toBytes(),
      },
      async (e, resp) => {
        if (e) {
          throw e;
        }
        // Append pubkey to ensure what we're signing is garbage.
        const challenge = `${this.authKeypair.publicKey.toString()}-${
          resp.challenge
        }`;
        const signedChallenge = await ed.sign(
          Buffer.from(challenge),
          // First 32 bytes is the private key, last 32 public key.
          this.authKeypair.secretKey.slice(0, 32)
        );
        this.client.generateAuthTokens(
          {
            challenge,
            clientPubkey: this.authKeypair.publicKey.toBytes(),
            signedChallenge,
          },
          (e, resp) => {
            let _a, _b, _c, _d;
            if (e) {
              throw e;
            }
            if (!AuthProvider.isValidToken(resp.accessToken)) {
              throw `received invalid access token ${resp.refreshToken}`;
            }
            const accessToken = new Jwt(
              ((_a = resp.accessToken) === null || _a === void 0
                ? void 0
                : _a.value) || '',
              (0, utils_1.unixTimestampFromDate)(
                ((_b = resp.accessToken) === null || _b === void 0
                  ? void 0
                  : _b.expiresAtUtc) || new Date()
              )
            );
            if (!AuthProvider.isValidToken(resp.refreshToken)) {
              throw `received invalid refresh token ${resp.refreshToken}`;
            }
            const refreshToken = new Jwt(
              ((_c = resp.accessToken) === null || _c === void 0
                ? void 0
                : _c.value) || '',
              (0, utils_1.unixTimestampFromDate)(
                ((_d = resp.accessToken) === null || _d === void 0
                  ? void 0
                  : _d.expiresAtUtc) || new Date()
              )
            );
            callback(accessToken, refreshToken);
          }
        );
      }
    );
  }
  static isValidToken(token) {
    if (!token) {
      return false;
    }
    if (!token.expiresAtUtc) {
      return false;
    }
    return true;
  }
}
exports.AuthProvider = AuthProvider;
//# sourceMappingURL=auth.js.map
