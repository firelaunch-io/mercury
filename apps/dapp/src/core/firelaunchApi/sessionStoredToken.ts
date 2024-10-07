import { BehaviorSubject, Observable } from 'rxjs';

import { TokenStorage } from './tokenStorage';

/**
 * A module for storing and managing a valid authentication token in session storage using RxJS.
 * This module provides functions to set, get, and observe the token state.
 */

/**
 * The key used to store the authentication token in session storage.
 */
const SESSION_TOKEN_KEY = 'firelaunch_auth_token';

/**
 * A BehaviorSubject that stores the current token value.
 * It's initialized with the token from session storage, if available.
 */
const tokenSubject = new BehaviorSubject<string | null>(
  sessionStorage.getItem(SESSION_TOKEN_KEY)
);

/**
 * An object that implements the TokenStorage interface for session storage.
 * It provides methods to set, get, observe, and remove the authentication token.
 */
export const SessionStoredToken: TokenStorage = {
  /**
   * Sets the authentication token in session storage and updates the BehaviorSubject.
   * @param token - The authentication token to be stored.
   */
  setToken: (token: string): void => {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    tokenSubject.next(token);
  },

  /**
   * Retrieves the current authentication token from session storage.
   * @returns The current token or null if not set.
   */
  getToken: (): string | null => sessionStorage.getItem(SESSION_TOKEN_KEY),

  /**
   * Returns an Observable that emits the current token value and subsequent changes.
   * @returns An Observable of the token.
   */
  getToken$: (): Observable<string | null> => tokenSubject.asObservable(),

  /**
   * Removes the authentication token from session storage and updates the BehaviorSubject.
   */
  removeToken: (): void => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    tokenSubject.next(null);
  },
};
