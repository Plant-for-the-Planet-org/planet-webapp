import PlanetLogo from './PlanetLogo';
import SecondaryLogo from './SecondaryLogo';
import { useEffect, useState } from 'react';
import { useMobileDetection } from '../../../../../utils/navbarUtils';

const BrandLogo = () => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width: 481px)').matches
  );
  useEffect(() => {
    const maxWidth = '481px';
    useMobileDetection(maxWidth, (isMobile: boolean) => {
      setIsMobile(isMobile);
    });
  }, [isMobile]);
  return (
    <div className={'brandLogos'}>
      <SecondaryLogo isMobile={isMobile} />
      <PlanetLogo isMobile={isMobile} />
    </div>
  );
};

export default BrandLogo;
