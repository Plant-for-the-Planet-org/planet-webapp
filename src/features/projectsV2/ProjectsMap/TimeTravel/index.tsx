import type { ReactElement } from 'react';
import type {
  SourceName,
  ProjectTimeTravelSources,
  ProjectTimeTravelConfig,
  SingleYearTimeTravelData,
} from '../../../../utils/mapsV2/timeTravel';
import type { ProjectSiteFeatureCollection } from '../../../common/types/map';

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MaplibreCompare from '@maplibre/maplibre-gl-compare';
import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';
import { Map as MaplibreMap } from 'maplibre-gl';
import { useProjectsMap } from '../../ProjectsMapContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import TimeTravelDropdown from '../../TimeTravelDropdown';
import styles from './TimeTravel.module.scss';
import themeProperties from '../../../../theme/themeProperties';

const EMPTY_STYLE = {
  version: 8 as const,
  sources: {},
  layers: [],
};

const DEFAULT_SOURCE = 'esri';
const DEFAULT_BEFORE_YEAR = '2014';
const DEFAULT_AFTER_YEAR = '2021';

const MAP_ERROR_CODES = {
  INITIALIZATION: 'MAP_INIT_ERROR',
  DATA_MISSING: 'MAP_DATA_ERROR',
  LAYER_LOAD: 'MAP_LAYER_ERROR',
  INVALID_SOURCE: 'MAP_SOURCE_ERROR',
  INVALID_YEAR: 'MAP_YEAR_ERROR',
} as const;
type MapErrorCode = (typeof MAP_ERROR_CODES)[keyof typeof MAP_ERROR_CODES];

interface Props {
  sitesGeoJson: ProjectSiteFeatureCollection;
  isVisible: boolean;
}

export default function TimeTravel({
  sitesGeoJson,
  isVisible,
}: Props): ReactElement {
  const { viewState: mainMapViewState, timeTravelConfig } = useProjectsMap();

  const { setErrors } = useContext(ErrorHandlingContext);

  const comparisonContainer = useRef<HTMLDivElement>(null);
  const beforeContainer = useRef<HTMLDivElement>(null);
  const afterContainer = useRef<HTMLDivElement>(null);
  const beforeMapRef = useRef<MaplibreMap | null>(null);
  const afterMapRef = useRef<MaplibreMap | null>(null);
  const compareRef = useRef<MaplibreCompare | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);

  const availableYears = useMemo(() => {
    if (timeTravelConfig === null || timeTravelConfig.sources === null) {
      return [];
    }
    return (
      timeTravelConfig.sources[DEFAULT_SOURCE]?.map((item) => item.year) || []
    );
  }, [timeTravelConfig]);

  const availableSources = useMemo(() => {
    if (timeTravelConfig === null || timeTravelConfig.sources === null)
      return [];
    return Object.keys(timeTravelConfig.sources) as Array<
      keyof ProjectTimeTravelSources
    >;
  }, [timeTravelConfig]);

  const [selectedSourceBefore, setSelectedSourceBefore] = useState<
    keyof ProjectTimeTravelSources
  >(availableSources[0] || DEFAULT_SOURCE);
  const [selectedSourceAfter, setSelectedSourceAfter] = useState<
    keyof ProjectTimeTravelSources
  >(availableSources[0] || DEFAULT_SOURCE);
  const [selectedYearBefore, setSelectedYearBefore] = useState(
    availableYears[0] || DEFAULT_BEFORE_YEAR
  );
  const [selectedYearAfter, setSelectedYearAfter] = useState(
    availableYears[availableYears.length - 1] || DEFAULT_AFTER_YEAR
  );

  const handleMapError = useCallback(
    (error: Error, code: MapErrorCode) => {
      setErrors([{ message: error.message, errorType: code }]);
    },
    [setErrors]
  );

  const validateData = useCallback(() => {
    if (!sitesGeoJson || !sitesGeoJson.features) {
      throw new Error('Invalid or missing GeoJSON data');
    }

    if (
      timeTravelConfig === null ||
      timeTravelConfig.sources === null ||
      Object.keys(timeTravelConfig.sources).length === 0
    ) {
      throw new Error('Time travel configuration not available');
    }

    const beforeYearExists = timeTravelConfig.sources[
      selectedSourceBefore
    ]?.some((item) => item.year === selectedYearBefore);
    if (!beforeYearExists) {
      throw new Error(
        `Year ${selectedYearBefore} not found in source ${selectedSourceBefore}`
      );
    }

    const afterYearExists = timeTravelConfig.sources[selectedSourceAfter]?.some(
      (item) => item.year === selectedYearAfter
    );
    if (!afterYearExists) {
      throw new Error(
        `Year ${selectedYearAfter} not found in source ${selectedSourceAfter}`
      );
    }
  }, [
    timeTravelConfig,
    selectedSourceBefore,
    selectedSourceAfter,
    selectedYearBefore,
    selectedYearAfter,
    sitesGeoJson,
  ]);

  const initializeMap = (
    container: HTMLDivElement | null,
    viewState: {
      longitude: number;
      latitude: number;
      zoom: number;
    },
    onError: (error: Error, code: MapErrorCode) => void,
    onLoad: (map: MaplibreMap) => void
  ): MaplibreMap | null => {
    if (!container) {
      onError(
        new Error('Map container element not found'),
        MAP_ERROR_CODES.INITIALIZATION
      );
      return null;
    }

    const map = new MaplibreMap({
      container,
      style: EMPTY_STYLE,
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      dragPan: true,
      scrollZoom: false,
      attributionControl: false,
    });

    map.on('error', (e) => {
      onError(
        new Error(`Map error: ${e.error.message}`),
        MAP_ERROR_CODES.INITIALIZATION
      );
    });

    map.on('load', () => {
      onLoad(map);
    });

    return map;
  };

  // Initialize the side by side comparison map
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !timeTravelConfig ||
      !beforeContainer.current ||
      !afterContainer.current
    ) {
      return;
    }

    try {
      validateData();

      const beforeMap = initializeMap(
        beforeContainer.current,
        mainMapViewState,
        handleMapError,
        (map) => {
          beforeMapRef.current = map;
          setBeforeLoaded(true);
        }
      );

      const afterMap = initializeMap(
        afterContainer.current,
        mainMapViewState,
        handleMapError,
        (map) => {
          afterMapRef.current = map;
          setAfterLoaded(true);
        }
      );

      if (!beforeMap || !afterMap) {
        return;
      }

      // Cleanup function
      return () => {
        beforeMap.remove();
        afterMap.remove();
        if (compareRef.current) {
          compareRef.current.remove();
        }
      };
    } catch (err) {
      handleMapError(
        err instanceof Error ? err : new Error('Failed to initialize maps'),
        MAP_ERROR_CODES.INITIALIZATION
      );
    }
  }, []);

  // Handle view state changes - syncs the zoom with the field data map
  useEffect(() => {
    if (beforeMapRef.current && afterMapRef.current) {
      beforeMapRef.current.setCenter([
        mainMapViewState.longitude,
        mainMapViewState.latitude,
      ]);
      beforeMapRef.current.setZoom(mainMapViewState.zoom);

      afterMapRef.current.setCenter([
        mainMapViewState.longitude,
        mainMapViewState.latitude,
      ]);
      afterMapRef.current.setZoom(mainMapViewState.zoom);
    }
  }, [mainMapViewState]);

  // Initialize comparison only when both maps are loaded
  useEffect(() => {
    if (
      beforeLoaded &&
      afterLoaded &&
      beforeMapRef.current &&
      afterMapRef.current
    ) {
      try {
        compareRef.current = new MaplibreCompare(
          beforeMapRef.current,
          afterMapRef.current,
          comparisonContainer.current || '',
          {
            mousemove: false,
            orientation: 'vertical',
          }
        );
      } catch (err) {
        handleMapError(
          err instanceof Error
            ? err
            : new Error('Failed to initialize comparison'),
          MAP_ERROR_CODES.INITIALIZATION
        );
      }
    }
  }, [beforeLoaded, afterLoaded]);

  // Utility function for generating layer IDs
  const getEsriLayerIds = (prefix: 'before' | 'after', year: string) => {
    return {
      layerId: `${prefix}-imagery-esri-${year}-layer`,
      polygonLayerId: `project-polygon-layer-esri-${year}`,
      sourceId: `${prefix}-imagery-esri-${year}`,
      polygonSourceId: `project-polygon-esri-${year}`,
    };
  };

  // Source-specific layer handlers
  const handleEsriLayers = (
    map: MaplibreMap,
    prefix: 'before' | 'after',
    selectedYear: string,
    yearData: SingleYearTimeTravelData,
    sitesGeoJson: ProjectSiteFeatureCollection
  ) => {
    const { sourceId, layerId, polygonSourceId, polygonLayerId } =
      getEsriLayerIds(prefix, yearData.year);

    // Add raster source and layer
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'raster',
        tiles: [yearData.rasterUrl],
        tileSize: 256,
        attribution: 'layer attribution',
      });
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
      });
    }

    // Add polygon source and layer
    if (!map.getSource(polygonSourceId)) {
      map.addSource(polygonSourceId, {
        type: 'geojson',
        data: sitesGeoJson,
      });
    }

    if (!map.getLayer(polygonLayerId)) {
      map.addLayer({
        id: polygonLayerId,
        type: 'line',
        source: polygonSourceId,
        layout: {},
        paint: {
          'line-color': themeProperties.designSystem.colors.white,
          'line-width': 4,
        },
      });
    }

    return [layerId, polygonLayerId];
  };

  const handleMapLayers = (
    map: MaplibreMap,
    prefix: 'before' | 'after',
    source: SourceName,
    selectedYear: string,
    timeTravelConfig: ProjectTimeTravelConfig & {
      sources: ProjectTimeTravelSources;
    },
    sitesGeoJson: ProjectSiteFeatureCollection
  ) => {
    const sourceData = timeTravelConfig.sources[source];
    if (!sourceData) return;

    // First remove any existing layers for this source
    sourceData.forEach((year) => {
      if (source === 'esri') {
        const { layerId, polygonLayerId } = getEsriLayerIds(prefix, year.year);

        if (map.getLayer(polygonLayerId)) {
          map.removeLayer(polygonLayerId);
        }
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }
      // Add cases for other sources here
    });

    // Find the configuration for the selected year
    const yearConfig = sourceData.find((year) => year.year === selectedYear);

    if (!yearConfig) {
      throw new Error(`Configuration not found for year ${selectedYear}`);
    }

    // Add new layers based on source type
    switch (source) {
      case 'esri':
        handleEsriLayers(map, prefix, selectedYear, yearConfig, sitesGeoJson);
        break;
      // Add cases for other sources here
      default:
        throw new Error(`Unsupported source type: ${source}`);
    }
  };

  const loadLayers = useCallback(() => {
    if (
      !timeTravelConfig?.sources ||
      !beforeMapRef.current ||
      !afterMapRef.current
    )
      return;

    try {
      validateData();

      // Handle before map
      handleMapLayers(
        beforeMapRef.current,
        'before',
        selectedSourceBefore,
        selectedYearBefore,
        { ...timeTravelConfig, sources: timeTravelConfig.sources },
        sitesGeoJson
      );

      // Handle after map
      handleMapLayers(
        afterMapRef.current,
        'after',
        selectedSourceAfter,
        selectedYearAfter,
        { ...timeTravelConfig, sources: timeTravelConfig.sources },
        sitesGeoJson
      );

      setIsLoading(false);
    } catch (err) {
      handleMapError(
        err instanceof Error ? err : new Error('Failed to load map layers'),
        MAP_ERROR_CODES.LAYER_LOAD
      );
    }
  }, [
    timeTravelConfig,
    selectedSourceBefore,
    selectedSourceAfter,
    selectedYearBefore,
    selectedYearAfter,
    sitesGeoJson,
    handleMapError,
    validateData,
  ]);

  useEffect(() => {
    if (beforeMapRef.current && afterMapRef.current) {
      loadLayers();
    }
  }, [
    beforeLoaded,
    afterLoaded,
    selectedSourceBefore,
    selectedSourceAfter,
    selectedYearBefore,
    selectedYearAfter,
    loadLayers,
  ]);

  const handleBeforeYearChange = (year: string) => {
    setSelectedYearBefore(year);
  };

  const handleBeforeSourceChange = (source: SourceName) => {
    setSelectedSourceBefore(source);
  };

  const handleAfterYearChange = (year: string) => {
    setSelectedYearAfter(year);
  };

  const handleAfterSourceChange = (source: SourceName) => {
    setSelectedSourceAfter(source);
  };

  return (
    <div className={`${isVisible ? styles.visible : styles.hidden}`}>
      <TimeTravelDropdown
        defaultYear={selectedYearBefore}
        defaultSource={selectedSourceBefore}
        availableYears={availableYears}
        availableSources={availableSources}
        onYearChange={handleBeforeYearChange}
        onSourceChange={handleBeforeSourceChange}
        customClassName={styles.beforeDropdown}
      />
      <TimeTravelDropdown
        defaultYear={selectedYearAfter}
        defaultSource={selectedSourceAfter}
        availableYears={availableYears}
        availableSources={availableSources}
        onYearChange={handleAfterYearChange}
        onSourceChange={handleAfterSourceChange}
        customClassName={styles.afterDropdown}
      />
      <div
        id="comparison-container"
        ref={comparisonContainer}
        className={styles.comparisonContainer}
      >
        {isLoading && <div className={styles.loadingOverlay}>Loading...</div>}
        <div
          id="before"
          ref={beforeContainer}
          className={styles.comparisonMap}
        ></div>
        <div
          id="after"
          ref={afterContainer}
          className={styles.comparisonMap}
        ></div>
      </div>
    </div>
  );
}
