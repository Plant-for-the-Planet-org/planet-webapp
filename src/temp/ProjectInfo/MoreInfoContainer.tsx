import styles from './ProjectInfo.module.scss';
import { useTranslation } from 'next-i18next';
import SingleProjectInfoItem from './SingleProjectInfoItem';
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

  const renderSiteOwnershipType = (siteOwnershipType: string) => {
    let translatedTitle = '';
    siteOwners.map((siteOwner) => {
      if (siteOwner.value === siteOwnershipType) {
        translatedTitle = siteOwner.title;
      }
    });
    return `${translatedTitle} · ${t('manageProjects:since')} ${acquiredSince}`;
  };

  const moreInfoContent = [
    {
      title: `${t('manageProjects:mainChallenge')}`,
      content: <div className={styles.infoDetail}>{mainChallengeText}</div>,
    },
    {
      title: `${t('manageProjects:siteOwnership')}`,
      content: (
        <>
          <div className={styles.siteOwnershipLabelContainer}>
            {siteOwnershipType.map((type) => (
              <span key={type}>{renderSiteOwnershipType(type)}</span>
            ))}
          </div>
          <div className={styles.infoDetail}>{siteOwnershipText}</div>
        </>
      ),
    },
    {
      title: `${t('manageProjects:causeOfDegradation')}`,
      content: (
        <div className={styles.infoDetail}>{causeOfDegradationText}</div>
      ),
    },
    {
      title: `${t('manageProjects:whyThisSite')}`,
      content: <div className={styles.infoDetail}>{whyThisSiteText}</div>,
    },
    {
      title: `${t('manageProjects:longTermProtection')}`,
      content: (
        <div className={styles.infoDetail}>{longTermProtectionText}</div>
      ),
    },
  ];

  return (
    <div className={styles.moreInfoContainer}>
      {moreInfoContent.map((item) => (
        <SingleProjectInfoItem
          key={item.title}
          title={item.title}
          itemContent={item.content}
        />
      ))}
    </div>
  );
};

export default MoreInfoContainer;
