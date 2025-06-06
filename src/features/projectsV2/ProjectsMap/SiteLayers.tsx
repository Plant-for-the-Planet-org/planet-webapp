import type { ReactElement } from 'react';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { useProjectsMap } from '../ProjectsMapContext';
import { useProjects } from '../ProjectsContext';

const TILE_SIZE = 128;

interface SiteLayersProps {
  // Probably needs to be moved to context instead of props
  selectedSiteLayer: 'biomass';
}

const SiteLayers = ({
  selectedSiteLayer,
}: SiteLayersProps): ReactElement | null => {
  const { siteLayersData } = useProjectsMap();
  const { selectedSiteId } = useProjects();

  if (Object.keys(siteLayersData).length === 0 || selectedSiteId === null) {
    return null;
  }

  const displayedLayerData = siteLayersData[selectedSiteId].find(
    (singleLayer) => singleLayer.key === selectedSiteLayer
  );

  if (!displayedLayerData) {
    return null;
  }

  const tiles = [displayedLayerData.tileUrl];

  return (
    <Source
      key={selectedSiteLayer}
      id={selectedSiteLayer}
      type="raster"
      tiles={tiles}
      tileSize={TILE_SIZE}
    >
      <Layer
        id={`${selectedSiteLayer}-layer`}
        source={selectedSiteLayer}
        type="raster"
      />
    </Source>
  );
};
export default SiteLayers;
