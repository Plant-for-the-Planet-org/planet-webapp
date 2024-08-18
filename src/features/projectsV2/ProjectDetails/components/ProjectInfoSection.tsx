import AboutProject from './AboutProject';
import ProjectReview from './ReviewReports';
import {
  TreeProjectConcise,
  ConservationProjectConcise,
  TreeProjectExtended,
  ConservationProjectExtended,
} from '@planet-sdk/common';
import styles from '../styles/ProjectDetails.module.scss';

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
      <ProjectReview reviews={project.reviews} />
      <AboutProject description={project.description} wordCount={60} />
    </section>
  );
};

export default ProjectInfoSection;
