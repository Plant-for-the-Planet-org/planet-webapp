import type { LayerOption } from './SiteLayerOptions';

import { useState, useRef, useEffect } from 'react';
import DropdownDownArrow from '../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import SiteLayerOptions, { availableLayerOptions } from './SiteLayerOptions';
import styles from './SiteMapLayerControls.module.scss';
import { clsx } from 'clsx';

interface SiteLayerDropdownProps {
  selectedLayer: LayerOption;
  setSelectedLayer: (layer: LayerOption) => void;
}

const SiteLayerDropdown = ({
  selectedLayer,
  setSelectedLayer,
}: SiteLayerDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
        <p className={styles.dropdownButtonText}>
          {selectedLayer.label}
          <span className={styles.timePeriodTextMobile}>
            (Since project begin 2018)
          </span>
        </p>
        <div
          className={clsx(styles.dropdownButtonArrow, {
            [styles.arrowRotated]: isOpen,
          })}
        >
          <DropdownDownArrow width={10} />
        </div>
      </div>
      {isOpen && (
        <div className={styles.optionsWrapper}>
          <SiteLayerOptions
            layerOptions={availableLayerOptions}
            selectedLayer={selectedLayer}
            handleLayerSelection={handleLayerSelection}
          />
        </div>
      )}
    </div>
  );
};

export default SiteLayerDropdown;
