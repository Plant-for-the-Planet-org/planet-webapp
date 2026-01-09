import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type EmbeddablePages = 'project-list' | 'project-details';
export type BooleanQueryParam = 'true' | 'false' | undefined;

interface QueryParamStore {
  embed: BooleanQueryParam;
  showBackIcon: BooleanQueryParam;
  callbackUrl: string | undefined;
  showProjectDetails: BooleanQueryParam;
  showProjectList: BooleanQueryParam;
  isContextLoaded: boolean;
  page: EmbeddablePages | null;

  initializeParams: (
    params: Partial<Omit<QueryParamStore, 'initializeParams'>>
  ) => void;
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
        set(params, undefined, 'queryParamStore/init_from_router'),
    }),
    {
      name: 'QueryParamStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
