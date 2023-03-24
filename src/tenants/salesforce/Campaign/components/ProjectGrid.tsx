import React, { useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projects/components/ProjectSnippet';
import { TENANT_ID } from '../../../../utils/constants/environment';

export default function ProjectGrid() {
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      const currencyCode = getStoredCurrency();
      const projects = await getRequest(`/app/projects`, handleError, '/', {
        _scope: 'map',
        currency: currencyCode,
        tenant: TENANT_ID,
        'filter[purpose]': 'trees,conservation',
      });
      setProjects(projects);
    }
    loadProjects();
  }, []);

  const renderAllowedProjects = (projects: any) => {
    const allowedProjects = projects
      .filter((project: any) => project.properties.allowDonations === true)
      .map((allowedProject: any) => {
        return (
          <div
            className={`${styles.projectItem}`}
            key={allowedProject.properties.id}
          >
            <ProjectSnippet
              keyString={allowedProject.properties.id}
              project={allowedProject.properties}
              editMode={false}
              utmCampaign="vto-fc-2023"
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
