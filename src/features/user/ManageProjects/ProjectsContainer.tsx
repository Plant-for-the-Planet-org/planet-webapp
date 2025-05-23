import type { APIError } from '@planet-sdk/common';
import type { Properties } from '../../common/types/project';
import type { Geometry } from '@turf/turf';

import Link from 'next/link';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import getImageUrl from '../../../utils/getImageURL';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './ProjectsContainer.module.scss';
import GlobeContentLoader from '../../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import { useLocale, useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import { useRouter } from 'next/router';
import { generateProjectLink } from '../../../utils/projectV2';
import { useApi } from '../../../hooks/useApi';

interface UserProjectsType {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

function SingleProject({ project }: { project: Properties }) {
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';
  const tDonate = useTranslations('Donate');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const locale = useLocale();
  const router = useRouter();
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
            tCountry((project.country || '').toLowerCase())
          )}
        </p>
        {project.purpose === 'trees' ? (
          <p>
            {localizedAbbreviatedNumber(
              locale,
              Number(project.countPlanted),
              1
            )}{' '}
            {tCommon('tree', { count: Number(project.countPlanted) })}
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
            <div className={styles.projectLabel}>🌟 {tCommon('featured')}</div>
          ) : (
            ''
          )}
          {project.allowDonations ? (
            <div className={styles.projectLabel}>
              💸 {tDonate('acceptingDonations')}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={styles.projectLinksContainer}>
        <Link href={generateProjectLink(project.id, router.asPath, locale)}>
          <button className={styles.secondaryLink}>{tCommon('view')}</button>
        </Link>
        <Link href={`/profile/projects/${project.id}?type=basic-details`}>
          <button className={styles.primaryLink}>{tCommon('edit')}</button>
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsContainer() {
  const tDonate = useTranslations('Donate');
  const tManageProjects = useTranslations('ManageProjects');
  const { getApiAuthenticated } = useApi();
  const [projects, setProjects] = React.useState<UserProjectsType[]>([]);
  const [loader, setLoader] = React.useState(true);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { user, contextLoaded, token } = useUserProps();
  async function loadProjects() {
    if (user) {
      try {
        const projects = await getApiAuthenticated<UserProjectsType[]>(
          '/app/profile/projects',
          { queryParams: { version: '1.2' } }
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

  return (
    <DashboardView
      title={tManageProjects('manageProject')}
      subtitle={
        <div>
          <p>{tManageProjects('descriptionForManageProjects')}</p>
        </div>
      }
    >
      <SingleColumnView>
        <div className={styles.headerCTAs}>
          <Link href="/profile/projects/new-project">
            <button
              // id={'addProjectBut'}
              className="primaryButton"
            >
              {tManageProjects('addProject')}
            </button>
          </Link>
          <Link href="/profile/payouts">
            <button className="primaryButton">
              {tManageProjects('managePayoutsButton')}
            </button>
          </Link>
        </div>

        <div className={styles.projectsContainer} id="projectsContainer">
          {loader && <GlobeContentLoader />}
          {projects?.length < 1 && !loader ? (
            <div className={styles.projectNotFound}>
              <LazyLoad>
                <NotFound className={styles.projectNotFoundImage} />
                <h5>{tDonate('noProjectsFound')}</h5>
              </LazyLoad>
            </div>
          ) : (
            <div className={styles.listProjects}>
              {projects.map((project, index) => {
                return (
                  <SingleProject key={index} project={project.properties} />
                );
              })}
            </div>
          )}
        </div>
      </SingleColumnView>
    </DashboardView>
  );
}
