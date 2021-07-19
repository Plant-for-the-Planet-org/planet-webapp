import React, { ReactElement } from 'react';

interface Props {}

export const ProjectPropsContext = React.createContext({
  projects: [] || null,
  project: {} || null,
  setProject: (value: {}) => {},
  setProjects: (value: []) => {},
  showSingleProject: false,
  setShowSingleProject: (value: boolean) => {},
  showProjects: true,
  setShowProjects: (value: boolean) => {},
  searchedProject: [],
  setsearchedProjects: (value: []) => {},
  geoJson: {} || null,
  setGeoJson: (value: boolean) => {},
  selectedSite: 0,
  setSelectedSite: (value: number) => {},
  siteExists: false,
  setsiteExists: (value: boolean) => {},
  isMobile: false,
  infoRef: {} || null,
  exploreContainerRef: {} || null,
  exploreExpanded: false,
  setExploreExpanded: (value: boolean) => {},
  exploreForests: false,
  setExploreForests: (value: boolean) => {},
  explorePotential: false,
  setExplorePotential: (value: boolean) => {},
  exploreDeforestation: false,
  setExploreDeforestation: (value: boolean) => {},
  explorePlanted: false,
  setExplorePlanted: (value: boolean) => {},
  infoExpanded: null || '',
  setInfoExpanded: (value: string) => {},
  openModal: false,
  setModalOpen: (value: boolean) => {},
  viewport: {},
  setViewPort: (value: {}) => {},
  setExploreProjects: (value: boolean) => {},
  mapState: {},
  setMapState: (value: {}) => {},
  exploreProjects: true,
  loaded: false,
  setLoaded: (value: boolean) => {},
  mapRef: {},
  defaultMapCenter: [],
  defaultZoom: 1.4,
  layersSettings: {},
  setLayersSettings: (value: {}) => {},
  selectedMode: 'location',
  setSelectedMode: (value: string) => {},
  rasterData: {
    evi: '',
    imagery: {},
  },
  setRasterData: (value: {}) => {},
  isPolygonMenuOpen: false,
  setIsPolygonMenuOpen: (value: boolean) => {},
});

function ProjectPropsProvider({ children }: any): ReactElement {
  const [projects, setProjects] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [showProjects, setShowProjects] = React.useState(true);
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [searchedProject, setsearchedProjects] = React.useState([]);
  const [geoJson, setGeoJson] = React.useState(null);
  const [siteExists, setsiteExists] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState(0);
  const infoRef = React.useRef(null);
  const exploreContainerRef = React.useRef(null);
  const [exploreExpanded, setExploreExpanded] = React.useState(false);
  const [exploreForests, setExploreForests] = React.useState(false);
  const [explorePotential, setExplorePotential] = React.useState(false);
  const [exploreDeforestation, setExploreDeforestation] = React.useState(false);
  const [explorePlanted, setExplorePlanted] = React.useState(false);
  const [infoExpanded, setInfoExpanded] = React.useState(null);
  const [openModal, setModalOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const mapRef = React.useRef(null);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [mapState, setMapState] = React.useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 15,
  });
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [viewport, setViewPort] = React.useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const [loaded, setLoaded] = React.useState(false);
  const [exploreProjects, setExploreProjects] = React.useState(true);
  const [layersSettings, setLayersSettings] = React.useState({});
  const [selectedMode, setSelectedMode] = React.useState('location');
  const [rasterData, setRasterData] = React.useState({
    evi: '',
    imagery: {},
  });
  const [isPolygonMenuOpen, setIsPolygonMenuOpen] = React.useState(false);

  const [windowSize, setWindowSize] = React.useState(1280);

  React.useEffect(() => {
    window.addEventListener('resize', updateWidth);
    const isMobileTemp = windowSize <= 767;
    setIsMobile(isMobileTemp);
    return () => window.removeEventListener('resize', updateWidth);
  }, [windowSize]);

  const updateWidth = () => {
    setWindowSize(window.innerWidth);
  };

  React.useEffect(() => {
    if (
      project &&
      typeof project.sites !== 'undefined' &&
      project.sites.length > 0 &&
      project.sites[0].geometry
    ) {
      setsiteExists(true);
      setGeoJson({
        type: 'FeatureCollection',
        features: project.sites,
      });
    } else {
      setsiteExists(false);
      setGeoJson(null);
    }
  }, [project]);

  return (
    <ProjectPropsContext.Provider
      value={{
        projects,
        project,
        setProject,
        setProjects,
        showSingleProject,
        setShowSingleProject,
        showProjects,
        setShowProjects,
        searchedProject,
        setsearchedProjects,
        geoJson,
        setGeoJson,
        selectedSite,
        setSelectedSite,
        siteExists,
        setsiteExists,
        isMobile,
        setIsMobile,
        exploreExpanded,
        setExploreExpanded,
        exploreForests,
        setExploreForests,
        explorePotential,
        setExplorePotential,
        exploreDeforestation,
        setExploreDeforestation,
        explorePlanted,
        setExplorePlanted,
        infoExpanded,
        setInfoExpanded,
        openModal,
        setModalOpen,
        exploreContainerRef,
        infoRef,
        viewport,
        setViewPort,
        setExploreProjects,
        mapState,
        setMapState,
        isMobile,
        exploreProjects,
        loaded,
        setLoaded,
        mapRef,
        defaultMapCenter,
        defaultZoom,
        layersSettings,
        setLayersSettings,
        selectedMode,
        setSelectedMode,
        rasterData,
        setRasterData,
        isPolygonMenuOpen,
        setIsPolygonMenuOpen,
      }}
    >
      {children}
    </ProjectPropsContext.Provider>
  );
}

export default ProjectPropsProvider;
