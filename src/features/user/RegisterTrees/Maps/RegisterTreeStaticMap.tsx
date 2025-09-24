import type { ReactElement } from 'react';
import type { ViewState, ViewStateChangeEvent } from 'react-map-gl-v7/maplibre';
import type { MapState } from '../../../projectsV2/ProjectsMapContext';
import type {
  ExtendedMapLibreMap,
  MapRef,
} from '../../../common/types/projectv2';
import type { Point, Polygon } from 'geojson';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Map as MapGL, Marker, Source } from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../projectsV2/ProjectsMapContext';
import zoomToLocation from '../../../../utils/mapsV2/zoomToLocation';
import { ProjectLocationIcon } from '../../../../../public/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../theme/themeProperties';
import { zoomToPolygonIntervention } from '../../../../utils/mapsV2/zoomToPolygonIntervention';

interface Props {
  geoJson: Point | Polygon | undefined;
}

export default function RegisterTreeStaticMap({
  geoJson,
}: Props): ReactElement {
  if (geoJson === undefined) return <></>;

  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const { colors } = themeProperties.designSystem;
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [mapLoaded, setMapLoaded] = useState(false);

  const isPointGeometry = geoJson?.type === 'Point';
  const isPolygonGeometry = geoJson?.type === 'Polygon';

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
    return () => {
      // Should cleanup map resources
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef) return;
    if (isPointGeometry) {
      const longitude = geoJson.coordinates[0];
      const latitude = geoJson.coordinates[1];
      zoomToLocation(
        handleViewStateChange,
        longitude,
        latitude,
        5,
        2400,
        mapRef
      );
    }

    if (isPolygonGeometry) {
      zoomToPolygonIntervention(
        geoJson.coordinates[0],
        mapRef,
        handleViewStateChange,
        2400
      );
    }
  }, [geoJson, mapLoaded]);

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
      {isPointGeometry && mapLoaded && (
        <Marker
          longitude={geoJson.coordinates[0]}
          latitude={geoJson.coordinates[1]}
          anchor="bottom"
        >
          <ProjectLocationIcon color={colors.primaryColor} />
        </Marker>
      )}
      {isPolygonGeometry && mapLoaded && (
        <Source id="polygon-source" type="geojson" data={geoJson}>
          <Layer
            id="polygon-fill"
            type="fill"
            paint={{
              'fill-color': colors.warmGreen,
              'fill-opacity': 0.4,
            }}
          ></Layer>
        </Source>
      )}
    </MapGL>
  );
}
