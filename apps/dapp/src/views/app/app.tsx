import {
  FireIcon,
  SparklesIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import React, { FC, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { match } from 'ts-pattern';

import { Menu, Background, FormInput, Logo } from '@/components';

type LaunchpadItem = {
  id: number;
  name: string;
  currentPrice: number;
  marketCap: number;
  tvl: number;
  isHot: boolean;
  isNew: boolean;
  bondingCurveType: string;
  completionPercentage: number;
  source: string;
};

type LaunchedToken = {
  id: number;
  name: string;
  currentPrice: number;
  marketCap: number;
  tvl: number;
};

// Mock API functions
const fetchLaunchpads = async (
  sortBy = 'name',
  sortOrder = 'asc',
): Promise<LaunchpadItem[]> => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const data = [
    {
      id: 1,
      name: 'Launchpad 1',
      currentPrice: 0.5,
      marketCap: 1000000,
      tvl: 500000,
      isHot: true,
      isNew: false,
      bondingCurveType: 'Linear',
      completionPercentage: 75,
      source: 'Pump.fun',
    },
    {
      id: 2,
      name: 'Launchpad 2',
      currentPrice: 1.2,
      marketCap: 2500000,
      tvl: 1200000,
      isHot: false,
      isNew: true,
      bondingCurveType: 'Exponential',
      completionPercentage: 30,
      source: 'fomo3d.fun',
    },
    {
      id: 3,
      name: 'Launchpad 3',
      currentPrice: 0.8,
      marketCap: 1500000,
      tvl: 800000,
      isHot: false,
      isNew: false,
      bondingCurveType: 'Logarithmic',
      completionPercentage: 50,
      source: 'Pump.fun',
    },
  ];

  // Use a type-safe sorting function
  return data.sort((a: LaunchpadItem, b: LaunchpadItem) => {
    const aValue = a[sortBy as keyof LaunchpadItem];
    const bValue = b[sortBy as keyof LaunchpadItem];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

const fetchLaunchedTokens = async (
  sortBy = 'name',
  sortOrder = 'asc',
): Promise<LaunchedToken[]> => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const data = [
    {
      id: 1,
      name: 'Token A',
      currentPrice: 2.5,
      marketCap: 5000000,
      tvl: 2000000,
    },
    {
      id: 2,
      name: 'Token B',
      currentPrice: 1.8,
      marketCap: 3500000,
      tvl: 1500000,
    },
    {
      id: 3,
      name: 'Token C',
      currentPrice: 3.2,
      marketCap: 6000000,
      tvl: 2500000,
    },
  ];
  // Use a type-safe sorting function
  return data.sort((a: LaunchedToken, b: LaunchedToken) => {
    const aValue = a[sortBy as keyof LaunchedToken];
    const bValue = b[sortBy as keyof LaunchedToken];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

type Tab = 'launchpads' | 'launched';
type TimeFrame = '5m' | '15m' | '30m';
type Filter = 'all' | 'hot' | 'new';

type FormData = {
  search: string;
};

// Progress Bar component
const ProgressBar: FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
    <div
      className="bg-blue-600 h-1.5 rounded-full"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

// Clickable table row component
const ClickableTableRow: FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    className="border-t border-gray-600 cursor-pointer transition-all duration-300 hover:bg-opacity-20 hover:bg-neutral-500 hover:shadow-[0_0_10px_#9E9E9EFF] text-sm"
  >
    {children}
  </tr>
);

// Sortable Table Header component
const SortableTableHeader: FC<{
  children: React.ReactNode;
  sortKey: string;
  currentSort: { key: string; order: 'asc' | 'desc' };
  onSort: (key: string) => void;
}> = ({ children, sortKey, currentSort, onSort }) => (
  <th className="p-1 cursor-pointer text-sm" onClick={() => onSort(sortKey)}>
    <div className="flex items-center">
      {children}
      <span className="ml-1">
        {currentSort.key === sortKey ? (
          currentSort.order === 'asc' ? (
            <ChevronUpIcon className="w-3 h-3" />
          ) : (
            <ChevronDownIcon className="w-3 h-3" />
          )
        ) : (
          <ArrowsUpDownIcon className="w-3 h-3 text-gray-400" />
        )}
      </span>
    </div>
  </th>
);

// Skeleton Loader component
const SkeletonLoader: FC<{ columns: number }> = ({ columns }) => (
  <>
    {[...Array(5)].map((_, index) => (
      <tr key={index} className="animate-pulse">
        {[...Array(columns)].map((_, cellIndex) => (
          <td key={cellIndex} className="p-1">
            <div className="h-3 bg-gray-300 rounded"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

// Launchpads component
const Launchpads: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('5m');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<{ key: string; order: 'asc' | 'desc' }>({
    key: 'name',
    order: 'asc',
  });

  const {
    data: launchpads,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['launchpads', sort.key, sort.order],
    queryFn: () => fetchLaunchpads(sort.key, sort.order),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Implement search functionality for launchpads here
  };

  const filteredLaunchpads = useMemo(
    () =>
      launchpads?.filter((launchpad) => {
        if (filter === 'hot') return launchpad.isHot;
        if (filter === 'new') return launchpad.isNew;
        return true;
      }) || [],
    [launchpads, filter],
  );

  const handleRowClick = (id: number) => {
    console.log(`Clicked on launchpad with id: ${id}`);
    // Implement row click functionality here
  };

  const handleSort = (key: string) => {
    setSort((prevSort) => ({
      key,
      order: prevSort.key === key && prevSort.order === 'asc' ? 'desc' : 'asc',
    }));
    refetch();
  };

  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <FormInput
          label="Search Launchpads"
          id="search"
          type="text"
          placeholder="Search by name, source, etc."
          register={register}
          errors={errors}
        />
      </form>
      <div className="flex justify-between mb-4">
        <div>
          <button
            className={`mr-2 px-2 py-1 rounded text-sm ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`mr-2 px-2 py-1 rounded text-sm ${filter === 'hot' ? 'bg-red-500' : 'bg-gray-500'}`}
            onClick={() => setFilter('hot')}
          >
            Hot <FireIcon className="inline-block w-3 h-3 ml-1" />
          </button>
          <button
            className={`px-2 py-1 rounded text-sm ${filter === 'new' ? 'bg-yellow-500' : 'bg-gray-500'}`}
            onClick={() => setFilter('new')}
          >
            New <SparklesIcon className="inline-block w-3 h-3 ml-1" />
          </button>
        </div>
        <div>
          <button
            className={`mr-2 px-2 py-1 rounded text-sm ${timeFrame === '5m' ? 'bg-green-500' : 'bg-gray-500'}`}
            onClick={() => setTimeFrame('5m')}
          >
            5m
          </button>
          <button
            className={`mr-2 px-2 py-1 rounded text-sm ${timeFrame === '15m' ? 'bg-green-500' : 'bg-gray-500'}`}
            onClick={() => setTimeFrame('15m')}
          >
            15m
          </button>
          <button
            className={`px-2 py-1 rounded text-sm ${timeFrame === '30m' ? 'bg-green-500' : 'bg-gray-500'}`}
            onClick={() => setTimeFrame('30m')}
          >
            30m
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-1 w-6"></th>
              <SortableTableHeader
                sortKey="name"
                currentSort={sort}
                onSort={handleSort}
              >
                Name
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="currentPrice"
                currentSort={sort}
                onSort={handleSort}
              >
                Current Price
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="marketCap"
                currentSort={sort}
                onSort={handleSort}
              >
                Market Cap
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="tvl"
                currentSort={sort}
                onSort={handleSort}
              >
                TVL
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="bondingCurveType"
                currentSort={sort}
                onSort={handleSort}
              >
                Bonding Curve
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="completionPercentage"
                currentSort={sort}
                onSort={handleSort}
              >
                Completion
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="source"
                currentSort={sort}
                onSort={handleSort}
              >
                Source
              </SortableTableHeader>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonLoader columns={8} />
            ) : (
              filteredLaunchpads.map((item) => (
                <ClickableTableRow
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="p-1">
                    {item.isHot && (
                      <FireIcon className="w-3 h-3 text-red-500" />
                    )}
                    {item.isNew && (
                      <SparklesIcon className="w-3 h-3 text-yellow-500" />
                    )}
                  </td>
                  <td className="p-1 flex items-center">
                    <Logo className="w-4 h-4 mr-1" />
                    {item.name}
                  </td>
                  <td className="p-1">${item.currentPrice.toFixed(2)}</td>
                  <td className="p-1">${item.marketCap.toLocaleString()}</td>
                  <td className="p-1">${item.tvl.toLocaleString()}</td>
                  <td className="p-1">{item.bondingCurveType}</td>
                  <td className="p-1 w-24">
                    <ProgressBar percentage={item.completionPercentage} />
                  </td>
                  <td className="p-1">{item.source}</td>
                </ClickableTableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Launched Tokens component
const LaunchedTokens: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [sort, setSort] = useState<{ key: string; order: 'asc' | 'desc' }>({
    key: 'name',
    order: 'asc',
  });

  const {
    data: launchedTokens,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['launchedTokens', sort.key, sort.order],
    queryFn: () => fetchLaunchedTokens(sort.key, sort.order),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Implement search functionality for launched tokens here
  };

  const handleRowClick = (id: number) => {
    console.log(`Clicked on launched token with id: ${id}`);
    // Implement row click functionality here
  };

  const handleSort = (key: string) => {
    setSort((prevSort) => ({
      key,
      order: prevSort.key === key && prevSort.order === 'asc' ? 'desc' : 'asc',
    }));
    refetch();
  };

  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <FormInput
          label="Search Launched Tokens"
          id="search"
          type="text"
          register={register}
          errors={errors}
        />
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <SortableTableHeader
                sortKey="name"
                currentSort={sort}
                onSort={handleSort}
              >
                Name
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="currentPrice"
                currentSort={sort}
                onSort={handleSort}
              >
                Current Price
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="marketCap"
                currentSort={sort}
                onSort={handleSort}
              >
                Market Cap
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="tvl"
                currentSort={sort}
                onSort={handleSort}
              >
                TVL
              </SortableTableHeader>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonLoader columns={4} />
            ) : (
              launchedTokens?.map((item) => (
                <ClickableTableRow
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="p-1 flex items-center">
                    <Logo className="w-4 h-4 mr-1" />
                    {item.name}
                  </td>
                  <td className="p-1">${item.currentPrice.toFixed(2)}</td>
                  <td className="p-1">${item.marketCap.toLocaleString()}</td>
                  <td className="p-1">${item.tvl.toLocaleString()}</td>
                </ClickableTableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TabContent: FC<{ activeTab: Tab }> = ({ activeTab }) =>
  match(activeTab)
    .with('launchpads', () => <Launchpads />)
    .with('launched', () => <LaunchedTokens />)
    .exhaustive();

export const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('launchpads');

  return (
    <main className="relative flex flex-col min-h-screen min-w-screen text-white">
      <div className="absolute w-full h-full">
        <Background />
      </div>
      <div className="absolute top-0 left-0 w-full z-20">
        <Menu />
      </div>
      <main className="mt-24 z-10 px-2 md:px-4 pb-2 md:pb-4 pt-4 rounded-lg black-blur-background mx-2 md:mx-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to Mercury</h1>
        <div className="flex ">
          <button
            className={`mr-4 px-3 py-1 rounded-t-lg text-sm ${
              activeTab === 'launchpads'
                ? 'bg-black bg-opacity-20 backdrop-blur-md'
                : 'bg-white bg-opacity-50 hover:bg-opacity-70'
            }`}
            onClick={() => setActiveTab('launchpads')}
          >
            Launchpads
          </button>
          <button
            className={`px-3 py-1 rounded-t-lg text-sm ${
              activeTab === 'launched'
                ? 'bg-black bg-opacity-20 backdrop-blur-md'
                : 'bg-white bg-opacity-50 hover:bg-opacity-70'
            }`}
            onClick={() => setActiveTab('launched')}
          >
            Launched Tokens
          </button>
        </div>
        <div className="backdrop-blur-md p-3 rounded-b-lg rounded-tr-lg">
          <TabContent activeTab={activeTab} />
        </div>
      </main>
    </main>
  );
};
