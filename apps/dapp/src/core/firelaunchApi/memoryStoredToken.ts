import { BehaviorSubject, Observable } from 'rxjs';

import { TokenStorage } from './tokenStorage';

/**
 * A module for storing and managing a valid authentication token in memory using RxJS.
 * This module provides functions to set, get, and observe the token state.
 */

/**
 * A BehaviorSubject that stores the current token value in memory.
 * It's initialized with null, representing no token at the start.
 */
const tokenSubject = new BehaviorSubject<string | null>(null);

/**
 * An object that implements the TokenStorage interface for in-memory storage.
 * It provides methods to set, get, observe, and remove the authentication token.
 */
export const MemoryStoredToken: TokenStorage = {
  /**
   * Sets the authentication token in memory and updates the BehaviorSubject.
   * @param token - The authentication token to be stored.
   */
  setToken: (token: string): void => {
    tokenSubject.next(token);
  },

  /**
   * Retrieves the current authentication token from memory.
   * @returns The current token or null if not set.
   */
  getToken: (): string | null => tokenSubject.getValue(),

  /**
   * Returns an Observable that emits the current token value and subsequent changes.
   * @returns An Observable of the token.
   */
  getToken$: (): Observable<string | null> => tokenSubject.asObservable(),

  /**
   * Removes the authentication token from memory by setting it to null.
   */
  removeToken: (): void => {
    tokenSubject.next(null);
  },
};
