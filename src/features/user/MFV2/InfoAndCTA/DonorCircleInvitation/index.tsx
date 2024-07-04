import React from 'react';
import styles from '../InfoAndCta.module.scss';
import DonorCircleInvitationHeader from './DonorCircleInvitationHeader';
import SingleInvitationCard from './SingleInvitationCard';
import { useTranslations } from 'next-intl';

const DonorCircleInvitation = () => {
  const t = useTranslations('Profile');

  const donorCircleCardsData = [
    {
      link: 'https://www.plant-for-the-planet.org/children-youth/',
      image: '/assets/images/donorCircleInvitationImages/youthEmpowerment.png',
      title: t(
        'infoAndCtaContainer.publicProfileActions.youthEmpowermentTitle'
      ),
      subtext: t(
        'infoAndCtaContainer.publicProfileActions.youthEmpowermentSubtext'
      ),
    },
    {
      link: 'https://www.plant-for-the-planet.org/restoration-organizations/',
      image: '/assets/images/donorCircleInvitationImages/restorationTools.png',
      title: t(
        'infoAndCtaContainer.publicProfileActions.restorationToolsTitle'
      ),
      subtext: t(
        'infoAndCtaContainer.publicProfileActions.restorationToolsSubtext'
      ),
    },
    {
      link: 'https://www.plant-for-the-planet.org/advice/',
      image: '/assets/images/donorCircleInvitationImages/restorationAdvice.png',
      title: t(
        'infoAndCtaContainer.publicProfileActions.restorationAdviceTitle'
      ),
      subtext: t(
        'infoAndCtaContainer.publicProfileActions.restorationAdviceSubtext'
      ),
    },
    {
      link: 'https://plant-for-the-planet.org/yucatan/',
      image:
        '/assets/images/donorCircleInvitationImages/forestRestorationAndConservation.png',
      title: t(
        'infoAndCtaContainer.publicProfileActions.restorationAndConservationTitle'
      ),
      subtext: t(
        'infoAndCtaContainer.publicProfileActions.restorationAndConservationSubtext'
      ),
    },
  ];

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
