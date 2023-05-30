import React, { useContext, useEffect, useState } from 'react';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { ThemeContext } from '../../../../theme/themeContext';
import { getRequest } from '../../../../utils/apiRequests/api';
import getStoredCurrency from '../../../../utils/countryCurrency/getStoredCurrency';
import gridStyles from './../styles/Grid.module.scss';
import styles from './../styles/SeaOfTrees.module.scss';
import { handleError, APIError } from '@planet-sdk/common';

export default function SeaOfTrees() {
  const projectID = 'proj_7gmlF7Q8aL65V7j7AG9NW8Yy';
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  const [project, setProject] = useState(null);
  useEffect(() => {
    async function loadProject() {
      const currencyCode = getStoredCurrency();
      try {
        const project = await getRequest(`/app/projects/${projectID}`, {
          _scope: 'extended',
          currency: currencyCode,
        });
        setProject(project);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
      }
    }
    if (projectID) {
      loadProject();
    }
  }, [projectID]);

  const { theme } = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const handleClose = (reason: string) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {/* {project && <Modal
        className={`modal ${theme} modalContainer`}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        hideBackdrop
      >
        <DonationsPopup project={project} onClose={handleClose} />
      </Modal>
      } */}
      <div className={`${styles.seaOfTreesContainer}`}>
        <div className={`${gridStyles.fluidContainer} ${styles.seaOfTrees}`}>
          <div
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
          >
            <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
              <h3>Blue Carbon Ocean Sustainability Program</h3>
              <p className={styles.contentSectionSubhead}>
                Where Ocean Sustainability meets Trees.
              </p>
              <p>
                Bold Ocean-Climate Action is necessary to create a just and
                sustainable future where everyone can thrive. We strive for
                Ocean Action for all, by all.
              </p>
              <p>
                The Salesforce Ocean Sustainability Program taps into the full
                power of Salesforce to protect, restore, and invest in
                mangroves, kelp, corals, salt marshes, sea grass, and oyster
                reefs.
              </p>
              <p>
                The improved protection and restoration of these ocean
                ecosystems will grow global carbon sequestration capacity,
                increase resilience, enhance food security, and help secure
                livelihoods.
              </p>
              <a href="https://trees.salesforce.com/restoring-guatemala">
                <button onClick={handleOpen}>
                  Donate to Blue Carbon Projects
                </button>
              </a>
            </div>
          </div>
          <div
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.seaOfTreesImagesContainer}`}
          >
            <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
              <img
                src="/tenants/salesforce/images/madagascar.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
            <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
              <img
                src="/tenants/salesforce/images/costa-rica.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
            <div className={`${gridStyles.colMd3} ${gridStyles.col12}`}>
              <img
                src="/tenants/salesforce/images/kenya.png"
                className={gridStyles.illustration1}
                alt=""
              />
            </div>
          </div>
          <div
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
          >
            <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
              <hr />
            </div>
          </div>
          <div
            className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
          >
            <div className={`${gridStyles.colMd8} ${gridStyles.col12}`}>
              <h3>How can you help?</h3>
              <p>
                Just <a href="/">click here</a> to see what tree project you’d
                like to support today. Then look for your donation on the
                Donation Tracker below and spread the word to your family,
                friends, colleagues, and network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
