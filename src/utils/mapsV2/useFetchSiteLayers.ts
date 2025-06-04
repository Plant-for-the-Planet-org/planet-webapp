import type { SingleSiteLayerConfig } from '../../features/projectsV2/ProjectsMapContext';

import { useEffect, useMemo } from 'react';
import { useProjectsMap } from '../../features/projectsV2/ProjectsMapContext';
import { useProjects } from '../../features/projectsV2/ProjectsContext';

type SiteApiResponse = {
  externalId: string;
  externalSource: string;
  siteUuid: string;
  siteName: string;
  layers: SingleSiteLayerConfig[];
};

export const useFetchSiteLayers = () => {
  const { siteLayersData, setSiteLayersData } = useProjectsMap();
  const { singleProject, selectedSite } = useProjects();

  const selectedSiteId = useMemo(() => {
    if (
      selectedSite === null ||
      singleProject === null ||
      singleProject.sites === null ||
      selectedSite >= singleProject.sites.length //bounds check
    )
      return null;
    return singleProject.sites[selectedSite].properties.id;
  }, [singleProject, selectedSite]);

  useEffect(() => {
    const fetchSiteLayers = async () => {
      if (!process.env.LAYERS_API_ENDPOINT || !process.env.LAYERS_API_KEY) {
        console.error('Invalid environment setup for layers API');
        return;
      }

      if (process.env.ENABLE_EXPLORE !== 'true' || selectedSiteId === null) {
        return;
      }

      if (siteLayersData[selectedSiteId]) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.LAYERS_API_ENDPOINT}/sites/external/${selectedSiteId}/layers?source=planet`,
          {
            method: 'GET',
            headers: {
              'x-api-key': process.env.LAYERS_API_KEY,
              accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJson = (await response.json()) as SiteApiResponse;

        if (!responseJson.layers || !Array.isArray(responseJson.layers)) {
          console.warn(`Invalid layers data for site ${selectedSiteId}`);
          setSiteLayersData((prevData) => ({
            ...prevData,
            [selectedSiteId]: [],
          }));
          return;
        }

        setSiteLayersData((prevData) => ({
          ...prevData,
          [selectedSiteId]: responseJson.layers,
        }));
      } catch (error) {
        console.error('Error fetching site layers:', error);
        setSiteLayersData((prevData) => ({
          ...prevData,
          [selectedSiteId]: [],
        }));
      }
    };

    fetchSiteLayers();
  }, [selectedSiteId]);
};
