import type {
  MapMouseEvent,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl-v7/maplibre';
import type { MapState } from '../../../../utils/mapsV2/mapDefaults';
import type {
  ExtendedMapLibreMap,
  MapLibreRef,
} from '../../../common/types/map';
import type { Geometry, Point, Polygon } from 'geojson';
import type { SetState } from '../../../common/types/common';
import type { RegisteredTreesGeometry } from '../../../common/types/map';

import {
  Layer,
  Map as MapGL,
  Marker,
  NavigationControl,
  Source,
} from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import styles from '../RegisterModal.module.scss';
import zoomToLocation from '../../../../utils/mapsV2/zoomToLocation';
import { ProjectLocationIcon } from '../../../../../public/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../theme/themeProperties';
import { centerMapOnCoordinates } from '../../../../utils/projectV2';
import DeleteIcon from '../../../../../public/assets/images/icons/DeleteIcon';
import { useTranslations } from 'next-intl';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../../utils/mapsV2/mapDefaults';

interface RegisterTreeMapProps {
  isMultiple: boolean;
  geometry: RegisteredTreesGeometry | undefined;
  setGeometry: SetState<RegisteredTreesGeometry | undefined>;
  userLocation: number[] | null;
  setErrorMessage: SetState<string | null>;
}

const MAP_CONFIG = {
  DEFAULT_ZOOM_LEVEL: 10,
  ZOOM_ANIMATION_DURATION: 2000,
  MIN_POLYGON_POINTS: 3,
  BORDER_RADIUS: '8px',
} as const;

const createPoint = (lng: number, lat: number): Point => ({
  type: 'Point',
  coordinates: [lng, lat],
});

const startPolygon = (lng: number, lat: number): Polygon => ({
  type: 'Polygon',
  coordinates: [[[lng, lat]]], // Only one point initially
});

const addPolygonVertex = (
  polygon: Polygon,
  lng: number,
  lat: number
): Polygon => ({
  ...polygon,
  coordinates: [[...polygon.coordinates[0], [lng, lat]]],
});

// Close the polygon when the user finishes (e.g., double-click)
const closePolygon = (polygon: Polygon): Polygon => {
  const coords = polygon.coordinates[0];
  if (coords.length < 3) throw new Error('Polygon must have at least 3 points');
  return {
    ...polygon,
    coordinates: [[...coords, coords[0]]], // duplicate first point at the end
  };
};

function isPointGeometry(geo: Geometry | undefined): geo is Point {
  return geo?.type === 'Point';
}

function isPolygonGeometry(geo: Geometry | undefined): geo is Polygon {
  return geo?.type === 'Polygon';
}

const RegisterTreeMap = ({
  isMultiple,
  geometry,
  setGeometry,
  userLocation,
  setErrorMessage,
}: RegisterTreeMapProps) => {
  const mapRef: MapLibreRef = useRef<ExtendedMapLibreMap | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('Me');
  const { colors } = themeProperties.designSystem;

  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);

  const isPolygon = isPolygonGeometry(geometry);
  const isPoint = isPointGeometry(geometry);

  const polygonCoords = isPolygon ? geometry.coordinates[0] : [];
  const isPolygonValid =
    isPolygon && polygonCoords.length >= MAP_CONFIG.MIN_POLYGON_POINTS;
  const isPolygonInProgress =
    isPolygon && polygonCoords.length > 1 && !isPolygonComplete;

  // Polygon can only be closed if it's valid and not already complete
  const canClosePolygon = useMemo(() => {
    if (!isMultiple || !geometry) return false;
    return isPolygonValid && !isPolygonComplete;
  }, [isMultiple, geometry, isPolygonComplete]);

  const cursorType = isMultiple
    ? isPolygonComplete
      ? 'default'
      : 'crosshair'
    : 'pointer';

  const handleViewStateChange = useCallback(
    (newViewState: Partial<ViewState>) => {
      setViewState((prev) => ({
        ...prev,
        ...newViewState,
      }));
    },
    []
  );

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      setErrorMessage(null);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        const { lng, lat } = e.lngLat;
        if (isMultiple) {
          if (isPolygonComplete) return;
          setGeometry((prev) => {
            if (prev?.type === 'Polygon') {
              return addPolygonVertex(prev, lng, lat);
            }
            return startPolygon(lng, lat);
          });
        } else {
          // Point mode → center map after placing marker
          setGeometry(createPoint(lng, lat));
          centerMapOnCoordinates(mapRef, [lng, lat]);
        }
      }, 250);
    },
    [isMultiple, isPolygonComplete]
  );

  const handleMapDoubleClick = useCallback(() => {
    //  Double click detected → cancel single click action
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    // Validate polygon before closing
    if (!isPolygonValid) {
      setErrorMessage(t('polygonMinimumPoints'));
      setGeometry(undefined);
      return;
    }

    if (canClosePolygon) {
      setGeometry((prev) => {
        if (!prev || prev.type !== 'Polygon') return prev;
        return closePolygon(prev);
      });
      setIsPolygonComplete(true);
    }
  }, [canClosePolygon]);

  const handleClearGeometry = useCallback(() => {
    setGeometry(undefined);
    setIsPolygonComplete(false);
  }, []);

  useEffect(() => {
    if (userLocation && mapRef.current && mapLoaded) {
      zoomToLocation(
        handleViewStateChange,
        userLocation[0],
        userLocation[1],
        MAP_CONFIG.DEFAULT_ZOOM_LEVEL,
        MAP_CONFIG.ZOOM_ANIMATION_DURATION,
        mapRef
      );
    }
  }, [userLocation, mapLoaded]);

  useEffect(() => handleClearGeometry(), [isMultiple]);

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('openStreetMap');
      if (result) {
        setMapState((prev) => ({ ...prev, mapStyle: result }));
      }
    }
    loadMapStyle();
  }, []);

  return (
    <section className={styles.registerTreeMapContainer}>
      {!mapLoaded && (
        <div role="status" aria-live="polite">
          Map Loading...
        </div>
      )}
      {geometry && isMultiple && (
        <button
          className={styles.polygonDeleteButton}
          onClick={handleClearGeometry}
          aria-label="Clear polygon geometry"
        >
          <DeleteIcon />
        </button>
      )}
      <MapGL
        {...viewState}
        {...mapState}
        ref={mapRef}
        onMove={onMove}
        onLoad={() => setMapLoaded(true)}
        onClick={handleMapClick}
        onDblClick={handleMapDoubleClick}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: MAP_CONFIG.BORDER_RADIUS,
        }}
        cursor={cursorType}
      >
        {isPoint && mapLoaded && (
          <Marker
            longitude={geometry.coordinates[0]}
            latitude={geometry.coordinates[1]}
          >
            <ProjectLocationIcon color={colors.primaryColor} />
          </Marker>
        )}

        {isPolygonValid && mapLoaded && (
          <Source
            id="polygon-preview"
            type="geojson"
            data={{ type: 'Feature', geometry, properties: {} }}
          >
            <Layer
              id="polygon-fill"
              type="fill"
              paint={{
                'fill-color': colors.warmGreen,
                'fill-opacity': 0.4,
              }}
            />
          </Source>
        )}

        {isPolygonInProgress && mapLoaded && (
          <Source
            id="polygon-line-preview"
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: geometry.coordinates[0],
              },
              properties: {},
            }}
          >
            <Layer
              id="polygon-line"
              type="line"
              paint={{ 'line-color': colors.primaryColor, 'line-width': 2 }}
            />
          </Source>
        )}

        <NavigationControl showCompass={false} position="bottom-right" />
      </MapGL>
    </section>
  );
};

export default RegisterTreeMap;
