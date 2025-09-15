import type { Polygon } from 'geojson';
import type {
  ExtendedMapLibreMap,
  MapRef,
} from '../../../../common/types/projectv2';

import MapGL, { Source, Layer } from 'react-map-gl-v7/maplibre';
import themeProperties from '../../../../../theme/themeProperties';
import { useRef } from 'react';
import { bbox } from '@turf/turf';

interface StaticMapProps {
  tiles: string[];
  siteId: string;
  siteGeometry: Polygon;
}
const { colors } = themeProperties.designSystem;

const StaticMap = ({ tiles, siteId, siteGeometry }: StaticMapProps) => {
  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);

  return (
    <MapGL
      ref={mapRef}
      style={{ height: 200, width: 320 }}
      interactive={false}
      attributionControl={false}
      onLoad={() => {
        if (!mapRef.current) return;
        const bounds = bbox(siteGeometry);
        mapRef.current.fitBounds(
          [
            [bounds[0], bounds[1]], // SW
            [bounds[2], bounds[3]], // NE
          ],
          { padding: 30, animate: false }
        );
      }}
    >
      <Source id="satellite_source" type="raster" tiles={tiles} tileSize={128}>
        <Layer type="raster" id="satellite_layer" />
      </Source>
      <Source id={`geojson-${siteId}`} type="geojson" data={siteGeometry}>
        <Layer
          id={`fill-${siteId}`}
          type="fill"
          source={`geojson-${siteId}`}
          paint={{
            'fill-color': colors.white,
            'fill-opacity': 0.2,
          }}
        />
        <Layer
          id={`line-${siteId}`}
          type="line"
          source={`geojson-${siteId}`}
          paint={{
            'line-color': colors.warmGreen,
            'line-width': 2,
          }}
        />
      </Source>
    </MapGL>
  );
};

export default StaticMap;
