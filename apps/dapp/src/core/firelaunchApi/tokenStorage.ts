import { Observable } from 'rxjs';

/**
 * Defines the interface for token storage operations.
 * This interface provides a consistent structure for managing authentication tokens
 * across different storage mechanisms (e.g., memory, session storage, local storage).
 */
export type TokenStorage = {
  /**
   * Stores the provided authentication token.
   * @param token - The authentication token to be stored.
   */
  setToken: (token: string) => void;

  /**
   * Retrieves the current authentication token.
   * @returns The current token if it exists, or null if no token is stored.
   */
  getToken: () => string | null;

  /**
   * Provides an Observable stream of the authentication token.
   * This allows components to react to changes in the token state.
   * @returns An Observable that emits the current token value and subsequent changes.
   */
  getToken$: () => Observable<string | null>;

  /**
   * Removes the currently stored authentication token.
   * This is typically used for logout operations or when the token becomes invalid.
   */
  removeToken: () => void;
};
