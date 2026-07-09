import type { MapProject } from '../../../../features/common/types/projectv2';
import type { APIError } from '@planet-sdk/common/build/types/errors';

import { useEffect, useState } from 'react';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projectsV2/ProjectSnippet';
import { handleError } from '@planet-sdk/common/build/utils/handleError';
import { useApi } from '../../../../hooks/useApi';
import { useLocale } from 'next-intl';
import { clsx } from 'clsx';
import { useTenantStore } from '../../../../stores/tenantStore';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useCurrencyStore } from '../../../../stores/currencyStore';

export default function ProjectGrid() {
  const { getApi } = useApi();
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // local state
  const [projects, setProjects] = useState<MapProject[] | null>(null);
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    async function loadProjects() {
      try {
        const projects = await getApi<MapProject[]>('/app/projects', {
          queryParams: {
            _scope: 'map',
            currency: currencyCode,
            locale: locale,
            tenant: tenantConfig.id,
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
      .filter((project) => project.properties.allowDonations === true)
      .map((allowedProject) => {
        return (
          <div
            className={styles.projectItem}
            key={allowedProject.properties.id}
          >
            <ProjectSnippet
              project={allowedProject.properties}
              showTooltipPopups={true}
              disableDonations={true}
              utmCampaign="243BY4FZ71"
            />
          </div>
        );
      });
    return allowedProjects;
  };

  return (
    <div className={styles.projectGridContainer}>
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
    </div>
  );
}
