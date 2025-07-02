import type {
  InterventionTypes,
  LandOwnershipTypes,
  OwnershipTypes,
} from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectInfo.module.scss';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import SiteOwnershipContent from './microComponents/SiteOwnershipContent';

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
        <SiteOwnershipContent
          siteOwnershipType={siteOwnershipType}
          siteOwnerName={siteOwnerName}
          acquiredSince={acquiredSince}
        />
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
