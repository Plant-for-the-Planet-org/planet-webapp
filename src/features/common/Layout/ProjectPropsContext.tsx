import React, { FC } from 'react';
import { ParamsContext } from './QueryParamsContext';
import {
  Project,
  SearchProject,
  RasterData,
  PlantLocation,
  SiteViewPort,
  Imagery,
  ProjectContextInterface,
  MapState,
  MapStyle,
} from '../types/projectPropContext';
import { ViewportProps } from 'react-map-gl';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

const defaultState: ProjectContextInterface = {
  project: ({} as Project) || null,
  setProject: () => {},
  projects: [] || null,
  setProjects: () => {},
  plantLocations: [],
  setPlantLocations: () => {},
  showSingleProject: false,
  setShowSingleProject: () => {},
  showProjects: true,
  setShowProjects: () => {},
  searchedProject: [],
  setsearchedProjects: () => [],
  geoJson: ({} as FeatureCollection) || null,
  setGeoJson: () => {},
  selectedSite: 0,
  setSelectedSite: () => {},
  siteExists: false,
  setsiteExists: () => {},
  infoRef:
    {
      current: null,
    } || null,
  exploreContainerRef: ({} as React.MutableRefObject<null>) || null,
  exploreExpanded: false,
  setExploreExpanded: () => {},
  exploreForests: false,
  setExploreForests: () => {},
  explorePotential: false,
  setExplorePotential: () => {},
  exploreDeforestation: false,
  setExploreDeforestation: () => {},
  explorePlanted: false,
  setExplorePlanted: () => {},
  infoExpanded: null || '',
  setInfoExpanded: () => {},
  openModal: false,
  setModalOpen: () => {},
  viewport: {} as ViewportProps,
  setViewPort: () => {},
  mapState: {} as MapState,
  setMapState: () => {},
  exploreProjects: true,
  setExploreProjects: () => {},
  loaded: false,
  setLoaded: () => {},
  mapRef: {},
  defaultMapCenter: [],
  defaultZoom: 1.4,
  layersSettings: {},
  setLayersSettings: () => {},
  selectedMode: 'location',
  setSelectedMode: () => {},
  rasterData: {
    evi: '',
    imagery: {} as Imagery,
  },
  setRasterData: () => {},
  selectedPl: {} as PlantLocation,
  setSelectedPl: () => {},
  zoomLevel: 1,
  setZoomLevel: () => {},
  satellite: false,
  setSatellite: () => {},
  plIds: null || [],
  setPlIds: () => {},
  hoveredPl: null || ({} as PlantLocation),
  setHoveredPl: () => {},
  isPolygonMenuOpen: false,
  setIsPolygonMenuOpen: () => {},
  siteViewPort: null || ({} as SiteViewPort),
  setSiteViewPort: () => {},
  filteredProjects: null || [],
  setFilteredProjects: () => {},
  filtersOpen: false,
  setFilterOpen: () => {},
  purpose: 'trees',
  setPurpose: () => {},
  plantLocationsLoaded: false,
  setPlantLocationsLoaded: () => {},
  isMobile: false,
  setIsMobile: () => {},
};

export const ProjectPropsContext =
  React.createContext<ProjectContextInterface>(defaultState);

export const ProjectPropsProvider: FC = ({ children }) => {
  const [projects, setProjects] = React.useState<Project[] | null>(null);
  const [project, setProject] = React.useState<Project | null>(null);
  const [plantLocations, setPlantLocations] = React.useState<
    PlantLocation[] | null
  >(null);
  const [selectedPl, setSelectedPl] = React.useState<PlantLocation | null>(
    null
  );
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [showProjects, setShowProjects] = React.useState<boolean>(true);
  const [showSingleProject, setShowSingleProject] =
    React.useState<boolean>(false);
  const [searchedProject, setsearchedProjects] = React.useState<
    SearchProject[]
  >([]);
  const [geoJson, setGeoJson] = React.useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);
  const [siteExists, setsiteExists] = React.useState<boolean>(false);
  const [selectedSite, setSelectedSite] = React.useState<number>(0);
  const infoRef = React.useRef(null);
  const exploreContainerRef = React.useRef(null);
  const [exploreExpanded, setExploreExpanded] = React.useState<boolean>(false);
  const [exploreForests, setExploreForests] = React.useState<boolean>(false);
  const [explorePotential, setExplorePotential] =
    React.useState<boolean>(false);
  const [exploreDeforestation, setExploreDeforestation] =
    React.useState<boolean>(false);
  const [explorePlanted, setExplorePlanted] = React.useState<boolean>(false);
  const [infoExpanded, setInfoExpanded] = React.useState<string | null>(null);
  const [openModal, setModalOpen] = React.useState<boolean>(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [satellite, setSatellite] = React.useState<boolean>(false);
  const [filteredProjects, setFilteredProjects] = React.useState<
    SearchProject[] | null
  >(null);
  const [filtersOpen, setFilterOpen] = React.useState<boolean>(false);
  const [purpose, setPurpose] = React.useState<string>('trees');
  const [plantLocationsLoaded, setPlantLocationsLoaded] =
    React.useState<boolean>(false);
  const { embed, showProjectList } = React.useContext(ParamsContext);

  const mapRef = React.useRef(null);

  const EMPTY_STYLE: MapStyle = {
    version: 8,
    sources: {
      esri: {
        type: '',
        scheme: '',
        tilejson: '',
        format: '',
        maxzoom: 15,
        tiles: [],
        name: '',
      },
    },
    layers: [],
  };

  const [mapState, setMapState] = React.useState<MapState>({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });

  const isEmbed = embed === 'true' && showProjectList === 'false';
  const defaultMapCenter = isMobile
    ? isEmbed
      ? [22.54, 0]
      : [22.54, 9.59]
    : isEmbed
    ? [36.96, 0]
    : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [viewport, setViewPort] = React.useState<ViewportProps>({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [exploreProjects, setExploreProjects] = React.useState<boolean>(true);
  const [layersSettings, setLayersSettings] = React.useState({});
  const [selectedMode, setSelectedMode] = React.useState<string>('location');
  const [rasterData, setRasterData] = React.useState<RasterData>({
    evi: '',
    imagery: {
      esri: [],
      landsat: [],
      planetLabs: [],
      sentinel: [],
    },
  });
  const [plIds, setPlIds] = React.useState<string[] | null>(null);
  const [isPolygonMenuOpen, setIsPolygonMenuOpen] =
    React.useState<boolean>(false);

  const [hoveredPl, setHoveredPl] = React.useState<PlantLocation | null>(null);
  const [siteViewPort, setSiteViewPort] = React.useState<SiteViewPort | null>(
    null
  );

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > 767) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    }
  });

  React.useEffect(() => {
    if (isMobile) {
      setIsPolygonMenuOpen(false);
    } else {
      setIsPolygonMenuOpen(true);
    }
  }, [isMobile]);

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
      setSiteViewPort(null);
    }
    setSelectedMode('location');
  }, [project]);

  React.useEffect(() => {
    if (plantLocations && plantLocations.length > 0) {
      setSatellite(false);
    } else {
      setSatellite(true);
    }
  }, [plantLocations]);

  React.useEffect(() => {
    const ids = [];
    if (plantLocations && (zoomLevel === 2 || zoomLevel === 3)) {
      for (const key in plantLocations) {
        if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
          const element = plantLocations[key];
          if (element.type === 'multi' && element.captureStatus === 'complete')
            ids.push(element.id + '-layer');
        }
      }
      setPlIds(ids);
    } else {
      setPlIds(null);
    }
  }, [plantLocations, zoomLevel]);

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
        plantLocations,
        setPlantLocations,
        selectedPl,
        setSelectedPl,
        zoomLevel,
        setZoomLevel,
        satellite,
        setSatellite,
        plIds,
        setPlIds,
        hoveredPl,
        setHoveredPl,
        isPolygonMenuOpen,
        setIsPolygonMenuOpen,
        siteViewPort,
        setSiteViewPort,
        filteredProjects,
        setFilteredProjects,
        filtersOpen,
        setFilterOpen,
        purpose,
        setPurpose,
        plantLocationsLoaded,
        setPlantLocationsLoaded,
      }}
    >
      {children}
    </ProjectPropsContext.Provider>
  );
};

export default ProjectPropsProvider;
