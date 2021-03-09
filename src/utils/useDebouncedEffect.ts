// credits to https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook
import { useCallback, useEffect } from "react";

export const useDebouncedEffect = (effect, delay , deps) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
}
