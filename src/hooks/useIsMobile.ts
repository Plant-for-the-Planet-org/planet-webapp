import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile-sized
 * @returns boolean indicating if viewport width is <= 767px
 *
 * Note: Returns false during SSR, then updates on client-side hydration
 */
export const useIsMobile = (): boolean => {
  // Initialize with a function to avoid accessing window during SSR
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 767;
  });

  useEffect(() => {
    // Double-check on mount (handles SSR → client hydration)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // Initial check
    checkMobile();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
