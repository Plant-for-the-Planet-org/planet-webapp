import React, {
  createContext,
  FC,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';

type QueryParamType = string | undefined | string[];
export interface ParamsContextType {
  embed: QueryParamType;
  singleProject: QueryParamType;
  callbackUrl: QueryParamType;
}
export const ParamsContext = createContext<ParamsContextType>({
  embed: undefined,
  singleProject: undefined,
  callbackUrl: undefined,
});

const QueryParamsProvider: FC = ({ children }) => {
  const [embed, setEmbed] = useState<QueryParamType>(undefined);
  const [singleProject, setSingleProject] = useState<QueryParamType>(undefined);
  const [callbackUrl, setCallbackUrl] = useState<QueryParamType>(undefined);
  const router = useRouter();

  useEffect(() => {
    setEmbed(router.query.embed);
    setSingleProject(router.query.singleproject);
    setCallbackUrl(router.query.callback);
    // console.log(router.query);
  }, [router]);

  return (
    <ParamsContext.Provider
      value={{
        embed,
        singleProject,
        callbackUrl,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};

export default QueryParamsProvider;
