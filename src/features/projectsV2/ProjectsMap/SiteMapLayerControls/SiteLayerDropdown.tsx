import styles from './SiteMapLayerControls.module.scss';
import TreeCoverIcon from '../../../../../public/assets/images/icons/projectV2/TreeCoverIcon';
import BiomassChangeIcon from '../../../../../public/assets/images/icons/projectV2/BiomassChangeIcon';
import DropdownDownArrow from '../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import { useState } from 'react';
import SiteLayerOptions from './SiteLayerOptions';

const layerOptions = [
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
  const [selectedLayer, _setSelectedLayer] = useState(layerOptions[0]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {isOpen && <SiteLayerOptions />}
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
    </>
  );
};
export default SiteLayerDropdown;
