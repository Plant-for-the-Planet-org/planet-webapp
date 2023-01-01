export interface Coordinates {
    lon: number;
    lat: number;
  }
  export interface ExpensesEntity {
    amount: number;
    pdf: string;
    year: number;
    id: string;
  }
  export interface ImagesEntity {
    image: string;
    description?: string | null;
    id: string;
  }
  export interface Metadata {
    plantingDensity: number;
    degradationYear: number;
    firstTreePlanted: string;
    motivation: string;
    longTermPlan: string;
    acquisitionYear: number;
    enablePlantLocations: boolean;
    visitorAssistance: boolean;
    mainChallenge: string;
    yearAbandoned: number;
    plantingSeasons?: (number)[] | null;
    maxPlantingDensity: number;
    siteOwnerType?: (string)[] | null;
    employeesCount: number;
    siteOwnerName?: null;
    location: string;
    degradationCause: string;
  }
  export interface GeoLocation {
      coordinates?: (number)[] | null;
      type: string;
  }
  export interface PaymentDefaults {
    fixedTreeCountOptions?: (number)[] | null;
    fixedDefaultTreeCount: number;
  }
  
  export interface Geometry {
    coordinates?: ((((number)[] | null | number)[] | null)[] | null)[] | null;
    type: string;
  }
  export interface LastUpdated {
    date: string;
    timezone: string;
    timezone_type: number;
  }
  export interface Properties {
    lastUpdated: LastUpdated;
    name: string;
    description?: string | null;
    id: string;
    status: string;
  }
    export interface SitesEntity {
      geometry: Geometry;
      type: string;
      properties: Properties;
    }
    export interface Address {
      zipCode: string;
      country: string;
      address: string;
      city: string;
    }
    export interface Tpo {
      image?: null;
      address: Address;
      name: string;
      id: string;
      email: string;
      slug: string;
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
      expenses?: (ExpensesEntity)[] | null;
      firstTreePlanted: string;
      fixedRates?: (null)[] | null;
      geoLocation: GeoLocation;
      image: string;
      images?: (ImagesEntity)[] | null;
      intensity: number;
      isApproved: boolean;
      isCertified: boolean;
      isPublished: boolean;
      isTopProject: boolean;
      lastUpdated: string;
      location: string;
      longTermPlan: string;
      mainChallenge: string;
      metadata: Metadata;
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
      siteOwnerType?: (string)[] | null;
      sites?: (SitesEntity)[] ;
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
    export interface SearchMetadata {
      degradationCause: string | null
      longTermPlan: string | null
      mainChallenge: string | null
      motivation: string | null
    }
    export interface Properties {
      id: string
      _scope: string
      allowDonations: boolean
      classification: string
      countPlanted: number
      countTarget: number
      country: string
      currency: string
      fixedRates: any[]
      image: string
      isApproved: boolean
      isFeatured: boolean
      isPublished: boolean
      isTopProject: boolean
      location: any
      minTreeCount: number
      name: string
      paymentDefaults: PaymentDefaults
      purpose: string
      reviewScore: number
      reviews: string[]
      slug: string
      taxDeductionCountries: string[]
      tpo: Tpo
      treeCost: number
      unitCost: number
      description: string
      metadata: SearchMetadata
      options: any[]
    } 
  
    
  export interface SearchProject  {
      type: string
      geometry: Geometry
      properties: Properties
  }
  
  // GeoJson
  export interface Feature {
      geometry: Geometry
      type: string
      properties: Properties
  }
    
    export interface Geometry {
      coordinates: any[][][]
      type: string
  }
  
  export interface Properties {
      lastUpdated: LastUpdated
      name: string
      description?: string
      id: string
      status: string
  }
  
  export interface LastUpdated {
      date: string
      timezone: string
      timezone_type: number
  }
  export interface GeoJson {
      type: string
      features: Feature[]
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
    
    
    export interface ViewPort {
      width: number
      height: number
      latitude: number
      longitude: number
      zoom: number
      bearing?: number
      pitch?: number
      altitude?: number
      maxZoom?: number
      minZoom?: number
      maxPitch?: number
      minPitch?: number
      transitionDuration?: number
      transitionInterpolator?: TransitionInterpolator
      transitionInterruption?: number
    }
    
  
    // MapState 
  
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
    export interface Metadata {
      arcgisStyleUrl: string
      arcgisOriginalItemTitle: string
      arcgisQuickEditorWarning: boolean
      arcgisQuickEditor: ArcgisQuickEditor
      arcgisEditorExtents: ArcgisEditorExtent[]
      arcgisMinimapVisibility: boolean
    }
    
    
    export interface Colors {
      boundaries: string
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
    
   //rasterData
  
   
   
   export interface PlanetLab {
       year: string
       raster: string
      }
      
  export interface Sentinel {
          year: string
          raster: string
      }
  export interface Landsat {
          year: string
          raster: string
      }
  export interface Imagery {
          planetLabs: PlanetLab[]
         sentinel: Sentinel[]
         landsat: Landsat[]
         esri: Esri[]
     }
    
  
  export interface Esri {
      year?: string
      raster?: string
  }
  
  export interface RasterData {
      evi: string | undefined;
      imagery: Imagery
   }
    
    
  // plantLocation
  
  export interface DeviceLocation {
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
    deviceLocation: DeviceLocation
  }
  
  export interface Metadata {
    app: App
    public: Public
  }
  
  
  export interface Coordinate {
    image: string
    coordinateIndex: string
    id: string
    status: string
  }
  
  export interface SamplePlantLocation {
    parent: string
    nextMeasurementDate?: NextMeasurementDate
    metadata: Metadata2
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
    profile: string
    coordinates: Coordinate2[]
    revisionPeriodicity?: RevisionPeriodicity
    scientificSpecies: string
    history: History[]
    originalGeometry: OriginalGeometry
    captureMode: string
    geometry: Geometry
    lastMeasurementDate?: LastMeasurementDate
    captureStatus: string
    deviceLocation: DeviceLocation3
    status: any
  }
  
  export interface NextMeasurementDate {
    date: string
    timezone: string
    timezone_type: number
  }
  
  export interface Metadata2 {
    app: App2
    private: any[]
    public: any[]
  }
  export interface DeviceLocation2 {
    coordinates: number[]
    type: string
  }
  export interface App2 {
    appVersion: string
    deviceSystemName: string
    deviceSystemVersion: string
    deviceModel: string
    deviceManufacturer: string
    deviceBrand: string
    deviceLocation: DeviceLocation2
  }
  
  
  
  export interface Measurements {
    width: number
    height: number
  }
  
  export interface Coordinate2 {
    image: string
    created: string
    coordinateIndex: string
    id: string
    updated: string
    status: string
  }
  
  export interface RevisionPeriodicity {
    subsequentInterval: string
    discreteIntervals: string[]
    startDate: string
  }
  export interface Measurements2 {
    width: number
    height: number
  }
  export interface EventDate {
    date: string
    timezone: string
    timezone_type: number
  }
  export interface History {
    image: string
    statusReason: any
    created: string
    eventName: string
    classification: any
    eventDate: EventDate
    measurements: Measurements2
    status: string
  }
  export interface OriginalGeometry {
    coordinates: number[]
    type: string
  }
  
  export interface Geometry {
    coordinates: number[]
    type: string
  }
  
  export interface LastMeasurementDate {
    date: string
    timezone: string
    timezone_type: number
  }
  
  export interface DeviceLocation3 {
    coordinates: number[]
    type: string
  }
  
  export interface PlantedSpecy {
    scientificName: string
    created: string
    otherSpecies: any
    scientificSpecies: string
    treeCount: number
    id: string
    updated: string
  }
  
  export interface OriginalGeometry2 {
    coordinates: number[][][]
    type: string
  }
  
  export interface Geometry2 {
    coordinates: number[][][]
    type: string
    properties: Properties
  }
  
  export interface Properties {
    id: string
  }
  
  export interface DeviceLocation4 {
    coordinates: number[]
    type: string
  }
  
  export interface PlantLocation {
    metadata: Metadata
    hid: string
    otherSpecies: null
    description: null
    geometryUpdatesCount: number
    type: string
    plantProjectSite: null
    statusReason: null
    plantDateEnd: null
    registrationDate: string
    sampleTreeCount: number
    id: string
    plantDate: string
    image: any
    idempotencyKey: string
    coordinates: Coordinate[]
    history: any[]
    samplePlantLocations: SamplePlantLocation[]
    plantProject: string
    plantedSpecies: PlantedSpecy[]
    plantDateStart: null
    originalGeometry: OriginalGeometry2
    captureMode: string
    geometry: Geometry2
    captureStatus: string
    deviceLocation: DeviceLocation4
    status: null
  }
  
  export interface SiteViewPort {
      center: number[];
      zoom: number;
  }
  