import type { MapProject } from '../../../../features/common/types/ProjectPropsContextInterface';
import type { APIError } from '@planet-sdk/common/build/types/errors';

import React, { useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projectsV2/ProjectSnippet';
import { handleError } from '@planet-sdk/common/build/utils/handleError';
import { useTenant } from '../../../../features/common/Layout/TenantContext';

export default function ProjectGrid() {
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const [projects, setProjects] = useState<MapProject[] | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const currencyCode = getStoredCurrency();
      try {
        const projects = await getRequest({
          tenant: tenantConfig.id,
          url: `/app/projects`,
          queryParams: {
            _scope: 'map',
            currency: currencyCode,
            tenant: tenantConfig.id,
            'filter[purpose]': 'trees,conservation',
          },
        });
        setProjects(projects as MapProject[]);
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
              utmCampaign="251Y48Z1NR"
            />
          </div>
        );
      });
    return allowedProjects;
  };

  return (
    <div className={`${styles.projectGridContainer}`} id="projects">
      <div className={`${gridStyles.fluidContainer} ${styles.projectGrid}`}>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h3>Projects</h3>
            <p className={styles.contentSectionSubhead}>
              You can donate to these projects.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${styles.projectList}`}
        >
          {projects ? renderAllowedProjects(projects) : <></>}
        </div>
      </div>
    </div>
  );
}
