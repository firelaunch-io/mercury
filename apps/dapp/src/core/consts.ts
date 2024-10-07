export const DECIMAL_PLACES = 9;
export const SUPPLY = 1_000_000;
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
export const SESSION_DURATION = import.meta.env.VITE_SESSION_DURATION
  ? parseInt(import.meta.env.VITE_SESSION_DURATION)
  : 60;
