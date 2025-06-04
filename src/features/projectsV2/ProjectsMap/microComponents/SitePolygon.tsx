import type { FeatureCollection } from 'geojson';

import React from 'react';
import { Layer, Source } from 'react-map-gl-v7/maplibre';

interface Props {
  geoJson: FeatureCollection;
  isSatelliteBackground: boolean;
}

export default function SitePolygon({
  geoJson,
  isSatelliteBackground,
}: Props): React.ReactElement {
  return (
    <Source id="project-site" type="geojson" data={geoJson}>
      <Layer
        id="site-polygon-layer"
        type="line"
        source="project-site"
        paint={{
          'line-color': isSatelliteBackground ? '#fff' : '#007A49',
          'line-width': 4,
        }}
        layout={{
          visibility: 'visible',
        }}
      />
    </Source>
  );
}
