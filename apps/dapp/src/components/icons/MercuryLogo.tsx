import cx from 'classnames';
import React, { FC, SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement> & {
  className?: string;
  circleClassName?: string;
};

export const Logo: FC<LogoProps> = ({
  className,
  circleClassName,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cx('relative', className)}
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <circle
      cx="6.5"
      cy="15.5"
      r="1.5"
      className={cx('origin-center group-hover:animate-spin', circleClassName)}
    />
  </svg>
);
