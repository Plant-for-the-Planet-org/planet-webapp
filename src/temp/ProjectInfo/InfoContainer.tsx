import { Fragment } from 'react';
import styles from './ProjectInfo.module.scss';
import InfoIconPopup from './InfoIconPopup';
import { useTranslation } from 'next-i18next';
import formatDate from '../../utils/countryCurrency/getFormattedDate';

interface Props {
  abandonment: number;
  firstTree: string;
  plantingDensity: number;
  maxPlantingDensity: number;
  employees: number;
  plantingSeasons: number[];
}

const InfoContainer = ({
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

  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:abandonment')}
            <InfoIconPopup
              height={10}
              width={10}
              color={'#F2994A'}
              text={t('manageProjects:yearAbandonedInfo')}
            />
          </div>
          <div className={styles.infoDetail}>
            {' '}
            {t('common:approx')} {abandonment}
          </div>
        </div>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('projectDetails:firstTreePlanted')}
          </div>
          <div className={styles.infoDetail}>
            {formatDate(
              firstTree.split('-')[1].length === 1 ||
                firstTree.split('-')[2].length === 1
                ? addZeroToDate(firstTree)
                : firstTree
            )}
          </div>
        </div>
      </div>
      <div className={styles.seperator}></div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {' '}
            {t('manageProjects:plantingDensity')}
          </div>
          <div className={styles.infoDetail}>
            {plantingDensity}
            {maxPlantingDensity !== null
              ? `-${maxPlantingDensity} ${t('manageProjects:treePerHa')}`
              : ` ${t('manageProjects:treePerHa')}`}
          </div>
        </div>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:employees')}
          </div>
          <div className={styles.infoDetail}>{employees}</div>
        </div>
      </div>
      <div className={styles.seperator}></div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('projectDetails:plantingSeasons')}
          </div>
          <div className={styles.infoDetail}>
            {plantingSeasons.map((season, index) => (
              <Fragment key={seasons[season - 1].title}>
                {seasons[season - 1].title}
                {index === plantingSeasons.length - 2 ? (
                  <> {t('manageProjects:and')} </>
                ) : index === plantingSeasons.length - 1 ? (
                  '.'
                ) : (
                  ', '
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoContainer;
