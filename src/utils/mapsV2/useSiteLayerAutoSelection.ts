import { useEffect } from 'react';
import { useProjectsMap } from '../../features/projectsV2/ProjectsMapContext';
import { useProjects } from '../../features/projectsV2/ProjectsContext';
import { allSiteLayerOptions } from './siteLayerOptions';

/**
 * Hook that manages automatic site layer selection.
 * Should only be called ONCE in SingleProjectView.
 */
export const useSiteLayerAutoSelection = () => {
  const { siteLayersData, selectedSiteLayer, setSelectedSiteLayer } =
    useProjectsMap();
  const { selectedSiteId } = useProjects();

  useEffect(() => {
    // Handle automatic layer selection when site layers data changes
    if (!selectedSiteId) {
      // Clear selection if no site is selected
      if (selectedSiteLayer) {
        setSelectedSiteLayer(null);
      }
      return;
    }

    // Get site data - if not loaded yet, don't change selection
    const siteData = siteLayersData[selectedSiteId];
    if (siteData === undefined) {
      // Data hasn't been fetched yet, wait
      return;
    }

    // Get available layer options based on fetched site layers
    const fetchedLayerKeys = siteData.map((layer) => layer.key);
    const availableLayerOptions = allSiteLayerOptions.filter((option) =>
      fetchedLayerKeys.includes(option.id)
    );

    if (availableLayerOptions.length === 0) {
      // Site has no available layers, clear selection
      if (selectedSiteLayer) {
        setSelectedSiteLayer(null);
      }
      return;
    }

    // Check if current selection is still valid
    const isCurrentSelectionValid = Boolean(
      selectedSiteLayer &&
        availableLayerOptions.some(
          (option) => option.id === selectedSiteLayer.id
        )
    );

    // If no current selection or current selection is invalid, select the first available
    if (!selectedSiteLayer || !isCurrentSelectionValid) {
      setSelectedSiteLayer(availableLayerOptions[0]);
    }
  }, [selectedSiteId, siteLayersData, selectedSiteLayer, setSelectedSiteLayer]);
};
