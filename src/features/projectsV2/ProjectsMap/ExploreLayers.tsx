import type { ReactElement } from 'react';
import type { MapOptions } from '../ProjectsMapContext';
import type { MapLayerOptionsType } from '../../../utils/mapsV2/mapSettings.config';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { useProjectsMap } from '../ProjectsMapContext';

const getEnabledLayers = (mapOptions: MapOptions): MapLayerOptionsType[] => {
  const enabledLayers: MapLayerOptionsType[] = [];
  Object.entries(mapOptions).forEach(([key, value]) => {
    if (key !== 'projects' && value === true) {
      enabledLayers.push(key as MapLayerOptionsType);
    }
  });
  return enabledLayers;
};

export default function ExploreLayers(): ReactElement | null {
  const { exploreLayersData, mapOptions } = useProjectsMap();
  if (!exploreLayersData) return null;

  const enabledLayers = getEnabledLayers(mapOptions);
  if (enabledLayers.length === 0) return null;

  return (
    <>
      {enabledLayers.map((layerKey) => {
        const layerData = exploreLayersData[layerKey];

        if (!layerData || !layerData.tileUrl) {
          return null;
        }

        const tiles = [layerData.tileUrl];

        return (
          <Source
            key={layerKey}
            id={layerKey}
            type="raster"
            tiles={tiles}
            tileSize={128}
          >
            <Layer id={`${layerKey}-layer`} source={layerKey} type="raster" />
          </Source>
        );
      })}
    </>
  );
}
