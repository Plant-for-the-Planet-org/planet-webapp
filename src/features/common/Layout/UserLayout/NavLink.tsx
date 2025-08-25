import type { User } from '@planet-sdk/common';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

import { useState, useEffect } from 'react';
import DownArrow from '../../../../../public/assets/images/icons/DownArrow';
import IconContainer from './IconContainer';
import styles from './UserLayout.module.scss';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

export interface SubMenuItemType {
  key: string;
  title: string;
  path: string;
  flag?: string;
  hideItem?: boolean;
  /**
   * Controls how this submenu item matches URL paths while identifying the current submenu item:
   * - 'exact' (default): Only matches the exact path
   * - 'prefix': Matches this path AND any sub-paths (e.g., /profile/bulk-codes matches /profile/bulk-codes/generic)
   *
   * ⚠️ WARNING: When using 'prefix', order matters! More specific paths should come BEFORE less specific ones
   * in the subMenu array, otherwise the broader prefix will match first and prevent specific items from activating.
   */
  matchPattern?: 'exact' | 'prefix';
}

export interface NavLinkType {
  key: string;
  title: string;
  path?: string;
  icon: ReactNode;
  flag?: string;
  accessLevel?: string[];
  hideSubMenu?: boolean;
  subMenu?: SubMenuItemType[];
  hideItem?: boolean;
  hasRelatedLinks?: boolean;
  /**
   * Controls how this menu item matches URL paths while identifying the current menu item:
   * - 'exact' (default): Only matches the exact path
   * - 'prefix': Matches this path AND any sub-paths (e.g., /profile/bulk-codes matches /profile/bulk-codes/generic)
   *
   * ⚠️ WARNING: When using 'prefix', order matters! More specific paths should come BEFORE less specific ones
   * in the navLinks array, otherwise the broader prefix will match first and prevent specific items from activating.
   */
  matchPattern?: 'exact' | 'prefix';
}

interface NavLinkProps {
  link: NavLinkType;
  setCurrentMenuKey: Dispatch<SetStateAction<string>>;
  currentMenuKey: string;
  currentSubMenuKey: string;
  setCurrentSubMenuKey: Dispatch<SetStateAction<string>>;
  user: User;
  closeMenu: () => void;
}

/**
 * NavLink component handles individual navigation menu items.
 * Separates concerns between:
 * - Current menu state: Which menu/submenu is currently selected based on route
 * - Open state: Which submenus are open based on user interaction
 */
function NavLink({
  link,
  setCurrentMenuKey,
  currentMenuKey,
  currentSubMenuKey,
  setCurrentSubMenuKey,
  user,
  closeMenu,
}: NavLinkProps) {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  // Determine if this is the current menu item (based on route)
  const isCurrentMainMenu = currentMenuKey === link.key;

  useEffect(() => {
    if (link.subMenu && link.subMenu.length > 0 && currentSubMenuKey) {
      const hasCurrentSubItem = link.subMenu.some((subMenuItem) => {
        return subMenuItem.key === currentSubMenuKey;
      });
      if (hasCurrentSubItem) {
        setIsSubMenuOpen(true);
      }
    }
  }, [currentSubMenuKey, link.subMenu]);

  if (link.accessLevel) {
    // Check user access level permissions
    if (!link.accessLevel.includes(user.type)) {
      return null;
    }
  }

  const handleMainMenuClick = () => {
    // Guard: If no path and no submenu, do nothing as menu is not interactive
    if (!link.path && (!link.subMenu || link.subMenu.length <= 0)) {
      return;
    }

    // Check if this menu item should navigate directly (no submenu interaction)
    const shouldNavigateDirectly =
      !link.subMenu || link.subMenu.length <= 0 || link.hideSubMenu;

    if (shouldNavigateDirectly && link.path) {
      router.push(localizedPath(link.path));
      setCurrentMenuKey(link.key);
      setCurrentSubMenuKey('');
      closeMenu();
    } else {
      // Toggle submenu visibility
      setIsSubMenuOpen(!isSubMenuOpen);
    }
  };

  // Navigate to submenu page and update current state
  const handleSubMenuClick = (subMenuItem: SubMenuItemType) => {
    setCurrentMenuKey(link.key);
    setCurrentSubMenuKey(subMenuItem.key);
    router.push(localizedPath(subMenuItem.path));
    closeMenu();
  };

  return (
    <div className={styles.navLinkMenu}>
      <div
        className={`${styles.navLink} ${
          isCurrentMainMenu ? styles.navLinkActive : ''
        } ${isSubMenuOpen ? styles.navLinkOpen : ''}`}
        onClick={handleMainMenuClick}
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
              transform: isSubMenuOpen ? 'rotate(-180deg)' : 'rotate(-90deg)',
            }}
          >
            <DownArrow />
          </button>
        )}
      </div>
      {isSubMenuOpen &&
        link.subMenu &&
        link.subMenu.length > 0 &&
        !link.hideSubMenu &&
        link.subMenu.map((subLink) => {
          if (!subLink.hideItem) {
            return (
              <div
                className={`${styles.navLinkSubMenu} ${
                  currentSubMenuKey === subLink.key
                    ? styles.navLinkActiveSubMenu
                    : ''
                }`}
                key={subLink.title}
                onClick={() => handleSubMenuClick(subLink)}
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
