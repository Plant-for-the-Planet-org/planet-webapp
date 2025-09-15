import type { Polygon } from 'geojson';

import Map, { Source, Layer } from 'react-map-gl-v7/maplibre';
import themeProperties from '../../../../../theme/themeProperties';

interface StaticMapProps {
  zoom: number;
  latitude: number;
  longitude: number;
  tiles: string[];
  siteId: string;
  siteGeometry: Polygon;
}

const StaticMap = ({
  zoom,
  latitude,
  longitude,
  tiles,
  siteId,
  siteGeometry,
}: StaticMapProps) => {
  const { colors } = themeProperties.designSystem;
  return (
    <Map
      style={{ height: 200, width: 320 }}
      zoom={zoom}
      interactive={false}
      attributionControl={false}
      latitude={latitude}
      longitude={longitude}
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
    </Map>
  );
};

export default StaticMap;
