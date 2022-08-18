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
  tenantID: QueryParamType;
}
export const ParamsContext = createContext<ParamsContextType>({
  embed: undefined,
  singleProject: undefined,
  callbackUrl: undefined,
  language: undefined,
  tenantID: '',
});

const QueryParamsProvider: FC = ({ children }) => {
  const { i18n } = useTranslation();

  const [embed, setEmbed] = useState<QueryParamType>(undefined);
  const [singleProject, setSingleProject] = useState<QueryParamType>(undefined);
  const [callbackUrl, setCallbackUrl] = useState<QueryParamType>(undefined);
  const [language, setLanguage] = useState<QueryParamType>(undefined);
  const [tenantID, setTenantID] = useState<QueryParamType>('');
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query.embed) setEmbed(query.embed);
  }, [query.embed]);

  useEffect(() => {
    if (query.singleProject) setSingleProject(query.singleProject);
  }, [query.singleProject]);

  useEffect(() => {
    if (query.callback) setCallbackUrl(query.callback);
  }, [query.callback]);

  useEffect(() => {
    if (query.locale) setLanguage(query.locale);
  }, [query.locale]);

  useEffect(() => {
    if (i18n && i18n.isInitialized && language) {
      i18n.changeLanguage(language as string);
      /* localStorage.setItem('language', language as string); */ //not needed as i18n handles setting the local storage
    }
  }, [language, i18n.isInitialized]);
  console.log(tenantID, '1');

  useEffect(() => {
    console.log(query, '2');
    const getTenantId = (tenantId: string) => {
      if (process.env.TENANTID) {
        return process.env.TENANTID;
      } else if (tenantId) {
        return tenantId;
      } else {
        return 'ten_NxJq55pm';
      }
    };
    console.log(query.tenant, '3');
    const id = query.tenant;
    console.log(id, '4');
    if (id) {
      console.log(id, '5');
      const tenantId = getTenantId(id);
      console.log(id, '6');
      console.log(tenantId, '7');
      setTenantID(tenantId);
      console.log(tenantId, '8');
    }
  }, [router.query, query.tenant]);

  console.log(tenantID, 'main');
  return (
    <ParamsContext.Provider
      value={{
        embed,
        singleProject,
        callbackUrl,
        language,
        tenantID,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};

export default QueryParamsProvider;
