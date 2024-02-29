import React, { useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projects/components/ProjectSnippet';
import { MapProject } from '../../../../features/common/types/ProjectPropsContextInterface';
import { TENANT_ID } from '../../../../utils/constants/environment';
import { handleError } from '@planet-sdk/common/build/utils/handleError';
import { APIError } from '@planet-sdk/common/build/types/errors';

/* const MANGROVE_PROJECTS = [
  'proj_StWEs2TGZFPf1WgfT6IJQoLC',
  'proj_YPXJ9e9iiy4Ras0zknJkxyH6',
  'proj_cVpKWdkq5nM31NfQ5Yn9pXMY',
  'proj_FEvW3WIB0Vcq2far1ppJvgLs',
  'proj_AzYMCCfmCnrwfS8nilKFng8z',
  'proj_mgtS4XFpiL6RCieGK403qDG5',
  'proj_70kDfWL50GRS79MHDaCXMwY1',
  'proj_4urzfQ47Xwv5SlNOurnXn2hU',
  'proj_7gmlF7Q8aL65V7j7AG9NW8Yy',
]; */

export default function ProjectGrid() {
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState<MapProject[] | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const currencyCode = getStoredCurrency();
      try {
        const projects = await getRequest<MapProject[]>(`/app/projects`, {
          _scope: 'map',
          currency: currencyCode,
          tenant: TENANT_ID,
          'filter[purpose]': 'trees,conservation',
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
      // .filter((project) => MANGROVE_PROJECTS.includes(project.properties.id))
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
