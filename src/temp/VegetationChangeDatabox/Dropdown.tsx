import React, { useState } from 'react';
import BiomassChangeIcon from '../icons/BiomassChangeIcon';
import PotentialBiomassIcon from '../icons/PotentialBiomassIcon';
import TreeCoverIcon from '../icons/TreeCoverIcon';
import FireIcon from '../icons/FireIcon';
import styles from './VegetationChangeDatabox.module.scss';
import SpeciesDensityIcon from '../icons/SpeciesDensityIcon';
import FloodingRiskIcon from '../icons/FloodingRiskIcon';
import DropdownArrow from '../icons/DropdownArrow';

interface Props {
  labelIcon: React.JSX.Element;
  labelTitle: string;
  isOpen: boolean;
}

const Dropdown = ({ labelIcon, labelTitle, isOpen }: Props) => {
  const optionsList = [
    {
      icon: <BiomassChangeIcon />,
      title: 'Biomass Change',
    },
    {
      icon: <PotentialBiomassIcon />,
      title: 'Potential Biomass',
    },
    {
      icon: <TreeCoverIcon />,
      title: 'Tree Cover',
    },
    {
      icon: <FireIcon />,
      title: 'Fire Risk',
    },
    {
      icon: <FloodingRiskIcon />,
      title: 'Flooding Risk',
    },
    {
      icon: <SpeciesDensityIcon />,
      title: 'Species Density',
    },
  ];
  const [selectedOption, setSelectedOption] = useState({
    icon: labelIcon,
    title: labelTitle,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);

  return (
    <>
      {isMenuOpen && (
        <div className={styles.itemsContainer}>
          <ul>
            {optionsList?.map((option, index) => (
              <li
                key={index}
                onClick={() => setSelectedOption(option)}
                className={`${styles.menuItem} ${
                  option.title === selectedOption.title ? styles.selected : ''
                }`}
              >
                {option.icon} {option.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={styles.label}>
          {selectedOption.icon}
          <p>{selectedOption.title}</p>
        </div>
        <div className={styles.dropdownIcon}>
          <DropdownArrow />
        </div>
      </div>
    </>
  );
};

export default Dropdown;
