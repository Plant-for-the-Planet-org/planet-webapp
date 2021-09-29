import React, { ReactElement } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../TreeMapper.module.scss';
import i18next from '../../../../../i18n';
import * as turf from '@turf/turf';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import TreeIcon from '../../../../../public/assets/images/icons/TreeIcon';
import { useRouter } from 'next/router';

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
  const router = useRouter();
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
      router.replace(`/profile/treemapper/?l=${location.id}`);
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
      className={`${styles.singleLocation}`}
    >
      <div className={styles.locationHeader}>
        <div className={styles.left}>
          <p className={styles.treeCount}>
              {`${location.hid?location.hid.substring(0, 3) + "-" + location.hid.substring(3):null} ${location.type === 'multi'?'• '+localizedAbbreviatedNumber(
                  i18n.language,
                  Number(plantationArea),
                  2
                ) + 'ha':location.tag? '• '+location.tag:''}`}
          </p>
          <p className={styles.date}>
             {formatDate(location.registrationDate)}
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
    </div>
  );
}

export default PlantLocation;
