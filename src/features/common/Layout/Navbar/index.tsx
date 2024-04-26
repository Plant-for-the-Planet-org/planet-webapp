import React, { useContext, useEffect, useState } from 'react';
import { useUserProps } from '../UserPropsContext';
import { ParamsContext } from '../QueryParamsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';
import BrandLogo from './microComponents/BrandLogo';
import MenuItems from './microComponents/MenuItems';

// used to detect window resize and return the current width of the window
const useWidth = () => {
  const [width, setWidth] = useState(0); // default width, detect on server.
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  return width;
};

export default function NavbarComponent() {
  const subMenuPath = {
    overview: '',
    childrenAndYouth: 'children-youth',
    trillionTrees: 'trillion-trees',
    yucatan: 'yucatan',
    partners: 'partners',
    changeChocolate: 'chocolate',
    stopTalkingStartPlanting: 'stop-talking-start-planting',
  };
  const [menu, setMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(false);
  const { embed } = useContext(ParamsContext);

  const { tenantConfig } = useTenant();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > 767) {
        setMobileWidth(false);
      } else {
        setMobileWidth(true);
      }
    }
  });
  const width = useWidth();

  // changes the isMobile state to true if the window width is less than 768px
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  const {
    setUser,

    logoutUser,
    auth0Error,
    isImpersonationModeOn,
  } = useUserProps();

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
        <div className={'top_nav'}>
          <BrandLogo />
          <MenuItems
            isMobile={isMobile}
            mobileWidth={mobileWidth}
            menu={menu}
            setMenu={setMenu}
            subMenuPath={subMenuPath}
          />
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
