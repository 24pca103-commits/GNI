import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';
import FloatingWidget from './components/FloatingWidget';
import Preloader from './components/Preloader';
import GniLoader from './components/GniLoader';

/**
 * RouteTransitionLoader
 * Seamlessly plays the signature GNI circular loop font loader on route changes across the site
 */
function RouteTransitionLoader() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const isFirstMount = useRef(true);
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    // Skip on first mount since Preloader already plays on initial site load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      setIsNavigating(true);
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (!isNavigating) return null;

  return (
    <div
      role="status"
      aria-label="Loading page"
      className="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-[#FAF7F0] transition-opacity duration-300 select-none"
    >
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#B89555]/12 blur-3xl pointer-events-none -z-10" />
      <GniLoader size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Initial site opening preloader */}
      <Preloader />
      {/* Route change loader */}
      <RouteTransitionLoader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingWidget />
    </BrowserRouter>
  );
}
