import type { ReactElement } from 'react';
import type {
  SourceName,
  ProjectTimeTravelSources,
  ProjectTimeTravelConfig,
  SingleYearTimeTravelData,
} from '../../../../utils/mapsV2/timeTravel';
import type { ProjectSiteFeatureCollection } from '../../../common/types/map';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaplibreCompare from '@maplibre/maplibre-gl-compare';
import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';
import { Map as MaplibreMap } from 'maplibre-gl';
import { useProjectsMap } from '../../ProjectsMapContext';
import TimeTravelDropdown from '../../TimeTravelDropdown';
import styles from './TimeTravel.module.scss';
import themeProperties from '../../../../theme/themeProperties';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';

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
  TILE_LOADING_ERROR: 'MAP_TILE_LOADING_ERROR',
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
  const tTimeTravel = useTranslations('Maps.timeTravel');

  const comparisonContainer = useRef<HTMLDivElement>(null);
  const beforeContainer = useRef<HTMLDivElement>(null);
  const afterContainer = useRef<HTMLDivElement>(null);
  const beforeMapRef = useRef<MaplibreMap | null>(null);
  const afterMapRef = useRef<MaplibreMap | null>(null);
  const compareRef = useRef<MaplibreCompare | null>(null);
  const tileErrorsShownRef = useRef<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  //store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

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
      throw new Error(tTimeTravel('errors.invalidGeoJson'));
    }

    if (
      timeTravelConfig === null ||
      timeTravelConfig.sources === null ||
      Object.keys(timeTravelConfig.sources).length === 0
    ) {
      throw new Error(tTimeTravel('errors.configNotAvailable'));
    }

    const beforeYearExists = timeTravelConfig.sources[
      selectedSourceBefore
    ]?.some((item) => item.year === selectedYearBefore);
    if (!beforeYearExists) {
      throw new Error(
        tTimeTravel('errors.yearNotFoundInSource', {
          year: selectedYearBefore,
          source: selectedSourceBefore,
        })
      );
    }

    const afterYearExists = timeTravelConfig.sources[selectedSourceAfter]?.some(
      (item) => item.year === selectedYearAfter
    );
    if (!afterYearExists) {
      throw new Error(
        tTimeTravel('errors.yearNotFoundInSource', {
          year: selectedYearAfter,
          source: selectedSourceAfter,
        })
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

  // Add this helper function before the initializeMap function
  const isTileError = (
    e: ErrorEvent & Object
  ): e is ErrorEvent & Object & { sourceId: string } => {
    const eventWithProps = e as ErrorEvent & Object & Record<string, unknown>;

    return (
      'sourceId' in e &&
      typeof eventWithProps.sourceId === 'string' &&
      (eventWithProps.sourceId as string).includes('imagery-esri') &&
      (e.error?.message?.includes('Failed to fetch') ||
        e.error?.status === 404 ||
        e.error?.name === 'NetworkError')
    );
  };

  const initializeMap = (
    container: HTMLDivElement | null,
    viewState: {
      longitude: number;
      latitude: number;
      zoom: number;
    },
    onError: (error: Error, code: MapErrorCode) => void,
    onLoad: (map: MaplibreMap) => void,
    mapType: 'before' | 'after'
  ): MaplibreMap | null => {
    if (!container) {
      onError(
        new Error(tTimeTravel('errors.containerNotFound')),
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
      // Check if this is a tile loading error
      if (isTileError(e)) {
        const yearMatch = e.sourceId?.match(/esri-(\d{4})/);
        const year = yearMatch
          ? yearMatch[1]
          : tTimeTravel('genericHistoricalYear');
        const errorKey = `${mapType}-${year}`;

        if (!tileErrorsShownRef.current.has(errorKey)) {
          tileErrorsShownRef.current.add(errorKey);
          handleMapError(
            new Error(tTimeTravel('errors.imageryNotAvailable', { year })),
            MAP_ERROR_CODES.TILE_LOADING_ERROR
          );
        }
        return;
      }
      onError(
        new Error(tTimeTravel('errors.mapError', { message: e.error.message })),
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
        },
        'before'
      );

      const afterMap = initializeMap(
        afterContainer.current,
        mainMapViewState,
        handleMapError,
        (map) => {
          afterMapRef.current = map;
          setAfterLoaded(true);
        },
        'after'
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
        err instanceof Error
          ? err
          : new Error(tTimeTravel('errors.mapInitializationFailed')),
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
            : new Error(tTimeTravel('errors.comparisonInitializationFailed')),
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
      throw new Error(
        tTimeTravel('errors.configNotFoundForYear', { year: selectedYear })
      );
    }

    // Add new layers based on source type
    switch (source) {
      case 'esri':
        handleEsriLayers(map, prefix, selectedYear, yearConfig, sitesGeoJson);
        break;
      // Add cases for other sources here
      default:
        throw new Error(
          tTimeTravel('errors.unsupportedSourceType', { source })
        );
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
        err instanceof Error
          ? err
          : new Error(tTimeTravel('errors.layerLoadFailed')),
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
    tileErrorsShownRef.current.delete(`before-${selectedYearBefore}`);
    tileErrorsShownRef.current.delete(`before-${year}`);
    setSelectedYearBefore(year);
    setBeforeLoaded(false);
  };

  const handleBeforeSourceChange = (source: SourceName) => {
    setSelectedSourceBefore(source);
  };

  const handleAfterYearChange = (year: string) => {
    tileErrorsShownRef.current.delete(`after-${selectedYearAfter}`);
    tileErrorsShownRef.current.delete(`after-${year}`);
    setSelectedYearAfter(year);
    setAfterLoaded(false);
  };

  const handleAfterSourceChange = (source: SourceName) => {
    setSelectedSourceAfter(source);
  };

  return (
    <div
      className={clsx({
        [styles.visible]: isVisible,
        [styles.hidden]: !isVisible,
      })}
    >
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
        {isLoading && (
          <div className={styles.loadingOverlay}>{tTimeTravel('loading')}</div>
        )}
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
