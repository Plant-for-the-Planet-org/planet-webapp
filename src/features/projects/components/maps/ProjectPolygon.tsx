import React, { ReactElement } from 'react';
import { Layer, Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';

interface Props {
  id?: string | undefined;
  geoJson: Object | null;
}

export default function ProjectPolygon({ id, geoJson }: Props): ReactElement {
  const { selectedMode } = React.useContext(ProjectPropsContext);

  return (
    <>
      {selectedMode !== 'imagery' && (
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
      )}
    </>
  );
}
