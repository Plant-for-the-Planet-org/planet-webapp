import type { FeatureCollection } from 'geojson';

import React from 'react';
import { Layer, Source } from 'react-map-gl-v7/maplibre';
import themeProperties from '../../../../theme/themeProperties';
import { MAIN_MAP_LAYERS } from '../../../../utils/projectV2';

interface Props {
  geoJson: FeatureCollection;
  isSatelliteView: boolean;
}

export default function SiteLayers({
  geoJson,
  isSatelliteView,
}: Props): React.ReactElement {
  const { colors } = themeProperties.designSystem;

  return (
    <Source id="project-site" type="geojson" data={geoJson}>
      <Layer
        id={MAIN_MAP_LAYERS.SITE_POLYGON}
        type="fill"
        paint={{
          'fill-color': colors.white,
          'fill-opacity': 0.05,
        }}
      />
      <Layer
        id={MAIN_MAP_LAYERS.SITE_POLYGON_LINE}
        type="line"
        source="project-site"
        paint={{
          'line-color': isSatelliteView ? colors.white : colors.primaryColor,
          'line-width': 4,
        }}
        layout={{
          visibility: 'visible',
        }}
      />
    </Source>
  );
}
