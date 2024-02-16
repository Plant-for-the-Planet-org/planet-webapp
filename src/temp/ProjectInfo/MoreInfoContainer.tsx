import { Fragment } from 'react';
import styles from './ProjectInfo.module.scss';
import { useTranslation } from 'next-i18next';
interface Props {
  mainChallengeText: string;
  siteOwnershipText: string;
  causeOfDegradationText: string;
  whyThisSiteText: string;
  longTermProtectionText: string;
  externalCertifications: string;
  siteOwnershipType: string[];
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
  const { t, ready } = useTranslation([
    'manageProjects',
    'common',
    'projectDetails',
  ]);

  const siteOwners = [
    {
      id: 1,
      title: ready ? t('projectDetails:privateProperty') : '',
      value: 'private',
    },
    {
      id: 2,
      title: ready ? t('projectDetails:publicProperty') : '',
      value: 'public-property',
    },
    {
      id: 3,
      title: ready ? t('manageProjects:siteOwnerSmallHolding') : '',
      value: 'smallholding',
    },
    {
      id: 4,
      title: ready ? t('manageProjects:siteOwnerCommunal') : '',
      value: 'communal-land',
    },
    {
      id: 5,
      title: ready ? t('manageProjects:siteOwnerOwned') : '',
      value: 'owned-by-owner',
    },
    {
      id: 6,
      title: ready ? t('manageProjects:siteOwnerOther') : '',
      value: 'other',
    },
  ];

  const translatedSiteOwnership = (siteOwnershipType: string) => {
    let translation = '';
    siteOwners.map((siteOwner) => {
      if (siteOwner.value === siteOwnershipType) {
        translation = siteOwner.title;
      }
    });
    return translation;
  };

  return (
    <div className={styles.moreInfoContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:mainChallenge')}
          </div>
          <div className={styles.infoDetail}>{mainChallengeText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.siteOwnershipTitle}>
            <div> {t('manageProjects:siteOwnership')}</div>{' '}
            <div className={styles.siteOwnershipLabelContainer}>
              {siteOwnershipType.map((type) => (
                <span key={type}>
                  {translatedSiteOwnership(type)} · {t('manageProjects:since')}{' '}
                  {acquiredSince}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.infoDetail}>{siteOwnershipText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {' '}
            {t('manageProjects:causeOfDegradation')}
          </div>
          <div className={styles.infoDetail}>{causeOfDegradationText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:whyThisSite')}
          </div>
          <div className={styles.infoDetail}>{whyThisSiteText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:longTermProtection')}
          </div>
          <div className={styles.infoDetail}>{longTermProtectionText}</div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:externalCertifications')}
          </div>
          <div className={styles.infoDetail}>
            <div>{externalCertifications} </div>
            <a href="#" target="_blank" rel="noreferrer">
              {t('common:view')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoContainer;
