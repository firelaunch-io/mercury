import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useRef } from 'react';
import React, { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { RpcSelector, Logo as MercuryLogo } from '@/components';
import { useBackground, useAuth } from '@/hooks';

// Constants
const menuItems: Array<{ name: string; href: string }> = [];

const backgroundVariants = [
  { name: 'Dark', value: 'dark', colors: ['#140318', '#2a0f24'] },
  { name: 'Light', value: 'light', colors: ['#87CEEB', '#E0F6FF'] },
  { name: 'Dusk', value: 'dusk', colors: ['#FF5050', '#FF5500'] },
  { name: 'Twilight', value: 'twilight', colors: ['#1C1C3C', '#2E2E5C'] },
  {
    name: 'Black and White',
    value: 'blackAndWhite',
    colors: ['#FFFFFF', '#FFFFFF'],
  },
] as const;

// Components
type LogoProps = {
  className?: string;
};

const Logo: FC<LogoProps> = ({ className }) => (
  <Link
    to="/"
    className={`flex items-center ${className} bg-white rounded-full px-4 py-1 transition-colors duration-300 hover:bg-black group`}
  >
    <MercuryLogo className="w-8 h-8 text-black mr-2 group-hover:text-white transition-colors duration-300" />
    <span className="text-xl font-bold text-black group-hover:text-white transition-colors duration-300">
      Mercury
    </span>
  </Link>
);

const ThemeSelector: FC = () => {
  const { variant, setVariant } = useBackground();
  return (
    <Popover className="relative">
      {() => (
        <>
          <PopoverButton className="px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75">
            Theme
            <div
              className="w-4 h-4 ml-2 rounded"
              style={{
                background: `linear-gradient(to bottom right, ${backgroundVariants.find((bg) => bg.value === variant)?.colors[0]}, ${backgroundVariants.find((bg) => bg.value === variant)?.colors[1]})`,
              }}
            ></div>
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute z-20 lg:left-1/2 lg:transform lg:-translate-x-1/2 mt-3 w-48 rounded-md shadow-lg bg-black">
              <div className="py-1">
                {backgroundVariants.map((bgVariant) => (
                  <button
                    key={bgVariant.value}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setVariant(bgVariant.value)}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 mr-2 rounded"
                        style={{
                          background: `linear-gradient(to bottom right, ${bgVariant.colors[0]}, ${bgVariant.colors[1]})`,
                        }}
                      ></div>
                      {bgVariant.name}
                    </div>
                  </button>
                ))}
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

type UserMenuProps = {
  isAuthenticated: boolean;
  signIn: () => void;
  isPending: boolean;
};

const UserMenu: FC<UserMenuProps> = ({
  isAuthenticated,
  signIn,
  isPending,
}) => (
  <li className="nav-item">
    {isAuthenticated ? (
      <Popover className="relative">
        {() => (
          <>
            <PopoverButton className="px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75">
              User
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute z-20 right-0 mt-3 w-48 rounded-md shadow-lg bg-black">
                <div className="py-1">
                  <Link
                    to="/app/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    ) : (
      <button
        className="px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75"
        onClick={() => signIn()}
        disabled={isPending}
      >
        {isPending ? 'Signing In...' : 'Sign In'}
      </button>
    )}
  </li>
);

export const Menu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signIn, isPending, isAuthenticated } = useAuth();
  const { connected } = useWallet();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full p-4 black-blur-background">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Logo />

        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        <div
          ref={menuRef}
          className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-auto`}
        >
          <ul className="lg:flex items-center flex-col lg:flex-row list-none lg:ml-auto">
            {menuItems.map((item) => (
              <li key={item.name} className="nav-item">
                <Link
                  className="px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75"
                  to={item.href}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <ThemeSelector />
            </li>
            <li className="nav-item">
              <RpcSelector />
            </li>
            <li className="nav-item">
              <WalletMultiButton />
            </li>
            {connected && (
              <UserMenu
                isAuthenticated={isAuthenticated}
                signIn={signIn}
                isPending={isPending}
              />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
