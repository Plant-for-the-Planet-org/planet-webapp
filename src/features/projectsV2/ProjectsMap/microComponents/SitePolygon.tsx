import React, { ReactElement } from 'react';
import { Layer, Source } from 'react-map-gl-v7';
import { FeatureCollection } from 'geojson';

interface Props {
  id?: string | undefined;
  geoJson: FeatureCollection;
}

export default function SitePolygon({ id, geoJson }: Props): ReactElement {
  return (
    <Source id={id ? id : 'singleProject'} type="geojson" data={geoJson}>
      <Layer
        id={id ? id : 'polygonOutline'}
        type="line"
        source={id ? id : 'singleProject'}
        paint={{
          'line-color': '#ffffff',
          'line-width': 4,
        }}
        layout={{
          visibility: 'visible',
        }}
      />
    </Source>
  );
}
