import { PublicKey } from '@solana/web3.js';
import axios, { AxiosRequestConfig } from 'axios';
import b58 from 'bs58';
import { addMinutes, getUnixTime } from 'date-fns';

import { BACKEND_URL, SESSION_DURATION } from '../consts';

import { SessionStoredToken } from './sessionStoredToken';
import { TokenStorage } from './tokenStorage';

export type MessageSigner = {
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  publicKey: PublicKey;
};

/**
 * Creates an authentication token to be passed to the server
 * via auth headers, returns the following format:
 * `pubKey.message.signature` (All in base58).
 * @param action Name of the action to be allowed, needed for authentication purposes.
 * @param wallet Signer.
 * @param exp Expiration time in minutes.
 * @returns {Promise<string>} pubKey.message.signature (All in base58)
 */
const createAuthToken = async (
  action: string,
  wallet: MessageSigner,
  exp = 60,
): Promise<string> => {
  const encodedMessage = new TextEncoder().encode(
    JSON.stringify({
      action,
      exp: getUnixTime(addMinutes(new Date(), exp)),
    }),
  );
  const signature = await wallet.signMessage(encodedMessage);
  const pk = wallet.publicKey.toBase58();
  const msg = b58.encode(encodedMessage);
  const sig = b58.encode(signature);
  return `${pk}.${msg}.${sig}`;
};

/**
 * Decodes the message part of the token and returns the contents.
 */
const decodeTokenMessage = (token: string): { exp: number; action: string } => {
  const [, msg] = token.split('.');
  return JSON.parse(new TextDecoder().decode(b58.decode(msg)));
};

/**
 * Checks if a token has expired.
 */
const isTokenExpired = (tokenContents: { exp: number }): boolean =>
  getUnixTime(new Date()) > tokenContents.exp;

/**
 * Retrieves a valid token, either from storage or by creating a new one
 * by requesting the user to sign a message with their wallet.
 * The created token is saved in the provided token storage.
 */
export const getAuthToken = async (
  action: 'skip' | string,
  wallet: MessageSigner,
  exp: number,
  tokenStorage: TokenStorage,
): Promise<string> => {
  if (action !== 'skip') {
    const newToken = await createAuthToken(action, wallet, exp);
    tokenStorage.setToken(newToken);
    return newToken;
  }

  const storedToken = tokenStorage.getToken();

  if (storedToken) {
    const tokenContents = decodeTokenMessage(storedToken);
    if (!isTokenExpired(tokenContents)) {
      return storedToken;
    }
  }

  const newToken = await createAuthToken(action, wallet, exp);
  tokenStorage.setToken(newToken);
  return newToken;
};

/**
 * Retrieves an authentication token with 'skip' action.
 * Uses the SESSION_DURATION constant for token expiration.
 * @param wallet MessageSigner object for signing the token
 * @returns {Promise<string>} Authentication token
 */
export const authTokenWithSkip = (
  wallet: MessageSigner,
  tokenStorage: TokenStorage,
): Promise<string> =>
  getAuthToken('skip', wallet, SESSION_DURATION, tokenStorage);

/**
 * Retrieves an authentication token with a specific action.
 * Uses the SESSION_DURATION constant for token expiration.
 * @param action String representing the action for the token
 * @param wallet MessageSigner object for signing the token
 * @returns {Promise<string>} Authentication token
 */
export const authTokenWithAction = (
  action: string,
  wallet: MessageSigner,
  tokenStorage: TokenStorage,
) => getAuthToken(action, wallet, SESSION_DURATION, tokenStorage);

// Create a base axios instance
export const createAxiosInstance = () =>
  axios.create({
    baseURL: BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
  });

// Helper function to make authenticated requests
export const makeAuthenticatedRequest = async (
  wallet: MessageSigner,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: Record<string, unknown>,
  action: string = 'skip',
  tokenStorage: TokenStorage = SessionStoredToken,
) => {
  const axiosInstance = createAxiosInstance();
  const token =
    action === 'skip'
      ? await authTokenWithSkip(wallet, tokenStorage)
      : await authTokenWithAction(action, wallet, tokenStorage);

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  const response = await axiosInstance(config);
  return response.data;
};
