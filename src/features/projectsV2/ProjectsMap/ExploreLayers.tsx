import type { ReactElement } from 'react';
import type {
  MapOptions,
  SingleExploreLayerConfig,
} from '../ProjectsMapContext';
import type { MapLayerOptionsType } from '../../../utils/mapsV2/mapSettings.config';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { useProjectsMap } from '../ProjectsMapContext';

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
  const { exploreLayersData, mapOptions } = useProjectsMap();
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
