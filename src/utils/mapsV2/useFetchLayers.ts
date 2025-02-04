import type { ExploreLayersData } from '../../features/projectsV2/ProjectsMapContext';
import type { MapLayerOptionsType } from './mapSettings.config';

import { useEffect, useRef } from 'react';
import { useProjectsMap } from '../../features/projectsV2/ProjectsMapContext';

// Get the type of a single layer from ExploreLayersData
type APILayer = ExploreLayersData[MapLayerOptionsType];

export const useFetchLayers = () => {
  const { exploreLayersData, setExploreLayersData } = useProjectsMap();
  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    const fetchLayers = async () => {
      if (exploreLayersData !== null || hasAttemptedFetch.current) {
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

        const layers = (await response.json()) as APILayer[];

        if (!Array.isArray(layers) || layers.length === 0) {
          setExploreLayersData(null);
          return;
        }

        const layersData = layers.reduce((tempLayersData, layer) => {
          const key = layer.name
            .toLowerCase()
            .replace(/\s+/g, '_') as MapLayerOptionsType;
          tempLayersData[key] = layer;
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
