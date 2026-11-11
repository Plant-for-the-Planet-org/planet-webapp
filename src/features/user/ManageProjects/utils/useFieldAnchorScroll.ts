import { useEffect } from 'react';

/**
 * Honours a `#field-...` hash after the form has rendered. Needed because the
 * fields do not exist yet when the browser first tries to follow the hash, so
 * links arriving from the Review page would otherwise land at the top.
 */
export default function useFieldAnchorScroll(ready: boolean): void {
  useEffect(() => {
    if (!ready) return;
    const anchor = window.location.hash.slice(1);
    if (!anchor) return;
    document.getElementById(anchor)?.scrollIntoView({ block: 'center' });
  }, [ready]);
}
