import dynamic from 'next/dynamic';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../../public/assets/images/NotFound';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import i18next from '../../../../../i18n';
import styles from '../styles/ProjectsContainer.module.scss';
import { getAuthenticatedRequest, getRequest } from '../../../../utils/apiRequests/api';
import { useSession } from 'next-auth/client';
import AddProject from '../../../../../public/assets/images/icons/manageProjects/AddProject';
import Link from 'next/link';

const { useTranslation } = i18next;

const ProjectSnippet = dynamic(() => import('../../../projects/components/ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});

export default function ProjectsContainer({ authenticatedType, userprofile }: any) {
  const { t } = useTranslation(['donate', 'manageProjects']);
  const [session, loading] = useSession();
  const [projects, setProjects] = React.useState([])

  React.useEffect(() => {
    async function loadProjects() {
      // const currencyCode = getStoredCurrency();
      const privateURL = '/app/profile/projects';
      const publicURL = `/app/profiles/${userprofile.id}/projects`;

      if (authenticatedType === 'private') {
        await getAuthenticatedRequest(
          privateURL, session
        ).then(projects => {
          setProjects(projects);
        })
      } else {
        await getRequest(
          publicURL,
        ).then(projects => {
          setProjects(projects);
        })
      }
    }
    loadProjects();
  }, [])

  return (
    <div style={{ margin: 'auto', maxWidth: '950px' }} id="projectsContainer">
      {projects.length < 1 ? (
        authenticatedType === 'private' ? (
          <Link href='/manage-projects/add-project'>
            <div className={styles.singleProject}>
              <div className={styles.projectNotFound}>
                <AddProject />
                <h2>{t('manageProjects:addProject')}</h2>
              </div>
            </div>
          </Link>
        ) : (
            <div className={styles.projectNotFound}>
              <LazyLoad>
                <NotFound className={styles.projectNotFoundImage} />
                <h5>{t('donate:noProjectsFound')}</h5>
              </LazyLoad>
            </div>)
      ) : (
          <div className={styles.listProjects}>
            <h6 className={styles.projectsTitleText}> {t('donate:PROJECTS')} </h6>

            {projects.map((project: any) => {
              return (
                <div className={styles.singleProject} key={project.properties.id}>
                  <ProjectSnippet 
                    key={project.properties.id} 
                    project={project.properties}
                    editMode={authenticatedType === 'private' ? true : false} />
                </div>
              );
            })}
            {
              authenticatedType === 'private' ? (
                <Link href='/manage-projects/add-project'>
                  <div className={styles.singleProject}>
                    <div className={styles.projectNotFound}>
                      <AddProject />
                      <h2>{t('manageProjects:addProject')}</h2>
                    </div>
                  </div>
                </Link>
              ) : (
                  null
                )
            }
          </div>
        )}


    </div>
  );
}
