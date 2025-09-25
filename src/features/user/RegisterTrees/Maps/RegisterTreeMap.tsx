import type {
  MapMouseEvent,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl-v7/maplibre';
import type { MapState } from '../../../projectsV2/ProjectsMapContext';
import type {
  ExtendedMapLibreMap,
  MapRef,
} from '../../../common/types/projectv2';
import type { Point, Polygon } from 'geojson';
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
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../projectsV2/ProjectsMapContext';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import styles from '../RegisterModal.module.scss';
import zoomToLocation from '../../../../utils/mapsV2/zoomToLocation';
import { ProjectLocationIcon } from '../../../../../public/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../theme/themeProperties';
import { centerMapOnCoordinates } from '../../../../utils/projectV2';
import DeleteIcon from '../../../../../public/assets/images/icons/DeleteIcon';

interface RegisterTreeMapProps {
  isMultiple: boolean;
  geometry: RegisteredTreesGeometry | undefined;
  setGeometry: SetState<RegisteredTreesGeometry | undefined>;
  userLocation: number[] | null;
}

const MAP_CONFIG = {
  DEFAULT_ZOOM_LEVEL: 10,
  ZOOM_ANIMATION_DURATION: 2000,
  MIN_POLYGON_POINTS: 4,
  BORDER_RADIUS: '8px',
} as const;

const createPoint = (lng: number, lat: number): Point => ({
  type: 'Point',
  coordinates: [lng, lat],
});

const addPolygonVertex = (
  polygon: Polygon,
  lng: number,
  lat: number
): Polygon => {
  const ring = polygon.coordinates[0];
  const updated = [...ring.slice(0, -1), [lng, lat], ring[0]];
  return { ...polygon, coordinates: [updated] };
};

const startPolygon = (lng: number, lat: number): Polygon => ({
  type: 'Polygon',
  coordinates: [
    [
      [lng, lat],
      [lng, lat],
      [lng, lat],
    ],
  ],
});

const closePolygon = (polygon: Polygon): Polygon => {
  if (!polygon || polygon.type !== 'Polygon') return polygon;
  const ring = polygon.coordinates[0];
  // Replace the last placeholder with the first coordinate
  return { ...polygon, coordinates: [[...ring.slice(0, -1), ring[0]]] };
};

const RegisterTreeMap = ({
  isMultiple,
  geometry,
  setGeometry,
  userLocation,
}: RegisterTreeMapProps) => {
  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const { colors } = themeProperties.designSystem;

  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);

  const canClosePolygon = useMemo(() => {
    if (!isMultiple || !geometry || geometry.type !== 'Polygon') return false;
    const ring = geometry.coordinates?.[0];
    // Need at least 4 points (including closing point) for a valid polygon
    return (
      Array.isArray(ring) &&
      ring.length >= MAP_CONFIG.MIN_POLYGON_POINTS &&
      !isPolygonComplete
    );
  }, [isMultiple, geometry, isPolygonComplete]);

  const isPointGeometry = geometry?.type === 'Point';
  const isPolygonGeometry = geometry?.type === 'Polygon';
  const isPolygonInProgress =
    geometry?.type === 'Polygon' && geometry.coordinates[0].length > 1;
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

  useEffect(() => {
    if (isMultiple) setGeometry(undefined);
  }, [isMultiple]);

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('openStreetMap');
      if (result) {
        setMapState((prev) => ({ ...prev, mapStyle: result }));
      }
    }
    loadMapStyle();
  }, []);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
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
        setGeometry(createPoint(lng, lat));
        centerMapOnCoordinates(mapRef, [lng, lat]);
      }
    },
    [isMultiple, isPolygonComplete]
  );

  const handleMapDoubleClick = useCallback(() => {
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
        {isPointGeometry && mapLoaded && (
          <Marker
            longitude={geometry.coordinates[0]}
            latitude={geometry.coordinates[1]}
          >
            <ProjectLocationIcon color={colors.primaryColor} />
          </Marker>
        )}

        {isPolygonGeometry && mapLoaded && (
          <Source id="polygon-preview" type="geojson" data={geometry}>
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

        {isPolygonInProgress && mapLoaded && !isPolygonComplete && (
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
