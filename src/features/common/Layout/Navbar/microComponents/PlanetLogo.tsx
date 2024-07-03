import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import { useTranslations } from 'next-intl';

const PlanetLogo = () => {
  const t = useTranslations('Common');
  const { theme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width: 481px)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 481px)');

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };
    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return (
    <div className={`${isMobile ? `planetLogoContainerForMobile` : ''}`}>
      {theme === 'theme-light' ? (
        <a href="https://www.plant-for-the-planet.org">
          <img
            className={'tenantLogo'}
            src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
            alt={t('about_pftp')}
          />
        </a>
      ) : (
        <a href="https://www.plant-for-the-planet.org">
          <img
            className={'tenantLogo'}
            src={`/assets/images/PlanetDarkLogo.svg`}
            alt={t('about_pftp')}
          />
        </a>
      )}
    </div>
  );
};

export default PlanetLogo;
