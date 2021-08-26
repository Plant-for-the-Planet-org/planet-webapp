import dynamic from 'next/dynamic';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../../public/assets/images/NotFound';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import i18next from '../../../../../i18n';
import styles from '../styles/ProjectsContainer.module.scss';
import {
  getAuthenticatedRequest,
  getRequest,
} from '../../../../utils/apiRequests/api';
import AddProject from '../../../../../public/assets/images/icons/manageProjects/AddProject';
import Link from 'next/link';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

const ProjectSnippet = dynamic(
  () => import('../../../projects/components/ProjectSnippet'),
  {
    loading: () => <ProjectLoader />,
  }
);

export default function ProjectsContainer({
  authenticatedType,
  userprofile,
}: any) {
  const { t, ready } = useTranslation(['donate', 'manageProjects']);
  const [projects, setProjects] = React.useState([]);

  const { user, contextLoaded, loginWithRedirect, token } = React.useContext(
    UserPropsContext
  );

  async function loadProjects() {
    // const currencyCode = getStoredCurrency();
    const privateURL = '/app/profile/projects';
    const publicURL = `/app/profiles/${userprofile.id}/projects`;

    if (authenticatedType === 'private') {
      await getAuthenticatedRequest(privateURL, token).then((projects) => {
        setProjects(projects);
      });
    } else {
      await getRequest(publicURL).then((projects) => {
        setProjects(projects);
      });
    }
  }

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    if (contextLoaded) {
      loadProjects();
    }
  }, [contextLoaded]);

  return ready ? (
    <div style={{ margin: 'auto', maxWidth: '950px' }} id="projectsContainer">
      {projects.length < 1 ? (
        authenticatedType === 'private' ? (
          <Link href="/manage-projects/add-project">
            <div className={styles.singleProject}>
              <button id={'addProjectBut'} className={styles.projectNotFound}>
                <AddProject />
                <h2 style={{color: 'var(--primary-font-color)'}}>{t('manageProjects:addProject')}</h2>
              </button>
            </div>
          </Link>
        ) : (
          <div className={styles.projectNotFound}>
            <LazyLoad>
              <NotFound className={styles.projectNotFoundImage} />
              <h5 style={{color: 'var(--primary-font-color)'}}>{t('donate:noProjectsFound')}</h5>
            </LazyLoad>
          </div>
        )
      ) : (
        <div className={styles.listProjects}>
          <h6 className={styles.projectsTitleText}> {t('donate:PROJECTS')} </h6>

          {projects.map((project: any) => {
            return (
              <div className={styles.singleProject} key={project.properties.id}>
                <ProjectSnippet
                  key={project.properties.id}
                  project={project.properties}
                  editMode={authenticatedType === 'private' ? true : false}
                />
              </div>
            );
          })}
          {authenticatedType === 'private' ? (
            <Link href="/manage-projects/add-project">
              <div className={styles.singleProject}>
                <button id={'addProjectBut'} className={styles.projectNotFound}>
                  <AddProject />
                  <h2 style={{color: 'var(--primary-font-color)'}}>{t('manageProjects:addProject')}</h2>
                </button>
              </div>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  ) : null;
}
