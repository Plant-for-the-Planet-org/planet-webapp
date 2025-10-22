import type { AllowedSeasonMonths } from '@planet-sdk/common';

import { useLocale, useTranslations } from 'next-intl';
import styles from '../styles/ProjectInfo.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import InfoIconPopup from './microComponents/InfoIconPopup';
import InterventionSeason from './microComponents/InterventionSeason';
import {
  getFormattedNumber,
  getFormattedRoundedNumber,
} from '../../../../utils/getFormattedNumber';
import themeProperties from '../../../../theme/themeProperties';

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
  projectAreaInHectares: number | null;
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
  projectAreaInHectares,
}: Props) => {
  const tCommon = useTranslations('Common');
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();

  const showAbandonmentInfo = abandonment !== null && abandonment > 0;
  const showProtectionStarted =
    startingProtectionYear !== null && startingProtectionYear > 0;
  const showPlantingDensity = plantingDensity !== null && plantingDensity > 0;
  const showEmployees = employees !== null && employees > 0;
  const showDegradationYear = degradationYear !== null && degradationYear > 0;
  const showActivitySeasons =
    activitySeasons !== null && activitySeasons.length > 0;
  const showPlantingSeasons =
    plantingSeasons !== null && plantingSeasons.length > 0;
  const restorationDate = firstTreePlanted ? formatDate(firstTreePlanted) : '';
  const showProjectArea =
    projectAreaInHectares !== null && projectAreaInHectares > 0;

  return (
    <div className={styles.keyInfoContainer}>
      {(showAbandonmentInfo ||
        restorationDate.length > 0 ||
        showProtectionStarted) && (
        <div className={styles.keyInfoSubContainer}>
          {showAbandonmentInfo && (
            <SingleProjectInfoItem
              title={
                <h2 className={styles.abandonmentTitle}>
                  {tProjectDetails('abandonment')}
                  <InfoIconPopup
                    height={10}
                    width={10}
                    color={themeProperties.designSystem.colors.sunriseOrange}
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
          {restorationDate.length > 0 && (
            <SingleProjectInfoItem
              title={tProjectDetails('restorationStarted')}
            >
              <time>{restorationDate}</time>
            </SingleProjectInfoItem>
          )}
          {showProtectionStarted && (
            <SingleProjectInfoItem title={tProjectDetails('protectionStarted')}>
              <time>{startingProtectionYear}</time>
            </SingleProjectInfoItem>
          )}
        </div>
      )}

      {(showPlantingDensity || showProjectArea) && (
        <div className={styles.keyInfoSubContainer}>
          {showPlantingDensity && (
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
          {showProjectArea && (
            <SingleProjectInfoItem title={tProjectDetails('projectArea')}>
              <p>
                {tProjectDetails('projectAreaUnit', {
                  formattedArea: getFormattedRoundedNumber(
                    locale,
                    projectAreaInHectares,
                    0
                  ),
                })}
              </p>
            </SingleProjectInfoItem>
          )}
        </div>
      )}

      {(showDegradationYear || showEmployees) && (
        <div className={styles.keyInfoSubContainer}>
          {showEmployees && (
            <SingleProjectInfoItem title={tProjectDetails('employees')}>
              <p>{employees}</p>
            </SingleProjectInfoItem>
          )}
          {showDegradationYear && (
            <SingleProjectInfoItem title={tProjectDetails('degradationYear')}>
              <p>{degradationYear}</p>
            </SingleProjectInfoItem>
          )}
        </div>
      )}

      {showActivitySeasons && (
        <SingleProjectInfoItem title={tProjectDetails('protectionSeasons')}>
          <InterventionSeason interventionSeasons={activitySeasons} />
        </SingleProjectInfoItem>
      )}
      {showPlantingSeasons && (
        <SingleProjectInfoItem title={tProjectDetails('restorationSeasons')}>
          <InterventionSeason interventionSeasons={plantingSeasons} />
        </SingleProjectInfoItem>
      )}
    </div>
  );
};

export default KeyInfo;
