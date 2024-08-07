import { useTenant } from '../../TenantContext';
import UserProfileButton from './UserProfileButton';
import { useState, useEffect } from 'react';
import { useMobileDetection } from '../../../../../utils/navbarUtils';
import NavigationItem from './NavigationItem';

const NavigationMenu = () => {
  const { tenantConfig } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const headerItems = tenantConfig.config.header.items;

  useEffect(() => {
    const maxWidth = '768px';
    useMobileDetection(maxWidth, (isMobile: boolean) => {
      setIsMobile(isMobile);
    });
  }, []);

  return headerItems.length > 0 ? (
    <nav className={'menuItems'}>
      {headerItems
        .filter(
          (headerItem) => headerItem.visible && headerItem.headerKey !== 'shop'
        )
        .map((headerItem) => {
          if (headerItem.headerKey === 'me') {
            return (
              <div
                className="profileButtonContainer"
                key={headerItem.headerKey}
              >
                <UserProfileButton />
              </div>
            );
          } else {
            return (
              <NavigationItem
                key={headerItem.headerKey}
                navLink={headerItem.headerKey}
                navLinkOptions={headerItem}
                isMobile={isMobile}
                menu={menu}
                setMenu={setMenu}
              />
            );
          }
        })}
    </nav>
  ) : null;
};

export default NavigationMenu;
