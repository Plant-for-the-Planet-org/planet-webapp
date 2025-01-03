import type {
  MyForestProject,
  ProfilePageType,
} from '../../../common/types/myForest';
import type { MyContributionsSingleProject } from '../../../common/types/myForest';
import type { CountryCode } from '@planet-sdk/common';
import type { ComponentProps } from 'react';

import ContributionCountOverflow from './ContributionCountOverflow';
import ContributionSummary from './ContributionSummary';
import DonateButton from './DonateButton';
import ItemMobileHeader from './ItemMobileHeader';
import ProjectTotalContributions from './ProjectTotalContributions';
import styles from './MyContributions.module.scss';
import { useTranslations } from 'next-intl';
import ItemImage from './ItemImage';
import ProjectSummary from './ProjectSummary';
import getImageUrl from '../../../../utils/getImageURL';

interface Props {
  project: MyForestProject;
  contributionDetails: MyContributionsSingleProject;
  profilePageType: ProfilePageType;
  supportedTreecounter?: string;
}

export type ProjectItemCardProps = ComponentProps<typeof ProjectItemCard>;

const ProjectItemCard = ({
  project,
  contributionDetails,
  profilePageType,
  supportedTreecounter,
}: Props) => {
  // Mobile version - ItemMobileHeader, ProjectTotalContributions, DonateButton, country/tpo (not components), project contribution list (if multiple contributions)
  // Larger screen version - ItemImage, ProjectSummary, ProjectTotalContributions, DonateButton, project contribution list (if multiple contributions)
  const tCountry = useTranslations('Country');
  const tProject = useTranslations('Project');
  const tProfile = useTranslations('Profile.myContributions');

  const {
    contributionCount,
    latestContributions,
    totalContributionUnits,
    contributionUnitType,
  } = contributionDetails;

  const giftDetails =
    contributionCount === 1 ? latestContributions[0].giftDetails : null;

  const lastTwoContributions = latestContributions.slice(0, 2);

  const imageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  const projectType =
    project.purpose === 'conservation'
      ? 'conservation'
      : project.unitType === 'm2'
      ? 'restoration'
      : 'trees';

  return (
    <article className={`${styles.projectItemCard} ${styles[projectType]}`}>
      <section className={styles.sectionOneLandscape}>
        <ItemImage
          imageUrl={imageSource}
          {...(giftDetails !== null && { giftDetails })}
        />
        <div className={styles.itemInfo}>
          <ProjectSummary
            projectName={project.name}
            projectCountry={project.country}
            projectTpoName={project.tpoName}
            {...(project.purpose === 'trees'
              ? {
                  projectPurpose: project.purpose,
                  projectClassification: project.classification,
                }
              : {
                  projectPurpose: project.purpose,
                  projectEcosystem: project.ecosystem,
                })}
          />
          <div className={styles.totalContributionsAndCTA}>
            <ProjectTotalContributions
              projectPurpose={project.purpose}
              totalContributionUnits={totalContributionUnits}
              contributionUnitType={contributionUnitType}
            />
            {project.allowDonations === true && (
              <DonateButton
                {...(profilePageType === 'public' &&
                supportedTreecounter !== undefined
                  ? { type: 'supported', supportedTreecounter }
                  : { type: 'unsupported' })}
                projectPurpose={project.purpose}
                buttonText={
                  profilePageType === 'public'
                    ? tProfile('donate')
                    : tProfile('donateAgain')
                }
                projectSlug={project.slug}
                contributionUnitType={project.unitType}
              />
            )}
          </div>
        </div>
      </section>
      <section className={styles.sectionOneMobile}>
        <ItemMobileHeader
          type="project"
          projectName={project.name}
          projectImageUrl={imageSource}
          {...(project.purpose === 'trees'
            ? {
                projectPurpose: project.purpose,
                projectClassification: project.classification,
              }
            : {
                projectPurpose: project.purpose,
                projectEcosystem: project.ecosystem,
              })}
          {...(giftDetails !== null && { giftDetails })}
        />

        <div className={styles.aggregateInfoAndActions}>
          <div className={styles.aggregateInfo}>
            <ProjectTotalContributions
              projectPurpose={project.purpose}
              totalContributionUnits={totalContributionUnits}
              contributionUnitType={contributionUnitType}
            />
            <div className={styles.additionalProjectInfo}>
              {tCountry(
                project.country.toLocaleLowerCase() as Lowercase<CountryCode>
              )}{' '}
              • {tProject('tpoName', { tpoName: project.tpoName })}
            </div>
          </div>
          {project.allowDonations === true && (
            <DonateButton
              {...(profilePageType === 'public' &&
              supportedTreecounter !== undefined
                ? { type: 'supported', supportedTreecounter }
                : { type: 'unsupported' })}
              projectPurpose={project.purpose}
              buttonText={
                profilePageType === 'public'
                  ? tProfile('donate')
                  : tProfile('donateAgain')
              }
              projectSlug={project.slug}
              contributionUnitType={project.unitType}
            />
          )}
        </div>
      </section>
      {contributionCount > 1 && (
        <section className={`${styles.sectionTwo} ${styles[projectType]}`}>
          {lastTwoContributions.map((contribution, index) => (
            <ContributionSummary
              key={index}
              contribution={contribution}
              purpose={project.purpose}
            />
          ))}
          {contributionCount > 2 && (
            <ContributionCountOverflow
              contributionCount={contributionCount}
              displayedCount={2}
            />
          )}
        </section>
      )}
    </article>
  );
};

export default ProjectItemCard;
