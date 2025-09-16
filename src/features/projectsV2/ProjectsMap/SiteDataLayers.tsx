import type { ReactElement } from 'react';
import type { SiteLayerKey } from '../../../utils/mapsV2/siteLayerOptions';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { useProjectsMap } from '../ProjectsMapContext';
import { useProjects } from '../ProjectsContext';

const TILE_SIZE = 128;

interface SiteDataLayersProps {
  // Probably needs to be moved to context instead of props
  selectedSiteLayerKey: SiteLayerKey;
}

const SiteDataLayers = ({
  selectedSiteLayerKey,
}: SiteDataLayersProps): ReactElement | null => {
  const { siteLayersData } = useProjectsMap();
  const { selectedSiteId } = useProjects();

  if (Object.keys(siteLayersData).length === 0 || selectedSiteId === null) {
    return null;
  }

  const displayedLayerData = siteLayersData[selectedSiteId].find(
    (singleLayer) => singleLayer.key === selectedSiteLayerKey
  );

  if (!displayedLayerData) {
    return null;
  }

  const tiles = [displayedLayerData.tileUrl];

  return (
    <Source
      key={selectedSiteLayerKey}
      id={selectedSiteLayerKey}
      type="raster"
      tiles={tiles}
      tileSize={TILE_SIZE}
    >
      <Layer
        id={`${selectedSiteLayerKey}-layer`}
        source={selectedSiteLayerKey}
        type="raster"
      />
    </Source>
  );
};
export default SiteDataLayers;
