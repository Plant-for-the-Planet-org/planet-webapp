import type { ReactElement } from 'react';
import type { MapOptions } from '../ProjectsMapContext';
import type { MapLayerOptionsType } from '../../../utils/mapsV2/mapSettings.config';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { useProjectsMap } from '../ProjectsMapContext';

const getSelectedLayerKeys = (
  mapOptions: MapOptions
): MapLayerOptionsType[] => {
  const selectedLayers: MapLayerOptionsType[] = [];
  Object.entries(mapOptions).forEach(([key, value]) => {
    if (key !== 'projects' && value === true) {
      selectedLayers.push(key as MapLayerOptionsType);
    }
  });
  return selectedLayers;
};

export default function ExploreLayers(): ReactElement | null {
  const { exploreLayersData, mapOptions } = useProjectsMap();
  if (!exploreLayersData) return null;

  const selectedLayers = getSelectedLayerKeys(mapOptions);
  if (selectedLayers.length === 0) return null;

  return (
    <>
      {selectedLayers.map((layerKey) => {
        const layerData = exploreLayersData[layerKey];

        if (!layerData || !layerData.tileUrl) {
          return null;
        }

        const tiles = [
          layerData.tileUrl.replace(
            'https://storage.googleapis.com/planet-layers',
            'https://layers-t.plant-for-the-planet.org'
          ),
        ];

        return (
          <Source
            key={layerKey}
            id={layerKey}
            type="raster"
            tiles={tiles}
            tileSize={128}
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
