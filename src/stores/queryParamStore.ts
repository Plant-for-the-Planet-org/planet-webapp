import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type EmbeddablePages = 'project-list' | 'project-details';
export type QueryParamType = string | undefined | string[] | null;

interface QueryParamStore {
  embed: QueryParamType;
  showBackIcon: QueryParamType;
  callbackUrl: QueryParamType;
  showProjectDetails: QueryParamType;
  showProjectList: QueryParamType;
  enableIntro: QueryParamType;
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
      enableIntro: undefined,
      page: null,
      isContextLoaded: false,

      initializeParams: (params) => set((state) => ({ ...state, ...params })),
    }),
    {
      name: 'QueryParamStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
