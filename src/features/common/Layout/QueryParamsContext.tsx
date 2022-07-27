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
}
export const ParamsContext = createContext<ParamsContextType>({
    embed: undefined,
    singleProject: undefined
});

const QueryParamsProvider: FC = ({ children }) => {
  const [embed, setEmbed] = useState<QueryParamType>(undefined);
  const [singleProject, setSingleProject] = useState<QueryParamType>(undefined);
  const router = useRouter();

  useEffect(() => {
    setEmbed(router.query.embed);
    setSingleProject(router.query.singleproject);
  }, [router]);

  return (
    <ParamsContext.Provider
      value={{
        embed,
        singleProject,
      }}
    >
      {children}
    </ParamsContext.Provider>
  );
};

export default QueryParamsProvider;
