/**
 * Converts a template string to a Uint8Array.
 *
 * This helper function takes a template string and encodes it into a Uint8Array
 * using the UTF-8 encoding. It's particularly useful for creating byte arrays
 * from string literals, which is common in Solana development for creating
 * program derived addresses (PDAs) or other byte-based identifiers.
 *
 * @param {TemplateStringsArray} strings - The template string to be encoded.
 * @returns {Uint8Array} The UTF-8 encoded byte array of the input string.
 *
 * @example
 * const bytes = b`Hello, world!`;
 * // bytes is now a Uint8Array containing the UTF-8 encoding of "Hello, world!"
 */
export const b = (strings: TemplateStringsArray): Uint8Array =>
  new TextEncoder().encode(strings.join(''));
