import { useCallback, useRef } from 'react';

/**
 * Returns a callback ref to attach to a sentinel element at the end of a list.
 * `onLoadMore` fires when the sentinel scrolls into view (while `enabled`).
 * A callback ref (not useEffect) is used so the observer attaches the moment
 * the sentinel mounts — which happens after the initial data load, not on the
 * component's first (still-loading) render.
 */
export const useInfiniteScroll = (onLoadMore: () => void, enabled: boolean) => {
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const observerRef = useRef<IntersectionObserver | null>(null);

  return useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    if (!node) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && enabledRef.current) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: '250px' }
    );
    observerRef.current.observe(node);
  }, []);
};
