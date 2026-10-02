import { useEffect, useState } from 'react';

/**
 * SSR-safe media-query hook. Returns false on the server / first render, then
 * the real match after mount (so it never causes a hydration mismatch).
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
};
