import { PublicKey } from "@solana/web3.js";

export const refineSolanaPubkey = (id: string) => {
  try {
    new PublicKey(id);
    return true;
  } catch (error) {
    return false;
  }
};
