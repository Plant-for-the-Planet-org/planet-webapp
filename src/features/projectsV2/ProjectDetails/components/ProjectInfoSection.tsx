import AboutProject from './AboutProject';
import ProjectReview from './ReviewReports';
import {
  TreeProjectConcise,
  ConservationProjectConcise,
  TreeProjectExtended,
  ConservationProjectExtended,
} from '@planet-sdk/common';
import styles from '../styles/ProjectDetails.module.scss';
import KeyInfo from './KeyInfo';
import AdditionalInfo from './AdditionalInfo';
import VideoPlayer from './VideoPlayer';
import ImagesSlider from './ImagesSlider';
import ProjectDownloads from './ProjectDownloads';

interface ProjectInfoSectionProps {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
}

const ProjectInfoSection = ({ project }: ProjectInfoSectionProps) => {
  return (
    <section className={styles.projectInfoContainer}>
      {project.reviews && project.reviews?.length > 0 && (
        <ProjectReview reviews={project.reviews} />
      )}
      <AboutProject description={project.description} wordCount={60} />
      {project.videoUrl && <VideoPlayer videoUrl={project.videoUrl} />}
      {project?.images?.length > 0 && (
        <ImagesSlider images={project.images} type={'project'} />
      )}
      <KeyInfo
        abandonment={project?.yearAbandoned}
        firstTree={project.firstTreePlanted}
        plantingDensity={project.plantingDensity}
        maxPlantingDensity={undefined}
        employees={project.employeesCount}
        plantingSeasons={project.plantingSeasons}
      />
      <AdditionalInfo
        mainChallengeText={project.metadata?.mainChallenge}
        siteOwnershipText={project.metadata?.siteOwnerName}
        siteOwnershipType={project.metadata?.siteOwnerType}
        causeOfDegradationText={project.metadata.degradationCause}
        whyThisSiteText={'xyz'}
        longTermProtectionText={project.metadata.longTermPlan}
        acquiredSince={project.metadata.acquisitionYear}
      />
      {/* <ProjectDownloads /> */}
    </section>
  );
};

export default ProjectInfoSection;
