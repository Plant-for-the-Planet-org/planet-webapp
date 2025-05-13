import type { NavbarItemHeaderKey } from '../tenant';
import type { HeaderItem } from '@planet-sdk/common';

import { useTenant } from '../../TenantContext';
import UserProfileButton from './UserProfileButton';
import { useState } from 'react';
import NavbarItemGroup from './NavbarItemGroup';
import styles from '../Navbar.module.scss';

const NavbarItems = () => {
  const { tenantConfig } = useTenant();
  const headerItems = tenantConfig.config.header.items;
  const [openMenuKey, setOpenMenuKey] = useState<NavbarItemHeaderKey | null>(
    null
  );

  const renderHeaderItem = (navItem: HeaderItem) => {
    return navItem.headerKey === 'me' ? (
      <div className={styles.profileButtonContainer} key={navItem.headerKey}>
        <UserProfileButton />
      </div>
    ) : (
      <NavbarItemGroup
        key={navItem.headerKey}
        navItem={navItem}
        openMenuKey={openMenuKey}
        setOpenMenuKey={setOpenMenuKey}
      />
    );
  };

  const visibleItems = headerItems.filter((item) => item.visible);
  if (visibleItems.length === 0) return null;

  return (
    <nav className={styles.headerItems}>
      {visibleItems.map(renderHeaderItem)}
    </nav>
  );
};

export default NavbarItems;
