import { useTenant } from '../../TenantContext';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import UserIcon from './UserIcon';
import { useState, useEffect } from 'react';
import AboutUsSubMenu from './AboutUsSubMenu';
import { SetState } from '../../../types/common';

type Submenu = Omit<navLinkOptions, 'subMenu' | 'loggedInTitle'>;
interface navLinkOptions {
  title: string;
  onclick: string;
  visible: boolean;
  subMenu: Submenu;
  loggedInTitle: string | undefined;
}
interface MenuItemProps {
  navLink: string;
  navLinkOptions: navLinkOptions;
  isMobile: boolean;
  menu: boolean;
  setMenu: SetState<boolean>;
}

const useWidth = () => {
  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const MenuItem = ({
  navLink,
  navLinkOptions,
  isMobile,
  menu,
  setMenu,
}: MenuItemProps) => {
  const router = useRouter();
  const t = useTranslations('Common');
  const hasSubMenu =
    navLinkOptions.subMenu && navLinkOptions.subMenu.length > 0;

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

  const isActive = () => {
    const donatePaths = [
      '/',
      '/[p]',
      '/[p]/[id]',
      '/sites/[slug]/[locale]',
      '/sites/[slug]/[locale]/[p]',
      '/sites/[slug]/[locale]/[p]/[id]',
    ];

    const linkPaths = {
      home: '/sites/[slug]/[locale]/home',
      leaderboard: '/sites/[slug]/[locale]/all',
      homeRoot: '/sites/[slug]/[locale]',
    };

    if (navLink === 'donate') {
      return donatePaths.includes(router.pathname);
    } else {
      return (
        (router.pathname === linkPaths.home && navLink === 'home') ||
        (router.pathname === linkPaths.leaderboard &&
          navLink === 'leaderboard') ||
        (router.pathname === linkPaths.homeRoot && navLink === 'home')
      );
    }
  };

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
        href={isMobile && hasSubMenu ? router.asPath : navLinkOptions.onclick}
      >
        {navLinkOptions.title !== 'signIn' && (
          <div className={`linkContainer`}>
            <p className={isActive() ? 'active_icon' : ''}>
              {t(navLinkOptions.title)}
            </p>
          </div>
        )}
      </Link>
      <div className={`subMenuItems ${menu ? 'showSubMenu' : ''}`}>
        {hasSubMenu && <AboutUsSubMenu subMenu={navLinkOptions.subMenu} />}
      </div>
    </div>
  ) : null;
};

const MenuItems = () => {
  const { tenantConfig } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const links = Object.keys(tenantConfig?.config?.header?.items || {});
  const width = useWidth();

  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  return tenantConfig ? (
    <div className={'menuItems'}>
      {links
        .filter((navLink) => navLink !== 'shop' && navLink !== 'me')
        .map((navLink) => {
          const navLinkOptions = tenantConfig.config.header.items[navLink];

          return (
            <MenuItem
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
          <UserIcon />
        </div>
      )}
    </div>
  ) : null;
};

export default MenuItems;
