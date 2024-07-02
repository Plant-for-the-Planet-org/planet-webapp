import React from 'react';
import styles from '../InfoAndCta.module.scss';
import WebappButton from '../../../../common/WebappButton';

const DonorCircleInvitationHeader = () => {
  return (
    <div className={styles.donorCircleInvitationHeader}>
      <h2 className={styles.headerTitle}>
        Plant-for-the-Planet donor circle member
      </h2>
      <WebappButton
        variant="tertiary"
        href="https://www.plant-for-the-planet.org/donor-circle/"
        elementType="link"
        target="_blank"
        text="Become a member"
        buttonClasses={styles.customJoinDonorCircleButton}
      />
    </div>
  );
};

export default DonorCircleInvitationHeader;
