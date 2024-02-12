import React, { useState } from 'react';
import BiomassChangeIcon from '../icons/BiomassChangeIcon';
import PotentialBiomassIcon from '../icons/PotentialBiomassIcon';
import TreeCoverIcon from '../icons/TreeCoverIcon';
import FireIcon from '../icons/FireIcon';
import styles from './VegetationChangeDatabox.module.scss';
import SpeciesDensityIcon from '../icons/SpeciesDensityIcon';
import FloodingRiskIcon from '../icons/FloodingRiskIcon';
import DropdownArrow from '../icons/DropdownArrow';
import { useTranslation } from 'next-i18next';

interface Props {
  labelIcon: React.JSX.Element;
  labelTitle: string;
  isOpen: boolean;
}

const Dropdown = ({ labelIcon, labelTitle, isOpen }: Props) => {
  const { t } = useTranslation('projectDetails');
  const optionsList = [
    {
      icon: <BiomassChangeIcon />,
      title: t('biomassChange'),
    },
    {
      icon: <PotentialBiomassIcon />,
      title: t('potentialBiomass'),
    },
    {
      icon: <TreeCoverIcon />,
      title: t('treeCover'),
    },
    {
      icon: <FireIcon />,
      title: t('fireRisk'),
    },
    {
      icon: <FloodingRiskIcon />,
      title: t('floodingRisk'),
    },
    {
      icon: <SpeciesDensityIcon />,
      title: t('speciesDensity'),
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
                <div className={styles.optionIcon}>{option.icon}</div>
                <p>{option.title}</p>
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
