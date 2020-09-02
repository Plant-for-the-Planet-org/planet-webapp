import Modal from '@material-ui/core/Modal';
import { Elements } from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { getImageUrl } from '../../../../utils/getImageURL';
import getStripe from '../../../../utils/getStripe';
import DonationsPopup from '../../Donations/screens/DonationsPopup';
import styles from '../../Donations/styles/Projects.module.scss';

interface Props {
  project: any;
  key: number;
  setShowSingleProject: Function;
  fetchProject: Function;
  setLayoutId: Function;
}

export default function ProjectSnippet({
  project,
  key,
  setShowSingleProject,
  fetchProject,
  setLayoutId,
}: Props): ReactElement {
  
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';
  const progressPercentage =
    (project.countPlanted / project.countTarget) * 100 +
    '%';

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenProject = async () => {
    await fetchProject();
    setShowSingleProject(true);
    setLayoutId(projectDetails.id);
  };
  const projectDetails = project.properties;
  return (
    <div className={styles.singleProject} key={key}>
      <Modal
        className={styles.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableBackdropClick
      >
        <Elements stripe={getStripe()}>
          <DonationsPopup project={projectDetails} onClose={handleClose} />
        </Elements>
      </Modal>
      <a>
        <div onClick={handleOpenProject} className={styles.projectImage}>
          {project.image &&
          typeof project.image !== 'undefined' ? (
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
              {Sugar.String.truncate(project.name, 54)}
            </div>
          </div>
        </div>
      </a>

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
              {Sugar.Number.abbr(Number(project.countPlanted), 1)}{' '}
              planted •{' '}
              <span style={{ fontWeight: 400 }}>
                {
                  getCountryDataBy('countryCode', project.country)
                    .countryName
                }
              </span>
            </div>
          </div>
          <div className={styles.projectTPOName}>
            By {project.tpoData.name}
          </div>
        </div>

        {project.allowDonations && (
          <div className={styles.projectCost}>
            {project.treeCost ? (
              <>
                <div onClick={handleOpen} className={styles.costButton}>
                  {project.currency === 'USD'
                    ? '$'
                    : project.currency === 'EUR'
                    ? '€'
                    : project.currency}{' '}
                  {project.treeCost % 1 !== 0
                    ? project.treeCost.toFixed(2)
                    : project.treeCost}
                </div>
                <div className={styles.perTree}>per tree</div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
