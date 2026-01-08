import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type EmbeddablePages = 'project-list' | 'project-details';
export type QueryParamType = 'true' | 'false' | undefined;

interface QueryParamStore {
  embed: QueryParamType;
  showBackIcon: QueryParamType;
  callbackUrl: string | undefined;
  showProjectDetails: QueryParamType;
  showProjectList: QueryParamType;
  isContextLoaded: boolean;
  page: EmbeddablePages | null;

  initializeParams: (params: Partial<QueryParamStore>) => void;
}

export const useQueryParamStore = create<QueryParamStore>()(
  devtools(
    (set) => ({
      embed: undefined,
      showBackIcon: undefined,
      callbackUrl: undefined,
      showProjectDetails: undefined,
      showProjectList: undefined,
      page: null,
      isContextLoaded: false,

      initializeParams: (params) =>
        set(params, undefined, 'queryParamStore/sync_from_router'),
    }),
    {
      name: 'QueryParamStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
