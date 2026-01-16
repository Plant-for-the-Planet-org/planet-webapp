import type {
  APIError,
  CountryCode,
  ProfileProjectFeature,
  ProfileProjectPropertiesConservation,
  ProfileProjectPropertiesFund,
  ProfileProjectPropertiesTrees,
} from '@planet-sdk/common';

import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';
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
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useAuthStore } from '../../../stores';

type ProjectProperties =
  | ProfileProjectPropertiesFund
  | ProfileProjectPropertiesTrees
  | ProfileProjectPropertiesConservation;

function SingleProject({ project }: { project: ProjectProperties }) {
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';
  const tDonate = useTranslations('Donate');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const count =
    project.unitType === 'tree'
      ? project.unitsContributed?.tree
      : project.unitsContributed?.m2;
  const formattedCount = useMemo(
    () => localizedAbbreviatedNumber(locale, Number(count), 1),
    [count]
  );
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
            ? project?.metadata?.ecosystem
            : (project as ProfileProjectPropertiesTrees)?.classification}{' '}
          •{' '}
          {project.country === null ? (
            <></>
          ) : (
            tCountry(
              (project.country || '').toLowerCase() as Lowercase<CountryCode>
            )
          )}
        </p>
        <p className={styles.projectUnitsAchieved}>
          {count !== undefined &&
            project.unitType !== 'currency' &&
            tCommon(`unitTypes.${project.unitType}`, { formattedCount, count })}
        </p>
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
        <Link
          href={localizedPath(generateProjectLink(project.id, router.asPath))}
        >
          <button className={styles.secondaryLink}>{tCommon('view')}</button>
        </Link>
        <Link
          href={localizedPath(
            `/profile/projects/${project.id}?type=basic-details`
          )}
        >
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
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const { user, contextLoaded } = useUserProps();
  const { localizedPath } = useLocalizedPath();
  // local state
  const [projects, setProjects] = useState<ProfileProjectFeature[]>([]);
  const [loader, setLoader] = useState(true);
  //store: state
  const token = useAuthStore((state) => state.token);

  async function loadProjects() {
    if (user) {
      try {
        const projects = await getApiAuthenticated<ProfileProjectFeature[]>(
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
  useEffect(() => {
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
          <Link href={localizedPath('/profile/projects/new-project')}>
            <button
              // id={'addProjectBut'}
              className="primaryButton"
            >
              {tManageProjects('addProject')}
            </button>
          </Link>
          <Link href={localizedPath('/profile/payouts')}>
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
