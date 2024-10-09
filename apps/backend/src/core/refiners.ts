import { PublicKey } from "@solana/web3.js";

export const refineSolanaPubkey = (id: string): boolean => {
  try {
    new PublicKey(id);
    return true;
  } catch {
    return false;
  }
};
