import { useTenant } from '../../TenantContext';

const SecondaryLogo = ({ isMobile }: { isMobile: boolean }) => {
  const { tenantConfig } = useTenant();

  const shouldNotRenderLogo = isMobile && tenantConfig.config.slug === 'ttc';

  if (shouldNotRenderLogo) {
    return null;
  }
  return (
    <>
      {tenantConfig.config.header?.isSecondaryTenant && (
        <div className="brandLogos">
          <a href={tenantConfig.config.header?.tenantLogoLink}>
            <img
              src={tenantConfig.config.header.tenantLogoURL}
              className="tenantLogo"
            />
          </a>
          <div className={'logo_divider'} />
        </div>
      )}
    </>
  );
};

export default SecondaryLogo;
