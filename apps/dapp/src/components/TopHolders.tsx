import cx from 'classnames';
import React, { FC, useState } from 'react';

import { useTopHoldersForMint } from '@/hooks';

type TopHoldersProps = {
  mintAddress: string;
  className?: string;
};

export const TopHolders: FC<TopHoldersProps> = ({ mintAddress, className }) => {
  const [showAllHolders, setShowAllHolders] = useState(false);
  const topHolders = useTopHoldersForMint(mintAddress);

  return (
    <div
      className={cx(
        'border border-gray-700 rounded-lg overflow-hidden text-xs',
        className,
      )}
    >
      <div className="px-1 py-0.5 border-b border-gray-700">
        <h2 className="text-sm font-bold">Top Holders</h2>
      </div>
      <div className="px-1 py-0.5">
        {topHolders.slice(0, showAllHolders ? 20 : 10).map((holder, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{holder.address}</span>
            <span>
              {holder.balance.toLocaleString()} ({holder.percentage.toFixed(2)}
              %)
            </span>
          </div>
        ))}
        <button
          onClick={() => setShowAllHolders(!showAllHolders)}
          className="w-full mt-1 px-1 py-0.5 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white transition duration-200"
        >
          {showAllHolders ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};
