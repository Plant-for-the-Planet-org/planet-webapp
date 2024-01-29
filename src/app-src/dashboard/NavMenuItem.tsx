'use client';

import { ElementType, ReactElement, ReactNode, useState } from 'react';
import { SetState } from '../../features/common/types/common';
import styles from '../../../app/sites/[slug]/dashboard/DashboardLayout.module.scss';
import DownArrow from '../../../public/assets/images/icons/DownArrow';
import Link from 'next/link';

interface SubMenuItemConfig {
  title: string;
  path: string;
  flag?: string;
  hideItem?: boolean;
}

export interface NavMenuItemConfig {
  key: number;
  title: string;
  path?: string;
  icon: ReactNode;
  flag?: string;
  accessLevel?: string[];
  hideSubMenu?: boolean;
  subMenu?: SubMenuItemConfig[];
  hideItem?: boolean;
  hasRelatedLinks?: boolean;
}

interface HeaderProps {
  link: NavMenuItemConfig;
  isSubMenuActive: boolean;
  elementType?: 'link' | 'button';
  toggleSubmenu?: () => void;
}

const NavMenuItemHeader = ({
  link,
  isSubMenuActive,
  elementType = 'link',
  toggleSubmenu,
}: HeaderProps) => {
  const Container: ElementType = elementType === 'link' ? Link : 'button';
  const { path } = link;

  return (
    <Container
      className={styles.navMenuItemHeader}
      onClick={toggleSubmenu}
      {...(elementType === 'link' && path !== undefined
        ? { href: path as string }
        : {})}
    >
      {link.icon}
      <div className={styles.navMenuText}>
        {link.title}
        {link.flag !== undefined && (
          <span className={styles.navFlag}>{link.flag}</span>
        )}
      </div>
      {link.subMenu !== undefined &&
        link.subMenu.length > 0 &&
        !link.hideSubMenu && (
          <div
            className={`${styles.subMenuArrow} ${
              isSubMenuActive ? styles.open : styles.closed
            }`}
          >
            <DownArrow />
          </div>
        )}
    </Container>
  );
};

interface SubMenuProps {
  subMenu: SubMenuItemConfig;
}

const NavSubMenuItem = ({ subMenu }: SubMenuProps) => {
  return (
    <Link href={subMenu.path} className={styles.navSubMenuItem}>
      <div className={styles.navSubMenuText}>
        {subMenu.title}
        {subMenu.flag !== undefined && (
          <span className={styles.navFlag}>{subMenu.flag}</span>
        )}
      </div>
    </Link>
  );
};

interface NavMenuItemProps {
  link: NavMenuItemConfig;
  setactiveLink: SetState<string>;
  activeLink: string;
  activeSubMenu: string;
  setActiveSubMenu: SetState<string>;
  user: User;
  // key: number;
  // closeMenu: () => void;
}

const NavMenuItem = ({
  link,
  setactiveLink,
  activeLink,
  activeSubMenu,
  setActiveSubMenu,
  user,
}: NavMenuItemProps): ReactElement => {
  const [isSubMenuActive, setIsSubMenuActive] = useState(false);
  const hasSubMenu =
    link.subMenu !== undefined && link.subMenu?.length > 0 && !link.hideSubMenu;

  const toggleSubmenu = () => {
    setIsSubMenuActive(!isSubMenuActive);
  };

  return (
    <div className={styles.navMenuItem}>
      <NavMenuItemHeader
        link={link}
        isSubMenuActive={isSubMenuActive}
        {...(hasSubMenu ? { toggleSubmenu: toggleSubmenu } : {})}
        elementType={hasSubMenu ? 'button' : 'link'}
      />
      {hasSubMenu &&
        isSubMenuActive &&
        link.subMenu?.map((subMenu, index) => (
          <NavSubMenuItem subMenu={subMenu} key={index} />
        ))}
    </div>
  );
};

export default NavMenuItem;
