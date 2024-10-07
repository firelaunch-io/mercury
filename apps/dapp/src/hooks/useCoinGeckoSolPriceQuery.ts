import { useQuery } from '@tanstack/react-query';

type CoinGeckoPriceResponse = {
  [coinId: string]: {
    [vsCurrency: string]: number;
  };
};

export const useCoinGeckoPriceQuery = (
  coinId: string,
  vsCurrencies: string[],
) => {
  return useQuery<CoinGeckoPriceResponse, Error>({
    queryKey: ['coinGeckoPrice', coinId, vsCurrencies],
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${vsCurrencies.join(
          ',',
        )}`,
      );
      return response.json();
    },
  });
};
