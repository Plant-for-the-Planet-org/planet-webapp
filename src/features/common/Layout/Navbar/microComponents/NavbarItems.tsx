import type { NavbarItemHeaderKey } from '../tenant';
import type { HeaderItem } from '@planet-sdk/common';

import UserProfileButton from './UserProfileButton';
import { useState } from 'react';
import NavbarItemGroup from './NavbarItemGroup';
import styles from '../Navbar.module.scss';
import { useTenantStore } from '../../../../../stores/tenantStore';

const NavbarItems = () => {
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const headerItems = tenantConfig.config.header.items;
  const [openMenuKey, setOpenMenuKey] = useState<NavbarItemHeaderKey | null>(
    null
  );

  const renderHeaderItem = (navbarItem: HeaderItem) => {
    return navbarItem.headerKey === 'me' ? (
      <div className={styles.profileButtonContainer} key={navbarItem.headerKey}>
        <UserProfileButton />
      </div>
    ) : (
      <NavbarItemGroup
        key={navbarItem.headerKey}
        navbarItem={navbarItem}
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
