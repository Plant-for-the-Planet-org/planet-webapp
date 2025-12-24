import type { ReactElement } from 'react';
import type { ViewState, ViewStateChangeEvent } from 'react-map-gl-v7/maplibre';
import type { MapState } from '../../../../utils/mapsV2/mapDefaults';
import type { Point, Polygon } from 'geojson';
import type {
  ExtendedMapLibreMap,
  MapLibreRef,
} from '../../../common/types/map';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Map as MapGL, Marker, Source } from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import zoomToLocation from '../../../../utils/mapsV2/zoomToLocation';
import { ProjectLocationIcon } from '../../../../../public/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../theme/themeProperties';
import { zoomToPolygonIntervention } from '../../../../utils/mapsV2/zoomToPolygonIntervention';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../../utils/mapsV2/mapDefaults';

interface Props {
  geometry: Point | Polygon | undefined;
}

export default function RegisterTreeStaticMap({
  geometry,
}: Props): ReactElement {
  if (geometry === undefined) return <></>;

  const mapRef: MapLibreRef = useRef<ExtendedMapLibreMap | null>(null);
  const { colors } = themeProperties.designSystem;

  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [mapLoaded, setMapLoaded] = useState(false);

  const pointReady = mapLoaded && geometry?.type === 'Point';
  const polygonReady = mapLoaded && geometry?.type === 'Polygon';

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

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    if (pointReady) {
      const [longitude, latitude] = geometry.coordinates;

      zoomToLocation(
        handleViewStateChange,
        longitude,
        latitude,
        5,
        2400,
        mapRef
      );
    }

    if (polygonReady) {
      zoomToPolygonIntervention(
        geometry.coordinates[0],
        mapRef,
        handleViewStateChange,
        2400
      );
    }
  }, [geometry, mapLoaded]);

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
    <MapGL
      {...viewState}
      {...mapState}
      ref={mapRef}
      onLoad={() => setMapLoaded(true)}
      onMove={onMove}
      interactive={false}
      style={{ width: '100%', height: '100%' }}
    >
      {pointReady && (
        <Marker
          longitude={geometry.coordinates[0]}
          latitude={geometry.coordinates[1]}
          anchor="bottom"
        >
          <ProjectLocationIcon color={colors.primaryColor} />
        </Marker>
      )}
      {polygonReady && (
        <Source
          id="polygon-source"
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
          <Layer
            id="polygon-outline"
            type="line"
            paint={{
              'line-color': colors.primaryColor,
              'line-width': 1,
            }}
          />
        </Source>
      )}
    </MapGL>
  );
}
