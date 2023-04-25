import Link from 'next/link';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';
import { getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import getImageUrl from '../../../utils/getImageURL';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './ProjectsContainer.module.scss';
import GlobeContentLoader from '../../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import { useTranslation } from 'next-i18next';
import { handleError, APIError } from '@planet-sdk/common';

function SingleProject({ project }: any) {
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';
  const { t, i18n } = useTranslation(['donate', 'common', 'country']);
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
          {project?.purpose === 'conservation'
            ? project?.metadata?.ecosystems
            : project?.classification}{' '}
          •{' '}
          {project.country === null ? (
            <></>
          ) : (
            t('country:' + project.country.toLowerCase())
          )}
        </p>
        {project.purpose === 'trees' ? (
          <p>
            {localizedAbbreviatedNumber(
              i18n.language,
              Number(project.countPlanted),
              1
            )}{' '}
            {t('common:tree', { count: Number(project.countPlanted) })}
          </p>
        ) : (
          <></>
        )}
        <div className={styles.projectLabels}>
          {/* Needed in future */}
          {/* {!project.isFeatured && (
            <div className={styles.projectLabel}>🛰 ️TreeMapper</div>
          )} */}
          {project.isFeatured ? (
            <div className={styles.projectLabel}>🌟 {t('common:featured')}</div>
          ) : (
            ''
          )}
          {project.allowDonations ? (
            <div className={styles.projectLabel}>
              💸 {t('donate:acceptingDonations')}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={styles.projectLinksContainer}>
        <Link href={'/' + project.id}>
          <button className={styles.secondaryLink}>{t('common:view')}</button>
        </Link>
        <Link href={`/profile/projects/${project.id}?type=basic-details`}>
          <button className={styles.primaryLink}>{t('common:edit')}</button>
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsContainer({}: any) {
  const { t, ready } = useTranslation(['donate', 'manageProjects']);
  const [projects, setProjects] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { user, contextLoaded, token, logoutUser } = useUserProps();

  async function loadProjects() {
    if (user) {
      try {
        const projects = await getAuthenticatedRequest(
          '/app/profile/projects?version=1.2',
          token,
          logoutUser
        );
        setProjects(projects);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/profile');
      }
      setLoader(false);
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
      <div className="profilePageHeader">
        <div>
          <div className={'profilePageTitle'}>
            {t('manageProjects:manageProject')}
          </div>
          <div className={'profilePageSubTitle'}>
            {t('manageProjects:descriptionForManageProjects')}
          </div>
        </div>
      </div>
      <div className={styles.headerCTAs}>
        <Link href="/profile/projects/new-project">
          <button
            // id={'addProjectBut'}
            className="primaryButton"
          >
            {t('manageProjects:addProject')}
          </button>
        </Link>
        <Link href="/profile/payouts">
          <button className="primaryButton">
            {t('manageProjects:managePayoutsButton')}
          </button>
        </Link>
      </div>

      <div className={styles.projectsContainer} id="projectsContainer">
        {loader && <GlobeContentLoader />}
        {projects?.length < 1 && !loader ? (
          <div className={styles.projectNotFound}>
            <LazyLoad>
              <NotFound className={styles.projectNotFoundImage} />
              <h5>{t('donate:noProjectsFound')}</h5>
            </LazyLoad>
          </div>
        ) : (
          <div className={styles.listProjects}>
            {projects.map((project: any, index: any) => {
              return <SingleProject key={index} project={project.properties} />;
            })}
          </div>
        )}
      </div>
    </div>
  ) : null;
}
