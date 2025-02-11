import {
  InterceptingCall,
  Interceptor,
  InterceptorOptions,
  Listener,
  Metadata,
} from '@grpc/grpc-js';
import {NextCall} from '@grpc/grpc-js/build/src/client-interceptors';

// Intercepts requests and sets the auth header.
export const authInterceptor = (accessToken: string): Interceptor => {
  return (opts: InterceptorOptions, nextCall: NextCall) => {
    return new InterceptingCall(nextCall(opts), {
      start: async function (metadata: Metadata, listener: Listener, next) {
        metadata.set('access-token', accessToken);
        next(metadata, listener);
      },
    });
  };
};
