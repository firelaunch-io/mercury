/**
 * Shows only the first and last four characters of a string, with '...' in the middle.
 * @param text The input string
 * @returns The truncated string
 */
export const showFirstAndLastFour = (text: string): string =>
  text.length <= 8 ? text : `${text.slice(0, 4)}...${text.slice(-4)}`;
