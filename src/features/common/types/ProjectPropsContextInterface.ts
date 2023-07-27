import { ProjectMapInfo } from '@planet-sdk/common/build/types/project/map';
import { ProjectExtended } from '@planet-sdk/common/build/types/project/extended';
import { ProjectPurposeTypes } from '@planet-sdk/common/build/types/project/common';
import { FeatureCollection } from 'geojson';
import { SetState } from './common';
import { RefObject, Ref } from 'react';
import { MapRef } from 'react-map-gl/src/components/static-map';
import { FlyToInterpolator } from 'react-map-gl';
import { PlantLocation } from './plantLocation';

export type ExploreOption =
  | 'Deforestation'
  | 'Forests'
  | 'Restoration'
  | 'Planted';

export type MapMode = 'location' | 'imagery' | 'vegetation';

export interface ViewPort {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration?: number;
  transitionInterpolator?: FlyToInterpolator;
  transitionEasing?: number;
}

export interface SiteViewPort {
  center: [latitude: number, longitude: number];
  zoom: number;
}

export interface MapState {
  mapStyle: object; //Tentative, needs to be updated
  dragPan: boolean;
  scrollZoom: boolean;
  minZoom: number;
  maxZoom: number;
}

export interface LayerSettings {
  [id: string]: {
    decodeParams?: {
      startDate: string;
      endDate: string;
      trimEndDate: string;
    };
    params?: {
      startDate: string;
      endDate: string;
    };
  };
}

export interface ImageryYear {
  year: string;
  raster: string;
}

export interface Imagery {
  planetLabs?: ImageryYear[];
  sentinel?: ImageryYear[];
  landsat?: ImageryYear[];
  esri?: ImageryYear[];
}

export interface RasterData {
  evi: string | undefined;
  imagery: Imagery;
}

interface ProjectPropsContextInterface {
  projects: ProjectMapInfo[] | null;
  setProjects: SetState<ProjectMapInfo[] | null>;
  project: ProjectExtended | null;
  setProject: SetState<ProjectExtended | null>;
  showSingleProject: boolean;
  setShowSingleProject: SetState<boolean>;
  showProjects: boolean;
  setShowProjects: SetState<boolean>;
  searchedProject: ProjectMapInfo[];
  setsearchedProjects: SetState<ProjectMapInfo[]>;
  geoJson: FeatureCollection | null;
  setGeoJson: SetState<FeatureCollection | null>;
  selectedSite: number;
  setSelectedSite: SetState<number>;
  siteExists: boolean;
  setsiteExists: SetState<boolean>;
  isMobile: boolean;
  // Evaluate - possible to remove infoRef
  infoRef: RefObject<HTMLDivElement>;
  exploreContainerRef: RefObject<HTMLDivElement>;
  mapRef: Ref<MapRef>; //Perhaps move this down
  exploreExpanded: boolean;
  setExploreExpanded: SetState<boolean>;
  exploreForests: boolean;
  setExploreForests: SetState<boolean>;
  explorePotential: boolean;
  setExplorePotential: SetState<boolean>;
  exploreDeforestation: boolean;
  setExploreDeforestation: SetState<boolean>;
  explorePlanted: boolean;
  setExplorePlanted: SetState<boolean>;
  infoExpanded: ExploreOption | null;
  setInfoExpanded: SetState<ExploreOption | null>;
  openModal: boolean;
  setModalOpen: SetState<boolean>;
  viewport: ViewPort;
  setViewPort: SetState<ViewPort>;
  exploreProjects: boolean;
  setExploreProjects: SetState<boolean>;
  mapState: MapState;
  setMapState: SetState<MapState>;
  loaded: boolean;
  setLoaded: SetState<boolean>;
  defaultMapCenter: [number, number];
  defaultZoom: number;
  layersSettings: LayerSettings;
  setLayersSettings: SetState<LayerSettings>;
  selectedMode: MapMode;
  setSelectedMode: SetState<MapMode>;
  rasterData: RasterData;
  setRasterData: SetState<RasterData>;
  plantLocations: PlantLocation[] | null;
  setPlantLocations: SetState<PlantLocation[] | null>;
  selectedPl: PlantLocation | null; //HERE
  setSelectedPl: SetState<PlantLocation | null>;
  samplePlantLocation: PlantLocation | null;
  setSamplePlantLocation: SetState<PlantLocation | null>;
  zoomLevel: number;
  setZoomLevel: SetState<number>;
  satellite: boolean;
  setSatellite: SetState<boolean>;
  plIds: string[] | null;
  setPlIds: SetState<string[] | null>;
  hoveredPl: PlantLocation | null;
  setHoveredPl: SetState<PlantLocation | null>;
  isPolygonMenuOpen: boolean;
  setIsPolygonMenuOpen: SetState<boolean>;
  siteViewPort: SiteViewPort | null;
  setSiteViewPort: SetState<SiteViewPort | null>;
  filteredProjects: ProjectMapInfo | null;
  setFilteredProjects: SetState<ProjectMapInfo | null>;
  filtersOpen: boolean;
  setFilterOpen: SetState<boolean>;
  purpose: ProjectPurposeTypes;
  setPurpose: SetState<ProjectPurposeTypes>;
  plantLocationsLoaded: boolean;
  setPlantLocationsLoaded: SetState<boolean>;
}

export default ProjectPropsContextInterface;
