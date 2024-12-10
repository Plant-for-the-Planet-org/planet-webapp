import type {
  PlantLocation as PlantLocationType,
  PlantLocationBase,
  PlantLocationMulti,
  PlantLocationSingle,
} from '../../../common/types/plantLocation';
import type { SamplePlantLocation } from '../Treemapper';

import React from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../TreeMapper.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import * as turf from '@turf/turf';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import TreeIcon from '../../../../../public/assets/images/icons/TreeIcon';
import { useRouter } from 'next/router';

interface Props {
  location: Object;
  index: number;
  locations: Object;
  selectedLocation:
    | PlantLocationSingle
    | PlantLocationMulti
    | SamplePlantLocation
    | null;
  setSelectedLocation: Function;
}

function PlantLocation({
  location,
  index,
  locations,
  selectedLocation,
  setSelectedLocation,
}: Props) {
  const t = useTranslations('Treemapper');
  const locale = useLocale();
  const router = useRouter();
  let treeCount = 0;
  if ((location as PlantLocationMulti)?.plantedSpecies?.length !== 0) {
    for (const key in (location as PlantLocationMulti).plantedSpecies) {
      if (
        Object.prototype.hasOwnProperty.call(
          (location as PlantLocationMulti).plantedSpecies,
          key
        )
      ) {
        const species = (location as PlantLocationMulti).plantedSpecies[key];
        treeCount += species.treeCount;
      }
    }
  }

  function selectLocation(location: any) {
    if (
      selectedLocation &&
      (selectedLocation as PlantLocationBase).id === location.id
    ) {
      setSelectedLocation(null);
    } else {
      router.replace(`/profile/treemapper/?l=${location.id}`);
    }
  }

  const [plantationArea, setPlantationArea] = React.useState(0);

  React.useEffect(() => {
    if (
      location &&
      (location as PlantLocationMulti).type === 'multi-tree-registration'
    ) {
      const area = turf.area((location as PlantLocationMulti).geometry);
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
            {`${
              (location as PlantLocationBase).hid
                ? (location as PlantLocationBase).hid.substring(0, 3) +
                  '-' +
                  (location as PlantLocationBase).hid.substring(3)
                : null
            } ${
              (location as PlantLocationMulti).type ===
              'multi-tree-registration'
                ? '• ' +
                  localizedAbbreviatedNumber(
                    locale,
                    Number(plantationArea),
                    2
                  ) +
                  'ha'
                : (location as SamplePlantLocation).tag
                ? '• ' + (location as SamplePlantLocation).tag
                : ''
            }`}
          </p>
          <p className={styles.date}>
            {formatDate((location as PlantLocationBase).registrationDate)}
          </p>
        </div>
        <div className={styles.right}>
          <div className={styles.status}>
            {(location as PlantLocationMulti).type ===
              'multi-tree-registration' && treeCount
              ? `${treeCount}`
              : `1`}
            <TreeIcon width={'19px'} height={'19.25px'} />
          </div>
          <div className={styles.mode}>
            {t((location as PlantLocationBase).captureStatus)}
          </div>
        </div>
      </div>

      {index !== (locations as PlantLocationType[])?.length - 1 && (
        <div className={styles.divider} />
      )}
    </div>
  );
}

export default PlantLocation;
