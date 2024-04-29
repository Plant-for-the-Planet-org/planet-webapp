import { useTenant } from '../../TenantContext';
import { useRouter } from 'next/router';
import { lang_path } from '../../../../../utils/constants/wpLanguages';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import UserIcon from './UserIcon';
import { useState, useEffect } from 'react';
import AboutUsSubMenu from './AboutUsSubMenu';

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
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Common');
  const { tenantConfig } = useTenant();
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(false);
  const links = Object.keys(tenantConfig.config.header.items);
  const tenantName = tenantConfig.config.slug || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > 767) {
        setMobileWidth(false);
      } else {
        setMobileWidth(true);
      }
    }
  });
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
          let SingleLink = tenantConfig.config.header.items[link];
          const hasSubMenu =
            SingleLink.subMenu && SingleLink.subMenu.length > 0;
          if (SingleLink) {
            if (link === 'me' && SingleLink.visible) {
              return (
                <div key={link} style={{ marginLeft: '20px' }}>
                  <UserIcon />
                </div>
              );
            }

            if (link === 'about' && SingleLink.visible) {
              let aboutOnclick = `${SingleLink.onclick}${
                (tenantConfig.config.slug === 'planet' ||
                  tenantConfig.config.slug === 'ttc') &&
                lang_path[locale as keyof typeof lang_path]
                  ? lang_path[locale as keyof typeof lang_path]
                  : ''
              }`;

              aboutOnclick = isMobile ? '' : aboutOnclick;
              SingleLink = {
                ...SingleLink,
                onclick: aboutOnclick,
              };
              if (hasSubMenu && SingleLink.subMenu) {
                SingleLink.subMenu[0].onclick = aboutOnclick;
              }
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
                      <button
                        className={
                          router.asPath === `/${locale}${SingleLink.onclick}`
                            ? 'active_icon'
                            : ''
                        }
                      >
                        {t(link)}
                      </button>
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
