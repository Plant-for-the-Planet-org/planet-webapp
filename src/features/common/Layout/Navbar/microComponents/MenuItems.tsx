import { useTenant } from '../../TenantContext';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import UserIcon from './UserIcon';
import { useState, useEffect } from 'react';
import AboutUsSubMenu from './AboutUsSubMenu';
import { SetState } from '../../../types/common';

type Submenu = Omit<SingleLink, 'loggedInTitle' | 'subMenu'>;
interface SingleLink {
  title: string;
  onclick: string;
  visible: boolean;
  subMenu: Submenu[];
  loggedInTitle: string | undefined;
}
interface MenuItem {
  link: string;
  SingleLink: SingleLink;
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

const MenuItem = ({ link, SingleLink, isMobile, menu, setMenu }: MenuItem) => {
  const router = useRouter();
  const t = useTranslations('Common');
  const hasSubMenu = SingleLink.subMenu && SingleLink.subMenu.length > 0;

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
    if (link === 'donate') {
      return (
        router.pathname === '/' ||
        router.pathname === '/[p]' ||
        router.pathname === '/[p]/[id]' ||
        router.pathname === '/sites/[slug]/[locale]' ||
        router.pathname === '/sites/[slug]/[locale]/[p]' ||
        router.pathname === '/sites/[slug]/[locale]/[p]/[id]'
      );
    } else {
      return (
        (router.pathname === '/sites/[slug]/[locale]' && link === 'home') ||
        (router.pathname === '/sites/[slug]/[locale]/all' &&
          link === 'leaderboard')
      );
    }
  };

  return SingleLink.visible ? (
    <div
      className={`${hasSubMenu ? 'subMenu' : ''}`}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      key={link}
    >
      <Link
        prefetch={false}
        href={isMobile && hasSubMenu ? router.asPath : SingleLink.onclick}
      >
        {SingleLink.title !== 'signIn' && (
          <div className={`linkContainer`}>
            <p className={isActive() ? 'active_icon' : ''}>
              {t(SingleLink.title)}
            </p>
          </div>
        )}
      </Link>
      <div className={`subMenuItems ${menu ? 'showSubMenu' : ''}`}>
        {hasSubMenu && <AboutUsSubMenu subMenu={SingleLink.subMenu} />}
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
        .filter((link) => link !== 'shop')
        .map((link) => {
          const SingleLink = tenantConfig.config.header.items[link];
          return (
            <MenuItem
              key={link}
              link={link}
              SingleLink={SingleLink}
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
