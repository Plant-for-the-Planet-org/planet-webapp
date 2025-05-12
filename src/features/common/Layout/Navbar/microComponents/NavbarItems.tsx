import type { HeaderItem, NavbarItemHeaderKey } from '../defaultTenantConfig';

import { useTenant } from '../../TenantContext';
import UserProfileButton from './UserProfileButton';
import { useState } from 'react';
import NavbarItemGroup from './NavbarItemGroup';

const NavbarItems = () => {
  const { tenantConfig } = useTenant();
  const headerItems = tenantConfig.config.header.items as HeaderItem[];
  const [openMenuKey, setOpenMenuKey] = useState<NavbarItemHeaderKey | null>(
    null
  );

  const renderHeaderItem = (navItem: HeaderItem) => {
    return navItem.headerKey === 'me' ? (
      <div className="profileButtonContainer" key={navItem.headerKey}>
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
    <nav className={'headerItems'}>{visibleItems.map(renderHeaderItem)}</nav>
  );
};

export default NavbarItems;
