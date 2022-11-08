import React, { createContext, FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import appSupportedLocale from '../../../../public/static/localeList.json';

type QueryParamType = string | undefined | string[] | null;
export interface ParamsContextType {
  embed: QueryParamType;
  showBackIcon: QueryParamType;
  callbackUrl: QueryParamType;
  language: QueryParamType;
  showProjectDetails: QueryParamType;
  showProjectList: QueryParamType;
}
export const ParamsContext = createContext<ParamsContextType>({
  embed: undefined,
  showBackIcon: undefined,
  callbackUrl: undefined,
  language: undefined,
  showProjectDetails: undefined,
  showProjectList: undefined,
});

const QueryParamsProvider: FC = ({ children }) => {
  const { i18n } = useTranslation();

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
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query.embed) setEmbed(query.embed);
  }, [query.embed]);

  useEffect(() => {
    if (query.back_icon) setShowBackIcon(query.back_icon);
  }, [query.back_icon]);

  useEffect(() => {
    if (query.callback) setCallbackUrl(query.callback);
  }, [query.callback]);

  useEffect(() => {
    if (
      query.locale &&
      appSupportedLocale.some(
        (locale) => locale.key[0] + locale.key[1] === query.locale
      )
    ) {
      setLanguage(query.locale);
    } else {
      const userPreferenceLanguage = navigator.language ?? navigator.languages;

      //checking is user preference language matching with the application supported language
      const languageMatched = appSupportedLocale.filter((locale) => {
        return (
          locale.key[0] + locale.key[1] ===
          userPreferenceLanguage[0] + userPreferenceLanguage[1]
        );
      });

      if (languageMatched !== undefined) {
        localStorage.setItem('language', languageMatched[0]?.key);
        setLanguage(languageMatched[0]?.key);
        i18n.changeLanguage(languageMatched[0]?.key);
      } else {
        localStorage.setItem('language', 'en');
        setLanguage('en');
        i18n.changeLanguage('en');
      }
    }
  }, [query.locale]);

  useEffect(() => {
    if (query.project_details === 'true' || query.project_details === 'false')
      setShowProjectDetails(query.project_details);
  }, [query.project_details]);

  useEffect(() => {
    if (query.project_list === 'true' || query.project_list === 'false')
      setShowProjectList(query.project_list);
  }, [query.project_list]);

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
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};

export default QueryParamsProvider;
