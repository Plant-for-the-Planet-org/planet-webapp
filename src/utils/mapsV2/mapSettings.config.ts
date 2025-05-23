// Types for the configuration
export type MapLayerOptionsType =
  | 'projects'
  | 'forestCover'
  | 'forestBiomass'
  | 'biomassPotential'
  | 'deforestation'
  | 'canopyHeight'
  | 'soilNitrogen'
  | 'soilPH'
  | 'soilOrganicCarbon'
  | 'soilBulkDensity'
  | 'treeSpeciesDensity'
  | 'birdDensity'
  | 'mammalDensity'
  | 'amphibianDensity'
  | 'fireRisk'
  | 'deforestationRisk';

export type ApiMapLayerOptionsType = Exclude<MapLayerOptionsType, 'projects'>;

export interface AdditionalInfo {
  resolution: string;
  dataYears: string;
  description: string;
  underlyingData: string;
  source: {
    text: string;
    url: string;
  };
}

export interface LayerConfig {
  key: MapLayerOptionsType;
  /** Indicates whether the layer should be enabled in the UI */
  canShow: boolean;
  /** Indicates whether layer data is available from API. null indicates unknown status */
  isAvailable: boolean | null;
  additionalInfo?: AdditionalInfo;
  color?: string;
}

export interface MapSettingsConfig {
  projects: LayerConfig;
  forests: LayerConfig[];
  soil: LayerConfig[];
  biodiversity: LayerConfig[];
  risks: LayerConfig[];
}

// Configuration object
// isAvailable is set to null initially, and will be updated based on the API response (except for projects which are always available)
export const mapSettingsConfig: MapSettingsConfig = {
  projects: {
    key: 'projects',
    canShow: true,
    isAvailable: true,
  },
  forests: [
    {
      key: 'forestCover',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~500m (Downscaled)',
        dataYears: '2023',
        description: 'Tree cover as a binary map',
        underlyingData:
          'AI model built by Google to classify Sentinel II images in 9 different land use and land cover classes',
        source: {
          text: 'Dynamic World',
          url: 'https://dynamicworld.app/',
        },
      },
    },
    {
      key: 'forestBiomass',
      canShow: false,
      isAvailable: null,
      color: '#27AE60',
      additionalInfo: {
        resolution: '~500km',
        dataYears: '2016',
        description: 'Current biomass maps in the forested regions',
        underlyingData:
          'Remote sensing (MODIS, LiDAR) based machine learning models',
        source: {
          text: 'Walker et al. 2022',
          url: 'https://www.pnas.org/doi/10.1073/pnas.2111312119',
        },
      },
    },
    {
      key: 'biomassPotential',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~500km',
        dataYears: '2016',
        description:
          'Global additional potential biomass with and without considering agricultural and human settlements.',
        underlyingData:
          'Remote sensing (MODIS, LiDAR) based Machine Learning models',
        source: {
          text: 'Walker et al. 2022',
          url: 'https://www.pnas.org/doi/10.1073/pnas.2111312119',
        },
      },
    },
    {
      key: 'deforestation',
      canShow: false,
      isAvailable: null,
      color: '#EB5757',
      additionalInfo: {
        resolution: '~30m',
        dataYears: '2023',
        description: 'Location of deforestation in previous year',
        underlyingData: 'Landsat satellite programs',
        source: {
          text: 'Hansen et al. 2013',
          url: 'https://www.science.org/doi/10.1126/science.1244693',
        },
      },
    },
    {
      key: 'canopyHeight',
      canShow: false,
      isAvailable: null,
      color: '#2F80ED',
      additionalInfo: {
        resolution: '~1m',
        dataYears: '2018–2020',
        description: 'Global canopy height between year 2018-2020',
        underlyingData:
          'Global Canopy Height Maps based on AI model (DinoV2) and remote sensing data (MAXAR and GEDI) by Meta',
        source: {
          text: 'Tolan et al. 2024',
          url: 'https://sustainability.atmeta.com/blog/2024/04/22/using-artificial-intelligence-to-map-the-earths-forests/',
        },
      },
    },
  ],
  soil: [
    {
      key: 'soilNitrogen',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~250m',
        dataYears: '2016',
        description:
          'cg/kg; 0-30 cm horizon (A weighted average for all depths)',
        underlyingData:
          '150,000 soil profiles and 158 remote sensing-based soil covariates (soilgrids.org)',
        source: {
          text: 'Hengl et al. 2017',
          url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0169748',
        },
      },
    },
    {
      key: 'soilPH',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~250m',
        dataYears: '2016',
        description: '0-30 cm horizon (A weighted average for all depths)',
        underlyingData:
          '150,000 soil profiles and 158 remote sensing-based soil covariates (soilgrids.org)',
        source: {
          text: 'Hengl et al. 2017',
          url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0169748',
        },
      },
    },
    {
      key: 'soilOrganicCarbon',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~250m',
        dataYears: '2016',
        description:
          'dg/kg; 0-30 cm horizon (A weighted average for all depths)',
        underlyingData:
          '150,000 soil profiles and 158 remote sensing-based soil covariates (soilgrids.org)',
        source: {
          text: 'Hengl et al. 2017',
          url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0169748',
        },
      },
    },
    {
      key: 'soilBulkDensity',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~250m',
        dataYears: '2016',
        description:
          'cg/cm3; cg/kg; 0-30 cm horizon (A weighted average for all depths)',
        underlyingData:
          '150,000 soil profiles and 158 remote sensing-based soil covariates (soilgrids.org)',
        source: {
          text: 'Hengl et al. 2017',
          url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0169748',
        },
      },
    },
  ],
  biodiversity: [
    {
      key: 'treeSpeciesDensity',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~3km',
        dataYears: '2005-2015',
        description:
          'Shows the average number of tree species around the globe',
        underlyingData:
          'the Global Forest Biodiversity Initiative [GFBI] and TREECHANGE dataset',
        source: {
          text: 'Gatti et al. 2022',
          url: 'https://www.pnas.org/doi/full/10.1073/pnas.2115329119',
        },
      },
    },
    {
      key: 'birdDensity',
      canShow: false,
      isAvailable: null,
      additionalInfo: {
        resolution: '~10km',
        dataYears: '2013-2018',
        description:
          'Number of bird species at different locations (Number of Birds per 100km2)',
        underlyingData:
          'IUCN (mammals, amphibians, and marine species), jointly from BirdLife International and NatureServe (birds), from NatureServe (reptiles and freshwater fish of the USA)',
        source: {
          text: 'Biodiversity Mapping',
          url: 'https://biodiversitymapping.org/',
        },
      },
    },
    {
      key: 'mammalDensity',
      canShow: false,
      isAvailable: null,
      additionalInfo: {
        resolution: '~10km',
        dataYears: '2013-2018',
        description: 'Number of mammal species at different locations',
        underlyingData:
          'IUCN (mammals, amphibians, and marine species), jointly from BirdLife International and NatureServe (birds), from NatureServe (reptiles and freshwater fish of the USA)',
        source: {
          text: 'Biodiversity Mapping',
          url: 'https://biodiversitymapping.org/',
        },
      },
    },
    {
      key: 'amphibianDensity',
      canShow: false,
      isAvailable: null,
      additionalInfo: {
        resolution: '~10km',
        dataYears: '2013-2018',
        description: 'Number of amphibian species at different locations',
        underlyingData:
          'IUCN (mammals, amphibians, and marine species), jointly from BirdLife International and NatureServe (birds), from NatureServe (reptiles and freshwater fish of the USA)',
        source: {
          text: 'Biodiversity Mapping',
          url: 'https://biodiversitymapping.org/',
        },
      },
    },
  ],
  risks: [
    {
      key: 'fireRisk',
      canShow: true,
      isAvailable: null,
      additionalInfo: {
        resolution: '~55km',
        dataYears: '1980-2023',
        description: 'Risk of a fire breaking out based on weather data',
        underlyingData: 'Fire Weather Index',
        source: {
          text: 'by Plant-for-the-Planet, Fire Weather Index based analysis for last 25 years (90th percentile) based on data from Climate Data Store API',
          url: 'https://cds.climate.copernicus.eu/home',
        },
      },
    },
    {
      key: 'deforestationRisk',
      canShow: false,
      isAvailable: null,
      additionalInfo: {
        resolution: '~30m',
        dataYears: '2023',
        description:
          'Risk factor of deforestation based on previous deforestation, current forest and direction of deforestation',
        underlyingData:
          'Based on the LANDSAT based forest locations and pattern of deforestation',
        source: {
          text: 'by Plant-for-the-Planet, LANDSAT based deforestation risk modelling based on a VERRA methodology',
          url: 'https://verra.org/wp-content/uploads/2021/04/DRAFT_JNR_Risk_Mapping_Tool_15APR2021.pdf',
        },
      },
    },
  ],
};
