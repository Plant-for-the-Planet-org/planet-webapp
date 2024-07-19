import { FC } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projects/components/maps/Credits';
import { SetState } from '../../types/common';

interface ProjectsLayoutProps {
  setCurrencyCode: SetState<string>;
}

const ProjectsLayout: FC<ProjectsLayoutProps> = ({
  children,
  setCurrencyCode,
}) => {
  return (
    <div className={styles.projectsLayout}>
      <main className={styles.mainContent}>
        <section className={styles.contentContainer}>{children}</section>
        <section className={styles.mapContainer}></section>
      </main>
      <Credits setCurrencyCode={setCurrencyCode} />
    </div>
  );
};

export default ProjectsLayout;
