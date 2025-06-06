import type { SetState } from '../../../../types/common';
import { type HeaderItem } from '@planet-sdk/common';

import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import SubMenu from './SubMenu';
import { useMemo } from 'react';

interface NavigationItemProps {
  navLink: string;
  navLinkOptions: HeaderItem;
  isMobile: boolean;
  menu: boolean;
  setMenu: SetState<boolean>;
}

const NavigationItem = ({
  navLink,
  navLinkOptions,
  isMobile,
  menu,
  setMenu,
}: NavigationItemProps) => {
  const router = useRouter();
  const t = useTranslations('Common');
  const hasSubMenu =
    navLinkOptions.subMenu !== undefined && navLinkOptions.subMenu.length > 0;

  const handleClick = () => {
    if (isMobile && hasSubMenu) {
      setMenu(!menu);
    }
  };

  const handleMouseOver = () => {
    if (hasSubMenu) {
      setMenu(isMobile ? menu : true);
    }
  };

  const handleMouseLeave = () => {
    if (hasSubMenu) {
      setMenu(isMobile ? menu : false);
    }
  };

  const isActive = useMemo(() => {
    const { pathname } = router;
    const strippedPathname =
      pathname.replace(/^\/sites\/\[slug\]\/\[locale\]/, '') || '/';

    // Check if it's a donate path and the current link is the home page
    const isDonatePath = ['/', '/[p]', '/[p]/[id]'].includes(strippedPathname);

    if (isDonatePath && navLinkOptions.onclick === '/') {
      return true;
    }

    // Check if the current pathname matches the onclick of the current item
    if (strippedPathname === navLinkOptions.onclick) {
      return true;
    }

    // Check if the current pathname matches any submenu item's onclick
    if (navLinkOptions.subMenu) {
      return navLinkOptions.subMenu.some(
        (item) => strippedPathname === item.onclick
      );
    }

    return false;
  }, [router, navLinkOptions]);

  console.log('navLinkOptions', navLinkOptions);

  return navLinkOptions.visible ? (
    <div
      className={`${hasSubMenu ? 'subMenu' : ''}`}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      key={navLink}
    >
      <Link
        prefetch={false}
        href={
          isMobile && hasSubMenu ? router.asPath : navLinkOptions.onclick || ''
        }
      >
        {navLinkOptions.title !== 'signIn' && (
          <div className={`linkContainer`}>
            <p className={isActive ? 'activeItem' : ''}>
              {t(navLinkOptions.title)}
            </p>
          </div>
        )}
      </Link>
      <div className={`subMenuItems ${menu ? 'showSubMenu' : ''}`}>
        {hasSubMenu && <SubMenu subMenu={navLinkOptions.subMenu} />}
      </div>
    </div>
  ) : null;
};

export default NavigationItem;
