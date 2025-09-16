import type { SitesGeoJSON } from '../../../../common/types/ProjectPropsContextInterface';

import { Source, Layer } from 'react-map-gl-v7/maplibre';
import themeProperties from '../../../../../theme/themeProperties';

interface SiteLayerProps {
  satellite: boolean;
  geoJson: SitesGeoJSON | null;
}

const ProjectSiteLayer = ({ satellite, geoJson }: SiteLayerProps) => {
  const { colors } = themeProperties.designSystem;
  return (
    <Source id="project-site-source" type="geojson" data={geoJson}>
      {!satellite && (
        <Layer
          id="project-site-fill"
          type="fill"
          source="project-site-source"
          paint={{
            'fill-color': colors.warmGreen,
            'fill-opacity': 0.2,
          }}
        />
      )}
      <Layer
        id="project-site-outline"
        type="line"
        source="project-site-source"
        paint={{
          'line-color': colors.white,
          'line-width': 2,
        }}
        layout={{
          visibility: satellite ? 'visible' : 'none',
        }}
      />
    </Source>
  );
};

export default ProjectSiteLayer;
