import { useTenant } from '../../TenantContext';
import { useRouter } from 'next/router';
import { useLocale } from 'next-intl';
import { lang_path } from '../../../../../utils/constants/wpLanguages';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import GetSubMenu from '../getSubMenu';
import UserIcon from './UserIcon';

const MenuItems = ({ isMobile, mobileWidth, menu, setMenu, subMenuPath }) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Common');
  const { tenantConfig } = useTenant();
  const links = Object.keys(tenantConfig.config.header.items);
  const tenantName = tenantConfig.config.slug || '';

  return tenantConfig && links ? (
    <div className={'menuItems'}>
      {links.map((link) => {
        if (link !== 'shop') {
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
                      <p
                        className={
                          router.asPath === `/${locale}${SingleLink.onclick}`
                            ? 'active_icon'
                            : ''
                        }
                      >
                        {t(SingleLink.title)}
                      </p>
                    )}
                  </div>
                </Link>
                <div className={`subMenuItems ${menu ? 'showSubMenu' : ''}`}>
                  {SingleLink.subMenu &&
                    SingleLink.subMenu.length > 0 &&
                    SingleLink.subMenu.map((submenu) => {
                      return (
                        <a
                          key={submenu.title}
                          className={'menuRow'}
                          href={`https://www.plant-for-the-planet.org/${
                            lang_path[locale as keyof typeof lang_path]
                              ? lang_path[locale as keyof typeof lang_path]
                              : 'en'
                          }/${
                            subMenuPath[
                              submenu.title as keyof typeof subMenuPath
                            ]
                          }`}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <GetSubMenu title={submenu.title} />
                            <div className={'menuText'}>{t(submenu.title)}</div>
                          </div>
                        </a>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div key={link}></div>
            );
          }
        }
      })}
    </div>
  ) : (
    <></>
  );
};

export default MenuItems;
