import type { MapState } from '../utils/mapsV2/mapDefaults';
import type { ViewState } from 'react-map-gl-v7/maplibre';
import type { MapLayerOptionsType } from '../utils/mapsV2/mapSettings.config';
import type { ProjectTimeTravelConfig } from '../utils/mapsV2/timeTravel';
import type {
  ExploreLayersData,
  MapOptions,
} from '../features/common/types/map';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../utils/mapsV2/mapDefaults';
import getMapStyle from '../utils/maps/getMapStyle';

interface ProjectMainMapStore {
  //states
  mapState: MapState;
  viewState: ViewState;
  isSatelliteView: boolean;
  mapOptions: MapOptions;
  timeTravelConfig: ProjectTimeTravelConfig | null;
  exploreLayersData: ExploreLayersData | null;
  isMapStyleLoaded: boolean;

  //Actions
  initializeMapStyle: () => Promise<void>;
  handleViewStateChange: (newViewState: Partial<ViewState>) => void;
  updateMapOption: (option: MapLayerOptionsType, value: boolean) => void;
  setTimeTravelConfig: (value: ProjectTimeTravelConfig | null) => void;
  setMapState: (partial: Partial<MapState>) => void;
  setIsSatelliteView: (value: boolean) => void;
  setExploreLayersData: (value: ExploreLayersData | null) => void;
}

export const useProjectMainMapStore = create<ProjectMainMapStore>()(
  devtools(
    (set, get) => ({
      //states
      viewState: DEFAULT_VIEW_STATE,
      mapState: DEFAULT_MAP_STATE,
      mapOptions: {
        projects: true,
      },
      isSatelliteView: false,
      timeTravelConfig: null,
      exploreLayersData: null,
      isMapStyleLoaded: false,

      //Actions
      initializeMapStyle: async () => {
        const { isMapStyleLoaded } = get();

        if (isMapStyleLoaded) return;
        const style = await getMapStyle('default');
        if (!style) return;
        set(
          (state) => ({
            mapState: {
              ...state.mapState,
              mapStyle: style,
            },
            isMapStyleLoaded: true,
          }),
          undefined,
          'projectMainMapStore/initialize_map_style'
        );
      },
      handleViewStateChange: (newViewState: Partial<ViewState>) => {
        set(
          (state) => ({
            viewState: {
              ...state.viewState,
              ...newViewState,
            },
          }),
          undefined,
          'projectMainMapStore/view_state_change'
        );
      },

      /**
       * Updates mapOptions, allowing it to contain only one non-project option at a time
       * @param option option being updated
       * @param value boolean value to set the option to
       */
      updateMapOption: (option: keyof MapOptions, value: boolean) => {
        set(
          (state) => {
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
          },
          undefined,
          'projectMainMapStore/map_options_update'
        );
      },

      setTimeTravelConfig: (value) =>
        set(
          { timeTravelConfig: value },
          undefined,
          'projectMainMapStore/time_travel_set_config'
        ),
      setMapState: (partial) =>
        set(
          (state) => ({
            mapState: {
              ...state.mapState,
              ...partial,
            },
          }),
          undefined,
          'projectMainMapStore/mapState_update'
        ),
      setExploreLayersData: (value) =>
        set(
          { exploreLayersData: value },
          undefined,
          'projectMainMapStore/explore_set_layers_data'
        ),
      setIsSatelliteView: (value) =>
        set(
          { isSatelliteView: value },
          undefined,
          'projectMainMapStore/set_satellite_view'
        ),
    }),
    {
      name: 'ProjectMainMapStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
