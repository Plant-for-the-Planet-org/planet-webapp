import { Fragment } from 'react';
import styles from './ProjectInfo.module.scss';
import { useTranslation } from 'next-i18next';
import formatDate from '../../utils/countryCurrency/getFormattedDate';
import SingleProjectInfoItem from './SingleProjectInfoItem';
import InfoIconPopup from '../components/InfoIconPopup';

interface Props {
  abandonment: number;
  firstTree: string;
  plantingDensity: number;
  maxPlantingDensity: number;
  employees: number;
  plantingSeasons: number[];
}

const KeyInfo = ({
  abandonment,
  firstTree,
  plantingDensity,
  maxPlantingDensity,
  employees,
  plantingSeasons,
}: Props) => {
  const { t, ready } = useTranslation([
    'manageProjects',
    'common',
    'projectDetails',
  ]);

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

  const seasons = [
    { id: 0, title: ready ? t('common:january') : '' },
    { id: 1, title: ready ? t('common:february') : '' },
    { id: 2, title: ready ? t('common:march') : '' },
    { id: 3, title: ready ? t('common:april') : '' },
    { id: 4, title: ready ? t('common:may') : '' },
    { id: 5, title: ready ? t('common:june') : '' },
    { id: 6, title: ready ? t('common:july') : '' },
    { id: 7, title: ready ? t('common:august') : '' },
    { id: 8, title: ready ? t('common:september') : '' },
    { id: 9, title: ready ? t('common:october') : '' },
    { id: 10, title: ready ? t('common:november') : '' },
    { id: 11, title: ready ? t('common:december') : '' },
  ];

  const renderPlantingSeasons = () => {
    return plantingSeasons.map((season, index) => (
      <Fragment key={seasons[season - 1].title}>
        {seasons[season - 1].title}
        {index === plantingSeasons.length - 2 ? (
          <span> {t('manageProjects:and')} </span>
        ) : index === plantingSeasons.length - 1 ? (
          '.'
        ) : (
          ', '
        )}
      </Fragment>
    ));
  };

  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.singleRowInfoContainer}>
        <SingleProjectInfoItem
          title={
            <h1 className={styles.abandonmentTitle}>
              {t('manageProjects:abandonment')}
              <InfoIconPopup
                height={10}
                width={10}
                color={`${'rgba(var(--secondary-divider-color-new))'}`}
              >
                <div className={styles.infoIconPopupContainer}>
                  {t('manageProjects:yearAbandonedInfo')}
                </div>
              </InfoIconPopup>
            </h1>
          }
        >
          <p>
            {t('common:approx')} {abandonment}
          </p>
        </SingleProjectInfoItem>
        <SingleProjectInfoItem title={t('projectDetails:firstTreePlanted')}>
          <time>
            {firstTree.length > 0 &&
              formatDate(
                firstTree.split('-')[1].length === 1 ||
                  firstTree.split('-')[2].length === 1
                  ? addZeroToDate(firstTree)
                  : firstTree
              )}
          </time>
        </SingleProjectInfoItem>
      </div>
      <div className={styles.seperator}></div>
      <div className={styles.singleRowInfoContainer}>
        <SingleProjectInfoItem title={t('manageProjects:plantingDensity')}>
          <>
            {plantingDensity}
            {maxPlantingDensity !== null
              ? `-${maxPlantingDensity} ${t('manageProjects:treePerHa')}`
              : ` ${t('manageProjects:treePerHa')}`}
          </>
        </SingleProjectInfoItem>
        <SingleProjectInfoItem title={t('manageProjects:employees')}>
          <p>{employees}</p>
        </SingleProjectInfoItem>
      </div>
      <div className={styles.seperator}></div>
      <SingleProjectInfoItem title={t('projectDetails:plantingSeasons')}>
        <>{renderPlantingSeasons()}</>
      </SingleProjectInfoItem>
    </div>
  );
};

export default KeyInfo;
