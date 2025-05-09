import PlanetLogo from './PlanetLogo';
import SecondaryLogo from './SecondaryLogo';
import { useEffect, useState } from 'react';
import { useMobileDetection } from '../../../../../utils/navbarUtils';

const NavbarBrandLogos = () => {
  const [isMobile, setIsMobile] = useState(
    window !== undefined && window.matchMedia('(max-width: 481px)').matches
  );

  useEffect(() => {
    const maxWidth = '481px';
    const cleanup = useMobileDetection(maxWidth, (isMobile: boolean) => {
      setIsMobile(isMobile);
    });
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="brandLogos">
      <SecondaryLogo isMobile={isMobile} />
      <PlanetLogo />
    </div>
  );
};

export default NavbarBrandLogos;
