import PlanetLogo from './PlanetLogo';
import SecondaryLogo from './SecondaryLogo';
import { useEffect, useState } from 'react';
import { subscribeToMobileDetection } from '../../../../../utils/navbarUtils';
import styles from '../Navbar.module.scss';

const NavbarBrandLogos = () => {
  const [isMobile, setIsMobile] = useState(
    window !== undefined && window.matchMedia('(max-width: 481px)').matches
  );

  useEffect(() => {
    const maxWidth = '481px';
    const cleanup = subscribeToMobileDetection(
      maxWidth,
      (isMobile: boolean) => {
        setIsMobile(isMobile);
      }
    );
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className={styles.brandLogos}>
      <SecondaryLogo isMobile={isMobile} />
      <PlanetLogo />
    </div>
  );
};

export default NavbarBrandLogos;
