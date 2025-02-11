import {Interceptor} from '@grpc/grpc-js';
import {Keypair} from '@solana/web3.js';
import {AuthServiceClient} from '../gen/auth';
export declare const authInterceptor: (
  authProvider: AuthProvider
) => Interceptor;
export declare class Jwt {
  readonly token: string;
  private readonly expiration;
  constructor(token: string, expiration: number);
  isExpired(): boolean;
}
export declare class AuthProvider {
  private client;
  private readonly authKeypair;
  private accessToken;
  private refreshToken;
  constructor(client: AuthServiceClient, authKeypair: Keypair);
  injectAccessToken(callback: (accessToken: Jwt) => void): void;
  private refreshAccessToken;
  static create(
    client: AuthServiceClient,
    authKeypair: Keypair
  ): Promise<AuthProvider>;
  private fullAuth;
  private static isValidToken;
}
