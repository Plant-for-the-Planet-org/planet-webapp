import styles from '../styles/ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import {
  InterventionTypes,
  LandOwnershipTypes,
  OwnershipTypes,
} from '@planet-sdk/common';
interface Props {
  mainChallenge: string | null;
  siteOwnerName: string | null;
  siteOwnershipType: LandOwnershipTypes[] | null;
  causeOfDegradation: string | null;
  whyThisSite: string | null;
  longTermPlan: string | null;
  acquiredSince: number | null;
  mainInterventions: InterventionTypes[] | null;
  actions: string | null;
  socialBenefits: string | null;
  ecologicalBenefits: string | null;
  coBenefits: string | null;
  benefits: string | null;
  ownershipTenure: OwnershipTypes | null;
}

const AdditionalInfo = ({
  mainChallenge,
  siteOwnerName,
  causeOfDegradation,
  whyThisSite,
  longTermPlan,
  siteOwnershipType,
  acquiredSince,
  mainInterventions,
  actions,
  socialBenefits,
  ecologicalBenefits,
  coBenefits,
  ownershipTenure,
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
      content: <div>{mainChallenge}</div>,
      shouldDisplay: Boolean(mainChallenge),
    },
    {
      title: `${tManageProjects('actions')}`,
      content: <div>{actions}</div>,
      shouldDisplay: Boolean(actions),
    },
    {
      title: `${tManageProjects('socialBenefits')}`,
      content: <div>{socialBenefits}</div>,
      shouldDisplay: Boolean(socialBenefits),
    },
    {
      title: `${tManageProjects('ecologicalBenefits')}`,
      content: <div>{ecologicalBenefits}</div>,
      shouldDisplay: Boolean(ecologicalBenefits),
    },
    {
      title: `${tManageProjects('coBenefits')}`,
      content: <div>{coBenefits}</div>,
      shouldDisplay: Boolean(coBenefits),
    },
    {
      title: `${tManageProjects(`labelMainInterventions`)}`,
      content: (
        <div>
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
          <div>{siteOwnerName}</div>
        </>
      ),
      shouldDisplay:
        Boolean(siteOwnerName) ||
        (siteOwnershipType && siteOwnershipType?.length > 0),
    },
    {
      title: `${tManageProjects('ownerShipTenure')}`,
      content: <div>{ownershipTenure}</div>,
      shouldDisplay: Boolean(ownershipTenure),
    },
    {
      title: `${tManageProjects('causeOfDegradation')}`,
      content: <div>{causeOfDegradation}</div>,
      shouldDisplay: Boolean(causeOfDegradation),
    },
    {
      title: `${tManageProjects('whyThisSite')}`,
      content: <div>{whyThisSite}</div>,
      shouldDisplay: Boolean(whyThisSite),
    },
    {
      title: `${tProjectDetails('longTermPlan')}`,
      content: <div>{longTermPlan}</div>,
      shouldDisplay: Boolean(longTermPlan),
    },
  ];

  return (
    <div className={styles.additionalInfoContainer}>
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
