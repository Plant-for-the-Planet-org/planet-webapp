import type { ReactElement } from 'react';
import type { GeoJSONSource } from 'maplibre-gl';
import type { ProjectSiteFeatureCollection } from '../../../common/types/map';
import type { E2EBounds } from '../../../../utils/e2eHooks';

import { useEffect } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import bbox from '@turf/bbox';
import themeProperties from '../../../../theme/themeProperties';
import { MAIN_MAP_LAYERS } from '../../../../utils/projectV2';
import { areE2EHooksEnabled, setE2EHooks } from '../../../../utils/e2eHooks';

interface Props {
  geoJson: ProjectSiteFeatureCollection;
  isSatelliteView: boolean;
}

const PROJECT_SITE_SOURCE = 'project-site';

export default function SiteLayers({
  geoJson,
  isSatelliteView,
}: Props): ReactElement {
  const { colors } = themeProperties.designSystem;
  const { current: mapInstance } = useMap();

  // Sites are drawn on a canvas, so E2E tests read them from the map's own source data instead of the page.
  useEffect(() => {
    const map = mapInstance?.getMap();
    if (!map || !areE2EHooksEnabled()) return;
    return setE2EHooks({
      getProjectSites: async () => {
        const source = map.getSource<GeoJSONSource>(PROJECT_SITE_SOURCE);
        if (!source) return null;
        const data = (await source.getData()) as ProjectSiteFeatureCollection;
        return data.features.map((feature) => ({
          id: String(feature.properties.id),
          bounds: bbox(feature) as E2EBounds,
        }));
      },
    });
  }, [mapInstance]);

  return (
    <Source id={PROJECT_SITE_SOURCE} type="geojson" data={geoJson}>
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
        source={PROJECT_SITE_SOURCE}
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
