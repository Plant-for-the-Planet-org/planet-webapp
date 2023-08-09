// credits to https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook
import { useCallback, useEffect } from 'react';

/**
 * Produces a debounced version of `useEffect`
 * @param effect - callback function to run within the `useEffect`
 * @param delay - time delay in ms
 * @param deps - dependency array
 */
export const useDebouncedEffect = (
  effect: () => void,
  delay: number,
  deps: string[]
) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};
