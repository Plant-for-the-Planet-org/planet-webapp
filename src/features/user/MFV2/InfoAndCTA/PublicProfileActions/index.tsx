import React from 'react';
import styles from '../InfoAndCta.module.scss';
import PublicProfileActionsHeader from './PublicProfileActionsHeader';
import PublicProfileActionCard from './PublicProfileActionCard';
import { useTranslations } from 'next-intl';

const PublicProfileActions = () => {
  const t = useTranslations('Profile');

  const donorCircleCardsData = [
    {
      link: 'https://www.plant-for-the-planet.org/children-youth/',
      image: '/assets/images/publicProfileActionsImages/youthEmpowerment.png',
      title: t(
        'infoAndCtaContainer.publicProfileActions.youthEmpowermentTitle'
      ),
      subtext: t(
        'infoAndCtaContainer.publicProfileActions.youthEmpowermentSubtext'
      ),
    },
    {
      link: 'https://www.plant-for-the-planet.org/restoration-organizations/',
      image: '/assets/images/publicProfileActionsImages/restorationTools.png',
      title: t(
        'infoAndCtaContainer.publicProfileActions.restorationToolsTitle'
      ),
      subtext: t(
        'infoAndCtaContainer.publicProfileActions.restorationToolsSubtext'
      ),
    },
    {
      link: 'https://www.plant-for-the-planet.org/advice/',
      image: '/assets/images/publicProfileActionsImages/restorationAdvice.png',
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
        '/assets/images/publicProfileActionsImages/forestRestorationAndConservation.png',
      title: t(
        'infoAndCtaContainer.publicProfileActions.restorationAndConservationTitle'
      ),
      subtext: t(
        'infoAndCtaContainer.publicProfileActions.restorationAndConservationSubtext'
      ),
    },
  ];

  return (
    <div className={styles.publicProfileActionContainer}>
      <PublicProfileActionsHeader />
      <div className={styles.publicProfileActionCardsContainer}>
        {donorCircleCardsData.map((item, index) => (
          <PublicProfileActionCard
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

export default PublicProfileActions;
