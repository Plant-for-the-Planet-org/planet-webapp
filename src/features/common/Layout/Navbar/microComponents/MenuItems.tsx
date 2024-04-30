import { useTenant } from '../../TenantContext';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import UserIcon from './UserIcon';
import { useState, useEffect } from 'react';
import AboutUsSubMenu, { SubMenu } from './AboutUsSubMenu';

interface SingleLink {
  loggedInTitle?: string;
  subMenu?: SubMenu[];
  onclick: string;
  title: string;
  visible: boolean;
}

// used to detect window resize and return the current width of the window
const useWidth = () => {
  const [width, setWidth] = useState(0); // default width, detect on server.
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  return width;
};

const MenuItems = () => {
  const router = useRouter();
  const t = useTranslations('Common');
  const { tenantConfig } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const links = Object.keys(tenantConfig.config.header.items);

  const width = useWidth();
  // changes the isMobile state to true if the window width is less than 768px
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  return tenantConfig && links ? (
    <div className={'menuItems'}>
      {links
        .filter((link) => link !== 'shop')
        .map((link) => {
          const SingleLink: SingleLink = tenantConfig.config.header.items[link];
          const hasSubMenu =
            SingleLink.subMenu && SingleLink.subMenu.length > 0;
          if (SingleLink) {
            if (link === 'me' && SingleLink.visible) {
              return (
                <div key={link} className="userIconContainer">
                  <UserIcon />
                </div>
              );
            }

            return SingleLink.visible ? (
              <div
                className={`${hasSubMenu ? 'subMenu' : ''}`}
                onClick={() => (isMobile && hasSubMenu ? setMenu(!menu) : {})}
                onMouseOver={() =>
                  hasSubMenu ? setMenu(isMobile ? menu : true) : {}
                }
                onMouseLeave={() =>
                  hasSubMenu ? setMenu(isMobile ? menu : false) : {}
                }
                key={link}
              >
                <Link
                  prefetch={false}
                  href={
                    isMobile && hasSubMenu ? router.asPath : SingleLink.onclick
                  }
                >
                  {console.log(router.asPath, SingleLink.onclick)}
                  <div className={`linkContainer`}>
                    {link === 'donate' ? (
                      <p
                        className={
                          router.pathname === '/' ||
                          router.pathname === '/[p]' ||
                          router.pathname === '/[p]/[id]' ||
                          router.pathname === '/sites/[slug]/[locale]' ||
                          router.pathname === '/sites/[slug]/[locale]/[p]' ||
                          router.pathname === '/sites/[slug]/[locale]/[p]/[id]'
                            ? 'active_icon'
                            : ''
                        }
                      >
                        {t(SingleLink.title)}
                      </p>
                    ) : (
                      <p
                        className={
                          (router.pathname === '/sites/[slug]/[locale]' &&
                            link === 'home') ||
                          (router.pathname === '/sites/[slug]/[locale]/all' &&
                            link === 'leaderboard')
                            ? 'active_icon'
                            : ''
                        }
                      >
                        {t(link)}
                      </p>
                    )}
                  </div>
                </Link>
                <div className={`subMenuItems ${menu ? 'showSubMenu' : ''}`}>
                  {SingleLink.subMenu && SingleLink.subMenu.length > 0 && (
                    <AboutUsSubMenu subMenu={SingleLink.subMenu} />
                  )}
                </div>
              </div>
            ) : (
              <div key={link}></div>
            );
          }
        })}
    </div>
  ) : (
    <></>
  );
};

export default MenuItems;
