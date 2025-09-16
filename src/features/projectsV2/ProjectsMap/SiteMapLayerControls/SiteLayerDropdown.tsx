import type { SiteLayerOption } from '../../../../utils/mapsV2/siteLayerOptions';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useProjectsMap } from '../../ProjectsMapContext';
import { useProjects } from '../../ProjectsContext';
import { allSiteLayerOptions } from '../../../../utils/mapsV2/siteLayerOptions';
import DropdownDownArrow from '../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import SiteLayerOptions from './SiteLayerOptions';
import styles from './SiteMapLayerControls.module.scss';
import { useTranslations } from 'next-intl';
import { getProjectStartingYear } from '../../../../utils/projectV2';

const SiteLayerDropdown = () => {
  const tSiteLayers = useTranslations('Maps.siteLayers');
  const { selectedSiteLayer, setSelectedSiteLayer, siteLayersData } =
    useProjectsMap();
  const { selectedSiteId, singleProject } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableLayerOptions = useMemo(() => {
    if (!selectedSiteId || !siteLayersData[selectedSiteId]) {
      return [];
    }
    const fetchedLayerKeys = siteLayersData[selectedSiteId].map(
      (layer) => layer.key
    );
    return allSiteLayerOptions.filter((option) =>
      fetchedLayerKeys.includes(option.id)
    );
  }, [selectedSiteId, siteLayersData]);

  const isDropdownDisabled = availableLayerOptions.length <= 1;

  // Don't render if no layer is selected
  if (!selectedSiteLayer || !availableLayerOptions.length || !singleProject) {
    return null;
  }

  const toggleDropdown = () => {
    if (isDropdownDisabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleLayerSelection = (newLayer: SiteLayerOption) => {
    setSelectedSiteLayer(newLayer);
    toggleDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const startingYear = getProjectStartingYear(singleProject);

  return (
    <div className={styles.siteLayerDropdown} ref={dropdownRef}>
      <div
        className={`${styles.dropdownButton} ${
          isDropdownDisabled ? styles.disabled : ''
        }`}
        onClick={toggleDropdown}
      >
        <div className={styles.dropdownButtonIcon}>
          {selectedSiteLayer.icon}
        </div>
        <p className={styles.dropdownButtonText}>
          {tSiteLayers(`labels.${selectedSiteLayer.label}`)}
          <span className={styles.timePeriodTextMobile}>
            {tSiteLayers('projectStart', { startingYear })}
          </span>
        </p>
        <div
          className={`${styles.dropdownButtonArrow} ${
            isOpen ? styles.arrowRotated : ''
          }`}
        >
          <DropdownDownArrow width={10} />
        </div>
      </div>

      {isOpen && (
        <div className={styles.optionsWrapper}>
          <SiteLayerOptions
            layerOptions={availableLayerOptions}
            selectedLayer={selectedSiteLayer}
            handleLayerSelection={handleLayerSelection}
          />
        </div>
      )}
    </div>
  );
};

export default SiteLayerDropdown;
