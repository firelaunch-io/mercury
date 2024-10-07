import { useEffect, useState } from "react";

export const useTopHoldersForMint = (mint: string) => {
  const [topHolders, setTopHolders] = useState<
    { address: string; balance: number; percentage: number }[]
  >([]);

  useEffect(() => {
    // This is a mock implementation. Replace with actual API call.
    const mockHolders = Array.from({ length: 20 }, (_, i) => ({
      address: `Holder${i + 1}`,
      balance: Math.floor(Math.random() * 1000000),
      percentage: Math.random() * 5,
    }));
    
    // Sort holders by percentage in descending order
    const sortedHolders = mockHolders.sort((a, b) => b.percentage - a.percentage);
    
    setTopHolders(sortedHolders);
  }, [mint]);

  return topHolders;
};
