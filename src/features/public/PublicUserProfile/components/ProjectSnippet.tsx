import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { getImageUrl } from '../../../../utils/getImageURL';
import styles from '../../Donations/styles/Projects.module.scss';

interface Props {
  project: any;
  key: number;
}

export default function ProjectSnippet({ project, key }: Props): ReactElement {
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';
  const progressPercentage =
    (project.countPlanted / project.countTarget) * 100 + '%';

  const projectDetails = project;
  return (
    <div key={key}>
      <a>
        <div className={styles.projectImage}>
          {project.image && typeof project.image !== 'undefined' ? (
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
              {Sugar.Number.abbr(Number(project.countPlanted), 1)} planted •{' '}
              <span style={{ fontWeight: 400 }}>
                {getCountryDataBy('countryCode', project.country).countryName}
              </span>
            </div>
          </div>
          <div className={styles.projectTPOName}>By {project.tpoData.name}</div>
        </div>

        {project.allowDonations && (
          <div className={styles.projectCost}>
            {project.treeCost ? (
              <>
                <div className={styles.costButton}>
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
