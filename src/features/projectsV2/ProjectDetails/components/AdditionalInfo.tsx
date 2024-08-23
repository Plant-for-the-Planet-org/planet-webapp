import styles from '../styles/ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
interface Props {
  mainChallengeText: string | null;
  siteOwnershipText: string | null;
  causeOfDegradationText: string | null;
  whyThisSiteText: string | null;
  longTermProtectionText: string | null;
  siteOwnershipType: string[] | null;
  acquiredSince: number | null;
}

const AdditionalInfo = ({
  mainChallengeText,
  siteOwnershipText,
  causeOfDegradationText,
  whyThisSiteText,
  longTermProtectionText,
  siteOwnershipType,
  acquiredSince,
}: Props) => {
  const tManageProjects = useTranslations('ManageProjects');
  const tProjectDetails = useTranslations('ProjectDetails');

  const siteOwners = [
    {
      id: 1,
      title: tProjectDetails('privateProperty'),
      value: 'private',
    },
    {
      id: 2,
      title: tProjectDetails('publicProperty'),
      value: 'public-property',
    },
    {
      id: 3,
      title: tManageProjects('siteOwnerSmallHolding'),
      value: 'smallholding',
    },
    {
      id: 4,
      title: tManageProjects('siteOwnerCommunal'),
      value: 'communal-land',
    },
    {
      id: 5,
      title: tManageProjects('siteOwnerOwned'),
      value: 'owned-by-owner',
    },
    {
      id: 6,
      title: tManageProjects('siteOwnerOther'),
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
    return `${translatedTitle} · ${tManageProjects('since')} ${acquiredSince}`;
  };

  const moreInfoContent = [
    {
      title: `${tManageProjects('mainChallenge')}`,
      content: <div className={styles.infoDetail}>{mainChallengeText}</div>,
    },
    {
      title: `${tManageProjects('siteOwnership')}`,
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
      title: `${tManageProjects('causeOfDegradation')}`,
      content: (
        <div className={styles.infoDetail}>{causeOfDegradationText}</div>
      ),
    },
    {
      title: `${tManageProjects('whyThisSite')}`,
      content: <div className={styles.infoDetail}>{whyThisSiteText}</div>,
    },
    {
      title: `${tManageProjects('longTermProtection')}`,
      content: (
        <div className={styles.infoDetail}>{longTermProtectionText}</div>
      ),
    },
  ];

  return (
    <div className={styles.moreInfoContainer}>
      {moreInfoContent.map((item) => (
        <SingleProjectInfoItem key={item.title} title={item.title}>
          {item.content}
        </SingleProjectInfoItem>
      ))}
    </div>
  );
};

export default AdditionalInfo;
