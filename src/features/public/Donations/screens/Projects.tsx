import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import SearchIcon from './../../../../assets/images/icons/SearchIcon';
import styles from './../styles/Projects.module.scss';

const AllProjects = dynamic(() => import('../components/AllProjects'), {
  ssr: false,
  loading: () => <ProjectLoader />,
});
interface Props {
  projects: Array<any>;
}

function Projects({ projects }: Props): ReactElement {
  const [selectedTab, setSelectedTab] = React.useState('featured');

  function getProjects(projects: Array<any>, type: string) {
    if (type === 'featured') {
      return projects.filter(
        (project: { properties: { isFeatured: boolean } }) =>
          project.properties.isFeatured === true
      );
    } else if (type === 'all') {
      return projects;
    }
  }

  const allProjects = React.useMemo(() => getProjects(projects, 'all'), [
    projects,
  ]);
  const featuredProjects = React.useMemo(
    () => getProjects(projects, 'featured'),
    [projects]
  );

  const AllProjectsProps = {
    projects: allProjects,
  };
  const FeaturedProjectsProps = {
    projects: featuredProjects,
  };
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.header}>
          <div className={styles.tabButtonContainer}>
            <div
              className={styles.tabButton}
              onClick={() => setSelectedTab('featured')}
            >
              <div
                className={
                  selectedTab === 'featured'
                    ? styles.tabButtonSelected
                    : styles.tabButtonText
                }
              >
                Transparent Projects
              </div>
              {selectedTab === 'featured' ? (
                <div className={styles.tabButtonSelectedIndicator} />
              ) : null}
            </div>

            <div
              className={styles.tabButton}
              onClick={() => setSelectedTab('all')}
            >
              <div
                className={
                  selectedTab === 'all'
                    ? styles.tabButtonSelected
                    : styles.tabButtonText
                }
              >
                All {projects.length} Projects
              </div>
              {selectedTab === 'all' ? (
                <div className={styles.tabButtonSelectedIndicator} />
              ) : null}
            </div>
          </div>
          <div className={styles.searchIcon}>
            <SearchIcon />
          </div>
        </div>

        <div className={styles.projectsContainer}>
          {selectedTab === 'all' ? (
            <AllProjects {...AllProjectsProps} />
          ) : (
            <AllProjects {...FeaturedProjectsProps} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
