import { useUserProps } from '../UserPropsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';
import BrandLogo from './microComponents/BrandLogo';
import NavigationMenu from './microComponents/NavigationMenu';

const ImpersonationStatusHeader = () => {
  const { isImpersonationModeOn } = useUserProps();
  return isImpersonationModeOn ? (
    <div className="impersonationAlertContainer">
      <ImpersonationActivated />
    </div>
  ) : null;
};

const CommonHeader = () => {
  const { isImpersonationModeOn } = useUserProps();
  return (
    <header
      className={`navContainer ${
        isImpersonationModeOn ? 'impersonationMode' : ''
      }`}
    >
      <BrandLogo />
      <NavigationMenu />
    </header>
  );
};

export default function NavbarComponent() {
  const { tenantConfig } = useTenant();
  const { setUser, logoutUser, auth0Error } = useUserProps();

  if (auth0Error) {
    const { message } = auth0Error;

    if (message === '401') {
      if (typeof window !== 'undefined') {
        setUser(null);
        logoutUser(`${window.location.origin}/verify-email`);
      }
    } else if (message === 'Invalid state') {
      setUser(null);
    } else if (typeof window !== 'undefined') {
      if (message) {
        alert(message);
      }
      setUser(null);
      logoutUser(`${window.location.origin}/`);
    }
  }

  return tenantConfig ? (
    <div className="mainNavContainer">
      <ImpersonationStatusHeader />
      <CommonHeader />
    </div>
  ) : null;
}
