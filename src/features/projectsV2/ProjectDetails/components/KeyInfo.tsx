import { Fragment } from 'react';
import styles from '../styles/ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import InfoIconPopup from '../../../../temp/components/InfoIconPopup';
import InterventionSeason from './microComponents/InterventionSeason';
import { AllowedSeasonMonths } from '@planet-sdk/common';

interface Props {
  abandonment: number | null;
  interventionStarted: string | number | null;
  plantingDensity: number | null;
  maxPlantingDensity: number | null;
  employees: number | null;
  interventionSeasons: number[] | AllowedSeasonMonths[] | null;
  isTreeProject: boolean;
  degradationYear: number | null;
}

const KeyInfo = ({
  abandonment,
  interventionStarted,
  plantingDensity,
  maxPlantingDensity,
  employees,
  interventionSeasons,
  isTreeProject,
  degradationYear,
}: Props) => {
  const tCommon = useTranslations('Common');
  const tManageProjects = useTranslations('ManageProjects');
  const tProjectDetails = useTranslations('ProjectDetails');

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
  const shouldRenderInterventionDate =
    (interventionStarted &&
      typeof interventionStarted === 'string' &&
      interventionStarted?.length > 0) ||
    interventionStarted;

  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.singleRowInfoContainer}>
        {abandonment && (
          <SingleProjectInfoItem
            title={
              <h2 className={styles.abandonmentTitle}>
                {tManageProjects('abandonment')}
                <InfoIconPopup
                  height={10}
                  width={10}
                  color={`${'rgba(var(--secondary-divider-color-new))'}`}
                >
                  <div className={styles.infoIconPopupContainer}>
                    {tManageProjects('yearAbandonedInfo')}
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
        {shouldRenderInterventionDate && (
          <SingleProjectInfoItem
            title={
              isTreeProject
                ? tProjectDetails('restorationStarted')
                : tProjectDetails('protectionStarted')
            }
          >
            {isTreeProject && typeof interventionStarted === 'string' ? (
              <time>
                {interventionStarted?.length > 0 &&
                  formatDate(
                    interventionStarted.split('-')[1].length === 1 ||
                      interventionStarted.split('-')[2].length === 1
                      ? addZeroToDate(interventionStarted)
                      : interventionStarted
                  )}
              </time>
            ) : (
              <time>{interventionStarted}</time>
            )}
          </SingleProjectInfoItem>
        )}
      </div>
      {(abandonment || interventionStarted) && (
        <div className={styles.seperator} />
      )}
      <div className={styles.singleRowInfoContainer}>
        {plantingDensity && (
          <SingleProjectInfoItem title={tManageProjects('plantingDensity')}>
            <>
              {plantingDensity}
              {maxPlantingDensity !== null
                ? `-${maxPlantingDensity} ${tManageProjects('treePerHa')}`
                : ` ${tManageProjects('treePerHa')}`}
            </>
          </SingleProjectInfoItem>
        )}
        {employees && (
          <SingleProjectInfoItem title={tManageProjects('employees')}>
            <p>{employees}</p>
          </SingleProjectInfoItem>
        )}
      </div>
      {(employees || plantingDensity) && <div className={styles.seperator} />}
      <div className={styles.singleRowInfoContainer}>
        {degradationYear && (
          <SingleProjectInfoItem title={tManageProjects('degradationYear')}>
            <p>{degradationYear}</p>
          </SingleProjectInfoItem>
        )}
      </div>
      {degradationYear && <div className={styles.seperator} />}
      {interventionSeasons && interventionSeasons.length > 0 && (
        <SingleProjectInfoItem
          title={
            isTreeProject
              ? tProjectDetails('restorationSeasons')
              : tProjectDetails('protectionSeasons')
          }
        >
          <InterventionSeason interventionSeasons={interventionSeasons} />
        </SingleProjectInfoItem>
      )}
    </div>
  );
};

export default KeyInfo;
