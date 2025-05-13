import { useUserProps } from '../UserPropsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';
import NavbarBrandLogos from './microComponents/NavbarBrandLogos';
import NavbarItems from './microComponents/NavbarItems';
import styles from './Navbar.module.scss';

const ImpersonationBanner = () => {
  const { isImpersonationModeOn } = useUserProps();
  if (!isImpersonationModeOn) return null;
  return (
    <div className={styles.impersonationAlertContainer}>
      <ImpersonationActivated />
    </div>
  );
};

const MainNavigationHeader = () => {
  const { isImpersonationModeOn } = useUserProps();

  const headerStyles = `${styles.navContainer} ${
    isImpersonationModeOn ? `${styles.impersonationMode}` : ''
  }`;
  return (
    <header className={headerStyles}>
      <NavbarBrandLogos />
      <NavbarItems />
    </header>
  );
};

export default function Navbar() {
  const { tenantConfig } = useTenant();
  if (!tenantConfig) return null;

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

  return (
    <div className={styles.mainNavContainer}>
      <ImpersonationBanner />
      <MainNavigationHeader />
    </div>
  );
}
