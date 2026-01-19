import type { SetState } from '../../../common/types/common';
import type {
  Intervention,
  SampleTreeRegistration,
  SingleTreeRegistration,
} from '@planet-sdk/common';

import { useEffect, useState } from 'react';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../TreeMapper.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import area from '@turf/area';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import TreeIcon from '../../../../../public/assets/images/icons/TreeIcon';
import { useRouter } from 'next/router';

interface Props {
  intervention: Intervention;
  showDivider: boolean;
  selectedIntervention: Intervention | SampleTreeRegistration | null;
  setSelectedIntervention: SetState<
    Intervention | SampleTreeRegistration | null
  >;
}

function TreemapperIntervention({
  intervention,
  showDivider,
  selectedIntervention,
  setSelectedIntervention,
}: Props) {
  const t = useTranslations('Treemapper');
  const locale = useLocale();
  const router = useRouter();
  let treeCount = 0;
  const [plantationArea, setPlantationArea] = useState(0);

  if (
    intervention.type === 'multi-tree-registration' &&
    intervention?.plantedSpecies?.length !== 0
  ) {
    for (const key in intervention.plantedSpecies) {
      if (
        Object.prototype.hasOwnProperty.call(intervention.plantedSpecies, key)
      ) {
        const species = intervention.plantedSpecies[key];
        treeCount += species.treeCount;
      }
    }
  }

  function handleClick(intervention: Intervention) {
    if (selectedIntervention?.id === intervention.id) {
      setSelectedIntervention(null);
    } else {
      router.replace(`/profile/treemapper/?l=${intervention.id}`);
    }
  }

  useEffect(() => {
    if (intervention.type === 'multi-tree-registration') {
      const calculatedArea = area(intervention.geometry);
      setPlantationArea(calculatedArea > 0 ? calculatedArea / 10000 : 0);
    }
  }, [intervention]);

  return (
    <div
      onClick={() => handleClick(intervention)}
      className={styles.singleLocation}
    >
      <div className={styles.locationHeader}>
        <div className={styles.left}>
          <p className={styles.treeCount}>
            {`${
              intervention.hid
                ? intervention.hid.substring(0, 3) +
                  '-' +
                  intervention.hid.substring(3)
                : null
            } ${
              intervention.type === 'multi-tree-registration'
                ? '• ' +
                  localizedAbbreviatedNumber(
                    locale,
                    Number(plantationArea),
                    2
                  ) +
                  'ha'
                : (intervention as SingleTreeRegistration).tag
                ? '• ' + (intervention as SingleTreeRegistration).tag
                : ''
            }`}
          </p>
          <p className={styles.date}>
            {formatDate(intervention.registrationDate)}
          </p>
        </div>
        <div className={styles.right}>
          <div className={styles.status}>
            {intervention.type === 'multi-tree-registration' && treeCount
              ? `${treeCount}`
              : `1`}
            <TreeIcon width={'19px'} height={'19.25px'} />
          </div>
          <div className={styles.mode}>{t(intervention.captureStatus)}</div>
        </div>
      </div>

      {showDivider && <div className={styles.divider} />}
    </div>
  );
}

export default TreemapperIntervention;
