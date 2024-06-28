import React from 'react';
import DonorCircleInvitation from './DonorCircleInvitation';
import SDGCardList from './SDGCardList';
import styles from './InfoAndCta.module.scss';

const InfoAndCta = () => {
  return (
    <div className={styles.infoAndCtaContainer}>
      <DonorCircleInvitation />
      {/* treegame embedd */}
      <SDGCardList />
    </div>
  );
};

export default InfoAndCta;
