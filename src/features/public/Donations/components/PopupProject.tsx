import Modal from '@material-ui/core/Modal';
import { Elements } from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import getImageUrl from '../../../../utils/getImageURL';
import getStripe from '../../../../utils/getStripe';
import { ThemeContext } from '../../../../utils/themeContext';
import DonationsPopup from './../screens/DonationsPopup';
import styles from './../styles/Projects.module.scss';

interface Props {
  project: any;
  open: boolean;
  handleOpen: Function;
  handleClose: Function;
  fetchProject: Function;
  setShowSingleProject: Function;
}

export default function PopupProject({
  project,
  open,
  handleOpen,
  handleClose,
  fetchProject,
  setShowSingleProject,
}: Props): ReactElement {
  const { theme } = React.useContext(ThemeContext);

  const ImageSource = project.properties.image
    ? getImageUrl('project', 'medium', project.properties.image)
    : '';
  const progressPercentage =
    (project.properties.countPlanted / project.properties.countTarget) * 100 +
    '%';

  const projectDetails = project.properties;

  return (
    <>
      <Modal
        className={styles.modal + ' ' + theme}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Elements stripe={getStripe()}>
          <DonationsPopup project={projectDetails} onClose={handleClose} />
        </Elements>
      </Modal>
      <div className={styles.projectImage}>
        {project.properties.image &&
        typeof project.properties.image !== 'undefined' ? (
          <div
            className={styles.projectImageFile}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
              backgroundPosition: 'center',
            }}
          ></div>
        ) : null}

        <div className={styles.projectImageBlock}>
          {/* <div className={styles.projectType}>
                {GetProjectClassification(project.properties.classification)}
              </div> */}

          <div className={styles.projectName}>
            {Sugar.String.truncate(project.properties.name, 54)}
          </div>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressBarHighlight}
          style={{ width: progressPercentage }}
        />
      </div>
      <div className={styles.projectInfo}>
        <div className={styles.projectData}>
          <div className={styles.targetLocation}>
            <div className={styles.target}>
              {Sugar.Number.abbr(Number(project.properties.countPlanted), 1)}{' '}
              planted •{' '}
              <span style={{ fontWeight: 400 }}>
                {
                  getCountryDataBy('countryCode', project.properties.country)
                    .countryName
                }
              </span>
            </div>
          </div>
          <div className={styles.projectTPOName}>
            By {project.properties.tpo.name}
          </div>
        </div>
        {project.properties.allowDonations && (
          <div className={styles.projectCost}>
            {project.properties.treeCost ? (
              <>
                <div onClick={handleOpen} className={styles.costButton}>
                  {project.properties.currency === 'USD'
                    ? '$'
                    : project.properties.currency === 'EUR'
                    ? '€'
                    : project.properties.currency}
                  {project.properties.treeCost % 1 !== 0
                    ? project.properties.treeCost.toFixed(2)
                    : project.properties.treeCost}
                </div>
                <div className={styles.perTree}>per tree</div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
