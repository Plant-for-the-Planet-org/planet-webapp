import {
  Contributions,
  BouquetContribution,
  GiftContributionProps,
  GiftsGeoJsonQueryResult,
} from '../../../../../common/types/myForest';
import { ReactElement } from 'react';
import myForestStyles from '../../../styles/MyForest.module.scss';
import ProjectImage from './ProjectImage';
import ProjectInfoAndContributionDate from './ProjectInfoAndContributionDate';
import TreesOrUnitAreaAndDonateOption from './TreesOrUnitAreaAndDonateOption';
import { User, UserPublicProfile } from '@planet-sdk/common';

export interface ProjectProps {
  projectInfo: Contributions | BouquetContribution | GiftContributionProps;
  profile: User | UserPublicProfile;
}

const ContributedToProject = ({
  projectInfo,
  profile,
}: ProjectProps): ReactElement => {
  return (
    <div className={myForestStyles.donationDetail}>
      <ProjectImage
        imageUniqueKey={
          (projectInfo as Contributions).plantProject?.image ||
          (projectInfo as GiftContributionProps)?.metadata?.project?.image
        }
        numberOfTreesPlanted={(projectInfo as Contributions)?.treeCount}
      />
      <div className={myForestStyles.projectDetailContainer}>
        <ProjectInfoAndContributionDate
          projectName={
            (projectInfo as Contributions)?.plantProject?.name ||
            (projectInfo as GiftContributionProps)?.metadata?.project?.name
          }
          countryName={(
            projectInfo as Contributions
          )?.plantProject?.country.toLowerCase()}
          tpoName={(projectInfo as Contributions)?.plantProject?.tpo?.name}
          giftSenderName={
            (projectInfo as GiftContributionProps)?.metadata?.giver?.name
          }
          contributionDate={
            Number((projectInfo as Contributions)?.plantDate) ||
            Number((projectInfo as GiftContributionProps)?.created)
          }
          contributionType={
            (projectInfo as Contributions).contributionType ||
            (projectInfo as GiftContributionProps)?._type === 'gift'
          }
          quantity={
            (projectInfo as Contributions)?.treeCount || projectInfo?.quantity
          }
        />
        <TreesOrUnitAreaAndDonateOption
          publicProfileSlug={profile?.slug}
          projectUnit={(projectInfo as Contributions)?.plantProject?.unit}
          projectPurpose={projectInfo?.purpose}
          quantity={
            (projectInfo as Contributions)?.treeCount || projectInfo?.quantity
          }
          contributionType={
            (projectInfo as Contributions).contributionType ||
            (projectInfo as GiftContributionProps)?._type === 'gift'
          }
          gift={(projectInfo as GiftContributionProps)?._type === 'gift'}
          tenantId={(projectInfo as Contributions)?.tenant?.guid}
          projectGUID={
            (projectInfo as Contributions)?.plantProject?.guid ||
            (projectInfo as GiftContributionProps)?.metadata?.project?.id
          }
          isDonatable={
            (projectInfo as Contributions)?.plantProject?.allowDonations ||
            (projectInfo as GiftContributionProps)?.allowDonations
          }
          countryName={(
            projectInfo as Contributions
          )?.plantProject?.country.toLowerCase()}
          tpoName={(projectInfo as Contributions)?.plantProject?.tpo?.name}
        />
      </div>
    </div>
  );
};

export default ContributedToProject;
