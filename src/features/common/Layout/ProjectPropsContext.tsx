import type { FC } from 'react';
import type { MapRef } from 'react-map-gl/src/components/static-map';
import type {
  TreeProjectExtended,
  ConservationProjectExtended,
} from '@planet-sdk/common/build/types/project/extended';
import type { ProjectPurposeTypes } from '@planet-sdk/common/build/types/project/common';
import type ProjectPropsContextInterface from '../types/ProjectPropsContextInterface';
import type {
  ExploreOption,
  LayerSettings,
  MapMode,
  MapProject,
  MapState,
  RasterData,
  SiteViewPort,
  SitesGeoJSON,
  ViewPort,
} from '../types/ProjectPropsContextInterface';
import type {
  PlantLocation,
  SamplePlantLocation,
} from '../types/plantLocation';

import React, {
  useState,
  createContext,
  useRef,
  useContext,
  useEffect,
} from 'react';
import { getTimeTravelConfig } from '../../../utils/mapsV2/timeTravel';
import { ParamsContext } from './QueryParamsContext';

const ProjectPropsContext = createContext<ProjectPropsContextInterface | null>(
  null
);

export const useProjectProps = (): ProjectPropsContextInterface => {
  const context = useContext(ProjectPropsContext);
  if (!context) {
    throw new Error(
      'ProjectPropsContext must be used within ProjectPropsProvider'
    );
  }
  return context;
};

const ProjectPropsProvider: FC = ({ children }) => {
  const [projects, setProjects] = useState<MapProject[] | null>(null);
  const [project, setProject] = useState<
    TreeProjectExtended | ConservationProjectExtended | null
  >(null);
  const [showSingleProject, setShowSingleProject] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [searchedProject, setsearchedProjects] = useState<MapProject[]>([]);
  const [geoJson, setGeoJson] = useState<SitesGeoJSON | null>(null);
  const [siteExists, setsiteExists] = useState(false);
  const [selectedSite, setSelectedSite] = useState(0);

  const [plantLocations, setPlantLocations] = useState<PlantLocation[] | null>(
    null
  );
  const [selectedPl, setSelectedPl] = useState<PlantLocation | null>(null);
  const [samplePlantLocation, setSamplePlantLocation] =
    useState<SamplePlantLocation | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const infoRef = useRef<HTMLDivElement>(null);
  const exploreContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef>(null);

  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [exploreForests, setExploreForests] = useState(false);
  const [explorePotential, setExplorePotential] = useState(false);
  const [exploreDeforestation, setExploreDeforestation] = useState(false);
  const [explorePlanted, setExplorePlanted] = useState(false);

  const [infoExpanded, setInfoExpanded] = useState<ExploreOption | null>(null);
  const [openModal, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<MapProject[] | null>(
    null
  );
  const [filtersOpen, setFilterOpen] = useState(false);
  const [purpose, setPurpose] = useState<ProjectPurposeTypes>('trees');
  const [plantLocationsLoaded, setPlantLocationsLoaded] = useState(false);
  const { embed, showProjectList } = useContext(ParamsContext);

  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [mapState, setMapState] = useState<MapState>({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });
  const isEmbed = embed === 'true' && showProjectList === 'false';
  const defaultMapCenter: [number, number] = isMobile
    ? isEmbed
      ? [22.54, 0]
      : [22.54, 9.59]
    : isEmbed
    ? [36.96, 0]
    : [36.96, -28.5];
  const defaultZoom: number = isMobile ? 1 : 1.4;
  const [viewport, setViewPort] = useState<ViewPort>({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const [loaded, setLoaded] = useState(false);
  const [exploreProjects, setExploreProjects] = useState(true);
  const [layersSettings, setLayersSettings] = useState<LayerSettings>({});
  const [selectedMode, setSelectedMode] = useState<MapMode>('location');
  const [rasterData, setRasterData] = useState<RasterData>({
    evi: undefined,
    imagery: getTimeTravelConfig(),
  });
  const [plIds, setPlIds] = useState<string[] | null>(null);
  const [isPolygonMenuOpen, setIsPolygonMenuOpen] = useState(false);
  const [hoveredPl, setHoveredPl] = useState<
    PlantLocation | SamplePlantLocation | null
  >(null);
  const [siteViewPort, setSiteViewPort] = useState<SiteViewPort | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > 767) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    }
  });

  useEffect(() => {
    if (isMobile) {
      setIsPolygonMenuOpen(false);
    } else {
      setIsPolygonMenuOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (
      project &&
      project.sites !== null &&
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

  useEffect(() => {
    if (plantLocations && plantLocations.length > 0) {
      setSatellite(false);
    } else {
      setSatellite(true);
    }
  }, [plantLocations]);

  useEffect(() => {
    const ids: string[] = [];
    if (plantLocations && (zoomLevel === 2 || zoomLevel === 3)) {
      for (const key in plantLocations) {
        if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
          const element = plantLocations[key];
          if (
            element.type === 'multi-tree-registration' &&
            element.captureStatus === 'complete'
          )
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
        setProjects,
        project,
        setProject,
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
        infoRef,
        exploreContainerRef,
        mapRef,
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
        viewport,
        setViewPort,
        exploreProjects,
        setExploreProjects,
        mapState,
        setMapState,
        loaded,
        setLoaded,
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
        samplePlantLocation,
        setSamplePlantLocation,
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
