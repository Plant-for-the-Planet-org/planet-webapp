import React, { useContext } from 'react';
import { useUserProps } from '../UserPropsContext';
import { ParamsContext } from '../QueryParamsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';
import BrandLogo from './microComponents/BrandLogo';
import MenuItems from './microComponents/MenuItems';

export default function NavbarComponent() {
  const { embed } = useContext(ParamsContext);

  const { tenantConfig } = useTenant();

  const { setUser, logoutUser, auth0Error, isImpersonationModeOn } =
    useUserProps();

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
    <>
      {isImpersonationModeOn && (
        <div className="impersonationAlertContainer" style={{ top: -142 }}>
          <ImpersonationActivated />
        </div>
      )}
      <div
        className={`mainNavContainer`}
        style={{ top: isImpersonationModeOn ? 49 : 0 }}
      >
        <BrandLogo />
        <MenuItems />
      </div>
    </>
  ) : (
    <></>
  );
}
