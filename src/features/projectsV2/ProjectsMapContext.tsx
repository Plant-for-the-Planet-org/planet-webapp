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

const DEFAULT_VIEW_STATE: ViewState = {
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
  maxZoom: 15,
};

interface ProjectsMapState {
  viewState: ViewState;
  setViewState: SetState<ViewState>;
  mapState: MapState;
}

const ProjectsMapContext = createContext<ProjectsMapState | null>(null);

export const ProjectsMapProvider: FC = ({ children }) => {
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  const value: ProjectsMapState | null = useMemo(
    () => ({ mapState, viewState, setViewState }),
    [mapState, viewState]
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