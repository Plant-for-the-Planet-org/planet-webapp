import dynamic from 'next/dynamic';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';
import ProjectLoader from '../../common/ContentLoaders/Projects/ProjectLoader';
import i18next from '../../../../i18n';
import styles from './styles/ProjectsContainer.module.scss';
import {
  getAuthenticatedRequest,
  getRequest,
} from '../../../utils/apiRequests/api';
import AddProject from '../../../../public/assets/images/icons/manageProjects/AddProject';
import Link from 'next/link';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

const ProjectSnippet = dynamic(
  () => import('../../projects/components/ProjectSnippet'),
  {
    loading: () => <ProjectLoader />,
  }
);

export default function ProjectsContainer({profile}: any) {
  const { t, ready } = useTranslation(['donate', 'manageProjects']);
  const [projects, setProjects] = React.useState([]);

  async function loadProjects() {
    await getRequest(`/app/profiles/${profile.id}/projects`).then((projects) => {
      setProjects(projects);
    });
  }

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    loadProjects();
  }, []);

  return ready ? (
    <div className={styles.tpoProjectsContainer}>
      {/* <div className={'profilePageTitle'}>{t('manageProjects:manageProjects')}</div> */}
      <div className={styles.projectsContainer} id="projectsContainer">
        {projects.length < 1 ? (
            <div className={styles.projectNotFound}>
              <LazyLoad>
                <NotFound className={styles.projectNotFoundImage} />
                <h5>{t('donate:noProjectsFound')}</h5>
              </LazyLoad>
            </div>
        ) : (
          <div className={styles.listProjects}>
            <h6 className={styles.projectsTitleText}>
              {t('donate:Projects')}
            </h6>

            {projects.map((project: any) => {
              return (
                <div
                  className={styles.singleProject}
                  key={project.properties.id}
                >
                  <ProjectSnippet
                    key={project.properties.id}
                    project={project.properties}
                    editMode={false}
                  />
                </div>
              );
            })}
            {/* {user ? (
              <Link href="/profile/projects/add-project">
                <div className={styles.singleProject}>
                  <button
                    id={'addProjectBut'}
                    className={styles.projectNotFound}
                  >
                    <AddProject />
                    <h2>{t('manageProjects:addProject')}</h2>
                  </button>
                </div>
              </Link>
            ) : null} */}
          </div>
        )}
      </div>
    </div>
  ) : null;
}
