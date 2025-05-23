import { useContext } from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import { useTranslations } from 'next-intl';
import styles from '../Navbar.module.scss';

const PlanetLogo = () => {
  const t = useTranslations('Common');
  const { theme } = useContext(ThemeContext);
  const logoSrc =
    theme === 'theme-light'
      ? `${process.env.CDN_URL}/logo/svg/planet.svg`
      : `/assets/images/PlanetDarkLogo.svg`;

  return (
    <div className={styles.planetLogoContainer}>
      <a href="https://www.plant-for-the-planet.org">
        <img
          className={styles.planetLogo}
          src={logoSrc}
          alt={t('about_pftp')}
        />
      </a>
    </div>
  );
};

export default PlanetLogo;
