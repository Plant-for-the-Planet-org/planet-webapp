import React, { ReactElement } from 'react';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../styles/TreeMapper.module.scss';
import i18next from '../../../../../../i18n';
import { LocationDetails } from '../../screens/PlantLocationPage';

const { useTranslation } = i18next;

interface Props {
  location: Object;
  index: number;
  locations: Object;
  selectedLocation: string;
  setselectedLocation: Function;
  setLocation: Function;
}

function PlantLocation({
  location,
  index,
  locations,
  selectedLocation,
  setselectedLocation,
  setLocation,
}: Props) {
  const { t, i18n } = useTranslation('treemapper');
  console.log('locations', locations);

  let treeCount = 0;
  if (location?.plantedSpecies?.length !== 0) {
    for (const key in location.plantedSpecies) {
      if (Object.prototype.hasOwnProperty.call(location.plantedSpecies, key)) {
        const species = location.plantedSpecies[key];
        treeCount += species.treeCount;
      }
    }
  }

  function selectLocation(id: any) {
    if (selectedLocation === id) {
      setselectedLocation('');
    } else {
      setselectedLocation(id);
    }
  }

  const DetailProps = {
    location,
    setselectedLocation,
    setLocation,
  };

  return (
    <div
      key={index}
      onClick={() => selectLocation(location.id)}
      className={`${styles.singleLocation} ${
        selectedLocation === location.id ? styles.selected : ''
      }`}
    >
      <div className={styles.locationHeader}>
        <div className={styles.left}>
          <p className={styles.treeCount}>
            {location.type === 'multi' && treeCount
              ? `${treeCount} ${t('trees')}`
              : `1 ${t('tree')}`}
          </p>
          <p className={styles.date}>
            {t('on')} {formatDate(location.registrationDate)}
          </p>
        </div>
        <div className={styles.right}>
          <div className={styles.status}>{t(location.captureStatus)}</div>
          <div className={styles.mode}>{t(location.captureMode)}</div>
        </div>
      </div>

      {index !== locations?.length - 1 && <div className={styles.divider} />}
      <div
        className={`${styles.detailContainer} ${
          selectedLocation === location.id ? styles.selected : ''
        }`}
      >
        <LocationDetails {...DetailProps} />
      </div>
    </div>
  );
}

export default PlantLocation;
