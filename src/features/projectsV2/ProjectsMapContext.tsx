import type { FC } from 'react';
import type { ViewState } from 'react-map-gl-v7';
import type { MapStyle } from 'react-map-gl-v7/maplibre';
import type { SetState } from '../common/types/common';
import type { ProjectTimeTravelConfig } from '../../utils/mapsV2/timeTravel';

import { useContext, useMemo, createContext, useState, useEffect } from 'react';
import getMapStyle from '../../utils/maps/getMapStyle';

// Update ViewState type to ensure width and height are included
interface ExtendedViewState extends ViewState {
  width?: string | number;
  height?: string | number;
}

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

export const DEFAULT_VIEW_STATE: ExtendedViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 2,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
  width: '100%',
  height: '100%',
};

const DEFAULT_MAP_STATE: MapState = {
  mapStyle: EMPTY_STYLE,
  dragPan: true,
  scrollZoom: false,
  minZoom: 1,
  maxZoom: 20,
};

export type MapOptions = {
  showProjects: boolean;
};

interface ProjectsMapState {
  viewState: ViewState;
  handleViewStateChange: (newViewState: Partial<ExtendedViewState>) => void;
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
}

const ProjectsMapContext = createContext<ProjectsMapState | null>(null);
export const ProjectsMapProvider: FC = ({ children }) => {
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    showProjects: true,
  });
  const [timeTravelConfig, setTimeTravelConfig] =
    useState<ProjectTimeTravelConfig | null>(null);

  const handleViewStateChange = (newViewState: Partial<ExtendedViewState>) => {
    setViewState((prev) => ({
      ...prev,
      ...newViewState,
      width: '100%', // Always ensure width and height are set
      height: '100%',
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

  const updateMapOption = (option: keyof MapOptions, value: boolean) => {
    setMapOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }));
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
      timeTravelConfig,
      setTimeTravelConfig,
    }),
    [mapState, viewState, mapOptions, isSatelliteView, timeTravelConfig]
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
