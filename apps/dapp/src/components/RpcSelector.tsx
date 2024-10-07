import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import React, { useState } from 'react';

import { useModal, useRpc } from '@/hooks';

const rpcOptions = [
  { name: 'Mainnet Beta', value: 'https://api.mainnet-beta.solana.com' },
  { name: 'Devnet', value: 'https://api.devnet.solana.com' },
];

export const RpcSelector: React.FC = () => {
  const { rpc, setRpc } = useRpc();
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);

  const handleRpcChange = (newRpc: string) => {
    setRpc(newRpc);
    setIsOpen(false);
  };

  return (
    <Popover className="relative">
      <PopoverButton
        className="px-3 py-2 text-sm uppercase font-bold leading-snug text-white hover:opacity-75"
        onClick={() => setIsOpen(!isOpen)}
      >
        RPC:{' '}
        {rpcOptions.find((option) => option.value === rpc)?.name || 'Custom'}
      </PopoverButton>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute z-20 w-56 mt-2 bg-black rounded-md shadow-lg">
          <div className="py-1">
            {rpcOptions.map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => handleRpcChange(option.value)}
              >
                {option.name}
              </button>
            ))}
            <button
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
              onClick={() => {
                openModal();
                setIsOpen(false);
              }}
            >
              Custom RPC
            </button>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};
