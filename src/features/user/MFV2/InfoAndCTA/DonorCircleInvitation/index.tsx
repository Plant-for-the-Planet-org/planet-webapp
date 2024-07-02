import React from 'react';
import styles from '../InfoAndCta.module.scss';
import DonorCircleInvitationHeader from './DonorCircleInvitationHeader';
import donorCircleCardsData from './donorCircleCardsData';
import SingleInvitationCard from './SingleInvitationCard';

const DonorCircleInvitation = () => {
  return (
    <div className={styles.donorCircleInvitationContainer}>
      <DonorCircleInvitationHeader />
      <div className={styles.inviationCardsContainer}>
        {donorCircleCardsData.map((item, index) => (
          <SingleInvitationCard
            image={item.image}
            title={item.title}
            subtext={item.subtext}
            link={item.link}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default DonorCircleInvitation;
