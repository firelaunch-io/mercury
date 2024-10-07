import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Background } from '@/components/Background';
import { Navigation } from '@/components/Navigation';
import { About } from '@/views/About';
import { Contact } from '@/views/Contact';
import { Home } from '@/views/Home';

export const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow relative">
          <Background variant="light" className="absolute inset-0 w-full h-full" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Navigation variant="white" />
      </div>
    </Router>
  );
};
