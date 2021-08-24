import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import LazyLoad from 'react-lazyload';
import i18next from '../../../../i18n';
import NotFound from '../../../../public/assets/images/NotFound';
import {
  getAuthenticatedRequest
} from '../../../utils/apiRequests/api';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import getImageUrl from '../../../utils/getImageURL';
import ProjectLoader from '../../common/ContentLoaders/Projects/ProjectLoader';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import styles from './ProjectsContainer.module.scss';

const { useTranslation } = i18next;

const ProjectSnippet = dynamic(
  () => import('../../projects/components/ProjectSnippet'),
  {
    loading: () => <ProjectLoader />,
  }
);

export default function ProjectsContainer({}: any) {
  const { t, ready } = useTranslation(['donate', 'manageProjects']);
  const [projects, setProjects] = React.useState([]);

  const { user, contextLoaded, loginWithRedirect, token } = React.useContext(
    UserPropsContext
  );

  async function loadProjects() {
    if (user) {
      await getAuthenticatedRequest('/app/profile/projects', token).then(
        (projects) => {
          setProjects(projects);
        }
      );
    }
  }

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    if (contextLoaded && token) {
      loadProjects();
    }
  }, [contextLoaded, token]);
  
  return ready ? (
    <div className="profilePage">
      <div className={'profilePageTitle'}>Manage Projects</div>
      <div className={'profilePageSubTitle'}>
        Description for Manage Projects
      </div>

      <Link href="/manage-projects/add-project">
        <button
          id={'addProjectBut'}
          className={'primaryButton'}
          style={{ maxWidth: '300px' }}
        >
          {t('manageProjects:addProject')}
        </button>
      </Link>

      <div className={styles.projectsContainer} id="projectsContainer">
        {projects && projects.length < 1 ? (
          <div className={styles.projectNotFound}>
            <LazyLoad>
              <NotFound className={styles.projectNotFoundImage} />
              <h5>{t('donate:noProjectsFound')}</h5>
            </LazyLoad>
          </div>
        ) : (
          <div className={styles.listProjects}>
            {projects.map((project: any) => {
              return <SingleProject project={project.properties} />;
            })}
          </div>
        )}
      </div>
    </div>
  ) : null;
}

function SingleProject({ project }: any) {
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  return (
    <div className={styles.singleProject} key={project.id}>
      {ImageSource ? (
        <img
          src={ImageSource}
          className={styles.projectImage}
          alt={project.name}
        />
      ) : (
        <div className={styles.noProjectImage}></div>
      )}
      <div className={styles.projectInformation}>
        <p className={styles.projectName}>{project.name}</p>
        <p className={styles.projectClassification}>
          {project.classification} •{' '}
          {t('country:' + project.country.toLowerCase())}
        </p>
        <p>
          {localizedAbbreviatedNumber(
            i18n.language,
            Number(project.countPlanted),
            1
          )}{' '}
          {t('common:tree', { count: Number(project.countPlanted) })}
        </p>
        <div className={styles.projectLabels}>
          {/* Needed in future */}
          {/* {!project.isFeatured && (
            <div className={styles.projectLabel}>🛰 ️TreeMapper</div>
          )} */}
          {!project.isFeatured && (
            <div className={styles.projectLabel}>🌟 Featured</div>
          )}
          {!project.allowDonations && (
            <div className={styles.projectLabel}>💸 Accepting Donations</div>
          )}
        </div>
      </div>
      <div className={styles.projectLinksContainer}>
        <Link href={'/' + project.id}>
          <button className={styles.secondaryLink}>View Project</button>
        </Link>
        <Link href={'/manage-projects/' + project.id}>
          <button className={styles.primaryLink}>Edit Project</button>
        </Link>
        {/* <button>
          Edit
        </button> */}
      </div>
    </div>
  );
}
