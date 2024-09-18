import styles from '../styles/ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import { InterventionTypes } from '@planet-sdk/common';
interface Props {
  mainChallengeText: string | null;
  siteOwnershipText: string | null;
  causeOfDegradationText: string | null;
  whyThisSiteText: string | null;
  longTermProtectionText: string | null;
  siteOwnershipType: string[] | null;
  acquiredSince: number | null;
  mainInterventions: InterventionTypes[] | null;
}

const AdditionalInfo = ({
  mainChallengeText,
  siteOwnershipText,
  causeOfDegradationText,
  whyThisSiteText,
  longTermProtectionText,
  siteOwnershipType,
  acquiredSince,
  mainInterventions,
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
    const siteOwner = siteOwners.find(
      (item) => item.value === siteOwnershipType
    );
    const translatedTitle = siteOwner ? siteOwner.title : '';
    if (acquiredSince) {
      return `${translatedTitle} · ${tManageProjects(
        'since'
      )} ${acquiredSince}`;
    } else {
      return translatedTitle;
    }
  };
  const moreInfoContent = [
    {
      title: `${tManageProjects('mainChallenge')}`,
      content: <div className={styles.infoDetail}>{mainChallengeText}</div>,
      shouldDisplay: Boolean(mainChallengeText),
    },
    {
      title: `${tManageProjects(`labelMainInterventions`)}`,
      content: (
        <div className={styles.infoDetail}>
          {mainInterventions
            ?.map((item) => tManageProjects(`interventionTypes.${item}`))
            .join(',')}
        </div>
      ),
      shouldDisplay: mainInterventions && mainInterventions?.length > 0,
    },
    {
      title: `${tManageProjects('siteOwnership')}`,
      content: (
        <>
          <div className={styles.siteOwnershipLabelContainer}>
            {siteOwnershipType?.map((type) => (
              <span key={type}>{renderSiteOwnershipType(type)}</span>
            ))}
          </div>
          <div className={styles.infoDetail}>{siteOwnershipText}</div>
        </>
      ),
      shouldDisplay:
        (siteOwnershipText && siteOwnershipText?.length > 0) ||
        (siteOwnershipType && siteOwnershipType?.length > 0),
    },
    {
      title: `${tManageProjects('causeOfDegradation')}`,
      content: (
        <div className={styles.infoDetail}>{causeOfDegradationText}</div>
      ),
      shouldDisplay: Boolean(causeOfDegradationText),
    },
    {
      title: `${tManageProjects('whyThisSite')}`,
      content: <div className={styles.infoDetail}>{whyThisSiteText}</div>,
      shouldDisplay: Boolean(whyThisSiteText),
    },
    {
      title: `${tProjectDetails('longTermPlan')}`,
      content: (
        <div className={styles.infoDetail}>{longTermProtectionText}</div>
      ),
      shouldDisplay: Boolean(longTermProtectionText),
    },
  ];

  return (
    <div className={styles.moreInfoContainer}>
      {moreInfoContent.map(
        (item) =>
          item.shouldDisplay && (
            <SingleProjectInfoItem key={item.title} title={item.title}>
              {item.content}
            </SingleProjectInfoItem>
          )
      )}
    </div>
  );
};

export default AdditionalInfo;
