import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AboutUsSubMenu from './AboutUsSubMenu';
import { SetState } from '../../../types/common';
import { useTenant } from '../../TenantContext';
import { navLinkOptions } from './NavigationMenu';
import { useMemo } from 'react';

interface NavigationItemProps {
  navLink: string;
  navLinkOptions: navLinkOptions;
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
  const { tenantConfig } = useTenant();
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
  const isActive = useMemo(() => {
    const { slug } = tenantConfig.config;
    const { pathname } = router;
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
    };

    const isDonatePath = donatePaths.includes(pathname);
    const isHomePath = pathname === linkPaths.home && navLink === 'home';
    const isLeaderboardPath =
      pathname === linkPaths.leaderboard && navLink === 'leaderboard';
    const isPlanetHome =
      slug === 'planet' &&
      pathname === '/sites/[slug]/[locale]' &&
      navLink === 'home';

    if (navLink === 'donate') {
      return isDonatePath;
    }
    if (isPlanetHome) {
      return true;
    }
    return isHomePath || isLeaderboardPath;
  }, [router, tenantConfig]);

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
            <p className={isActive ? 'activeIcon' : ''}>
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

export default NavigationItem;
