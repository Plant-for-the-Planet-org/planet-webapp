import clsx from 'clsx';
import { useTenant } from '../../TenantContext';
import styles from '../Navbar.module.scss';

const SecondaryLogo = ({ isMobile }: { isMobile: boolean }) => {
  const { tenantConfig } = useTenant();

  const shouldNotRenderLogo = isMobile && tenantConfig.config.slug === 'ttc';
  const hasWideLogo = tenantConfig.config.slug === 'concentrix';

  if (shouldNotRenderLogo) {
    return null;
  }

  return (
    <>
      {tenantConfig.config.header?.isSecondaryTenant && (
        <div className={styles.tenantLogoContainer}>
          <a href={tenantConfig.config?.header?.tenantLogoLink}>
            <img
              src={tenantConfig.config?.header?.tenantLogoURL}
              className={clsx(styles.tenantLogo, {
                [styles.wideLogo]: hasWideLogo,
              })}
            />
          </a>
          {!isMobile && <div className={styles.logoDivider} />}
        </div>
      )}
    </>
  );
};

export default SecondaryLogo;
