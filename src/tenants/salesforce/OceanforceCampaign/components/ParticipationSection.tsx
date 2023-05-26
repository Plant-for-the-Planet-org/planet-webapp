import React, { useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ParticipationSection.module.scss';
import { handleError, APIError, ProjectExtended } from '@planet-sdk/common';
import ProjectSnippet from '../../../../features/projects/components/ProjectSnippet';

export default function ParticipationSection() {
  const projectSlug = 'restoring-guatemala';
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  const [project, setProject] = useState<ProjectExtended | null>(null);
  useEffect(() => {
    async function loadProject() {
      const currencyCode = getStoredCurrency();
      try {
        const project = await getRequest<ProjectExtended>(
          `https://app.plant-for-the-planet.org/app/projects/${projectSlug}`,
          {
            _scope: 'extended',
            currency: currencyCode,
          }
        );
        setProject(project);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
      }
    }
    if (projectSlug) {
      loadProject();
    }
  }, [projectSlug]);

  return (
    <div className={`${styles.participationSectionContainer}`}>
      <div
        className={`${gridStyles.fluidContainer} ${styles.participationSection}`}
      >
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter} ${styles.participationInfo}`}
          >
            <h3>How I can participate</h3>
            <p>Everyone is eligible to participate!</p>
            <h4>Employees-Only:</h4>
            <ul>
              <li>
                To utilize the power of donation-matching, donate $50 or more to
                the Guatemala project. You will then receive a donation
                confirmation email from Plant-for-the-Planet.
              </li>
              <li>
                Next, request your Salesforce Donation Match in Volunteerforce
                and upload your confirmation from Plant-for-the-Planet.
              </li>
              <li>
                Can&apos;t donate $50? That&apos;s ok! Every dollar helps us
                reach our goal.
              </li>
            </ul>
            <p>Click on the project alongside to learn more about it.</p>
          </div>
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg4} ${gridStyles.col12}`}
          >
            {project !== null && (
              <div className={styles.projectItem}>
                <ProjectSnippet
                  project={project}
                  editMode={false}
                  displayPopup={false}
                  utmCampaign="oceanforce-2023"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
