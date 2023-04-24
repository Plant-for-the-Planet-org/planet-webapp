import dynamic from 'next/dynamic';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';
import ProjectLoader from '../../common/ContentLoaders/Projects/ProjectLoader';
import { useTranslation } from 'next-i18next';
import styles from './styles/ProjectsContainer.module.scss';
import { getRequest } from '../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';

const ProjectSnippet = dynamic(
  () => import('../../projects/components/ProjectSnippet'),
  {
    loading: () => <ProjectLoader />,
  }
);

export default function ProjectsContainer({ profile }: any) {
  const { t, ready, i18n } = useTranslation(['donate', 'manageProjects']);
  const [projects, setProjects] = React.useState([]);
  const { setErrors } = React.useContext(ErrorHandlingContext);

  async function loadProjects() {
    try {
      const projects = await getRequest(
        `/app/profiles/${profile.id}/projects`,
        {
          locale: i18n.language,
        }
      );
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  }

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    loadProjects();
  }, [i18n.language]);

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
            <h6 className={styles.projectsTitleText}>{t('donate:Projects')}</h6>

            {projects.map((project: any) => {
              return (
                <div
                  className={styles.singleProject}
                  key={project.properties.id}
                >
                  <ProjectSnippet
                    project={project.properties}
                    editMode={false}
                    displayPopup={true}
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
