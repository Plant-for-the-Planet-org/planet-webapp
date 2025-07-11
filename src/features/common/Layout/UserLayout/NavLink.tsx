import type { User } from '@planet-sdk/common';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import router from 'next/router';
import DownArrow from '../../../../../public/assets/images/icons/DownArrow';
import IconContainer from './IconContainer';
import styles from './UserLayout.module.scss';

export interface SubMenuItemType {
  title: string;
  path: string;
  flag?: string;
  hideItem?: boolean;
}

export interface NavLinkType {
  key: number;
  title: string;
  path?: string;
  icon: ReactNode;
  flag?: string;
  accessLevel?: string[];
  hideSubMenu?: boolean;
  subMenu?: SubMenuItemType[];
  hideItem?: boolean;
  hasRelatedLinks?: boolean;
}

interface NavLinkProps {
  link: NavLinkType;
  setActiveLink: Dispatch<SetStateAction<string>>;
  activeLink: string;
  activeSubMenu: string;
  setActiveSubMenu: Dispatch<SetStateAction<string>>;
  user: User;
  key: number;
  closeMenu: () => void;
}

function NavLink({
  link,
  setActiveLink,
  activeLink,
  activeSubMenu,
  setActiveSubMenu,
  user,
}: NavLinkProps) {
  const [isSubMenuActive, setIsSubMenuActive] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    // Check if array of submenu has activeSubLink
    if (link.subMenu && link.subMenu.length > 0) {
      const subMenuItem = link.subMenu.find((subMenuItem) => {
        return subMenuItem.path === activeSubMenu;
      });
      if (subMenuItem) {
        link.path && setActiveLink(link.path);
        setActiveSubMenu(subMenuItem.path);
        if (activeSubMenu && subMenuItem.path === activeSubMenu) {
          setIsSubMenuActive(true);
        }
      }
    }
  }, [activeLink]);

  if (link.accessLevel) {
    //checks the type of user login
    if (!link.accessLevel.includes(user.type)) {
      return null;
    }
  }

  return (
    <div key={link.title} className={styles.navLinkMenu}>
      <div
        className={`${styles.navLink} ${
          activeLink && activeLink === link.path ? styles.navLinkActive : ''
        } ${isSubMenuActive ? styles.navLinkActive : ''}`}
        onClick={() => {
          // This is to shift to the main page needed when there is no sub menu
          if ((!link.subMenu || link.subMenu.length <= 0) && link.path) {
            router.push(`/${locale}${link.path}`);
            setActiveLink(link.path);
            setActiveSubMenu('');
          } else {
            if (link.hideSubMenu && link.path) {
              router.push(`/${locale}${link.path}`);
            } else {
              setIsSubMenuActive(!isSubMenuActive);
            }
          }
        }}
      >
        <IconContainer>{link.icon}</IconContainer>
        <button className={styles.navLinkTitle}>
          {link.title}
          {link.flag && <span className={styles.itemFlag}>{link.flag}</span>}
        </button>
        {link.subMenu && link.subMenu.length > 0 && !link.hideSubMenu && (
          <button
            className={styles.subMenuArrow}
            style={{
              transform: isSubMenuActive ? 'rotate(-180deg)' : 'rotate(-90deg)',
            }}
          >
            <DownArrow />
          </button>
        )}
      </div>
      {isSubMenuActive &&
        link.subMenu &&
        link.subMenu.length > 0 &&
        !link.hideSubMenu &&
        link.subMenu.map((subLink, index) => {
          if (!subLink.hideItem) {
            return (
              <div
                className={`${styles.navLinkSubMenu} ${
                  activeSubMenu === subLink.path
                    ? styles.navLinkActiveSubMenu
                    : ''
                }`}
                key={index}
                onClick={() => {
                  //this is to shift to the submenu pages
                  link.path && setActiveLink(link.path);
                  setActiveSubMenu(subLink.path);
                  router.push(`/${locale}${subLink.path}`);
                }}
              >
                {subLink.title}
                {subLink.flag && (
                  <span className={styles.itemFlag}>{subLink.flag}</span>
                )}
              </div>
            );
          }
        })}
    </div>
  );
}

export default NavLink;
