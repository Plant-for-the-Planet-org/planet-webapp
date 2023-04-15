import { Dispatch, SetStateAction } from 'react';
import { ViewportProps } from 'react-map-gl'
import { FeatureCollection, GeoJsonProperties,Geometry,Feature, Point as GeoJSONPoint } from 'geojson'
import {TreeProjectConcise} from "@planet-sdk/common/build/types/project/map"
import {SiteOwnerTypes, Tpo, Image, ProjectExpense,Coordinates,LastUpdated} from "@planet-sdk/common/build/types/project/common"
import {TreeProjectMetadata, ConservationProjectMetadata} from "@planet-sdk/common/build/types/project/extended"


  export interface PaymentDefaults {
    fixedTreeCountOptions?: (number)[] | null;
    fixedDefaultTreeCount: number;
  }
  export interface LastUpdated {
    date: string;
    timezone: string;
    timezone_type: number;
  }
    export interface Project {
      id: string;
      _scope: string;
      allowDonations: boolean;
      certificates?: (null)[] | null;
      classification: string;
      coordinates: Coordinates;
      countDonated: number;
      countPlanted: number;
      countRegistered: number;
      countTarget: number;
      country: string;
      currency: string;
      degradationCause: string;
      degradationYear: number;
      description: string;
      employeesCount: number;
      enablePlantLocations: boolean;
      expenses?: (ProjectExpense)[] | null;
      firstTreePlanted: string;
      fixedRates?: (null)[] | null;
      geoLocation: GeoJSONPoint;
      image: string;
      images?: (Image)[] | null;
      intensity: number;
      isApproved: boolean;
      isCertified: boolean;
      isPublished: boolean;
      isTopProject: boolean;
      lastUpdated: string;
      location: string;
      longTermPlan: string;
      mainChallenge: string;
      metadata: TreeProjectMetadata | ConservationProjectMetadata;
      minQuantity: number;
      minTreeCount: number;
      motivation: string;
      name: string;
      options?: (null)[] | null;
      paymentDefaults: PaymentDefaults;
      plantingDensity: number;
      plantingSeasons?: (number)[] | null;
      purpose: string;
      reviewRequested: boolean;
      reviews?: (null)[] | null;
      siteOwnerName?: null;
      siteOwnerType?: SiteOwnerTypes;
      sites?: Feature<Geometry, GeoJsonProperties>[];
      slug: string;
      survivalRate: number;
      survivalRateStatus: string;
      taxDeductionCountries?: (string)[] | null;
      tpo: Tpo;
      treeCost: number;
      unitCost: number;
      videoUrl: string;
      visitorAssistance: boolean;
      website: string;
      yearAbandoned: number;
      yearAcquired: number;
    }
  
  // Searched project
      export interface SearchProject  {
        type: string
        geometry: GeoJSONPoint
        properties: TreeProjectConcise
    }  
    // ViewPort
    
    export interface Props {
      speed: number
      curve: number
    }
    export interface TransitionInterpolator {
      propNames: string[]
      props: Props
    }
    
    
    
  
    // MapState 
    
    
    export interface Esri {
      type: string
      scheme: string
      tilejson: string
      format: string
      maxzoom: number
      tiles: string[]
      name: string
    }
    export interface Sources {
      esri: Esri
    }
    export interface Layer {
      id: string
      type: string
      paint: Paint
      layout: Layout
      showProperties?: boolean
      source?: string
      "source-layer"?: string
      minzoom?: number
      maxzoom?: number
      filter?: any[]
    }

    export interface Metadata {
      arcgisStyleUrl: string
      arcgisOriginalItemTitle: string
      arcgisQuickEditorWarning: boolean
      arcgisQuickEditor: ArcgisQuickEditor
      arcgisEditorExtents: ArcgisEditorExtent[]
      arcgisMinimapVisibility: boolean
    }
    export interface MapStyle {
      version: number
      sprite?: string
      glyphs?: string
      sources: Sources
      layers: Layer[]
      metadata?: Metadata
    }
    export interface MapState {
      mapStyle: MapStyle
      dragPan: boolean
      scrollZoom: boolean
      minZoom: number
      maxZoom: number
    }
    
    export interface Paint {
      "background-color"?: string
      "fill-color": any
      "fill-outline-color"?: string
      "fill-pattern"?: string
      "fill-opacity"?: number
      "line-color": any
      "line-width": any
      "line-dasharray"?: number[]
      "text-color"?: string
      "text-halo-color"?: string
      "fill-translate"?: FillTranslate
      "fill-translate-anchor"?: string
      "line-opacity"?: number
      "text-halo-blur"?: number
      "text-halo-width"?: number
    }
    
    export interface FillTranslate {
      stops: [number, number[]][]
    }
    
    export interface Layout {
      visibility?: string
      "line-join"?: string
      "line-cap"?: string
      "symbol-placement"?: string
      "symbol-avoid-edges"?: boolean
      "icon-image"?: string
      "symbol-spacing"?: number
      "icon-rotation-alignment"?: string
      "icon-allow-overlap"?: boolean
      "icon-padding"?: number
      "text-font"?: string[]
      "text-size": any
      "text-letter-spacing": any
      "text-line-height"?: number
      "text-max-width"?: number
      "text-field"?: string
      "text-padding"?: number
      "text-max-angle"?: number
      "text-offset"?: number[]
      "text-rotation-alignment"?: string
      "text-transform"?: string
      "text-optional"?: boolean
    }
    export interface Colors {
      boundaries: string
    }
    export interface ArcgisQuickEditor {
      labelTextColor: string
      labelHaloColor: string
      baseColor: any
      spriteProcessing: boolean
      labelContrast: number
      labelColorMode: string
      colorMode: string
      colors: Colors
      boundaries: string
    }
    
    export interface SpatialReference {
      wkid: number
      latestWkid?: number
    }
    export interface ArcgisEditorExtent {
      spatialReference: SpatialReference
      xmin: number
      ymin: number
      xmax: number
      ymax: number
    }
    
   //rasterData
 
 export interface Landsat {
          year: string
          raster: string
        }
export interface Esri {
          year?: string
          raster?: string
        }
  export interface Imagery {
        planetLabs: Landsat[]
        sentinel: Landsat[]
        landsat: Landsat[]
        esri: Esri[]
        }
    
  
  
  export interface RasterData {
    evi: string | undefined;
    imagery: Imagery
  }
    
    
  // samplePlantLocation
  
  export interface Geometry {
    coordinates: number[]
    type: string
  }
  export interface Public {
    "complete-yes-np": string
    "name-lider": string
    "se-replanto-yes-no": string
  }
  
  export interface App {
    appVersion: string
    deviceSystemName: string
    deviceSystemVersion: string
    deviceModel: string
    deviceManufacturer: string
    deviceBrand: string
    deviceLocation: Geometry
  }
  
  export interface MetadataB {
    app: App
    public: Public
    private?: any[]
  }
  
  export interface Coordinate {
    image: string
    coordinateIndex: string
    id: string
    status: string
    created?: string
    updated?: string
  }

  export interface Measurements {
    width: number
    height: number
  }
  
  export interface RevisionPeriodicity {
    subsequentInterval: string
    discreteIntervals: string[]
    startDate: string
  }
  
  export interface History {
    image: string
    statusReason: any
    created: string
    eventName: string
    classification: any
    eventDate: LastUpdated
    measurements: Measurements
    status: string
  }
  export interface SamplePlantLocation {
    parent: string
    nextMeasurementDate?: LastUpdated
    metadata: MetadataB
    hid: string
    scientificName: string
    otherSpecies: any
    description: any
    geometryUpdatesCount: number
    type: string
    plantProjectSite: any
    statusReason: any
    registrationDate: string
    id: string
    tag: string
    plantDate: string
    measurements: Measurements
    image: any
    idempotencyKey: string
    profile?: string
    coordinates: Coordinate[]
    revisionPeriodicity?: RevisionPeriodicity
    scientificSpecies: string
    history: History[]
    originalGeometry: Geometry
    captureMode: string
    geometry: Geometry
    lastMeasurementDate?: LastUpdated
    captureStatus: string
    deviceLocation: Geometry
    status: any
  }
  
  
  //plantLocation
  
  
  export interface PlantedSpecy {
    scientificName: string
    created: string
    otherSpecies: any
    scientificSpecies: string
    treeCount: number
    id: string
    updated: string
  }
  export interface PlantLocation extends Omit<SamplePlantLocation, "profile" | "scientificSpecies" | "measurements" | "tag" | "parent">  {
    plantDateEnd: null
    sampleTreeCount: number
    samplePlantLocations: SamplePlantLocation[]
    plantProject: string
    plantedSpecies: PlantedSpecy[]
    plantDateStart: null
  }
  
  export interface SiteViewPort {
      center: number[];
      zoom: number;
  }
 //main
 export type SetState<T> = Dispatch<SetStateAction<T>>;
  
  export type ProjectContextInterface = {
    project: Project | null;
    setProject: SetState<Project | null>;
    projects: Project[] | null;
    setProjects: SetState<Project[] | null>;
    plantLocations: PlantLocation[] | null;
    setPlantLocations: React.Dispatch<
      React.SetStateAction<PlantLocation[] | null>
    >;
    showSingleProject: boolean;
    setShowSingleProject: SetState<boolean>;
    showProjects: boolean;
    setShowProjects: SetState<boolean>;
    searchedProject: SearchProject[];
    setsearchedProjects: SetState<SearchProject[]>;
    geoJson: FeatureCollection | null;
    setGeoJson: SetState<FeatureCollection<Geometry, GeoJsonProperties> | null>;
    selectedPl: PlantLocation | null;
    setSelectedPl: SetState<PlantLocation | null>;
    zoomLevel: number;
    setZoomLevel: SetState<number>;
    siteExists: boolean;
    setsiteExists: SetState<boolean>;
    selectedSite: number;
    setSelectedSite: SetState<number>;
    isMobile: boolean;
    setIsMobile: SetState<boolean>;
    infoRef: {
      current: null;
    };
    exploreContainerRef: React.MutableRefObject<null>;
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
    infoExpanded: string | null;
    setInfoExpanded: SetState<string | null>;
    openModal: boolean;
    setModalOpen: SetState<boolean>;
    filtersOpen: boolean;
    setFilterOpen: SetState<boolean>;
    filteredProjects: SearchProject[] | null;
    setFilteredProjects: React.Dispatch<
      React.SetStateAction<SearchProject[] | null>
    >;
    purpose: string;
    setPurpose: SetState<string>;
    mapState: MapState;
    setMapState: SetState<MapState>;
    selectedMode: string;
    setSelectedMode: SetState<string>;
    viewport: ViewportProps;
    setViewPort: SetState<ViewportProps>;
    exploreProjects: boolean;
    setExploreProjects: SetState<boolean>;
    loaded: boolean;
    setLoaded: SetState<boolean>;
    mapRef: any;
    defaultMapCenter: number[];
    defaultZoom: number;
    layersSettings: {};
    setLayersSettings: SetState<{}>;
    rasterData: RasterData;
    setRasterData: SetState<RasterData>;
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
    plantLocationsLoaded: boolean;
    setPlantLocationsLoaded: SetState<boolean>;
  };