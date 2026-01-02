import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryParamStore } from '../stores/queryParamStore';

export const useInitializeParams = () => {
  const router = useRouter();
  const initializeParams = useQueryParamStore(
    (state) => state.initializeParams
  );

  useEffect(() => {
    if (!router.isReady) return;
    const query = router.query;
    const pathname = router.pathname;
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
      showProjectDetails:
        query.project_details === 'true' || query.project_details === 'false'
          ? query.project_details
          : undefined,
      showProjectList:
        query.project_list === 'true' || query.project_list === 'false'
          ? query.project_list
          : undefined,
      enableIntro:
        query.enable_intro === 'true' || query.enable_intro === 'false'
          ? query.enable_intro
          : undefined,
      page,
      isContextLoaded: true,
    });
  }, [router.isReady, router.pathname, router.query]);
};
