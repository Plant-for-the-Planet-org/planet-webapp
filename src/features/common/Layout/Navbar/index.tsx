import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Me from '../../../../../public/assets/images/navigation/Me';
import MeSelected from '../../../../../public/assets/images/navigation/MeSelected';
import tenantConfig from '../../../../../tenant.config';
import { ThemeContext } from '../../../../theme/themeContext';
import themeProperties from '../../../../theme/themeProperties';
import getImageUrl from '../../../../utils/getImageURL';
import { useUserProps } from '../UserPropsContext';
import GetNavBarIcon from './getNavBarIcon';
import GetSubMenu from './getSubMenu';
import { lang_path } from '../../../../utils/constants/wpLanguages';
import { ParamsContext } from '../QueryParamsContext';
import ImpersonationActivated from '../../../user/Settings/ImpersonateUser/ImpersonationActivated';

// used to detect window resize and return the current width of the window
const useWidth = () => {
  const [width, setWidth] = React.useState(0); // default width, detect on server.
  const handleResize = () => setWidth(window.innerWidth);
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  return width;
};

const config = tenantConfig();
export default function NavbarComponent(props: any) {
  const { t, ready, i18n } = useTranslation(['common']);
  const router = useRouter();
  const subMenuPath = {
    overview: '',
    childrenAndYouth: 'children-youth',
    trillionTrees: 'trillion-trees',
    yucatan: 'yucatan',
    partners: 'partners',
    changeChocolate: 'change-chocolate',
    stopTalkingStartPlanting: 'stop-talking-start-planting',
  };
  const [menu, setMenu] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileWidth, setMobileWidth] = React.useState(false);
  const { embed } = React.useContext(ParamsContext);
  React.useEffect(() => {
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
  React.useEffect(() => {
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
      //----------------- To do - redirect to slug -----------------
      // Currently we cannot do that because we don't know the slug of the user
      loginWithRedirect({
        redirectUri: `${process.env.NEXTAUTH_URL}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
    }
  }

  const { toggleTheme, theme } = React.useContext(ThemeContext);

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
        logoutUser(`${process.env.NEXTAUTH_URL}/verify-email`);
      }
    } else if (auth0Error.message === 'Invalid state') {
      setUser(null);
    } else {
      if (auth0Error.message) {
        alert(auth0Error.message);
      }
      setUser(null);
      logoutUser(`${process.env.NEXTAUTH_URL}/`);
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
    ) : router.pathname === '/complete-signup' ||
      (user && router.pathname === `/t/${user.slug}`) ? (
      <MeSelected color={themeProperties.primaryColor} />
    ) : (
      <Me color={themeProperties.light.primaryFontColor} />
    );
  };

  const MenuItems = () => {
    const links = Object.keys(config.header.items);
    const tenantName = config?.tenantName;
    return links ? (
      <div className={'menuItems'}>
        {links.map((link) => {
          let SingleLink = config.header.items[link];
          const hasSubMenu =
            SingleLink.subMenu && SingleLink.subMenu.length > 0;
          if (SingleLink) {
            if (link === 'me' && SingleLink.visible) {
              return (
                <button
                  id={'navbarActiveIcon'}
                  key={link}
                  onClick={() => gotoUserPage()}
                  className={`linkContainer`}
                >
                  <div className={'link_icon'}>
                    <UserIcon />
                  </div>
                  <p
                    className={
                      router.pathname === SingleLink.onclick
                        ? 'active_icon'
                        : ''
                    }
                  >
                    {user && SingleLink.loggedInTitle
                      ? t('common:' + SingleLink.loggedInTitle)
                      : t('common:' + SingleLink.title)}
                  </p>
                </button>
              );
            }
            if (link === 'about' && SingleLink.visible) {
              let aboutOnclick = `${SingleLink.onclick}${
                (process.env.TENANT === 'planet' ||
                  process.env.TENANT === 'ttc') &&
                lang_path[i18n.language]
                  ? lang_path[i18n.language]
                  : ''
              }`;

              aboutOnclick = isMobile ? '' : aboutOnclick;
              SingleLink = {
                ...SingleLink,
                onclick: aboutOnclick,
              };
              if (hasSubMenu) {
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
                <Link href={isMobile && hasSubMenu ? '' : SingleLink.onclick}>
                  <div className={`linkContainer`}>
                    <GetNavBarIcon
                      mainKey={link}
                      router={router}
                      item={SingleLink}
                      tenantName={tenantName}
                    />
                    {link === 'donate' ? (
                      <p
                        className={
                          router.pathname === '/' || router.pathname === '/[p]'
                            ? 'active_icon'
                            : ''
                        }
                      >
                        {t('common:' + SingleLink.title)}
                      </p>
                    ) : (
                      <p
                        className={
                          router.pathname === SingleLink.onclick
                            ? 'active_icon'
                            : ''
                        }
                      >
                        {t('common:' + SingleLink.title)}
                      </p>
                    )}
                  </div>
                </Link>
                <div className={`subMenuItems ${menu ? 'showSubMenu' : ''}`}>
                  {SingleLink.subMenu &&
                    SingleLink.subMenu.length > 0 &&
                    SingleLink.subMenu.map((submenu: any) => {
                      return (
                        <a
                          key={submenu.title}
                          className={'menuRow'}
                          href={`https://a.plant-for-the-planet.org/${
                            lang_path[i18n.language]
                              ? lang_path[i18n.language]
                              : 'en'
                          }/${subMenuPath[submenu.title]}`}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <GetSubMenu title={submenu.title} />
                            <div className={'menuText'}>
                              {t('common:' + submenu.title)}
                            </div>
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
  ) : (
    <>
      {isImpersonationModeOn && (
        <div className="impersonationAlertContainer" style={{ top: -142 }}>
          <ImpersonationActivated />
        </div>
      )}
      <div
        className={`mainNavContainer`}
        style={{ top: isImpersonationModeOn ? 49 : 0 }}
      >
        <div className={'top_nav'}>
          <div className={'brandLogos'}>
            {config.header?.isSecondaryTenant && (
              <div
                className={
                  config.tenantName === 'ttc'
                    ? 'hidePrimaryTenantLogo'
                    : 'primaryTenantLogo'
                }
              >
                <a href={config.header?.tenantLogoLink}>
                  <img
                    className={'tenantLogo desktop'}
                    src={config.header.tenantLogoURL}
                  />
                  {config.header.mobileLogoURL ? (
                    <img
                      className={'tenantLogo mobile'}
                      src={config.header.mobileLogoURL}
                    />
                  ) : (
                    <img
                      className={'tenantLogo mobile'}
                      src={config.header.tenantLogoURL}
                    />
                  )}
                </a>
                <div className={'logo_divider'} />
              </div>
            )}

            {theme === 'theme-light' ? (
              <a href="https://a.plant-for-the-planet.org">
                <img
                  className={'tenantLogo'}
                  src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                  alt={t('common:about_pftp')}
                />
              </a>
            ) : (
              <a href="https://a.plant-for-the-planet.org">
                <img
                  className={'tenantLogo'}
                  src={`/assets/images/PlanetDarkLogo.svg`}
                  alt={t('common:about_pftp')}
                />
              </a>
            )}
          </div>
          {ready && <MenuItems />}
        </div>
      </div>
    </>
  );
}
