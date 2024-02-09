import styles from './ProjectInfo.module.scss';
interface Props {
  mainChallengeText: string;
  siteOwnershipText: string;
  causeOfDegradationText: string;
  whyThisSiteText: string;
  longTermProtectionText: string;
  externalCertifications: string;
  siteOwnershipType: string;
  acquiredSince: number;
}

const MoreInfoContainer = ({
  mainChallengeText,
  siteOwnershipText,
  causeOfDegradationText,
  whyThisSiteText,
  longTermProtectionText,
  externalCertifications,
  siteOwnershipType,
  acquiredSince,
}: Props) => {
  return (
    <div className={styles.moreInfoContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>main challenge</div>
          <div className={styles.infoDetail}>{mainChallengeText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.siteOwnershipTitle}>
            <div>site ownership</div>{' '}
            <span>
              {siteOwnershipType} Property · since {acquiredSince}
            </span>
          </div>
          <div className={styles.infoDetail}>{siteOwnershipText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>cause of degradation</div>
          <div className={styles.infoDetail}>{causeOfDegradationText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>why this site?</div>
          <div className={styles.infoDetail}>{whyThisSiteText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>long term protection</div>
          <div className={styles.infoDetail}>{longTermProtectionText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>external certifications</div>
          <div className={styles.infoDetail}>
            <div>{externalCertifications} </div>
            <a href="#" target="_blank" rel="noreferrer">
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoContainer;
