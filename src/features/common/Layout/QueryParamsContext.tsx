import React, { createContext, FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import tenantConfig from '../../../../tenant.config';

const config = tenantConfig();
const tenantSupportedLocale = config.languages;
type QueryParamType = string | undefined | string[] | null;
export interface ParamsContextType {
  embed: QueryParamType;
  showBackIcon: QueryParamType;
  callbackUrl: QueryParamType;
  language: QueryParamType;
  showProjectDetails: QueryParamType;
  showProjectList: QueryParamType;
  enableIntro: QueryParamType;
  isContextLoaded: boolean;
}
export const ParamsContext = createContext<ParamsContextType>({
  embed: undefined,
  showBackIcon: undefined,
  callbackUrl: undefined,
  language: undefined,
  showProjectDetails: undefined,
  showProjectList: undefined,
  enableIntro: undefined,
  isContextLoaded: false,
});

const QueryParamsProvider: FC = ({ children }) => {
  const { i18n } = useTranslation();
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [embed, setEmbed] = useState<QueryParamType>(undefined);
  const [showBackIcon, setShowBackIcon] = useState<QueryParamType>(undefined);
  const [callbackUrl, setCallbackUrl] = useState<QueryParamType>(undefined);
  const [language, setLanguage] = useState<QueryParamType>(
    typeof window !== 'undefined' && localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en'
  );

  const [showProjectDetails, setShowProjectDetails] =
    useState<QueryParamType>(undefined);
  const [showProjectList, setShowProjectList] =
    useState<QueryParamType>(undefined);
  const [enableIntro, setEnableIntro] = useState<QueryParamType>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { query } = router;
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
  }, [router]);

  useEffect(() => {
    if (localStorage.getItem('language') === null) {
      const userBrowserLanguage = navigator.language ?? navigator.languages[0];
      // checks whether tenant supported locale matches the user browser preference locale
      const languageMatched = tenantSupportedLocale.find((locale) => {
        return (
          locale[0] + locale[1] ===
          userBrowserLanguage[0] + userBrowserLanguage[1]
        );
      });

      if (languageMatched !== undefined) {
        localStorage.setItem('language', languageMatched);
        setLanguage(languageMatched);
        i18n.changeLanguage(languageMatched);
      } else {
        localStorage.setItem('language', 'en');
        setLanguage('en');
        i18n.changeLanguage('en');
      }
    }
  }, [tenantSupportedLocale]);

  useEffect(() => {
    if (i18n && i18n.isInitialized && language) {
      i18n.changeLanguage(language as string);
      /* localStorage.setItem('language', language as string); */ //not needed as i18n handles setting the local storage
    }
  }, [language, i18n.isInitialized]);

  return (
    <ParamsContext.Provider
      value={{
        embed,
        showBackIcon,
        callbackUrl,
        language,
        showProjectDetails,
        showProjectList,
        enableIntro,
        isContextLoaded,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};

export default QueryParamsProvider;
