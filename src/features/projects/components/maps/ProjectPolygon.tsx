import React, { ReactElement } from 'react';
import { Layer, Source } from 'react-map-gl';

interface Props {
  id: string | undefined;
  geoJson: Object | null;
}

export default function ProjectPolygon({ id, geoJson }: Props): ReactElement {
  return (
    <>
      <Source id={id ? id : 'singleProject'} type="geojson" data={geoJson}>
        <Layer
          id={id ? id : 'polygonOutline'}
          type="line"
          source={id ? id : 'singleProject'}
          paint={{
            'line-color': '#fff',
            'line-width': 4,
          }}
        />
      </Source>
    </>
  );
}
