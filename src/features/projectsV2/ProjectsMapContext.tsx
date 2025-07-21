import type { FC, ReactNode } from 'react';
import type { ViewState } from 'react-map-gl-v7';
import type { MapStyle } from 'react-map-gl-v7/maplibre';
import type { SetState } from '../common/types/common';
import type { MapLayerOptionsType } from '../../utils/mapsV2/mapSettings.config';
import type { ProjectTimeTravelConfig } from '../../utils/mapsV2/timeTravel';

import { useContext, useMemo, createContext, useState, useEffect } from 'react';
import getMapStyle from '../../utils/maps/getMapStyle';

interface MapState {
  mapStyle: MapStyle;
  dragPan: boolean;
  scrollZoom: boolean;
  minZoom: number;
  maxZoom: number;
}

const EMPTY_STYLE = {
  version: 8,
  sources: {},
  layers: [] as MapStyle['layers'],
} as const;

export const DEFAULT_VIEW_STATE: ViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 2,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const DEFAULT_MAP_STATE: MapState = {
  mapStyle: EMPTY_STYLE,
  dragPan: true,
  scrollZoom: true,
  minZoom: 1,
  maxZoom: 20,
};

/**
 * Contains current state of map settings (set using MapFeatureExplorer)
 */
export type MapOptions = {
  [key in MapLayerOptionsType]?: boolean;
};

export type ExploreLayersData = {
  [key in MapLayerOptionsType]?: SingleExploreLayerConfig;
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

type VisParams = {
  max: number;
  min: number;
  palette: string[];
};

type LayerZoomConfig = {
  minZoom: number;
  maxZoom: number;
};

interface ProjectsMapState {
  viewState: ViewState;
  handleViewStateChange: (newViewState: Partial<ViewState>) => void;
  mapState: MapState;
  isSatelliteView: boolean;
  setIsSatelliteView: SetState<boolean>;
  /**
   * Contains the current state (enabled/disabled) of various map-related options.
   */
  mapOptions: MapOptions;
  /**
   * Updates the state of a single map-related option.
   */
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  timeTravelConfig: ProjectTimeTravelConfig | null;
  setTimeTravelConfig: SetState<ProjectTimeTravelConfig | null>;
  exploreLayersData: ExploreLayersData | null;
  setExploreLayersData: SetState<ExploreLayersData | null>;
  isExploreMode: boolean;
}

const ProjectsMapContext = createContext<ProjectsMapState | null>(null);

interface ProjectsMapProviderProps {
  children: ReactNode;
  isEmbedded?: boolean;
  isQueryParamsLoaded?: boolean;
}

export const ProjectsMapProvider: FC<ProjectsMapProviderProps> = ({
  children,
  isEmbedded = false,
  isQueryParamsLoaded = false,
}) => {
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    projects: true,
  });
  const [timeTravelConfig, setTimeTravelConfig] =
    useState<ProjectTimeTravelConfig | null>(null);
  const [exploreLayersData, setExploreLayersData] =
    useState<ExploreLayersData | null>(null);
  const [isExploreMode, setIsExploreMode] = useState(false);

  // Update mapState when embed status changes, but only after query params are loaded
  useEffect(() => {
    if (isQueryParamsLoaded) {
      setMapState((prevState) => ({
        ...prevState,
        scrollZoom: !isEmbedded,
      }));
    }
  }, [isEmbedded, isQueryParamsLoaded]);

  // Set isExploreMode to true if mapOptions has keys other than 'projects' set to true
  useEffect(() => {
    const enabledLayers = Object.entries(mapOptions).filter(
      ([key, value]) => key !== 'projects' && value === true
    );
    setIsExploreMode(enabledLayers.length > 0);
  }, [mapOptions]);

  const handleViewStateChange = (newViewState: Partial<ViewState>) => {
    setViewState((prev) => ({
      ...prev,
      ...newViewState,
    }));
  };

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  /**
   * Updates mapOptions, allowing it to contain only one non-project option at a time
   * @param option option being updated
   * @param value boolean value to set the option to
   */
  const updateMapOption = (option: keyof MapOptions, value: boolean) => {
    if (option === 'projects') {
      setMapOptions((prevOptions) => ({
        ...prevOptions,
        [option]: value,
      }));
    } else {
      setMapOptions((prevOptions) => ({
        projects: Boolean(prevOptions.projects),
        [option]: value,
      }));
    }
  };

  const value: ProjectsMapState | null = useMemo(
    () => ({
      mapState,
      viewState,
      handleViewStateChange,
      isSatelliteView,
      setIsSatelliteView,
      mapOptions,
      updateMapOption,
      exploreLayersData,
      setExploreLayersData,
      isExploreMode,
      timeTravelConfig,
      setTimeTravelConfig,
    }),
    [
      mapState,
      viewState,
      mapOptions,
      isSatelliteView,
      exploreLayersData,
      isExploreMode,
      timeTravelConfig,
    ]
  );

  return (
    <ProjectsMapContext.Provider value={value}>
      {children}
    </ProjectsMapContext.Provider>
  );
};

export const useProjectsMap = (): ProjectsMapState => {
  const context = useContext(ProjectsMapContext);
  if (!context) {
    throw new Error(
      'ProjectsMapContext must be used within ProjectsMapProvider'
    );
  }
  return context;
};
