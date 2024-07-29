import { useTenant } from '../../TenantContext';
import UserProfileButton from './UserProfileButton';
import { useState, useEffect } from 'react';
import { useMobileDetection } from '../../../../../utils/navbarUtils';
import NavigationItem from './NavigationItem';

type Submenu = Omit<navLinkOptions, 'subMenu' | 'loggedInTitle'>;
export interface navLinkOptions {
  title: string;
  onclick: string;
  visible: boolean;
  subMenu?: Submenu[];
  loggedInTitle?: string | undefined;
}

const NavigationMenu = () => {
  const { tenantConfig } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const links = Object.keys(tenantConfig?.config?.header?.items || {});

  useEffect(() => {
    const maxWidth = '768px';
    useMobileDetection(maxWidth, (isMobile: boolean) => {
      setIsMobile(isMobile);
    });
  }, []);
  return tenantConfig ? (
    <nav className={'menuItems'}>
      {links
        .filter((navLink) => navLink !== 'shop' && navLink !== 'me')
        .map((navLink) => {
          const navLinkOptions = tenantConfig.config.header.items[navLink];
          return (
            <NavigationItem
              key={navLink}
              navLink={navLink}
              navLinkOptions={navLinkOptions}
              isMobile={isMobile}
              menu={menu}
              setMenu={setMenu}
            />
          );
        })}
      {tenantConfig.config.header.items['me']?.visible && (
        <div>
          <UserProfileButton />
        </div>
      )}
    </nav>
  ) : null;
};

export default NavigationMenu;
