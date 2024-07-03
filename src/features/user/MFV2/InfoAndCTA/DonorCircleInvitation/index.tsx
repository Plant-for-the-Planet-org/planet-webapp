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
      title: t('infoAndCtaContainer.youthEmpowermentTitle'),
      subtext: t('infoAndCtaContainer.youthEmpowermentSubtext'),
    },
    {
      link: 'https://www.plant-for-the-planet.org/restoration-organizations/',
      image: '/assets/images/donorCircleInvitationImages/restorationTools.png',
      title: t('infoAndCtaContainer.restorationToolsTitle'),
      subtext: t('infoAndCtaContainer.restorationToolsSubtext'),
    },
    {
      link: 'https://www.plant-for-the-planet.org/advice/',
      image: '/assets/images/donorCircleInvitationImages/restorationAdvice.png',
      title: t('infoAndCtaContainer.restorationAdviceTitle'),
      subtext: t('infoAndCtaContainer.restorationAdviceSubtext'),
    },
    {
      link: 'https://plant-for-the-planet.org/yucatan/',
      image:
        '/assets/images/donorCircleInvitationImages/forestRestorationAndConservation.png',
      title: t('infoAndCtaContainer.restorationAndConservationTitle'),
      subtext: t('infoAndCtaContainer.restorationAndConservationSubtext'),
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
