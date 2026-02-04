import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';
import NavbarBrandLogos from './microComponents/NavbarBrandLogos';
import NavbarItems from './microComponents/NavbarItems';
import styles from './Navbar.module.scss';
import { clsx } from 'clsx';
import { useAuthSession } from '../../../../hooks/useAuthSession';
import { useUserStore } from '../../../../stores';

const ImpersonationBanner = () => {
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  if (!isImpersonationModeOn) return null;
  return (
    <div className={styles.impersonationBanner}>
      <ImpersonationActivated />
    </div>
  );
};

const MainNavigationHeader = () => {
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );

  const headerStyles = clsx(styles.mainNavigationHeader, {
    [styles.impersonationMode]: isImpersonationModeOn,
  });
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
  const { logoutUser, auth0Error } = useAuthSession();
  // store: state
  const setUserProfile = useUserStore((state) => state.setUserProfile);

  if (auth0Error) {
    const { message } = auth0Error;
    const isBrowser = typeof window !== 'undefined';

    setUserProfile(null);

    if (message === '401' && isBrowser) {
      logoutUser(`${window.location.origin}/verify-email`);
    } else if (message === 'Invalid state') {
      // Only clear user, no logout needed
    } else if (isBrowser) {
      if (message) alert(message);
      logoutUser(`${window.location.origin}/`);
    }
  }

  return (
    <div className={styles.navbar}>
      <ImpersonationBanner />
      <MainNavigationHeader />
    </div>
  );
}
