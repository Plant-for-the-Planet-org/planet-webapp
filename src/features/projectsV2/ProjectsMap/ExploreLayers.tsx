import type { ReactElement } from 'react';
import type {
  MapOptions,
  SingleExploreLayerConfig,
} from '../../common/types/map';
import type { MapLayerOptionsType } from '../../../utils/mapsV2/mapSettings.config';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { useProjectMapStore } from '../../../stores/projectMapStore';

const TILE_SIZE = 128;

const getSelectedLayerKeys = (
  mapOptions: MapOptions
): MapLayerOptionsType[] => {
  return Object.entries(mapOptions)
    .filter(([key, value]) => key !== 'projects' && value === true)
    .map(([key]) => key as MapLayerOptionsType);
};

type ValidLayer = {
  layerKey: MapLayerOptionsType;
  layerData: SingleExploreLayerConfig;
};

export default function ExploreLayers(): ReactElement | null {
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const exploreLayersData = useProjectMapStore(
    (state) => state.exploreLayersData
  );
  if (!exploreLayersData) return null;

  const selectedLayers = getSelectedLayerKeys(mapOptions);
  if (selectedLayers.length === 0) return null;

  const validLayers = selectedLayers.reduce<ValidLayer[]>((acc, layerKey) => {
    const layerData = exploreLayersData[layerKey];
    if (layerData?.tileUrl) {
      acc.push({ layerKey, layerData });
    }
    return acc;
  }, []);

  return (
    <>
      {validLayers.map(({ layerKey, layerData }) => {
        const tiles = [layerData.tileUrl];

        return (
          <Source
            key={layerKey}
            id={layerKey}
            type="raster"
            tiles={tiles}
            tileSize={TILE_SIZE}
            minzoom={layerData.zoomConfig.minZoom}
            maxzoom={layerData.zoomConfig.maxZoom}
          >
            <Layer id={`${layerKey}-layer`} source={layerKey} type="raster" />
          </Source>
        );
      })}
    </>
  );
}
