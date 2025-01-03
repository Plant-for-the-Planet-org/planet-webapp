import type {
  APIError,
  TreeProjectExtended,
  ConservationProjectExtended,
} from '@planet-sdk/common';

import { useContext, useEffect, useState } from 'react';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/ContentSection.module.scss';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import { handleError } from '@planet-sdk/common';
import ProjectSnippet from '../../../../features/projects/components/ProjectSnippet';
import { getRequest } from '../../../../utils/apiRequests/api';
import { useTenant } from '../../../../features/common/Layout/TenantContext';

export default function ContentSection() {
  const projectSlug = 'restoring-guatemala';
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const currencyCode = getStoredCurrency();
  const { tenantConfig } = useTenant();

  const [project, setProject] = useState<
    TreeProjectExtended | ConservationProjectExtended | null
  >(null);
  useEffect(() => {
    async function loadProject() {
      try {
        const project = await getRequest<
          TreeProjectExtended | ConservationProjectExtended
        >({
          tenant: tenantConfig.id,
          url: `/app/projects/${projectSlug}`,
          queryParams: {
            _scope: 'extended',
            currency: currencyCode,
          },
        });
        setProject(project);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
      }
    }
    if (projectSlug) {
      loadProject();
    }
  }, [projectSlug, currencyCode]);
  return (
    <div className={`${styles.contentSectionContainer}`}>
      <div className={`${gridStyles.fluidContainer} ${styles.contentSection}`}>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <h2>World Ocean Month Fundraising Challenge</h2>
            <p className={`${styles.contentSectionSubhead} ${styles.bold}`}>
              Powered by Oceanforce
            </p>
            <p className={`${styles.contentSectionSubhead}`}>
              Help us conserve, restore, and grow 15,000 mangroves throughout
              the month of June. Everyone is eligible to participate! Click on
              the blue Donate button below to donate.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd8} ${gridStyles.col12} ${gridStyles.textCenter}`}
          >
            <p>
              June is World Oceans Month, and we are inviting Salesforce
              employees and friends from around the world to join Oceanforce in
              our commitment to protect and restore the ocean.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
          >
            <img
              src="/tenants/salesforce/images/oceanforce_1.png"
              className={gridStyles.illustration}
              alt=""
            />
          </div>
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
          >
            <p>
              Mangrove forests are the ultimate climate champion and a bedrock
              for biodiversity: they provide food, shelter, and livelihoods;
              support biodiversity; build coastal resilience; and are among the
              world&apos;s most productive carbon sinks. Put simply, mangroves
              are critically important for climate, nature, and people,
              including many of the world&apos;s most vulnerable communities,
              which is why Salesforce has placed a strategic priority on
              mangroves this year.
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
            <p className={`${styles.contentSectionQuote}`}>
              <em>
                “Mangroves are unparalleled in their role as a powerful climate
                solution, a bedrock of biodiversity, and a source of livelihood
                for millions of people around the world”{' '}
              </em>{' '}
              - Suzanne DiBianca, EVP and Chief Impact Officer at Salesforce
            </p>
          </div>
        </div>
        <div
          className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
        >
          <div
            className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
          >
            <p>
              By participating in this fundraising challenge, you will also be a
              part of Salesforce&apos;s commitment to conserve, restore, and
              grow 100 million trees as a part of the{' '}
              <a href="https://www.1t.org/" target="_blank" rel="noreferrer">
                1t.org
              </a>{' '}
              global trillion tree movement!
            </p>
            <p>
              We are driving donations to support an impactful mangrove tree
              project in Guatemala. Guatemala has one of the most extensive and
              diverse forest systems in Central America. Its name is said to
              mean “land of the trees” in the Mayan-Toltec language. Sadly, the
              country is losing these precious forests at a rapid rate. This
              project aims to bring back the healthy forests that have
              characterized the country since ancient times.
            </p>
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
