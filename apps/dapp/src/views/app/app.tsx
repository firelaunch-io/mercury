import {
  FireIcon,
  SparklesIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Menu, Background, FormInput, Logo } from '@/components';

type LaunchpadItem = {
  id: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  tvl: number;
  isHot: boolean;
  isNew: boolean;
  bondingCurveType: string;
  completionPercentage: number;
  source: string;
  creationDate: string;
  creator: string;
};

// Mock API functions
const fetchLaunchpads = async (
  sortBy = 'name',
  sortOrder = 'asc',
  page = 1,
  pageSize = 25,
  isHot?: boolean,
  isNew?: boolean,
): Promise<{ data: LaunchpadItem[]; total: number }> => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const data = [
    {
      id: 1,
      name: 'Launchpad 1',
      symbol: 'LP1',
      price: 0.5,
      marketCap: 1000000,
      tvl: 500000,
      isHot: true,
      isNew: false,
      bondingCurveType: 'Linear',
      completionPercentage: 75,
      source: 'Pump.fun',
      creationDate: '2d ago',
      creator: 'Creator A',
    },
    {
      id: 2,
      name: 'Launchpad 2',
      symbol: 'LP2',
      price: 1.2,
      marketCap: 2500000,
      tvl: 1200000,
      isHot: false,
      isNew: true,
      bondingCurveType: 'Exponential',
      completionPercentage: 30,
      source: 'fomo3d.fun',
      creationDate: '5h ago',
      creator: 'Creator B',
    },
    {
      id: 3,
      name: 'Launchpad 3',
      symbol: 'LP3',
      price: 0.8,
      marketCap: 1500000,
      tvl: 800000,
      isHot: false,
      isNew: false,
      bondingCurveType: 'Logarithmic',
      completionPercentage: 50,
      source: 'Pump.fun',
      creationDate: '1w ago',
      creator: 'Creator C',
    },
    // Add more mock data here
    ...Array.from({ length: 97 }, (_, i) => ({
      id: i + 4,
      name: `Launchpad ${i + 4}`,
      symbol: `LP${i + 4}`,
      price: Math.random() * 10,
      marketCap: Math.floor(Math.random() * 10000000),
      tvl: Math.floor(Math.random() * 5000000),
      isHot: Math.random() > 0.8,
      isNew: Math.random() > 0.9,
      bondingCurveType: ['Linear', 'Exponential', 'Logarithmic'][
        Math.floor(Math.random() * 3)
      ],
      completionPercentage: Math.floor(Math.random() * 100),
      source: ['Pump.fun', 'fomo3d.fun'][Math.floor(Math.random() * 2)],
      creationDate: `${Math.floor(Math.random() * 30)}d ago`,
      creator: `Creator ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    })),
  ];

  // Filter data based on isHot and isNew
  let filteredData = data;
  if (isHot !== undefined) {
    filteredData = filteredData.filter((item) => item.isHot === isHot);
  }
  if (isNew !== undefined) {
    filteredData = filteredData.filter((item) => item.isNew === isNew);
  }

  // Use a type-safe sorting function
  const sortedData = filteredData.sort((a: LaunchpadItem, b: LaunchpadItem) => {
    const aValue = a[sortBy as keyof LaunchpadItem];
    const bValue = b[sortBy as keyof LaunchpadItem];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: sortedData.slice(start, end),
    total: sortedData.length,
  };
};

type TimeFrame = '5m' | '15m' | '30m';

type FormData = {
  search: string;
};

// Progress Bar component
const ProgressBar: FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
    <div
      className="bg-blue-500 h-1.5 rounded-full"
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
    {[...Array(25)].map((_, index) => (
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

// Pagination component
const Pagination: FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center mt-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="mr-2 px-2 py-1 rounded bg-gray-500 disabled:opacity-50"
    >
      <ChevronLeftIcon className="w-4 h-4" />
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="ml-2 px-2 py-1 rounded bg-gray-500 disabled:opacity-50"
    >
      <ChevronRightIcon className="w-4 h-4" />
    </button>
  </div>
);

// Launchpads component
const Launchpads: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('5m');
  const [isHot, setIsHot] = useState<boolean | undefined>(undefined);
  const [isNew, setIsNew] = useState<boolean | undefined>(undefined);
  const [sort, setSort] = useState<{ key: string; order: 'asc' | 'desc' }>({
    key: 'name',
    order: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const {
    data: launchpadsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'launchpads',
      sort.key,
      sort.order,
      currentPage,
      pageSize,
      isHot,
      isNew,
    ],
    queryFn: () =>
      fetchLaunchpads(
        sort.key,
        sort.order,
        currentPage,
        pageSize,
        isHot,
        isNew,
      ),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Implement search functionality for launchpads here
  };

  const handleRowClick = (id: number) => {
    console.log(`Clicked on launchpad with id: ${id}`);
    // Implement row click functionality here
  };

  const handleSort = (key: string) => {
    setSort((prevSort) => ({
      key,
      order: prevSort.key === key && prevSort.order === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const toggleHot = () => {
    setIsHot((prev) => (prev === undefined ? true : prev ? undefined : true));
    setCurrentPage(1);
    refetch();
  };

  const toggleNew = () => {
    setIsNew((prev) => (prev === undefined ? true : prev ? undefined : true));
    setCurrentPage(1);
    refetch();
  };

  if (error) return <div>An error occurred: {error.message}</div>;

  const totalPages = Math.ceil((launchpadsData?.total || 0) / pageSize);

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
            className={`mr-2 px-2 py-1 rounded text-sm ${isHot === true ? 'bg-red-500' : 'bg-gray-500'}`}
            onClick={toggleHot}
          >
            Hot <FireIcon className="inline-block w-3 h-3 ml-1" />
          </button>
          <button
            className={`px-2 py-1 rounded text-sm ${isNew === true ? 'bg-yellow-500' : 'bg-gray-500'}`}
            onClick={toggleNew}
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
                sortKey="symbol"
                currentSort={sort}
                onSort={handleSort}
              >
                Symbol
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="price"
                currentSort={sort}
                onSort={handleSort}
              >
                Price
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="marketCap"
                currentSort={sort}
                onSort={handleSort}
              >
                M.Cap
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
                Curve
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
              <SortableTableHeader
                sortKey="creationDate"
                currentSort={sort}
                onSort={handleSort}
              >
                Created
              </SortableTableHeader>
              <SortableTableHeader
                sortKey="creator"
                currentSort={sort}
                onSort={handleSort}
              >
                Creator
              </SortableTableHeader>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonLoader columns={11} />
            ) : (
              launchpadsData?.data.map((item) => (
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
                  <td className="p-1">{item.symbol}</td>
                  <td className="p-1 text-right">${item.price.toFixed(2)}</td>
                  <td className="p-1 text-right">
                    ${item.marketCap.toLocaleString()}
                  </td>
                  <td className="p-1 text-right">
                    ${item.tvl.toLocaleString()}
                  </td>
                  <td className="p-1">{item.bondingCurveType}</td>
                  <td className="p-1 w-24">
                    <ProgressBar percentage={item.completionPercentage} />
                  </td>
                  <td className="p-1">{item.source}</td>
                  <td className="p-1">{item.creationDate}</td>
                  <td className="p-1">{item.creator}</td>
                </ClickableTableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export const App = () => {
  console.log('Hi');
  return (
    <main className="relative flex flex-col min-h-screen min-w-screen text-white">
      <div className="absolute w-full h-full">
        <Background />
      </div>
      <div className="absolute top-0 left-0 w-full z-20">
        <Menu />
      </div>
      <main className="mt-24 z-10 px-2 md:px-4 pb-2 md:pb-4 pt-4 rounded-lg black-blur-background mx-2 md:mx-4">
        <h1 className="text-3xl font-bold mb-4">Mercury Aggregator</h1>
        <p className="text-sm mb-4">
          Mercury is a platform for finding the best launchpads and tokens to
          invest in, by aggregating data from your favorite protocols like
          pump.fun and fomo3d.fun
        </p>
        <div className="backdrop-blur-3xl p-3 rounded-lg">
          <Launchpads />
        </div>
      </main>
    </main>
  );
};
