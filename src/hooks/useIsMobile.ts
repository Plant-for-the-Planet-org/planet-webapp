import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 767;

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses debouncing to optimize performance during window resize
 * @returns boolean indicating if viewport width is <= 767px
 *
 * Note: Returns false during SSR, then updates on client-side hydration
 */
export const useIsMobile = (): boolean => {
  // Initialize with a function to avoid accessing window during SSR
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    // Double-check on mount (handles SSR → client hydration)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    // Initial check
    checkMobile();

    let timeoutId: NodeJS.Timeout;
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    // Listen for window resize
    window.addEventListener('resize', debouncedCheckMobile);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheckMobile);
    };
  }, []);

  return isMobile;
};
