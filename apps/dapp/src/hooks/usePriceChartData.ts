import { useState } from 'react';

const generateRealisticData = (count: number) => {
  const data = [];
  const startDate = new Date('2018-12-22');
  let prevClose = 75.16; // Starting price

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const volatility = Math.random() * 0.3 + 0.1; // Random volatility between 10% and 40%
    const range = prevClose * volatility;

    const open = prevClose + (Math.random() - 0.5) * range * 0.1; // Open near previous close
    const high = Math.max(open, open + Math.random() * range);
    const low = Math.min(open, open - Math.random() * range);
    const close = low + Math.random() * (high - low);

    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    prevClose = close;
  }

  return data;
};

export const usePriceChartData = () => {
  const [chartData] = useState(() => generateRealisticData(1_000));
  return chartData;
};
