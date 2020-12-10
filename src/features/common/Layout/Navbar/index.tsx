import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import tenantConfig from '../../../../../tenant.config';
import Donate from '../../../../../public/assets/images/navigation/Donate';
import DonateSelected from '../../../../../public/assets/images/navigation/DonateSelected';
import Globe from '../../../../../public/assets/images/navigation/Globe';
import GlobeSelected from '../../../../../public/assets/images/navigation/GlobeSelected';
import Leaderboard from '../../../../../public/assets/images/navigation/Leaderboard';
import LeaderboardSelected from '../../../../../public/assets/images/navigation/LeaderboardSelected';
import Me from '../../../../../public/assets/images/navigation/Me';
import MeSelected from '../../../../../public/assets/images/navigation/MeSelected';
import { ThemeContext } from '../../../../theme/themeContext';
import styles from './Navbar.module.scss';
import i18next from '../../../../../i18n';
import getImageUrl from '../../../../utils/getImageURL';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserInfo } from '../../../../utils/auth0/userInfo';

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
      <MeSelected color={styles.primaryColor} />
    ) : (
      <Me color={styles.primaryFontColor} />
    );
  };

  return (
    <>
      {/* Top Navbar */}
      <div className={styles.top_nav}>
        <div className={`d-sm-flex flex-row ${styles.nav_container}`}>
          {config.header?.isSecondaryTenant ? (
            <div
              className={`${styles.first_icon} ${styles.tenant_logo}`}
              style={{ padding: '0rem 0.5rem' }}
            >
              <div className={styles.tenant_logo_container}>
                <Link
                  href={config.header?.tenantLogoLink}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <a href={config.header?.tenantLogoLink}>
                    <img src={config.header.tenantLogoURL} />
                  </a>
                </Link>
                <div className={styles.logo_divider} />
                <div className={styles.navlink}>
                  <a href="https://www.plant-for-the-planet.org">
                    {ready ? (
                      <img
                        src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                        alt={t('common:about_pftp')}
                      />
                    ) : null}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.first_icon} ${styles.tenant_logo}`}
              style={{ padding: '0rem 0.5rem' }}
            >
              <Link href="https://www.plant-for-the-planet.org">
                <div className={styles.link_container}>
                  <div className={styles.link_icon}>
                    <img
                      src="/assets/images/planet.svg"
                      alt={t('common:about_pftp')}
                    />
                  </div>
                  {ready ? <p>{t('common:aboutUs')}</p> : null}
                </div>
              </Link>
            </div>
          )}

          {config.header?.items.map((item) => (
            <div key={item.id} style={{ marginTop: '8px' }}>
              {item.key === 'home' && item.visible === true ? (
                <Link key={item.id} href={item.onclick}>
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>
                      {/* <i className="fas fa-ad"></i> */}
                      {router.pathname === item.onclick ? (
                        <GlobeSelected color={styles.primaryColor} />
                      ) : (
                        <Globe color={styles.primaryFontColor} />
                      )}
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ) : null}
              {item.key === 'donate' && item.visible === true ? (
                <Link key={item.id} href={item.onclick}>
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>
                      {router.pathname === item.onclick ? (
                        <DonateSelected color={styles.primaryColor} />
                      ) : (
                        <Donate color={styles.primaryFontColor} />
                      )}
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ) : null}

              {item.key === 'leaderboard' && item.visible === true ? (
                <Link key={item.id} href={item.onclick}>
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>
                      {/* <i className="fas fa-ad"></i> */}
                      {router.pathname === item.onclick ? (
                        <LeaderboardSelected color={styles.primaryColor} />
                      ) : (
                        <Leaderboard color={styles.primaryFontColor} />
                      )}
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ) : null}

              {item.key === 'me' && item.visible === true ? (
                <div key={item.id} onClick={gotoUserPage}>
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>
                      <UserProfileIcon />
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          {/* <div
            className={`${styles.theme_icon} ${styles.link_container}`}
            onClick={toggleTheme}
          >
            <div className={styles.link_icon}>
              {props.theme === 'theme-light' ? <Moon /> : <Sun />}
            </div>
          </div> */}
        </div>
      </div>

      {/* Bottom navbar */}
      <div className={styles.bottom_nav}>
        <div className={`${styles.mobile_nav}`}>
          {config.header?.isSecondaryTenant ? (
            <div className={styles.bottomLogo}>
              {config.tenantName !== 'ttc' && (
                <Link
                  href={config.header?.tenantLogoLink}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <div className={styles.link_container}>
                    <img src={config.header.tenantLogoURL} />
                  </div>
                </Link>
              )}
              <Link
                href="https://www.plant-for-the-planet.org"
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <div className={styles.link_container}>
                  <img
                    src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                    alt="About Plant-for-the-Planet"
                  />
                </div>
              </Link>
            </div>
          ) : (
            <div className={styles.bottomLogo}>
              <Link
                href="https://www.plant-for-the-planet.org"
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <div
                  className={styles.link_container}
                  style={{ margin: '0px 8px' }}
                >
                  <img
                    src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                    alt="About Plant-for-the-Planet"
                  />
                </div>
              </Link>
            </div>
          )}

          {config.header?.items.map((item) => (
            <div key={item.id}>
              {item.key === 'home' && item.visible === true ? (
                <Link
                  href={item.onclick}
                  key={item.id}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <div className={styles.link_icon}>
                      {router.pathname === item.onclick ? (
                        <GlobeSelected color={styles.primaryColor} />
                      ) : (
                        <Globe color={styles.primaryFontColor} />
                      )}
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ) : null}

              {item.key === 'donate' && item.visible === true ? (
                <Link
                  key={item.id}
                  href={item.onclick}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <div
                    className={styles.link_container}
                    // style={{ margin: '0px 8px' }}
                  >
                    <div className={styles.link_icon}>
                      {router.pathname === item.onclick ? (
                        <DonateSelected color={styles.primaryColor} />
                      ) : (
                        <Donate color={styles.primaryFontColor} />
                      )}
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ) : null}

              {item.key === 'leaderboard' && item.visible === true ? (
                <Link
                  href={item.onclick}
                  key={item.id}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>
                      {router.pathname === item.onclick ? (
                        <LeaderboardSelected color={styles.primaryColor} />
                      ) : (
                        <Leaderboard color={styles.primaryFontColor} />
                      )}
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ) : null}

              {item.key === 'me' && item.visible === true ? (
                <div
                  key={item.id}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                  onClick={gotoUserPage}
                >
                  <div className={styles.link_container}>
                    <div className={styles.link_icon}>
                      <UserProfileIcon />
                    </div>
                    {ready ? (
                      <p
                        className={
                          router.pathname === item.onclick
                            ? styles.active_icon
                            : ''
                        }
                      >
                        {t('common:' + item.title)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
