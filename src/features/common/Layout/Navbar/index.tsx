import React, { useContext } from 'react';
import { useUserProps } from '../UserPropsContext';
import { ParamsContext } from '../QueryParamsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';
import BrandLogo from './microComponents/BrandLogo';
import MenuItems from './microComponents/MenuItems';

const ImpersonationStatusHeader = () => {
  const { isImpersonationModeOn } = useUserProps();
  return isImpersonationModeOn ? (
    <div className="impersonationAlertContainer">
      <ImpersonationActivated />
    </div>
  ) : (
    <></>
  );
};

const CommonHeader = () => {
  const { isImpersonationModeOn } = useUserProps();
  return (
    <div
      className={`navContainer ${
        isImpersonationModeOn ? 'impersonationMode' : ''
      }`}
    >
      <BrandLogo />
      <MenuItems />
    </div>
  );
};
export default function NavbarComponent() {
  const { embed } = useContext(ParamsContext);

  const { tenantConfig } = useTenant();

  const { setUser, logoutUser, auth0Error } = useUserProps();

  if (auth0Error) {
    if (auth0Error.message === '401') {
      if (typeof window !== 'undefined') {
        setUser(null);
        logoutUser(`${window.location.origin}/verify-email`);
      }
    } else if (auth0Error.message === 'Invalid state') {
      setUser(null);
    } else if (typeof window !== 'undefined') {
      if (auth0Error.message) {
        alert(auth0Error.message);
      }
      setUser(null);
      logoutUser(`${window.location.origin}/`);
    }
  }

  return embed === 'true' ? (
    <></>
  ) : tenantConfig ? (
    <div className="mainNavContainer">
      <ImpersonationStatusHeader />
      <CommonHeader />
    </div>
  ) : (
    <></>
  );
}
