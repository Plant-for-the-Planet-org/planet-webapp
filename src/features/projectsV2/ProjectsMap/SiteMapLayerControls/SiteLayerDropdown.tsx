import type { LayerOption } from './SiteLayerOptions';

import { useState, useRef, useEffect } from 'react';
import TreeCoverIcon from '../../../../../public/assets/images/icons/projectV2/TreeCoverIcon';
import BiomassChangeIcon from '../../../../../public/assets/images/icons/projectV2/BiomassChangeIcon';
import DropdownDownArrow from '../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import SiteLayerOptions from './SiteLayerOptions';
import styles from './SiteMapLayerControls.module.scss';

const layerOptions: LayerOption[] = [
  {
    id: 'biomass',
    label: 'Biomass Change',
    icon: <BiomassChangeIcon />,
  },
  {
    id: 'tree-cover',
    label: 'Tree Cover Change',
    icon: <TreeCoverIcon />,
  },
];

const SiteLayerDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<LayerOption>(
    layerOptions[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLayerSelection = (newLayer: LayerOption) => {
    setSelectedLayer(newLayer);
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

  return (
    <div className={styles.siteLayerDropdown} ref={dropdownRef}>
      <div className={styles.dropdownButton} onClick={toggleDropdown}>
        <div className={styles.dropdownButtonIcon}>{selectedLayer.icon}</div>
        <p className={styles.dropdownButtonText}>{selectedLayer.label}</p>
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
            layerOptions={layerOptions}
            selectedLayer={selectedLayer}
            handleLayerSelection={handleLayerSelection}
          />
        </div>
      )}
    </div>
  );
};

export default SiteLayerDropdown;
