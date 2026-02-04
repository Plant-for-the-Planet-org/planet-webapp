import type { MapProject } from '../../../../features/common/types/projectv2';
import type { APIError } from '@planet-sdk/common/build/types/errors';

import { useEffect, useState } from 'react';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projectsV2/ProjectSnippet';
import { handleError } from '@planet-sdk/common/build/utils/handleError';
import { useTenant } from '../../../../features/common/Layout/TenantContext';
import { useApi } from '../../../../hooks/useApi';
import { useLocale } from 'next-intl';
import { clsx } from 'clsx';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import { useCurrencyStore } from '../../../../stores/currencyStore';

export default function ProjectGrid() {
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const { getApi } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // local state
  const [projects, setProjects] = useState<MapProject[] | null>(null);
  // store: state
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  // store : action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    async function loadProjects() {
      try {
        const projects = await getApi<MapProject[]>(`/app/projects`, {
          queryParams: {
            _scope: 'map',
            currency: currencyCode,
            tenant: tenantConfig.id,
            locale: locale,
            'filter[purpose]': 'trees,conservation',
          },
        });
        setProjects(projects);
      } catch (err) {
        setErrors(handleError(err as APIError));
        router.push(localizedPath('/'));
      }
    }
    loadProjects();
  }, []);

  const renderAllowedProjects = (projects: MapProject[]) => {
    const allowedProjects = projects
      .filter((project) => project.properties.allowDonations)
      .map((allowedProject) => {
        return (
          <div
            className={styles.projectItem}
            key={allowedProject.properties.id}
          >
            <ProjectSnippet
              project={allowedProject.properties}
              showTooltipPopups={true}
              utmCampaign="251Y48Z1NR"
            />
          </div>
        );
      });
    return allowedProjects;
  };

  return (
    <section className={clsx(styles.projectGridContainer)} id="projects">
      <div className={clsx(gridStyles.fluidContainer, styles.projectGrid)}>
        <div
          className={clsx(gridStyles.gridRow, gridStyles.justifyContentCenter)}
        >
          <div className={clsx(gridStyles.colMd8, gridStyles.col12)}>
            <h3>Projects</h3>
            <p className={styles.contentSectionSubhead}>
              You can donate to these projects.
            </p>
          </div>
        </div>
        <div
          className={clsx(
            gridStyles.gridRow,
            gridStyles.justifyContentCenter,
            styles.projectList
          )}
        >
          {projects ? renderAllowedProjects(projects) : <></>}
        </div>
      </div>
    </section>
  );
}
