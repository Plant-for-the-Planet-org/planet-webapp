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
      isFeaturePending: false,
    },
    {
      icon: <TreeCoverIcon />,
      title: t('treeCover'),
      isFeaturePending: false,
    },
    {
      icon: <PotentialBiomassIcon />,
      title: t('potentialBiomass'),
      isFeaturePending: true,
    },
    {
      icon: <FireIcon />,
      title: t('fireRisk'),
      isFeaturePending: true,
    },
    {
      icon: <FloodingRiskIcon />,
      title: t('floodingRisk'),
      isFeaturePending: true,
    },
    {
      icon: <SpeciesDensityIcon />,
      title: t('speciesDensity'),
      isFeaturePending: true,
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
                <div className={styles.optionLabel}>
                  <p>{option.title}</p>
                  {option.isFeaturePending && <span>{t('comingSoon')}</span>}
                </div>
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
