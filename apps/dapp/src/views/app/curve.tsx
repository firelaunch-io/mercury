import cx from 'classnames';
import React, { FC, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  Background,
  Menu,
  FormInput,
  FormTextArea,
  PriceChart,
  TopHolders,
} from '@/components';

// Mock data
const mockCurveData = {
  name: 'Mock Curve',
  symbol: 'MCK',
  image: 'https://example.com/mock-image.png',
  mintAddress: 'MockMintAddress123456789',
  circulatingSupply: BigInt(1000000),
  price: BigInt(50000000), // 0.5 SOL in lamports
  marketCap: BigInt(500000000000), // 5000 SOL in lamports
  decimals: 9,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tradeSchema = z.object({
  amount: z.number().positive(),
  action: z.enum(['buy', 'sell']),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const commentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty'),
  action: z.literal('comment'),
});

type TradeFormData = z.infer<typeof tradeSchema>;
type CommentFormData = z.infer<typeof commentSchema>;

const useTradeForm = () =>
  useForm<TradeFormData>({
    defaultValues: { action: 'buy' },
  });

const useCommentForm = () => useForm<CommentFormData>();

type CopyIconProps = {
  onClick: () => void;
  className?: string;
  size?: number;
};

const CopyIcon: FC<CopyIconProps> = ({ onClick, className, size = 4 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cx(`h-${size} w-${size}`, className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    onClick={onClick}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

type CurveHeaderProps = {
  name: string;
  symbol: string;
  image?: string;
  mintAddress: string;
  circulatingSupply: bigint;
  price: bigint;
  marketCap: bigint;
  decimals: number;
  className?: string;
};

const CurveHeader: FC<CurveHeaderProps> = ({
  name,
  symbol,
  image,
  mintAddress,
  circulatingSupply,
  price,
  marketCap,
  decimals,
  className,
}) => (
  <div className={cx('p-2 border-b border-gray-700', className)}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center">
        {image && (
          <img src={image} alt={name} className="w-8 h-8 rounded-full mr-2" />
        )}
        <div>
          <h2 className="text-lg font-bold">
            {name} ({symbol})
          </h2>
          <div className="flex items-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(mintAddress);
                toast.success('Mint address copied to clipboard');
              }}
              className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center"
            >
              <span>Mint: {mintAddress}</span>
              <CopyIcon onClick={() => {}} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end space-x-4 text-xs mt-2 sm:mt-0 w-full sm:w-auto">
        <span>
          Price: ◎{(Number(price) / 10 ** decimals).toFixed(decimals)}
        </span>
        <span>Supply: {circulatingSupply.toLocaleString()}</span>
        <span>
          Market Cap: ◎{(Number(marketCap) / 10 ** decimals).toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

type TradeControlsProps = {
  className?: string;
};

const TradeControls: FC<TradeControlsProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useTradeForm();

  const onTradeSubmit = (data: TradeFormData) => {
    console.log(`${data.action === 'buy' ? 'Buy' : 'Sell'} ${data.amount}`);
    reset();
  };

  const handleStepClick = useCallback(
    (step: number) => {
      setValue('amount', step);
    },
    [setValue],
  );

  return (
    <div
      className={cx(
        'border border-gray-700 rounded-lg overflow-hidden',
        className,
      )}
    >
      <div className="p-2 border-b border-gray-700">
        <h2 className="text-xl font-bold">Trade Controls</h2>
      </div>
      <div className="p-2 space-y-4">
        <div className="flex overflow-hidden rounded-lg">
          <button
            className={`flex-1 py-2 ${activeTab === 'buy' ? 'bg-green-600' : 'bg-gray-700'} ${activeTab === 'buy' ? 'rounded-l-lg' : ''}`}
            onClick={() => {
              setActiveTab('buy');
              setValue('action', 'buy');
            }}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'sell' ? 'bg-red-600' : 'bg-gray-700'} ${activeTab === 'sell' ? 'rounded-r-lg' : ''}`}
            onClick={() => {
              setActiveTab('sell');
              setValue('action', 'sell');
            }}
          >
            Sell
          </button>
        </div>
        <form onSubmit={handleSubmit(onTradeSubmit)}>
          <FormInput
            label="Amount"
            id="amount"
            type="number"
            register={register}
            errors={errors}
          />
          <div className="flex justify-between mt-2">
            {[10, 25, 50, 75, 100].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => handleStepClick(step)}
                className="px-1 sm:px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs sm:text-sm"
              >
                {step}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className={`w-full mt-4 p-2 rounded text-white transition duration-200 ${
              activeTab === 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Place Trade
          </button>
        </form>
      </div>
    </div>
  );
};

type CommentsProps = {
  className?: string;
};

const Comments: FC<CommentsProps> = ({ className }) => {
  const [comments, setComments] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useCommentForm();

  const onCommentSubmit = (data: CommentFormData) => {
    setComments([...comments, data.comment]);
    reset();
  };

  return (
    <div
      className={cx(
        'flex-1 border border-gray-700 rounded-lg overflow-hidden',
        className,
      )}
    >
      <div className="p-2 border-b border-gray-700">
        <h2 className="text-xl font-bold">Comments</h2>
      </div>
      <div className="p-2">
        <div className="space-y-2 mb-4">
          {comments.map((c, index) => (
            <div key={index} className="bg-gray-700 p-2 rounded">
              {c}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onCommentSubmit)}>
          <FormTextArea
            label="Add a comment"
            id="comment"
            register={register}
            errors={errors}
          />
          <button
            type="submit"
            className="w-full mt-2 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition duration-200"
          >
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
};

type BondingCurveVisualizationProps = {
  className?: string;
};

const BondingCurveVisualization: FC<BondingCurveVisualizationProps> = ({
  className,
}) => (
  <div
    className={cx(
      'flex-1 border border-gray-700 rounded-lg overflow-hidden',
      className,
    )}
  >
    <div className="p-2 border-b border-gray-700">
      <h2 className="text-xl font-bold">Bonding Curve Visualization</h2>
    </div>
    <div className="p-2">
      <div className="h-64 bg-gray-700 flex items-center justify-center">
        Mock Bonding Curve Chart
      </div>
    </div>
  </div>
);

const ProgressBar: FC<{ percentage: number }> = ({ percentage }) => (
  <div className="bg-gray-700 h-6 rounded-full overflow-hidden">
    <div
      className="bg-blue-500 h-full transition-all duration-500 ease-in-out"
      style={{ width: `${percentage}%` }}
    >
      <span className="text-xs font-semibold text-white px-2 flex items-center h-full">
        {percentage.toFixed(2)}%
      </span>
    </div>
  </div>
);

const Contents: FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Mock data
  const currentSupply = 1000000;
  const maxSupply = 10000000;
  const progressPercentage = (currentSupply / maxSupply) * 100;

  return (
    <div className="w-full min-h-screen text-white p-1 sm:p-2">
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-grow border border-gray-700 rounded-lg overflow-hidden">
          <CurveHeader {...mockCurveData} />
          <div className="p-2 h-96">
            <PriceChart
              chartContainerRef={chartContainerRef}
              className="h-full"
            />
          </div>
          <div className="p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              Progress to Token Liberation
            </h3>
            <ProgressBar percentage={progressPercentage} />
            <p className="text-sm mt-2">
              {currentSupply.toLocaleString()} / {maxSupply.toLocaleString()}{' '}
              tokens minted
              {progressPercentage >= 100 &&
                ' - Tokens liberated, liquidity deposited into Raydium'}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:w-64">
          <TradeControls />
          <TopHolders mintAddress={mockCurveData.mintAddress} />
        </div>
      </div>
      <div className="mt-4 flex flex-col lg:flex-row gap-2">
        <BondingCurveVisualization />
        <Comments />
      </div>
    </div>
  );
};

export const CurveView = () => {
  const { curveAddress } = useParams();
  if (!curveAddress) throw new Error('Curve address is required');

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full text-white">
      <div className="absolute w-full h-full">
        <Background />
      </div>
      <div className="fixed top-0 left-0 w-full z-10">
        <Menu />
      </div>
      <div className="w-full max-w-8xl mx-auto px-1 sm:px-2">
        <div className="relative black-blur-background p-2 sm:p-4 rounded-lg my-28">
          <Contents />
        </div>
      </div>
    </div>
  );
};
