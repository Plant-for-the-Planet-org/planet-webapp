import type { MapState } from '../utils/mapsV2/mapDefaults';
import type { ViewState } from 'react-map-gl-v7/maplibre';
import type { MapLayerOptionsType } from '../utils/mapsV2/mapSettings.config';
import type { ProjectTimeTravelConfig } from '../utils/mapsV2/timeTravel';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../utils/mapsV2/mapDefaults';

export type MapOptions = {
  [key in MapLayerOptionsType]?: boolean;
};

type VisParams = {
  max: number;
  min: number;
  palette: string[];
};

type LayerZoomConfig = {
  minZoom: number;
  maxZoom: number;
};

export type SingleExploreLayerConfig = {
  uuid: string;
  name: string;
  key: MapLayerOptionsType;
  description: string;
  earthEngineAssetId: string;
  visParams: VisParams;
  zoomConfig: LayerZoomConfig;
  tileUrl: string;
  googleEarthUrl: string;
  metadata: Record<never, never>;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExploreLayersData = {
  [key in MapLayerOptionsType]?: SingleExploreLayerConfig;
};

interface ProjectMainMapStore {
  //states
  mapState: MapState;
  viewState: ViewState;
  isSatelliteView: boolean;
  mapOptions: MapOptions;
  timeTravelConfig: ProjectTimeTravelConfig | null;
  exploreLayersData: ExploreLayersData | null;
  isExploreMode: boolean;

  //Actions
  handleViewStateChange: (newViewState: Partial<ViewState>) => void;
  updateMapOption: (option: MapLayerOptionsType, value: boolean) => void;
  setTimeTravelConfig: (value: ProjectTimeTravelConfig | null) => void;
  setMapState: (partial: Partial<MapState>) => void;
  setIsExploreMode: (value: boolean) => void;
  setIsSatelliteView: (value: boolean) => void;
  setExploreLayersData: (value: ExploreLayersData | null) => void;
}

export const useProjectMainMapStore = create<ProjectMainMapStore>()(
  devtools(
    (set) => ({
      //states
      viewState: DEFAULT_VIEW_STATE,
      mapState: DEFAULT_MAP_STATE,
      mapOptions: {
        projects: true,
      },
      isSatelliteView: false,
      timeTravelConfig: null,
      isExploreMode: false,
      exploreLayersData: null,

      //Actions

      handleViewStateChange: (newViewState: Partial<ViewState>) => {
        set((state) => ({
          viewState: {
            ...state.viewState,
            ...newViewState,
          },
        }));
      },

      /**
       * Updates mapOptions, allowing it to contain only one non-project option at a time
       * @param option option being updated
       * @param value boolean value to set the option to
       */
      updateMapOption: (option: keyof MapOptions, value: boolean) => {
        set((state) => {
          if (option === 'projects') {
            return {
              mapOptions: {
                ...state.mapOptions,
                [option]: value,
              },
            };
          } else {
            return {
              mapOptions: {
                projects: Boolean(state.mapOptions.projects),
                [option]: value,
              },
            };
          }
        });
      },

      setTimeTravelConfig: (value) => set({ timeTravelConfig: value }),
      setMapState: (partial) =>
        set((state) => ({
          mapState: {
            ...state.mapState,
            ...partial,
          },
        })),
      setIsExploreMode: (value) => set({ isExploreMode: value }),
      setExploreLayersData: (value) => set({ exploreLayersData: value }),
      setIsSatelliteView: (value) => set({ isSatelliteView: value }),
    }),
    {
      name: 'projectMapStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
