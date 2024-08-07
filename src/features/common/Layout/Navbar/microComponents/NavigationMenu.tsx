import { useTenant } from '../../TenantContext';
import UserProfileButton from './UserProfileButton';
import { useState, useEffect } from 'react';
import { useMobileDetection } from '../../../../../utils/navbarUtils';
import NavigationItem from './NavigationItem';
import { HeaderItem } from '@planet-sdk/common';

const NavigationMenu = () => {
  const { tenantConfig } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const headerItems = tenantConfig.config.header.items;

  useEffect(() => {
    const maxWidth = '768px';
    const cleanup = useMobileDetection(maxWidth, (isMobile: boolean) => {
      setIsMobile(isMobile);
    });
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const renderHeaderItem = (headerItem: HeaderItem) => {
    return headerItem.headerKey === 'me' ? (
      <div className="profileButtonContainer" key={headerItem.headerKey}>
        <UserProfileButton />
      </div>
    ) : (
      <NavigationItem
        key={headerItem.headerKey}
        navLink={headerItem.headerKey}
        navLinkOptions={headerItem}
        isMobile={isMobile}
        menu={menu}
        setMenu={setMenu}
      />
    );
  };

  return headerItems.length > 0 ? (
    <nav className={'menuItems'}>
      {headerItems
        .filter(
          (headerItem) => headerItem.visible && headerItem.headerKey !== 'shop'
        )
        .map(renderHeaderItem)}
    </nav>
  ) : null;
};

export default NavigationMenu;
