import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Me from '../../../../../public/assets/images/navigation/Me';
import MeSelected from '../../../../../public/assets/images/navigation/MeSelected';
import { ThemeContext } from '../../../../theme/themeContext';
import themeProperties from '../../../../theme/themeProperties';
import getImageUrl from '../../../../utils/getImageURL';
import { useUserProps } from '../UserPropsContext';
import GetNavBarIcon from './getNavBarIcon';
import GetSubMenu from './getSubMenu';
import { lang_path } from '../../../../utils/constants/wpLanguages';
import { ParamsContext } from '../QueryParamsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';
import { useTenant } from '../TenantContext';

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

export default function NavbarComponent() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const subMenuPath = {
    overview: '',
    childrenAndYouth: 'children-youth',
    trillionTrees: 'trillion-trees',
    yucatan: 'yucatan',
    partners: 'partners',
    changeChocolate: 'chocolate',
    stopTalkingStartPlanting: 'stop-talking-start-planting',
  };
  const [menu, setMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(false);
  const { embed } = useContext(ParamsContext);

  const { tenantConfig } = useTenant();

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

  const {
    user,
    setUser,
    loginWithRedirect,
    logoutUser,
    auth0Error,
    isImpersonationModeOn,
  } = useUserProps();

  // This function controls the path for the user when they click on Me
  async function gotoUserPage() {
    if (user) {
      if (typeof window !== 'undefined') {
        router.push(`/profile`);
      }
    } else {
      loginWithRedirect({
        redirectUri: `${window.location.origin}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
    }
  }

  const { theme } = useContext(ThemeContext);

  // if (isLoading) {
  //   return <div></div>;
  // }
  // this two gives different view
  // if (isLoading) {
  //   return <p>loading</p>;
  // }
  if (auth0Error) {
    if (auth0Error.message === '401') {
      if (typeof window !== 'undefined') {
        setUser(null);
        logoutUser(`${window.location.origin}/verify-email`);
      }
    } else if (auth0Error.message === 'Invalid state') {
      setUser(null);
    } else if (typeof window !== 'undefined') {
      if (auth0Error.message) {
        alert(auth0Error.message);
      }
      setUser(null);
      logoutUser(`${window.location.origin}/`);
    }
  }

  const UserIcon = () => {
    return user && user.image ? (
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '50%',
          height: '27px',
          width: '27px',
          border: '1px solid #F2F2F7',
        }}
      >
        <img
          src={getImageUrl('profile', 'avatar', user.image)}
          height="26px"
          width="26px"
          style={{ borderRadius: '40px' }}
        />
      </div>
    ) : router.pathname.includes('/complete-signup') ||
      (user && router.pathname.includes(`/profile`)) ? (
        <MeSelected color={themeProperties.primaryColor} />
    ) : (
      <Me color={themeProperties.light.primaryFontColor} />
    );
  };

  const MenuItems = () => {
    const { tenantConfig } = useTenant();

    const links = Object.keys(tenantConfig.config.header.items);
    const tenantName = tenantConfig.config.slug || '';
    return tenantConfig && links ? (
      <div className="menuItems">
        {links.map((link) => {
          let SingleLink = tenantConfig.config.header.items[link];
          const hasSubMenu =
            SingleLink.subMenu && SingleLink.subMenu.length > 0;
          if (SingleLink) {
            if (link === 'me' && SingleLink.visible) {
              return (
                <button
                  id="navbarActiveIcon"
                  key={link}
                  onClick={() => gotoUserPage()}
                  className="linkContainer"
                >
                  <div className="link_icon">
                    <UserIcon />
                  </div>
                  <p
                    className={
                      router.asPath === `/${locale}${SingleLink.onclick}`
                        ? 'active_icon'
                        : ''
                    }
                  >
                    {user && SingleLink.loggedInTitle
                      ? t(SingleLink.loggedInTitle)
                      : t(SingleLink.title)}
                  </p>
                </button>
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
            if (link === 'shop' && mobileWidth) {
              SingleLink.visible = false;
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
                  <div className="linkContainer">
                    <GetNavBarIcon
                      mainKey={link}
                      router={router}
                      item={SingleLink}
                      tenantName={tenantName}
                    />
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
                          className="menuRow"
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
                            <div className="menuText">{t(submenu.title)}</div>
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
        })}
      </div>
    ) : (
      <></>
    );
  };

  return embed === 'true' ? (
    <></>
  ) : tenantConfig ? (
    <>
      {isImpersonationModeOn && (
        <div className="impersonationAlertContainer" style={{ top: -142 }}>
          <ImpersonationActivated />
        </div>
      )}
      <div
        className="mainNavContainer"
        style={{ top: isImpersonationModeOn ? 49 : 0 }}
      >
        <div className="top_nav">
          <div className="brandLogos">
            {tenantConfig.config.header?.isSecondaryTenant && (
              <div
                className={
                  tenantConfig.config.slug === 'ttc'
                    ? 'hidePrimaryTenantLogo'
                    : 'primaryTenantLogo'
                }
              >
                <a href={tenantConfig.config.header?.tenantLogoLink}>
                  <img
                    className="tenantLogo desktop"
                    src={tenantConfig.config.header.tenantLogoURL}
                  />
                  {tenantConfig.config.header.mobileLogoURL ? (
                    <img
                      className="tenantLogo mobile"
                      src={tenantConfig.config.header.mobileLogoURL}
                    />
                  ) : (
                    <img
                      className="tenantLogo mobile"
                      src={tenantConfig.config.header.tenantLogoURL}
                    />
                  )}
                </a>
                <div className="logo_divider" />
              </div>
            )}

            {theme === 'theme-light' ? (
              <a href="https://www.plant-for-the-planet.org">
                <img
                  className="tenantLogo"
                  src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                  alt={t('about_pftp')}
                />
              </a>
            ) : (
              <a href="https://www.plant-for-the-planet.org">
                <img
                  className="tenantLogo"
                  src="/assets/images/PlanetDarkLogo.svg"
                  alt={t('about_pftp')}
                />
              </a>
            )}
          </div>
          <MenuItems />
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
