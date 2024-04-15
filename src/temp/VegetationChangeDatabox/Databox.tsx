import React, { useState } from 'react';
import styles from './VegetationChangeDatabox.module.scss';
import BiomassChangeIcon from '../icons/BiomassChangeIcon';
import VegetationSlider from './VegetationSlider';
import NewInfoIcon from '../icons/NewInfoIcon';
import { useTranslation } from 'next-i18next';
import CloseIcon from '../icons/CloseIcon';
import PotentialBiomassIcon from '../icons/PotentialBiomassIcon';
import TreeCoverIcon from '../icons/TreeCoverIcon';
import FireIcon from '../icons/FireIcon';
import SpeciesDensityIcon from '../icons/SpeciesDensityIcon';
import FloodingRiskIcon from '../icons/FloodingRiskIcon';
import DropdownDownArrow from '../icons/DropdownDownArrow';
import DropdownUpArrow from '../icons/DropdownUpArrow';

interface DataboxProps {
  startYear: number;
}
interface PopupContent {
  [key: string]: { heading: string; content: string }[];
}

const Databox = ({ startYear }: DataboxProps) => {
  const { t } = useTranslation('projectDetails');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    icon: <BiomassChangeIcon />,
    title: t('biomassChange'),
    name: `biomassChange`,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const PopupContent: PopupContent = {
    biomassChange: [
      {
        heading: ``,
        content: `Areas where biomass has increased since the project begin appear in green. Areas where it has decreased substantially appear in red. No change appears white and mild decreases in grey.`,
      },
      {
        heading: `Why the grey?`,
        content: `This is because restoration projects routinely experience a small decrease in biomass at the beginning of the restoration work. This is not necessarily a bad thing.`,
      },
      {
        heading: ``,
        content: `For instance, when converting a degraded cattle ranch back to forest, a project might initially have to cut tall grass in order to plant small tree seedlings. It will take a few years before the biomass of the young trees exceeds the biomass of the removed grass.`,
      },
      {
        heading: `Source`,
        content: `The change is biomass is calculated by a Plant-for-the-Planet analysis model based on satellite data.`,
      },
    ],
    treeCover: [
      {
        heading: ``,
        content: `Areas where biomass has increased since the project begin appear in green. Areas where it has decreased substantially appear in red. No change appears white and mild decreases in grey.`,
      },
      {
        heading: `Why the grey?`,
        content: `This is because restoration projects routinely experience a small decrease in biomass at the beginning of the restoration work. This is not necessarily a bad thing.`,
      },
      {
        heading: ``,
        content: `For instance, when converting a degraded cattle ranch back to forest, a project might initially have to cut tall grass in order to plant small tree seedlings. It will take a few years before the biomass of the young trees exceeds the biomass of the removed grass.`,
      },
      {
        heading: `Source`,
        content: `The change is biomass is calculated by a Plant-for-the-Planet analysis model based on satellite data.`,
      },
    ],
    potentialBiomass: [
      {
        heading: ``,
        content: `Areas where biomass has increased since the project begin appear in green. Areas where it has decreased substantially appear in red. No change appears white and mild decreases in grey.`,
      },
      {
        heading: `Why the grey?`,
        content: `This is because restoration projects routinely experience a small decrease in biomass at the beginning of the restoration work. This is not necessarily a bad thing.`,
      },
      {
        heading: ``,
        content: `For instance, when converting a degraded cattle ranch back to forest, a project might initially have to cut tall grass in order to plant small tree seedlings. It will take a few years before the biomass of the young trees exceeds the biomass of the removed grass.`,
      },
      {
        heading: `Source`,
        content: `The change is biomass is calculated by a Plant-for-the-Planet analysis model based on satellite data.`,
      },
    ],
    fireRisk: [
      {
        heading: ``,
        content: `Areas where biomass has increased since the project begin appear in green. Areas where it has decreased substantially appear in red. No change appears white and mild decreases in grey.`,
      },
      {
        heading: `Why the grey?`,
        content: `This is because restoration projects routinely experience a small decrease in biomass at the beginning of the restoration work. This is not necessarily a bad thing.`,
      },
      {
        heading: ``,
        content: `For instance, when converting a degraded cattle ranch back to forest, a project might initially have to cut tall grass in order to plant small tree seedlings. It will take a few years before the biomass of the young trees exceeds the biomass of the removed grass.`,
      },
      {
        heading: `Source`,
        content: `The change is biomass is calculated by a Plant-for-the-Planet analysis model based on satellite data.`,
      },
    ],
    floodingRisk: [
      {
        heading: ``,
        content: `Areas where biomass has increased since the project begin appear in green. Areas where it has decreased substantially appear in red. No change appears white and mild decreases in grey.`,
      },
      {
        heading: `Why the grey?`,
        content: `This is because restoration projects routinely experience a small decrease in biomass at the beginning of the restoration work. This is not necessarily a bad thing.`,
      },
      {
        heading: ``,
        content: `For instance, when converting a degraded cattle ranch back to forest, a project might initially have to cut tall grass in order to plant small tree seedlings. It will take a few years before the biomass of the young trees exceeds the biomass of the removed grass.`,
      },
      {
        heading: `Source`,
        content: `The change is biomass is calculated by a Plant-for-the-Planet analysis model based on satellite data.`,
      },
    ],
    speciesDensity: [
      {
        heading: ``,
        content: `Areas where biomass has increased since the project begin appear in green. Areas where it has decreased substantially appear in red. No change appears white and mild decreases in grey.`,
      },
      {
        heading: `Why the grey?`,
        content: `This is because restoration projects routinely experience a small decrease in biomass at the beginning of the restoration work. This is not necessarily a bad thing.`,
      },
      {
        heading: ``,
        content: `For instance, when converting a degraded cattle ranch back to forest, a project might initially have to cut tall grass in order to plant small tree seedlings. It will take a few years before the biomass of the young trees exceeds the biomass of the removed grass.`,
      },
      {
        heading: `Source`,
        content: `The change is biomass is calculated by a Plant-for-the-Planet analysis model based on satellite data.`,
      },
    ],
  };

  const optionsList = [
    {
      icon: <BiomassChangeIcon />,
      title: t('biomassChange'),
      isFeaturePending: false,
      name: `biomassChange`,
    },
    {
      icon: <TreeCoverIcon />,
      title: t('treeCover'),
      isFeaturePending: false,
      name: `treeCover`,
    },
    {
      icon: <PotentialBiomassIcon />,
      title: t('potentialBiomass'),
      isFeaturePending: true,
      name: `potentialBiomass`,
    },
    {
      icon: <FireIcon />,
      title: t('fireRisk'),
      isFeaturePending: true,
      name: `fireRisk`,
    },
    {
      icon: <FloodingRiskIcon />,
      title: t('floodingRisk'),
      isFeaturePending: true,
      name: `floodingRisk`,
    },
    {
      icon: <SpeciesDensityIcon />,
      title: t('speciesDensity'),
      isFeaturePending: true,
      name: `speciesDensity`,
    },
  ];

  return (
    <div className={styles.databoxContainer}>
      <div className={styles.dropdownInfoContainer}>
        <div>
          {isMenuOpen && (
            <div className={styles.itemsContainer}>
              <ul>
                {optionsList?.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`${styles.menuItem} ${
                      option.title === selectedOption.title
                        ? styles.selected
                        : ''
                    }`}
                  >
                    <div className={styles.optionIcon}>{option.icon}</div>
                    <div className={styles.optionLabel}>
                      <p>{option.title}</p>
                      {option.isFeaturePending && (
                        <span>{t('comingSoon')}</span>
                      )}
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
              {isMenuOpen ? (
                <DropdownDownArrow width={10} />
              ) : (
                <DropdownUpArrow width={8} />
              )}
            </div>
          </div>
        </div>
        <p className={styles.startYearText}>
          {t('projectBegin')} {startYear}
        </p>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.sliderInfoContainer}>
        <VegetationSlider position={5} />
        <div
          className={styles.infoIcon}
          onMouseEnter={() => setIsPopupOpen(true)}
        >
          <NewInfoIcon width={10} color={`#BDBDBD`} />
        </div>
      </div>
      {isPopupOpen && (
        <div
          className={styles.databoxPopup}
          onMouseEnter={() => setIsPopupOpen(true)}
        >
          <div className={styles.popupHeading}>
            <h6>Biomass Change Map</h6>
            <button onClick={() => setIsPopupOpen(false)}>
              <CloseIcon width={16} />
            </button>
          </div>
          {PopupContent[selectedOption.name].map((item, index) => (
            <div className={styles.popupItem} key={index}>
              <h6>{item.heading}</h6>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Databox;
