import { Fragment } from 'react';
import styles from './ProjectInfo.module.scss';
import InfoIconPopup from './InfoIconPopup';

interface Props {
  abandonment: number;
  firstTree: string;
  plantingDensity: number;
  maxPlantingDensity: number;
  employees: number;
  plantingSeasons: string[];
}

const InfoContainer = ({
  abandonment,
  firstTree,
  plantingDensity,
  maxPlantingDensity,
  employees,
  plantingSeasons,
}: Props) => {
  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            Abandonment
            <InfoIconPopup
              height={10}
              width={10}
              color={'#F2994A'}
              text={
                'When was the last significant human intervention in the site? Incl. logging, agriculture, cattle grazing, human induced burning.'
              }
            />
          </div>
          <div className={styles.infoDetail}>Approx. {abandonment}</div>
        </div>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>First tree planted</div>
          <div className={styles.infoDetail}>{firstTree}</div>
        </div>
      </div>
      <div className={styles.seperator}></div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>Planting density</div>
          <div className={styles.infoDetail}>
            {plantingDensity} - {maxPlantingDensity} trees per ha
          </div>
        </div>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>employees</div>
          <div className={styles.infoDetail}>{employees}</div>
        </div>
      </div>
      <div className={styles.seperator}></div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>planting seasons</div>
          <div className={styles.infoDetail}>
            {plantingSeasons.map((season, index) => (
              <Fragment key={index}>
                {season}
                {index === plantingSeasons.length - 2
                  ? ' and '
                  : index === plantingSeasons.length - 1
                  ? '.'
                  : ', '}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoContainer;
