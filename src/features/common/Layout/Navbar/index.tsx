import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import NavbarBrandLogos from './microComponents/NavbarBrandLogos';
import NavbarItems from './microComponents/NavbarItems';
import styles from './Navbar.module.scss';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { useAuthSession } from '../../../../hooks/useAuthSession';
import { useUserStore, useTenantStore } from '../../../../stores';

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
  const { logoutUser, auth0Error } = useAuthSession();
  // store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);
  // store: action
  const setUserProfile = useUserStore((state) => state.setUserProfile);

  useEffect(() => {
    if (!auth0Error) return;

    const { message } = auth0Error;

    setUserProfile(null);
    // TODO: Remove '401' case after July 31, 2026. Confirm whether safe to remove before then.
    if (message === '401' || message === 'email_not_verified') {
      logoutUser(`${window.location.origin}/verify-email`);
    } else if (message === 'Invalid state') {
      // Only clear user, no logout needed
    } else {
      if (message) alert(message);
      logoutUser(`${window.location.origin}/`);
    }
  }, [auth0Error, logoutUser, setUserProfile]);

  if (!isInitialized) return null;

  return (
    <div className={styles.navbar}>
      <ImpersonationBanner />
      <MainNavigationHeader />
    </div>
  );
}
