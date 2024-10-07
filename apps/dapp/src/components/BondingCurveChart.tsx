import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import cx from 'classnames';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { CurveChartData } from '@/hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type BondingCurveChartProps = {
  chartData: CurveChartData;
  className?: string;
  currentPrice?: number;
  maxSupply?: number;
};

export const BondingCurveChart: React.FC<BondingCurveChartProps> = ({
  chartData,
  className,
  maxSupply,
}) => {
  return (
    <div className={cx('flex-1', className)}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              title: { color: 'white', display: true, text: 'Supply' },
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              type: 'linear',
              max: maxSupply, // Set the maximum value for the x-axis
            },
            y: {
              title: { color: 'white', display: true, text: 'Price' },
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              beginAtZero: true,
            },
          },
          plugins: { legend: { labels: { color: 'white' } } },
        }}
      />
    </div>
  );
};
