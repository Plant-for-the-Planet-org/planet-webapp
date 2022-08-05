import React, { createContext, FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

type QueryParamType = string | undefined | string[] | null;
export interface ParamsContextType {
  embed: QueryParamType;
  singleProject: QueryParamType;
  callbackUrl: QueryParamType;
  language: QueryParamType;
}
export const ParamsContext = createContext<ParamsContextType>({
  embed: undefined,
  singleProject: undefined,
  callbackUrl: undefined,
  language: undefined,
});

const QueryParamsProvider: FC = ({ children }) => {
  const { i18n } = useTranslation();

  const [embed, setEmbed] = useState<QueryParamType>(undefined);
  const [singleProject, setSingleProject] = useState<QueryParamType>(undefined);
  const [callbackUrl, setCallbackUrl] = useState<QueryParamType>(undefined);
  const [language, setLanguage] = useState<QueryParamType>(undefined);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    setEmbed(router.query.embed);
  }, [query.embed]);

  useEffect(() => {
    setSingleProject(query.singleProject);
  }, [query.singleProject]);

  useEffect(() => {
    setCallbackUrl(query.callback);
  }, [query.callback]);

  useEffect(() => {
    if (query.locale) {
      setLanguage(query.locale);
    } else {
      setLanguage(localStorage.getItem('language'));
    }
  }, [query.locale]);

  useEffect(() => {
    if (i18n && i18n.isInitialized) {
      i18n.changeLanguage(language as string);
      localStorage.setItem('language', language as string);
    }
  }, [language, i18n.isInitialized]);

  return (
    <ParamsContext.Provider
      value={{
        embed,
        singleProject,
        callbackUrl,
        language,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};

export default QueryParamsProvider;
