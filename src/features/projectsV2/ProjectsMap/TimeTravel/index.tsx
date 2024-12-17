import type { ReactElement } from 'react';
import type {
  SourceName,
  TimeTravelConfig,
} from '../../../../utils/mapsV2/timeTravel';
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import type { ProjectSite } from '@planet-sdk/common/build/types/project';

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
import { Map } from 'maplibre-gl';
import { useProjectsMap } from '../../ProjectsMapContext';
import { getTimeTravelConfig } from '../../../../utils/mapsV2/timeTravel';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import TimeTravelDropdown from '../../TimeTravelDropdown';
import styles from './TimeTravel.module.scss';

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
  sitesGeoJson: FeatureCollection<Polygon | MultiPolygon, ProjectSite>;
}

export default function TimeTravel({ sitesGeoJson }: Props): ReactElement {
  const { viewState: mainMapViewState } = useProjectsMap();
  const { setErrors } = useContext(ErrorHandlingContext);

  const comparisonContainer = useRef<HTMLDivElement>(null);
  const beforeContainer = useRef<HTMLDivElement>(null);
  const afterContainer = useRef<HTMLDivElement>(null);
  const beforeMapRef = useRef<Map | null>(null);
  const afterMapRef = useRef<Map | null>(null);
  const compareRef = useRef<MaplibreCompare | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  const [beforeDropdownOpen, setBeforeDropdownOpen] = useState(false);
  const [afterDropdownOpen, setAfterDropdownOpen] = useState(false);

  const timeTravelData = useMemo(() => getTimeTravelConfig(), []);

  const availableYears = useMemo(
    () => timeTravelData[DEFAULT_SOURCE]?.map((item) => item.year) || [],
    [timeTravelData]
  );

  const availableSources = useMemo(
    () => Object.keys(timeTravelData) as Array<keyof TimeTravelConfig>,
    [timeTravelData]
  );

  const [selectedSourceBefore, setSelectedSourceBefore] = useState<
    keyof TimeTravelConfig
  >(availableSources[0] || DEFAULT_SOURCE);
  const [selectedSourceAfter, setSelectedSourceAfter] = useState<
    keyof TimeTravelConfig
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

    if (!timeTravelData || Object.keys(timeTravelData).length === 0) {
      throw new Error('Time travel configuration not available');
    }

    const beforeYearExists = timeTravelData[selectedSourceBefore]?.some(
      (item) => item.year === selectedYearBefore
    );
    if (!beforeYearExists) {
      throw new Error(
        `Year ${selectedYearBefore} not found in source ${selectedSourceBefore}`
      );
    }

    const afterYearExists = timeTravelData[selectedSourceAfter]?.some(
      (item) => item.year === selectedYearAfter
    );
    if (!afterYearExists) {
      throw new Error(
        `Year ${selectedYearAfter} not found in source ${selectedSourceAfter}`
      );
    }
  }, [
    timeTravelData,
    selectedSourceBefore,
    selectedSourceAfter,
    selectedYearBefore,
    selectedYearAfter,
    sitesGeoJson,
  ]);

  // Initialize the side by side comparison map
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      validateData();

      const before = new Map({
        container: beforeContainer.current || '',
        style: EMPTY_STYLE,
        center: [mainMapViewState.longitude, mainMapViewState.latitude],
        zoom: mainMapViewState.zoom,
        dragPan: true,
        scrollZoom: false,
        attributionControl: false,
      });

      before.on('error', (e) => {
        handleMapError(
          new Error(`Before map error: ${e.error.message}`),
          MAP_ERROR_CODES.INITIALIZATION
        );
      });

      before.on('load', () => {
        beforeMapRef.current = before;
        setBeforeLoaded(true);
      });

      const after = new Map({
        container: afterContainer.current || '',
        style: EMPTY_STYLE,
        center: [mainMapViewState.longitude, mainMapViewState.latitude],
        zoom: mainMapViewState.zoom,
        dragPan: true,
        scrollZoom: false,
        attributionControl: false,
      });

      before.on('error', (e) => {
        handleMapError(
          new Error(`After map error: ${e.error.message}`),
          MAP_ERROR_CODES.INITIALIZATION
        );
      });

      after.on('load', () => {
        afterMapRef.current = after;
        setAfterLoaded(true);
      });
    } catch (err) {
      handleMapError(
        err instanceof Error ? err : new Error('Failed to initialize maps'),
        MAP_ERROR_CODES.INITIALIZATION
      );
    }

    // Cleanup function
    return () => {
      if (beforeMapRef.current) {
        beforeMapRef.current.remove();
      }
      if (afterMapRef.current) {
        afterMapRef.current.remove();
      }
      if (compareRef.current) {
        compareRef.current.remove();
      }
    };
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

  const loadLayers = useCallback(() => {
    if (!beforeMapRef.current || !afterMapRef.current) return;

    try {
      validateData();

      // Handle before map layers
      if (timeTravelData.esri) {
        // First remove all existing layers from before map
        timeTravelData.esri.forEach((year) => {
          const layerId = `before-imagery-esri-${year.year}-layer`;
          const polygonLayerId = `project-polygon-layer-esri-${year.year}`;

          if (beforeMapRef.current?.getLayer(polygonLayerId)) {
            beforeMapRef.current.removeLayer(polygonLayerId);
          }
          if (beforeMapRef.current?.getLayer(layerId)) {
            beforeMapRef.current.removeLayer(layerId);
          }
        });

        // Add new layers if source is esri
        if (selectedSourceBefore === 'esri') {
          const beforeYear = timeTravelData.esri.find(
            (year) => year.year === selectedYearBefore
          );

          if (!beforeYear) {
            throw new Error(
              `Configuration not found for year ${selectedYearBefore}`
            );
          }

          const sourceId = `before-imagery-esri-${beforeYear.year}`;
          const layerId = `${sourceId}-layer`;
          const polygonSourceId = `project-polygon-esri-${beforeYear.year}`;
          const polygonLayerId = `project-polygon-layer-esri-${beforeYear.year}`;

          if (!beforeMapRef.current.getSource(sourceId)) {
            beforeMapRef.current.addSource(sourceId, {
              type: 'raster',
              tiles: [beforeYear.raster],
              tileSize: 256,
              attribution: 'layer attribution',
            });
          }

          if (!beforeMapRef.current.getLayer(layerId)) {
            beforeMapRef.current.addLayer({
              id: layerId,
              type: 'raster',
              source: sourceId,
            });
          }

          if (!beforeMapRef.current.getSource(polygonSourceId)) {
            beforeMapRef.current.addSource(polygonSourceId, {
              type: 'geojson',
              data: sitesGeoJson,
            });
          }

          if (!beforeMapRef.current.getLayer(polygonLayerId)) {
            beforeMapRef.current.addLayer({
              id: polygonLayerId,
              type: 'line',
              source: polygonSourceId,
              layout: {},
              paint: {
                'line-color': '#fff',
                'line-width': 4,
              },
            });
          }
        }
      }

      // Handle after map layers (similar logic)
      if (timeTravelData.esri) {
        // First remove all existing layers from after map
        timeTravelData.esri.forEach((year) => {
          const layerId = `after-imagery-esri-${year.year}-layer`;
          const polygonLayerId = `project-polygon-layer-esri-${year.year}`;

          if (afterMapRef.current?.getLayer(polygonLayerId)) {
            afterMapRef.current.removeLayer(polygonLayerId);
          }
          if (afterMapRef.current?.getLayer(layerId)) {
            afterMapRef.current.removeLayer(layerId);
          }
        });

        // Add new layers if source is esri
        if (selectedSourceAfter === 'esri') {
          const afterYear = timeTravelData.esri.find(
            (year) => year.year === selectedYearAfter
          );

          if (!afterYear) {
            throw new Error(
              `Configuration not found for year ${selectedYearAfter}`
            );
          }

          const sourceId = `after-imagery-esri-${afterYear.year}`;
          const layerId = `${sourceId}-layer`;
          const polygonSourceId = `project-polygon-esri-${afterYear.year}`;
          const polygonLayerId = `project-polygon-layer-esri-${afterYear.year}`;

          if (!afterMapRef.current.getSource(sourceId)) {
            afterMapRef.current.addSource(sourceId, {
              type: 'raster',
              tiles: [afterYear.raster],
              tileSize: 256,
              attribution: 'layer attribution',
            });
          }

          if (!afterMapRef.current.getLayer(layerId)) {
            afterMapRef.current.addLayer({
              id: layerId,
              type: 'raster',
              source: sourceId,
            });
          }

          if (!afterMapRef.current.getSource(polygonSourceId)) {
            afterMapRef.current.addSource(polygonSourceId, {
              type: 'geojson',
              data: sitesGeoJson,
            });
          }

          if (!afterMapRef.current.getLayer(polygonLayerId)) {
            afterMapRef.current.addLayer({
              id: polygonLayerId,
              type: 'line',
              source: polygonSourceId,
              layout: {},
              paint: {
                'line-color': '#fff',
                'line-width': 4,
              },
            });
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      handleMapError(
        err instanceof Error ? err : new Error('Failed to load map layers'),
        MAP_ERROR_CODES.LAYER_LOAD
      );
    }
  }, [
    timeTravelData,
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
    setBeforeDropdownOpen(false);
  };

  const handleBeforeSourceChange = (source: SourceName) => {
    setSelectedSourceBefore(source);
    setBeforeDropdownOpen(false);
  };

  const handleAfterYearChange = (year: string) => {
    setSelectedYearAfter(year);
    setAfterDropdownOpen(false);
  };

  const handleAfterSourceChange = (source: SourceName) => {
    setSelectedSourceAfter(source);
    setAfterDropdownOpen(false);
  };

  return (
    <>
      <TimeTravelDropdown
        defaultYear={selectedYearBefore}
        defaultSource={selectedSourceBefore}
        availableYears={availableYears}
        availableSources={availableSources}
        isOpen={beforeDropdownOpen}
        onYearChange={handleBeforeYearChange}
        onSourceChange={handleBeforeSourceChange}
        customClassName={styles.beforeDropdown}
      />
      <TimeTravelDropdown
        defaultYear={selectedYearAfter}
        defaultSource={selectedSourceAfter}
        availableYears={availableYears}
        availableSources={availableSources}
        isOpen={afterDropdownOpen}
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
    </>
  );
}
