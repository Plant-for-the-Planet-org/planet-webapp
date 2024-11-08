import type { AllowedSeasonMonths } from '@planet-sdk/common';

import { useLocale, useTranslations } from 'next-intl';
import styles from '../styles/ProjectInfo.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import InfoIconPopup from './microComponents/InfoIconPopup';
import InterventionSeason from './microComponents/InterventionSeason';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';

interface Props {
  abandonment: number | null;
  firstTreePlanted: string | null;
  startingProtectionYear: number | null;
  plantingSeasons: AllowedSeasonMonths[] | null;
  activitySeasons: AllowedSeasonMonths[] | null;
  plantingDensity: number | null;
  maxPlantingDensity: number | null;
  employees: number | null;
  degradationYear: number | null;
}

const KeyInfo = ({
  abandonment,
  firstTreePlanted,
  startingProtectionYear,
  plantingSeasons,
  activitySeasons,
  plantingDensity,
  maxPlantingDensity,
  employees,
  degradationYear,
}: Props) => {
  const tCommon = useTranslations('Common');
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();

  const addZeroToDate = (val: string) => {
    const arr = val.split('-');
    const newDateArr = [arr[0]];
    if (arr[1].length === 1) {
      newDateArr.push(`0${arr[1]}`);
    } else {
      newDateArr.push(arr[1]);
    }
    if (arr[2].length === 1) {
      newDateArr.push(`0${arr[2]}`);
    } else {
      newDateArr.push(arr[2]);
    }
    return newDateArr.join('-');
  };

  return (
    <div className={styles.keyInfoContainer}>
      <div className={styles.keyInfoSubContainer}>
        {abandonment && (
          <SingleProjectInfoItem
            title={
              <h2 className={styles.abandonmentTitle}>
                {tProjectDetails('abandonment')}
                <InfoIconPopup
                  height={10}
                  width={10}
                  color={`${'rgba(var(--secondary-divider-color-new))'}`}
                >
                  <div className={styles.infoIconPopupContainer}>
                    {tProjectDetails('yearAbandonedInfo')}
                  </div>
                </InfoIconPopup>
              </h2>
            }
          >
            <p>
              {tCommon('approx')} {abandonment}
            </p>
          </SingleProjectInfoItem>
        )}
        {firstTreePlanted && (
          <SingleProjectInfoItem title={tProjectDetails('restorationStarted')}>
            <time>
              {firstTreePlanted?.length > 0 &&
                formatDate(
                  firstTreePlanted.split('-')[1].length === 1 ||
                    firstTreePlanted.split('-')[2].length === 1
                    ? addZeroToDate(firstTreePlanted)
                    : firstTreePlanted
                )}
            </time>
          </SingleProjectInfoItem>
        )}
        {startingProtectionYear && (
          <SingleProjectInfoItem title={tProjectDetails('protectionStarted')}>
            <time>{startingProtectionYear}</time>
          </SingleProjectInfoItem>
        )}
      </div>

      <div className={styles.keyInfoSubContainer}>
        {plantingDensity && (
          <SingleProjectInfoItem title={tProjectDetails('plantingDensity')}>
            <>
              {getFormattedNumber(locale, plantingDensity)}
              {maxPlantingDensity !== null
                ? `-${getFormattedNumber(
                    locale,
                    maxPlantingDensity
                  )} ${tProjectDetails('treePerHa')}`
                : ` ${tProjectDetails('treePerHa')}`}
            </>
          </SingleProjectInfoItem>
        )}
        {employees && (
          <SingleProjectInfoItem title={tProjectDetails('employees')}>
            <p>{employees}</p>
          </SingleProjectInfoItem>
        )}
      </div>

      {degradationYear && (
        <div className={styles.keyInfoSubContainer}>
          <SingleProjectInfoItem title={tProjectDetails('degradationYear')}>
            <p>{degradationYear}</p>
          </SingleProjectInfoItem>
        </div>
      )}

      {activitySeasons && activitySeasons.length > 0 && (
        <SingleProjectInfoItem title={tProjectDetails('protectionSeasons')}>
          <InterventionSeason interventionSeasons={activitySeasons} />
        </SingleProjectInfoItem>
      )}
      {plantingSeasons && plantingSeasons.length > 0 && (
        <SingleProjectInfoItem title={tProjectDetails('restorationSeasons')}>
          <InterventionSeason interventionSeasons={plantingSeasons} />
        </SingleProjectInfoItem>
      )}
    </div>
  );
};

export default KeyInfo;
