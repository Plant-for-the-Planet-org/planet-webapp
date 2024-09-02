import React, { ReactElement } from 'react';
import { Layer, Source } from 'react-map-gl-v7';
import { FeatureCollection } from 'geojson';

interface Props {
  geoJson: FeatureCollection;
  isSatelliteView: boolean;
}

export default function SitePolygon({
  geoJson,
  isSatelliteView,
}: Props): ReactElement {
  return (
    <Source id="project-site" type="geojson" data={geoJson}>
      <Layer
        id="site-layer"
        type="line"
        source="project-site"
        paint={{
          'line-color': isSatelliteView ? '#fff' : '#007A49',
          'line-width': 4,
        }}
        layout={{
          visibility: 'visible',
        }}
      />
    </Source>
  );
}
