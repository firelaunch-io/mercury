import React from 'react';

import { Menu, Background } from '@/components';

export const App = () => (
  <main className="relative flex flex-col items-center justify-center min-h-screen min-w-screen text-white">
    <div className="absolute w-full h-full">
      <Background />
    </div>
    <div className="absolute top-0 left-0 w-full z-20">
      <Menu />
    </div>
    <div className="mx-4 w-full z-10 my-28">Building...</div>
  </main>
);
