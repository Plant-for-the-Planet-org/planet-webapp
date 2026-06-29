import type {
  ExploreLayersData,
  SingleExploreLayerConfig,
} from '../../features/common/types/map';

import { useEffect, useRef } from 'react';
import { mapSettingsConfig } from './mapSettings.config';
import { useProjectMapStore } from '../../stores';

export const useFetchLayers = () => {
  const exploreLayersData = useProjectMapStore(
    (state) => state.exploreLayersData
  );
  const setExploreLayersData = useProjectMapStore(
    (state) => state.setExploreLayersData
  );
  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    const fetchLayers = async () => {
      if (
        exploreLayersData !== null ||
        hasAttemptedFetch.current ||
        process.env.ENABLE_EXPLORE !== 'true'
      ) {
        return;
      }

      if (!process.env.LAYERS_API_ENDPOINT || !process.env.LAYERS_API_KEY) {
        console.error('Invalid environment setup for layers API');
        return;
      }

      hasAttemptedFetch.current = true;

      try {
        const response = await fetch(
          `${process.env.LAYERS_API_ENDPOINT}/layers`,
          {
            method: 'GET',
            headers: {
              'x-api-key': process.env.LAYERS_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const layers = (await response.json()) as SingleExploreLayerConfig[];

        if (!Array.isArray(layers) || layers.length === 0) {
          setExploreLayersData(null);
          return;
        }

        const availableLayers = new Set(
          layers.filter((layer) => layer.enabled).map((layer) => layer.key)
        );

        // Update isAvailable in mapSettingsConfig based on API response
        Object.entries(mapSettingsConfig).forEach(([key, section]) => {
          if (key === 'projects') {
            // projects is always available
            return;
          }

          if (Array.isArray(section)) {
            section.forEach((layer) => {
              layer.isAvailable = availableLayers.has(layer.key);
            });
          }
        });

        const layersData = layers.reduce((tempLayersData, layer) => {
          tempLayersData[layer.key] = layer;
          return tempLayersData;
        }, {} as ExploreLayersData);

        setExploreLayersData(layersData);
      } catch (error) {
        console.error('Error fetching layers:', error);
        setExploreLayersData(null);
      }
    };

    fetchLayers();
  }, [exploreLayersData]);
};
