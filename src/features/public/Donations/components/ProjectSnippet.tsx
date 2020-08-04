import Modal from '@material-ui/core/Modal';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { getImageUrl } from '../../../../utils/getImageURL';
import TreeDonation from './../screens/TreeDonation';
import styles from './../styles/Projects.module.scss';

interface Props {
  project: any;
}

export default function ProjectSnippet({ project }: Props): ReactElement {
  const ImageSource = project.properties.image
    ? getImageUrl('project', 'medium', project.properties.image)
    : '';
  const progressPercentage =
    (project.properties.countPlanted / project.properties.countTarget) * 100 +
    '%';

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const projectDetails = project.properties;
  return (
    <div className={styles.singleProject}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <TreeDonation project={projectDetails} onClose={handleClose} />
      </Modal>
      <Link prefetch={false} href="/[id]" as={`/${project.properties.id}`}>
        <a>
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
        </a>
      </Link>

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
              planted •
            </div>
            <div className={styles.location}>
              {
                getCountryDataBy('countryCode', project.properties.country)
                  .countryName
              }
            </div>
          </div>
          <div className={styles.projectTPOName}>
            By {project.properties.tpo.name}
          </div>
        </div>
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
      </div>
    </div>
  );
}
