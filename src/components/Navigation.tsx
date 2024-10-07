import { EnvelopeIcon, HomeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { match } from 'ts-pattern';

type NavigationProps = {
  className?: string;
  variant: 'black' | 'white';
};

type NavItemProps = {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  variant: 'black' | 'white';
};

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, variant }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const itemClasses = match({ variant, isActive })
    .with({ variant: 'black', isActive: true }, () => 'bg-white bg-opacity-10 text-white')
    .with({ variant: 'white', isActive: true }, () => 'bg-black bg-opacity-10 text-black')
    .with(
      { variant: 'black', isActive: false },
      () => 'hover:text-gray-300 hover:bg-white hover:bg-opacity-10'
    )
    .with(
      { variant: 'white', isActive: false },
      () => 'hover:text-gray-700 hover:bg-black hover:bg-opacity-10'
    )
    .exhaustive();

  const textColor = variant === 'black' ? 'text-white' : 'text-black';
  const underlineColor = variant === 'black' ? 'bg-white' : 'bg-black';

  return (
    <Link
      to={to}
      className={classNames(
        'p-4 flex-1 flex flex-col items-center transition-colors duration-300 ease-in-out relative',
        textColor,
        itemClasses
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
      {isActive && (
        <div className={classNames('absolute bottom-0 left-0 right-0 h-[1px]', underlineColor)} />
      )}
    </Link>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ className, variant }) => {
  const bgColor = match(variant)
    .with('black', () => 'bg-black bg-opacity-50')
    .with('white', () => 'bg-white bg-opacity-50')
    .exhaustive();

  return (
    <nav
      className={classNames(
        'overflow-hidden flex absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-filter backdrop-blur-lg rounded-full shadow-lg w-11/12 max-w-4xl sm:w-[calc(100%-2rem)] shadow-xl',
        bgColor,
        className
      )}
    >
      <NavItem to="/" icon={HomeIcon} label="Home" variant={variant} />
      <NavItem to="/about" icon={InformationCircleIcon} label="About" variant={variant} />
      <NavItem to="/contact" icon={EnvelopeIcon} label="Contact" variant={variant} />
    </nav>
  );
};
