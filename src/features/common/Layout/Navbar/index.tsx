import { useRouter } from 'next/router';
import React from 'react';
import tenantConfig from '../../../../../tenant.config';
import Me from '../../../../../public/assets/images/navigation/Me';
import MeSelected from '../../../../../public/assets/images/navigation/MeSelected';
import { ThemeContext } from '../../../../theme/themeContext';
import i18next from '../../../../../i18n';
import getImageUrl from '../../../../utils/getImageURL';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserInfo } from '../../../../utils/auth0/userInfo';
import themeProperties from '../../../../theme/themeProperties';
import Link from 'next/link';
import GetNavBarIcon from './getNavBarIcon';

const { useTranslation } = i18next;
const config = tenantConfig();
export default function NavbarComponent(props: any) {
  const { t, ready } = useTranslation(['common']);
  const router = useRouter();

  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [token, setToken] = React.useState('');
  const [userInfo, setUserInfo] = React.useState({});

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
      let userInfo;
      userInfo = await getUserInfo(token, router, logout);
      setUserInfo(userInfo);
    }
    if (!isLoading && isAuthenticated) {
      loadFunction();
    }
  }, [isAuthenticated, isLoading]);

  // This function controls the path for the user when they click on Me
  async function gotoUserPage() {
    if (userInfo && isAuthenticated) {
      if (!userInfo.slug) {
        let userInfo;
        userInfo = await getUserInfo(token, router, logout);
        setUserInfo(userInfo);
      }
      if (typeof window !== 'undefined') {
        router.push(`/t/${userInfo.slug}`);
      }
    } else {
      //----------------- To do - redirect to slug -----------------
      // Currently we cannot do that because we don't know the slug of the user
      loginWithRedirect({ redirectUri: `${process.env.NEXTAUTH_URL}/login` });
    }
  }

  const { toggleTheme } = React.useContext(ThemeContext);

  // if (isLoading) {
  //   return <div></div>;
  // }
  // this two gives different view
  // if (isLoading) {
  //   return <p>loading</p>;
  // }
  if (error) {
    if (error.message === '401') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
        logout({ returnTo: `${process.env.NEXTAUTH_URL}/verify-email` });
      }
    } else if (error.message === 'Invalid state') {
      localStorage.removeItem('userInfo');
    } else {
      alert(error.message);
      localStorage.removeItem('userInfo');
      logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });
    }
  }

  const UserProfileIcon = () => {
    return isAuthenticated && userInfo && userInfo.profilePic ? (
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
          src={getImageUrl('profile', 'avatar', userInfo.profilePic)}
          height="26px"
          width="26px"
          style={{ borderRadius: '40px' }}
        />
      </div>
    ) : router.pathname === '/complete-signup' ||
      (userInfo && router.pathname === `/t/${userInfo.slug}`) ? (
          <MeSelected color={themeProperties.primaryColor} />
        ) : (
          <Me color={themeProperties.light.primaryFontColor} />
        );
  };

  const MenuItems = () => {
    const links = Object.keys(config.header.items);
    return links ? (
      <div className={'menuItems'}>
        {links.map((link) => {
          let SingleLink = config.header.items[link];
          if (SingleLink) {
            if (link === 'me' && SingleLink.visible) {
              return (
                <div key={link} onClick={() => gotoUserPage()} className={'linkContainer'}>
                  <div className={'link_icon'}>
                    <UserProfileIcon />
                  </div>
                  <p className={router.pathname === SingleLink.onclick ? 'active_icon' : ''}>
                    {t('common:' + SingleLink.title)}
                  </p>
                </div>
              )
            }
            return SingleLink.visible ? (
              (
                <Link key={link} href={SingleLink.onclick}>
                  <div className={'linkContainer'}>
                    <GetNavBarIcon UserProfileIcon={UserProfileIcon} mainKey={link} router={router} item={SingleLink} />
                    <p className={router.pathname === SingleLink.onclick ? 'active_icon' : ''}>
                      {t('common:' + SingleLink.title)}
                    </p>
                  </div>
                </Link>
              )
            ) : <></>;
          }

        })}
      </div>
    ) : <></>;
  }

  return (
    <div className={'mainNavContainer'}>
      <div className={'top_nav'}>
        <div className={'brandLogos'}>
          {config.header?.isSecondaryTenant && (
            <div className={config.tenantName === 'ttc' ? 'hidePrimaryTenantLogo' : 'primaryTenantLogo'}>
              <a href={config.header?.tenantLogoLink}>
                <img className={'tenantLogo'} src={config.header.tenantLogoURL} />
              </a>
              <div className={'logo_divider'} />
            </div>
          )}

          <a href="https://a.plant-for-the-planet.org">
            <img
              className={'tenantLogo'}
              src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
              alt={t('common:about_pftp')}
            />
          </a>
        </div>
        {ready && <MenuItems />}
      </div>
    </div>
  );
}
