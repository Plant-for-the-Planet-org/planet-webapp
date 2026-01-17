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
    const { query, pathname } = router;
    const page =
      pathname === '/sites/[slug]/[locale]'
        ? 'project-list'
        : query.p !== undefined
        ? 'project-details'
        : null;

    initializeParams({
      embed: getBooleanQuery(query.embed),
      showBackIcon: getBooleanQuery(query.back_icon),
      callbackUrl: getFirstQueryValue(query.callback),
      showProjectDetails: getBooleanQuery(query.project_details),
      showProjectList: getBooleanQuery(query.project_list),
      page,
      isContextLoaded: true,
    });
  }, [router.isReady, router.pathname, router.query, isContextLoaded]);
};
