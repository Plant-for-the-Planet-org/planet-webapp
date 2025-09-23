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
import type { RegisteredTreesGeometry } from '../RegisterTreesWidget';
import type { SetState } from '../../../common/types/common';

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
import { useCallback, useEffect, useRef, useState } from 'react';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import styles from '../RegisterModal.module.scss';
import zoomToLocation from '../../../../utils/mapsV2/zoomToLocation';
import { ProjectLocationIcon } from '../../../../../storybook-static/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../theme/themeProperties';
import { centerMapOnCoordinates } from '../../../../utils/projectV2';
import DeleteIcon from '../../../../../public/assets/images/icons/DeleteIcon';

interface RegisterTreeMapProps {
  isMultiple: boolean;
  geometry: RegisteredTreesGeometry | undefined;
  setGeometry: SetState<RegisteredTreesGeometry | undefined>;
  userLocation: number[] | null;
}

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

const closePolygon = (polygon: Polygon): Polygon => {
  const ring = polygon.coordinates[0];
  if (ring.length < 4) return polygon;
  return { ...polygon, coordinates: [[...ring.slice(0, -1), ring[0]]] };
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

  const isPointGeometry =
    geometry?.type === 'Point' && Array.isArray(geometry?.coordinates);
  const isPolygonGeometry =
    geometry?.type === 'Polygon' && Array.isArray(geometry?.coordinates);

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
    if (userLocation && mapRef.current) {
      zoomToLocation(
        handleViewStateChange,
        userLocation[0],
        userLocation[1],
        10,
        2000,
        mapRef
      );
    }
  }, [userLocation, mapRef.current]);

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
    [isMultiple, setGeometry]
  );

  const handleMapDoubleClick = useCallback(() => {
    if (isMultiple && geometry?.type === 'Polygon') {
      setGeometry(closePolygon(geometry));
    }
  }, [isMultiple, geometry, setGeometry]);

  return (
    <section className={styles.registerTreeMapContainer}>
      {geometry && isMultiple && (
        <button
          className={styles.polygonDeleteButton}
          onClick={() => setGeometry(undefined)}
          aria-label="Clear geometry"
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
        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
        cursor={isMultiple ? 'crosshair' : 'pointer'}
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
                'fill-color': colors.sunriseOrange,
                'fill-opacity': 0.4,
              }}
            />
            <Layer
              id="polygon-outline"
              type="line"
              paint={{ 'line-color': colors.coreText, 'line-width': 2 }}
            />
          </Source>
        )}

        <NavigationControl showCompass={false} position="bottom-right" />
      </MapGL>
    </section>
  );
};

export default RegisterTreeMap;
