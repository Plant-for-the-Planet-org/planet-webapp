import React, { useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projects/components/ProjectSnippet';
import { MapProject } from '../../../../features/common/types/ProjectPropsContextInterface';
import { handleError } from '@planet-sdk/common/build/utils/handleError';
import { APIError } from '@planet-sdk/common/build/types/errors';
import { useTenant } from '../../../../features/common/Layout/TenantContext';

export default function ProjectGrid() {
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState<MapProject[] | null>(null);
  const { tenantConfig } = useTenant();

  useEffect(() => {
    async function loadProjects() {
      const currencyCode = getStoredCurrency();
      try {
        const projects = await getRequest(tenantConfig.id, `/app/projects`, {
          _scope: 'map',
          currency: currencyCode,
          tenant: tenantConfig.id,
          'filter[purpose]': 'trees,conservation',
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
              editMode={false}
              displayPopup={false}
              utmCampaign="vto-fc-2023"
              disableDonations={true}
            />
          </div>
        );
      });
    return allowedProjects;
  };

  return (
    <div className={`${styles.projectGridContainer}`}>
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
