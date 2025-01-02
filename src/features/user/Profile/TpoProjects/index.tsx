import dynamic from 'next/dynamic';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../../public/assets/images/NotFound';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import { useLocale, useTranslations } from 'next-intl';
import styles from './TpoProjects.module.scss';
import { getRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError, UserPublicProfile } from '@planet-sdk/common';
import { MapProject } from '../../../common/types/ProjectPropsContextInterface';
import { useTenant } from '../../../common/Layout/TenantContext';

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
  const { tenantConfig } = useTenant();
  const t = useTranslations('Donate');
  const locale = useLocale();
  const [projects, setProjects] = React.useState<MapProject[]>();
  const { setErrors } = React.useContext(ErrorHandlingContext);

  async function loadProjects() {
    try {
      const projects = await getRequest<MapProject[]>({
        tenant: tenantConfig?.id,
        url: `/app/profiles/${profile.id}/projects`,
        queryParams: {
          locale: locale,
        },
      });
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  }

  React.useEffect(() => {
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
