import cx from 'classnames';
import { ColorType, createChart, CrosshairMode } from 'lightweight-charts';
import React, { FC, useEffect } from 'react';

import { usePriceChartData } from '@/hooks';

type PriceChartProps = {
  chartContainerRef: React.RefObject<HTMLDivElement>;
  className?: string;
};

export const PriceChart: FC<PriceChartProps> = ({
  chartContainerRef,
  className,
}) => {
  const chartData = usePriceChartData();

  useEffect(() => {
    if (chartContainerRef.current) {
      // log the width and height
      console.log(
        chartContainerRef.current.clientWidth,
        chartContainerRef.current.clientHeight,
      );
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: {
            type: ColorType.VerticalGradient,
            topColor: '#1E1E1E11',
            bottomColor: '#12121200',
          },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#2B2B2B' },
          horzLines: { color: '#2B2B2B' },
        },
        crosshair: { mode: CrosshairMode.Normal },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#00FF44',
        downColor: '#800080',
        borderVisible: false,
        wickUpColor: '#00FF44',
        wickDownColor: '#800080',
      });

      candlestickSeries.setData(chartData);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [chartContainerRef, chartData]);

  return (
    <div ref={chartContainerRef} className={cx(className)} />
  );
};
