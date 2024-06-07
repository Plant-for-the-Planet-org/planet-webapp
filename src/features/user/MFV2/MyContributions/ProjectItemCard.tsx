import ContributionCountOverflow from './ContributionCountOverflow';
import ContributionSummary from './ContributionSummary';
import DonateButton from './DonateButton';
import ItemMobileHeader from './ItemMobileHeader';
import ProjectTotalContributions from './ProjectTotalContributions';
import styles from './MyContributions.module.scss';
import { MyForestProject } from '../../../common/types/myForestv2';
import { MyContributionsSingleProject } from '../../../common/types/myForestv2';
import { useTranslations } from 'next-intl';
import { CountryCode } from '@planet-sdk/common';
import ItemImage from './ItemImage';
import ProjectSummary from './ProjectSummary';

interface Props {
  project: MyForestProject;
  contributionDetails: MyContributionsSingleProject;
  pageType: 'public' | 'private';
  supportedTreecounter?: string;
}

const ProjectItemCard = ({
  project,
  contributionDetails,
  pageType,
  supportedTreecounter,
}: Props) => {
  // Mobile version - ItemMobileHeader, ProjectTotalContributions, DonateButton, country/tpo (not components), project contribution list (if multiple contributions)
  // Larger screen version - ItemImage, ProjectSummary, ProjectTotalContributions, DonateButton, project contribution list (if multiple contributions)
  const tCountry = useTranslations('Country');
  const tProject = useTranslations('Project');
  const tProfile = useTranslations('Profile.myContributions');

  const giftDetails =
    contributionDetails.contributionCount === 1
      ? contributionDetails.latestContributions[0].giftDetails
      : null;

  const lastThreeContributions = contributionDetails.latestContributions.slice(
    0,
    3
  );

  return (
    <article className={styles.projectItemCard}>
      <section className={styles.sectionOneLandscape}>
        <ItemImage
          imageUrl={project.image}
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
              totalContributionUnits={
                contributionDetails.totalContributionUnits
              }
              contributionUnitType={contributionDetails.contributionUnitType}
            />
            <DonateButton
              {...(pageType === 'public' && supportedTreecounter !== undefined
                ? { type: 'supported', supportedTreecounter }
                : { type: 'unsupported' })}
              projectPurpose={project.purpose}
              buttonText={
                pageType === 'public'
                  ? tProfile('donate')
                  : tProfile('donateAgain')
              }
              projectSlug={project.slug}
              contributionUnitType={project.unitType}
            />
          </div>
        </div>
      </section>
      <section className={styles.sectionOneMobile}>
        <ItemMobileHeader
          type="project"
          projectName={project.name}
          projectImageUrl={project.image}
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
              totalContributionUnits={
                contributionDetails.totalContributionUnits
              }
              contributionUnitType={contributionDetails.contributionUnitType}
            />
            <div className={styles.additionalProjectInfo}>
              {tCountry(
                project.country.toLocaleLowerCase() as Lowercase<CountryCode>
              )}{' '}
              • {tProject('tpoName', { tpoName: project.tpoName })}
            </div>
          </div>
          <DonateButton
            {...(pageType === 'public' && supportedTreecounter !== undefined
              ? { type: 'supported', supportedTreecounter }
              : { type: 'unsupported' })}
            projectPurpose={project.purpose}
            buttonText={
              pageType === 'public'
                ? tProfile('donate')
                : tProfile('donateAgain')
            }
            projectSlug={project.slug}
            contributionUnitType={project.unitType}
          />
        </div>
      </section>
      {contributionDetails.contributionCount > 1 && (
        <section className={styles.sectionTwo}>
          {lastThreeContributions.map((contribution, index) => (
            <ContributionSummary
              key={index}
              contribution={contribution}
              purpose={project.purpose}
            />
          ))}
          {contributionDetails.contributionCount > 3 && (
            <ContributionCountOverflow
              contributionCount={contributionDetails.contributionCount}
              displayedCount={3}
            />
          )}
        </section>
      )}
    </article>
  );
};

export default ProjectItemCard;
