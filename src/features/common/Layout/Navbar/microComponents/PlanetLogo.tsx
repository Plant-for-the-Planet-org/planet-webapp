import { useContext } from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import { useTranslations } from 'next-intl';

const PlanetLogo = () => {
  const t = useTranslations('Common');
  const { theme } = useContext(ThemeContext);
  return (
    <>
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
    </>
  );
};

export default PlanetLogo;
