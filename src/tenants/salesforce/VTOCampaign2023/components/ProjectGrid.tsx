import type { MapProject } from '../../../../features/common/types/ProjectPropsContextInterface';
import type { APIError } from '@planet-sdk/common/build/types/errors';

import { useEffect, useState, useContext } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { useApi } from '../../../../hooks/useApi';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projectsV2/ProjectSnippet';
import { handleError } from '@planet-sdk/common/build/utils/handleError';
import { useLocale } from 'next-intl';
import { useTenant } from '../../../../features/common/Layout/TenantContext';
import { clsx } from 'clsx';

export default function ProjectGrid() {
  const { getApi } = useApi();
  const locale = useLocale();
  const { tenantConfig } = useTenant();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState<MapProject[] | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const currencyCode = getStoredCurrency();
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
        redirect('/');
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
            className={`${styles.projectItem}`}
            key={allowedProject.properties.id}
          >
            <ProjectSnippet
              project={allowedProject.properties}
              showTooltipPopups={true}
              utmCampaign="vto-fc-2023"
              disableDonations={true}
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
