import { useUserProps } from '../UserPropsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';
import NavbarBrandLogos from './microComponents/NavbarBrandLogos';
import NavbarItems from './microComponents/NavbarItems';

const ImpersonationBanner = () => {
  const { isImpersonationModeOn } = useUserProps();
  return isImpersonationModeOn ? (
    <div className="impersonationAlertContainer">
      <ImpersonationActivated />
    </div>
  ) : null;
};

const MainNavigationHeader = () => {
  const { isImpersonationModeOn } = useUserProps();
  return (
    <header
      className={`navContainer ${
        isImpersonationModeOn ? 'impersonationMode' : ''
      }`}
    >
      <NavbarBrandLogos />
      <NavbarItems />
    </header>
  );
};

export default function Navbar() {
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
      <ImpersonationBanner />
      <MainNavigationHeader />
    </div>
  ) : null;
}
