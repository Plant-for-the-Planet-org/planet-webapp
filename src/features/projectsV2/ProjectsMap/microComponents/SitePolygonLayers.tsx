import type { ReactElement } from 'react';
import type { SitesGeoJSON } from '../../../common/types/ProjectPropsContextInterface';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import themeProperties from '../../../../theme/themeProperties';
import { MAIN_MAP_LAYERS } from '../../../../utils/projectV2';

interface Props {
  geoJson: SitesGeoJSON;
  isSatelliteBackground: boolean;
}

export default function SitePolygonLayers({
  geoJson,
  isSatelliteBackground,
}: Props): ReactElement {
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
          'line-color': isSatelliteBackground
            ? colors.white
            : colors.primaryColor,
          'line-width': 4,
        }}
        layout={{
          visibility: 'visible',
        }}
      />
    </Source>
  );
}
