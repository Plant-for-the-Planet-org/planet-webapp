import { useContext } from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import { useTranslations } from 'next-intl';

const PlanetLogo = ({ isMobile }: { isMobile: boolean }) => {
  const t = useTranslations('Common');
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${isMobile ? `planetLogoContainerForMobile` : ''}`}>
      {theme === 'theme-light' ? (
        <a href="https://www.plant-for-the-planet.org">
          <img
            className={'planetLogo'}
            src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
            alt={t('about_pftp')}
          />
        </a>
      ) : (
        <a href="https://www.plant-for-the-planet.org">
          <img
            className={'planetLogo'}
            src={`/assets/images/PlanetDarkLogo.svg`}
            alt={t('about_pftp')}
          />
        </a>
      )}
    </div>
  );
};

export default PlanetLogo;
