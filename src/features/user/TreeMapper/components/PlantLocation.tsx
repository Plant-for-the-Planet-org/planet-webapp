import React, { ReactElement } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../TreeMapper.module.scss';
import i18next from '../../../../../i18n';
import { LocationDetails } from './PlantLocationPage';
import * as turf from '@turf/turf';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import TreeIcon from '../../../../../public/assets/images/icons/TreeIcon';

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

  function selectLocation(location: any) {
    if (selectedLocation && selectedLocation.id === location.id) {
      setselectedLocation(null);
    } else {
      setselectedLocation(location);
    }
  }

  const [plantationArea, setPlantationArea] = React.useState(0);

  React.useEffect(() => {
    if (location && location.type === 'multi') {
      const area = turf.area(location.geometry);
      setPlantationArea(area / 10000);
    }
  }, [location]);

  return (
    <div
      key={index}
      onClick={() => selectLocation(location)}
      // className={`${styles.singleLocation} ${
      //   selectedLocation?.id === location.id ? styles.selected : ''
      // }`}
      className={`${styles.singleLocation}`}
    >
      <div className={styles.locationHeader}>
        <div className={styles.left}>
          <p className={styles.treeCount}>
            {/* {location.type === 'multi' && treeCount
              ? `${treeCount} ${t('trees')}`
              : `1 ${t('tree')}`} */}
              {`${location.hid?location.hid:null} • ${localizedAbbreviatedNumber(
                  i18n.language,
                  Number(plantationArea),
                  2
                )} ha`}
          </p>
          <p className={styles.date}>
            {t('on')} {formatDate(location.registrationDate)}
          </p>
        </div>
        <div className={styles.right}>
          <div className={styles.status}>{location.type === 'multi' && treeCount
              ? `${treeCount}`
              : `1`}<TreeIcon/></div>
          <div className={styles.mode}>{t(location.captureStatus)}</div>
        </div>
      </div>

      {index !== locations?.length - 1 && <div className={styles.divider} />}
      {/* <div
        className={`${styles.detailContainer} ${
          selectedLocation?.id === location.id ? styles.selected : ''
        }`}
      >
        <LocationDetails {...DetailProps} />
      </div> */}
    </div>
  );
}

export default PlantLocation;
