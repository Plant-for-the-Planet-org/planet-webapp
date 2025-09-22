import type { ReactNode } from 'react';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLocale } from 'next-intl';

export type QueryParamType = string | undefined | string[] | null;
export interface ParamsContextType {
  embed: QueryParamType;
  showBackIcon: QueryParamType;
  callbackUrl: QueryParamType;
  showProjectDetails: QueryParamType;
  showProjectList: QueryParamType;
  enableIntro: QueryParamType;
  isContextLoaded: boolean;
  page: EmbeddablePages | null;
}

type EmbeddablePages = 'project-list' | 'project-details';

export const ParamsContext = createContext<ParamsContextType>({
  embed: undefined,
  showBackIcon: undefined,
  callbackUrl: undefined,
  showProjectDetails: undefined,
  showProjectList: undefined,
  enableIntro: undefined,
  isContextLoaded: false,
  page: null,
});

const QueryParamsProvider = ({ children }: { children: ReactNode }) => {
  const locale = useLocale();
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [embed, setEmbed] = useState<QueryParamType>(undefined);
  const [showBackIcon, setShowBackIcon] = useState<QueryParamType>(undefined);
  const [callbackUrl, setCallbackUrl] = useState<QueryParamType>(undefined);
  const [page, setPage] = useState<EmbeddablePages | null>(null);

  const [showProjectDetails, setShowProjectDetails] =
    useState<QueryParamType>(undefined);
  const [showProjectList, setShowProjectList] =
    useState<QueryParamType>(undefined);
  const [enableIntro, setEnableIntro] = useState<QueryParamType>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const query = router.query;
      const pathname = router.pathname;
      if (pathname === '/sites/[slug]/[locale]') {
        setPage('project-list');
      } else if (query.p !== undefined) {
        setPage('project-details');
      } else {
        setPage(null);
      }
      if (query.embed) setEmbed(query.embed);
      if (query.back_icon) setShowBackIcon(query.back_icon);
      if (query.callback) setCallbackUrl(query.callback);
      if (query.project_details === 'true' || query.project_details === 'false')
        setShowProjectDetails(query.project_details);
      if (query.project_list === 'true' || query.project_list === 'false')
        setShowProjectList(query.project_list);
      if (query.enable_intro === 'true' || query.enable_intro === 'false')
        setEnableIntro(query.enable_intro);
      setIsContextLoaded(true);
    }
  }, [router.isReady, router.query, router.pathname]);

  useEffect(() => {
    if (localStorage.getItem('language') !== locale)
      localStorage.setItem('language', locale);
  }, [locale]);

  return (
    <ParamsContext.Provider
      value={{
        embed,
        showBackIcon,
        callbackUrl,
        showProjectDetails,
        showProjectList,
        enableIntro,
        isContextLoaded,
        page,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};

export default QueryParamsProvider;
