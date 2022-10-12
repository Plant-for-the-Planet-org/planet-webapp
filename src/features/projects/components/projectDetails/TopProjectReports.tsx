import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}
export default function TopProjectReports({
  isOpen,
  handleClose,
}: Props): ReactElement {
  return (
    <>
      <div className={styles.reports_container}>
        <VerifiedIcon sx={{ color: '#42A5F5' }} />
        <div className={styles.reports_description}>
          <p id="child-modal-description">
            The project was inspected in a multiday field review in March 2021
          </p>
          <a href="">View Report</a>
        </div>
      </div>
    </>
  );
}
