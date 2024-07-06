import { useTenant } from '../../TenantContext';

const SecondaryLogo = ({ isMobile }: { isMobile: boolean }) => {
  const { tenantConfig } = useTenant();
  return (
    <>
      {tenantConfig.config.header?.isSecondaryTenant &&
        isMobile &&
        tenantConfig.config.slug !== 'ttc' && (
          <div>
            <a
              href={tenantConfig.config.header?.tenantLogoLink}
              className="tenantLogo"
            >
              <img src={tenantConfig.config.header.tenantLogoURL} />
            </a>
            <div className={'logo_divider'} />
          </div>
        )}
    </>
  );
};

export default SecondaryLogo;
