import { useTenant } from '../../TenantContext';

const SecondaryLogo = () => {
  const { tenantConfig } = useTenant();
  return (
    <>
      {tenantConfig.config.header?.isSecondaryTenant && (
        <div
          className={
            tenantConfig.config.slug === 'ttc'
              ? 'hidePrimaryTenantLogo'
              : 'primaryTenantLogo'
          }
        >
          <a
            href={tenantConfig.config.header?.tenantLogoLink}
            className="tenantLogoX"
          >
            <img
              className={'tenantLogo desktop'}
              src={tenantConfig.config.header.tenantLogoURL}
            />
          </a>
          <div className={'logo_divider'} />
        </div>
      )}
    </>
  );
};

export default SecondaryLogo;
