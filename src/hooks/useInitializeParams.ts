import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryParamStore } from '../stores/queryParamStore';

const getFirstQueryValue = (value?: string | string[]): string | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

const getBooleanQuery = (
  value?: string | string[]
): 'true' | 'false' | undefined => {
  const normalized = getFirstQueryValue(value);
  return normalized === 'true' || normalized === 'false'
    ? normalized
    : undefined;
};

export const useInitializeParams = () => {
  const router = useRouter();
  const initializeParams = useQueryParamStore(
    (state) => state.initializeParams
  );
  const isContextLoaded = useQueryParamStore((state) => state.isContextLoaded);

  useEffect(() => {
    if (!router.isReady || isContextLoaded) return;
    const { query } = router;

    initializeParams({
      embed: getBooleanQuery(query.embed),
      showBackIcon: getBooleanQuery(query.back_icon),
      callbackUrl: getFirstQueryValue(query.callback),
      showProjectDetails: getBooleanQuery(query.project_details),
      showProjectList: getBooleanQuery(query.project_list),
      isContextLoaded: true,
    });
  }, [router.isReady, router.query, isContextLoaded]);

  /**
   * Remember where to return to, for the back button on project details.
   *
   * Kept out of the latched effect above so a client-side navigation carrying a
   * new `backNavigationUrl` still updates it. It lives here rather than in
   * `ProjectSnippet` because that component is not rendered when the details
   * pane is hidden in embed mode.
   */
  useEffect(() => {
    const { backNavigationUrl } = router.query;
    if (typeof backNavigationUrl !== 'string') return;

    try {
      sessionStorage.setItem(
        'backNavigationUrl',
        decodeURIComponent(backNavigationUrl)
      );
    } catch {
      // Malformed percent-encoding, such as a bare `%`, throws a `URIError`.
      // Session storage can also be blocked in a cross-origin embed.
      // Neither is worth failing the page for, the back button just falls back to home.
    }
  }, [router.query.backNavigationUrl]);
};
