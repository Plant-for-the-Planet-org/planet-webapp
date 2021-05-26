import React, { ReactElement } from 'react';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../styles/TreeMapper.module.scss';
import i18next from '../../../../../../i18n';

const { useTranslation } = i18next;

interface Props {
  location: Object;
  index: number;
  locations: Object;
  selectedLocation: string;
  setselectedLocation: Function;
}

function PlantLocation({
  location,
  index,
  locations,
  selectedLocation,
  setselectedLocation,
}: Props) {
  const { t, i18n } = useTranslation('treemapper');

  var treeCount = 0;
  if (location.plantedSpecies.length !== 0) {
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

  return (
    <div
      key={index}
      onClick={() => selectLocation(location.id)}
      className={styles.singleLocation}
    >
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
  );
}

export default PlantLocation;
