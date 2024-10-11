import {
  FC,
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
} from 'react';
import { ViewState } from 'react-map-gl-v7';
import { MapStyle } from 'react-map-gl-v7/maplibre';
import getMapStyle from '../../utils/maps/getMapStyle';
import { SetState } from '../common/types/common';
import { useProjects } from './ProjectsContext';

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
  scrollZoom: false,
  minZoom: 1,
  maxZoom: 20,
};

export type MapOptions = {
  showProjects: boolean;
};

interface ProjectsMapState {
  viewState: ViewState;
  setViewState: SetState<ViewState>;
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
}

const ProjectsMapContext = createContext<ProjectsMapState | null>(null);

export const ProjectsMapProvider: FC = ({ children }) => {
  const { filteredProjects, plantLocations } = useProjects();
  const hasSingleProject = filteredProjects?.length === 1;
  const singleProjectCoordinates = hasSingleProject
    ? filteredProjects[0].geometry.coordinates
    : [0, 0];
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    showProjects: true,
  });

  useEffect(() => {
    const [longitude, latitude] = singleProjectCoordinates;
    setViewState((prev) => ({
      ...prev,
      longitude,
      latitude,
    }));
  }, [filteredProjects]);

  useEffect(() => {
    if (plantLocations) setIsSatelliteView(!(plantLocations?.length > 0));
  }, [plantLocations]);

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
      setViewState,
      mapOptions,
      updateMapOption,
      isSatelliteView,
      setIsSatelliteView,
    }),
    [mapState, viewState, mapOptions, isSatelliteView]
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
