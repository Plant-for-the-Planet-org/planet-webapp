import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Props {
  data: any;
}
export default function TopProjectReports(data: Props) {
  return (
    <>
      <div className={styles.reports_container}>
        <VerifiedIcon sx={{ color: '#42A5F5' }} />
        <div className={styles.reports_description}>
          {data?.data?.map((review) => (
            <div id={review.id}>
              <p id="child-modal-description">
                The project was inspected in a multiday field review in{' '}
                {review.issueMonth}
              </p>
              <a href={review.pdf} download>
                View Report
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
