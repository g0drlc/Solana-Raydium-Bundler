"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authInterceptor = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
// Intercepts requests and sets the auth header.
const authInterceptor = (accessToken) => {
    return (opts, nextCall) => {
        return new grpc_js_1.InterceptingCall(nextCall(opts), {
            start: async function (metadata, listener, next) {
                metadata.set('access-token', accessToken);
                next(metadata, listener);
            },
        });
    };
};
exports.authInterceptor = authInterceptor;
//# sourceMappingURL=auth.js.map