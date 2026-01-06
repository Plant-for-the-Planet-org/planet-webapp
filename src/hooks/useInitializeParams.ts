import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryParamStore } from '../stores/queryParamStore';

const getBooleanQuery = (value?: string | string[]) =>
  value === 'true' || value === 'false' ? value : undefined;

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
      embed: query.embed,
      showBackIcon: query.back_icon,
      callbackUrl: query.callback,
      showProjectDetails: getBooleanQuery(query.project_details),
      showProjectList: getBooleanQuery(query.project_list),
      page,
      isContextLoaded: true,
    });
  }, [router.isReady, router.pathname, router.query, isContextLoaded]);
};
