import { FC, useMemo } from 'react';

type BackgroundVariant = 'dark' | 'light' | 'dusk' | 'twilight';

type GradientColors = {
  sky: [string, string];
  mountain1: [string, string];
  mountain2: [string, string];
  mountain3: [string, string];
};

const gradients: Record<BackgroundVariant, GradientColors> = {
  dark: {
    sky: ['#140318', '#2a0f24'],
    mountain1: ['#ff6b6b', '#cc2e5d'],
    mountain2: ['#ff8e3c', '#ff5733'],
    mountain3: ['#ff9966', '#ff5e62'],
  },
  light: {
    sky: ['#87CEEB', '#E0F6FF'],
    mountain1: ['#FFB347', '#FF8C00'],
    mountain2: ['#FFA07A', '#FF6347'],
    mountain3: ['#FF7F50', '#FF4500'],
  },
  dusk: {
    sky: ['#4A0E2E', '#7A1E3D'],
    mountain1: ['#3B0058', '#6B0058'],
    mountain2: ['#2E1F5B', '#4A3B8C'],
    mountain3: ['#0E0E46', '#1A1A5A'],
  },
  twilight: {
    sky: ['#1C1C3C', '#2E2E5C'],
    mountain1: ['#2B0F3A', '#3D1C5A'],
    mountain2: ['#1E1E3F', '#2D2D5F'],
    mountain3: ['#0F0F2F', '#1E1E4F'],
  },
};

type Star = {
  x: number;
  y: number;
  r: number;
  opacity: number;
};

const generateStars = (count: number): Star[] =>
  Array.from({ length: count }, () => ({
    x: Math.random() * 1200,
    y: Math.random() * 800,
    r: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
  }));

type SvgStarsProps = {
  variant: BackgroundVariant;
};

const SvgStars: FC<SvgStarsProps> = ({ variant }) => {
  const stars = useMemo(() => generateStars(100), []);

  if (!['dark', 'twilight', 'dusk'].includes(variant)) return null;

  return (
    <>
      {stars.map((star, index) => (
        <circle
          key={index}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="#ffffff"
          opacity={star.opacity}
        />
      ))}
    </>
  );
};

type SvgCelestialBodyProps = {
  variant: BackgroundVariant;
};

const SvgCelestialBody: FC<SvgCelestialBodyProps> = ({ variant }) => {
  switch (variant) {
    case 'dark':
      return (
        <>
          <circle cx="85%" cy="15%" r="60" fill="#fff6a6" />
          <circle cx="83%" cy="13%" r="15" fill="#e6e6c3" opacity="0.4" />
          <circle cx="87%" cy="16%" r="10" fill="#e6e6c3" opacity="0.3" />
          <circle cx="85%" cy="18%" r="8" fill="#e6e6c3" opacity="0.2" />
        </>
      );
    case 'light':
      return <circle cx="85%" cy="15%" r="60" fill="#FFD700" />;
    case 'dusk':
      return <circle cx="85%" cy="15%" r="80" fill="#FF2400" />;
    case 'twilight':
      return <circle cx="85%" cy="15%" r="70" fill="#E6E6FA" opacity="0.7" />;
  }
};

type SvgMountainProps = {
  path: string;
  gradientId: string;
};

const SvgMountain: FC<SvgMountainProps> = ({ path, gradientId }) => (
  <path d={path} fill={`url(#${gradientId})`} />
);

type BackgroundProps = {
  variant: BackgroundVariant;
} & React.SVGProps<SVGSVGElement>;

export const Background: FC<BackgroundProps> = ({ variant, ...svgProps }) => {
  const colors = gradients[variant];

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      {...svgProps}
    >
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.sky[0]} />
          <stop offset="100%" stopColor={colors.sky[1]} />
        </linearGradient>
        <linearGradient id="mountainGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.mountain1[0]} />
          <stop offset="100%" stopColor={colors.mountain1[1]} />
        </linearGradient>
        <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.mountain2[0]} />
          <stop offset="100%" stopColor={colors.mountain2[1]} />
        </linearGradient>
        <linearGradient id="mountainGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.mountain3[0]} />
          <stop offset="100%" stopColor={colors.mountain3[1]} />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#skyGradient)" />
      <SvgStars variant={variant} />
      <SvgCelestialBody variant={variant} />
      <SvgMountain
        path="M0 800 L400 300 L650 600 L900 400 L1200 700 L1200 800 Z"
        gradientId="mountainGradient1"
      />
      <SvgMountain
        path="M0 800 L300 400 L600 700 L900 500 L1200 800 Z"
        gradientId="mountainGradient2"
      />
      <SvgMountain
        path="M0 800 L300 550 L500 700 L700 500 L900 650 L1100 550 L1200 800 Z"
        gradientId="mountainGradient3"
      />
    </svg>
  );
};
