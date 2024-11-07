import type {
  InterventionTypes,
  LandOwnershipTypes,
  OwnershipTypes,
} from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectInfo.module.scss';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';

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
  const tProjectsCommon = useTranslations('Project');
  const tProjectDetails = useTranslations('ProjectDetails');

  const siteOwners = [
    {
      id: 1,
      title: tProjectDetails('siteOwnershipTypes.private'),
      value: 'private',
    },
    {
      id: 2,
      title: tProjectDetails('siteOwnershipTypes.public-property'),
      value: 'public-property',
    },
    {
      id: 3,
      title: tProjectDetails('siteOwnershipTypes.smallholding'),
      value: 'smallholding',
    },
    {
      id: 4,
      title: tProjectDetails('siteOwnershipTypes.communal-land'),
      value: 'communal-land',
    },
    {
      id: 5,
      title: tProjectDetails('siteOwnershipTypes.owned-by-owner'),
      value: 'owned-by-owner',
    },
    {
      id: 6,
      title: tProjectDetails('siteOwnershipTypes.other'),
      value: 'other',
    },
  ];

  const renderSiteOwnershipType = (siteOwnershipType: string) => {
    const siteOwner = siteOwners.find(
      (item) => item.value === siteOwnershipType
    );
    const translatedTitle = siteOwner ? siteOwner.title : '';
    if (acquiredSince) {
      return tProjectDetails('ownershipTypeDetails', {
        translatedOwnershipType: translatedTitle,
        acquisitionYear: acquiredSince,
      });
    } else {
      return translatedTitle;
    }
  };
  const moreInfoContent = [
    {
      title: `${tProjectDetails('mainChallenge')}`,
      content: <div>{mainChallenge}</div>,
      shouldDisplay: Boolean(mainChallenge),
    },
    {
      title: `${tProjectDetails('actions')}`,
      content: <div>{actions}</div>,
      shouldDisplay: Boolean(actions),
    },
    {
      title: `${tProjectDetails('socialBenefits')}`,
      content: <div>{socialBenefits}</div>,
      shouldDisplay: Boolean(socialBenefits),
    },
    {
      title: `${tProjectDetails('ecologicalBenefits')}`,
      content: <div>{ecologicalBenefits}</div>,
      shouldDisplay: Boolean(ecologicalBenefits),
    },
    {
      title: `${tProjectDetails('coBenefits')}`,
      content: <div>{coBenefits}</div>,
      shouldDisplay: Boolean(coBenefits),
    },
    {
      title: `${tProjectDetails(`labelMainInterventions`)}`,
      content: (
        <div>
          {mainInterventions
            ?.map((item) => tProjectsCommon(`interventionTypes.${item}`))
            .join(',')}
        </div>
      ),
      shouldDisplay: mainInterventions && mainInterventions?.length > 0,
    },
    {
      title: `${tProjectDetails('siteOwnership')}`,
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
      title: `${tProjectDetails('ownerShipTenure')}`,
      content: <div>{ownershipTenure}</div>,
      shouldDisplay: Boolean(ownershipTenure),
    },
    {
      title: `${tProjectDetails('causeOfDegradation')}`,
      content: <div>{causeOfDegradation}</div>,
      shouldDisplay: Boolean(causeOfDegradation),
    },
    {
      title: `${tProjectDetails('whyThisSite')}`,
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
