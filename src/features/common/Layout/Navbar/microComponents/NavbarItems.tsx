import type { HeaderItem, NavbarItemHeaderKey } from '../defaultTenantConfig';

import { useTenant } from '../../TenantContext';
import UserProfileButton from './UserProfileButton';
import { useState } from 'react';
import NavbarItemGroup from './NavbarItemGroup';

const NavbarItems = () => {
  const { tenantConfig } = useTenant();
  const headerItems = tenantConfig.config.header.items;
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
        navItem={navItem}
        openMenuKey={openMenuKey}
        setOpenMenuKey={setOpenMenuKey}
      />
    );
  };

  return headerItems.length > 0 ? (
    <nav className={'headerItems'}>
      {headerItems
        .filter(
          (headerItem) => headerItem.visible && headerItem.headerKey !== 'shop'
        )
        .map(renderHeaderItem)}
    </nav>
  ) : null;
};

export default NavbarItems;
