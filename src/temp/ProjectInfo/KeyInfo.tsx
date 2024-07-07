import { Fragment } from 'react';
import styles from './ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../utils/countryCurrency/getFormattedDate';
import SingleProjectInfoItem from './SingleProjectInfoItem';
import InfoIconPopup from '../components/InfoIconPopup';
import PlantingSeasons from './PlantingSeasons';

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

  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.singleRowInfoContainer}>
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
        <SingleProjectInfoItem title={tProjectDetails('firstTreePlanted')}>
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
        <SingleProjectInfoItem title={tManageProjects('plantingDensity')}>
          <>
            {plantingDensity}
            {maxPlantingDensity !== null
              ? `-${maxPlantingDensity} ${tManageProjects('treePerHa')}`
              : ` ${tManageProjects('treePerHa')}`}
          </>
        </SingleProjectInfoItem>
        <SingleProjectInfoItem title={tManageProjects('employees')}>
          <p>{employees}</p>
        </SingleProjectInfoItem>
      </div>
      <div className={styles.seperator}></div>
      <SingleProjectInfoItem title={tProjectDetails('plantingSeasons')}>
        <PlantingSeasons plantingSeasons={plantingSeasons} />
      </SingleProjectInfoItem>
    </div>
  );
};

export default KeyInfo;
