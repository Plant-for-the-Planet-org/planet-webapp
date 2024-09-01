import React, { ReactElement, useMemo } from 'react';
import { Layer, Source } from 'react-map-gl-v7';
import { FeatureCollection } from 'geojson';

interface Props {
  id?: string | undefined;
  geoJson: FeatureCollection;
  isSatelliteView: boolean;
}

export default function SitePolygon({
  id,
  geoJson,
  isSatelliteView,
}: Props): ReactElement {
  const paint = useMemo(
    () => ({
      'line-color': isSatelliteView ? '#ffffff' : '#007A49',
      'line-width': 4,
    }),
    [isSatelliteView]
  );
  return (
    <Source id={id ?? 'singleProject'} type="geojson" data={geoJson}>
      <Layer
        id={id ?? 'polygonOutline'}
        type="line"
        source={id ?? 'singleProject'}
        paint={paint}
        layout={{
          visibility: 'visible',
        }}
      />
    </Source>
  );
}
