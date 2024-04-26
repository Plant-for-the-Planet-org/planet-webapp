import { ThemeContext } from '../../../../../theme/themeContext';
import { useTenant } from '../../TenantContext';
import { useContext } from 'react';
import { useTranslations } from 'next-intl';

const BrandLogo = () => {
  const { tenantConfig } = useTenant();
  const { theme } = useContext(ThemeContext);
  const t = useTranslations('Common');
  return (
    <div className={'brandLogos'}>
      {tenantConfig.config.header?.isSecondaryTenant && (
        <div
          className={
            tenantConfig.config.slug === 'ttc'
              ? 'hidePrimaryTenantLogo'
              : 'primaryTenantLogo'
          }
        >
          <a href={tenantConfig.config.header?.tenantLogoLink}>
            <img
              className={'tenantLogo desktop'}
              src={tenantConfig.config.header.tenantLogoURL}
            />
            {tenantConfig.config.header.mobileLogoURL ? (
              <img
                className={'tenantLogo mobile'}
                src={tenantConfig.config.header.mobileLogoURL}
              />
            ) : (
              <img
                className={'tenantLogo mobile'}
                src={tenantConfig.config.header.tenantLogoURL}
              />
            )}
          </a>
          <div className={'logo_divider'} />
        </div>
      )}

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

export default BrandLogo;
