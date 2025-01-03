import type { MapProject } from '../../../../features/common/types/ProjectPropsContextInterface';
import type { APIError } from '@planet-sdk/common/build/types/errors';

import React, { useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ProjectGrid.module.scss';
import ProjectSnippet from '../../../../features/projects/components/ProjectSnippet';
import { handleError } from '@planet-sdk/common/build/utils/handleError';
import { useTenant } from '../../../../features/common/Layout/TenantContext';

const MANGROVE_PROJECTS = [
  'proj_4urzfQ47Xwv5SlNOurnXn2hU',
  'proj_7gmlF7Q8aL65V7j7AG9NW8Yy',
  'proj_StWEs2TGZFPf1WgfT6IJQoLC',
  'proj_mgtS4XFpiL6RCieGK403qDG5',
  'proj_FEvW3WIB0Vcq2far1ppJvgLs',
  'proj_AzYMCCfmCnrwfS8nilKFng8z',
  'proj_70kDfWL50GRS79MHDaCXMwY1',
  'proj_ekdaWSYWHRBdtAzncLVdclzP',
  'proj_h27ErrwYmhAGB5jp6nyLGEkN',
  'proj_sRvqi265caRiKyLaog760QsT',
];

export default function ProjectGrid() {
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState<MapProject[] | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const currencyCode = getStoredCurrency();
      try {
        const projects = await getRequest<MapProject[]>({
          tenant: tenantConfig.id,
          url: `/app/projects`,
          queryParams: {
            _scope: 'map',
            currency: currencyCode,
            tenant: tenantConfig.id,
            'filter[purpose]': 'trees,conservation',
          },
        });
        setProjects(projects);
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setErrors(handleError(err as APIError));
        redirect('/');
      }
    }
    loadProjects();
  }, []);

  const renderAllowedProjects = (projects: MapProject[]) => {
    const allowedProjects = projects
      .filter((project) => MANGROVE_PROJECTS.includes(project.properties.id))
      .sort((projectA, projectB) => {
        if (
          projectA.properties.allowDonations ===
          projectB.properties.allowDonations
        ) {
          return 0;
        } else if (
          projectA.properties.allowDonations &&
          !projectB.properties.allowDonations
        ) {
          return -1;
        } else {
          return 1;
        }
      })
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
            />
          </div>
        );
      });
    return allowedProjects;
  };

  return (
    <div className={`${styles.projectGridContainer}`} id="project-grid">
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
          {projects ? (
            renderAllowedProjects(projects)
          ) : (
            <>{!isLoaded ? <p>Loading projects...</p> : ''}</>
          )}
        </div>
      </div>
    </div>
  );
}
