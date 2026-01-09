import { useTenantStore } from '../../../../../stores/tenantStore';
import styles from '../Navbar.module.scss';

const SecondaryLogo = ({ isMobile }: { isMobile: boolean }) => {
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

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
              className={`${styles.tenantLogo} ${
                hasWideLogo ? styles.wideLogo : ''
              }`}
            />
          </a>
          {!isMobile && <div className={styles.logoDivider} />}
        </div>
      )}
    </>
  );
};

export default SecondaryLogo;
