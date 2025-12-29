import type { APIError, UserPublicProfile } from '@planet-sdk/common';
import type { MapProject } from '../../../common/types/projectv2';

import { useEffect, useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../../public/assets/images/NotFound';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import { useLocale, useTranslations } from 'next-intl';
import styles from './TpoProjects.module.scss';
import { useApi } from '../../../../hooks/useApi';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';

const ProjectSnippet = dynamic(
  () => import('../../../projectsV2/ProjectSnippet'),
  {
    loading: () => <ProjectLoader />,
  }
);

interface Props {
  profile: UserPublicProfile;
}

export default function ProjectsContainer({ profile }: Props) {
  const { getApi } = useApi();
  const t = useTranslations('Donate');
  const locale = useLocale();
  const [projects, setProjects] = useState<MapProject[]>();
  const { setErrors } = useContext(ErrorHandlingContext);

  async function loadProjects() {
    try {
      const projects = await getApi<MapProject[]>(
        `/app/profiles/${profile.id}/projects`
      );
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  }

  useEffect(() => {
    loadProjects();
  }, [locale]);

  if (projects === undefined) return null;

  return (
    <div className={styles.tpoProjects}>
      {projects.length < 1 ? (
        <div className={styles.projectNotFound}>
          <LazyLoad>
            <NotFound className={styles.projectNotFoundImage} />
            <h5>{t('noProjectsFound')}</h5>
          </LazyLoad>
        </div>
      ) : (
        <>
          <h6 className={styles.projectsTitleText}>{t('projects')}</h6>
          <div className={styles.listProjects}>
            {projects
              .filter(
                (project) =>
                  project.properties.purpose === 'trees' ||
                  project.properties.purpose === 'conservation'
              )
              .map((project) => {
                return (
                  <div
                    className={styles.singleProject}
                    key={project.properties.id}
                  >
                    <ProjectSnippet
                      project={project.properties}
                      showTooltipPopups={false}
                    />
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
