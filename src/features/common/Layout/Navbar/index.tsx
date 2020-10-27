import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useSession, signIn } from 'next-auth/client';
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
import {getS3Image} from '../../../../utils/getImageURL'
import { getUserExistsInDB, getUserSlug, getUserProfilePic } from '../../../../utils/auth0/localStorageUtils'

const { useTranslation } = i18next;
const config = tenantConfig();
console.log('NODE_ENV-----', process.env.NODE_ENV)
console.log('NEXTAUTH_URL-------', process.env.NEXTAUTH_URL)
export default function NavbarComponent(props: any) {
  // If there is a session we will use it
  const [session, loading] = useSession();

  const { t } = useTranslation(['common']);
  const router = useRouter();

  /* Works when user clicks on Me
   If the user is logged in, redirect to t/userSlug
   If user is not logged in we will redirect to singin page with Auth0
   If in the signin flow, if the user is already existing, we login the user and  redirect to t/userSlug
   If in the signin flow, if the user is not existing, then we redirect to complete Signup flow */
  const checkWhichPath = () => {

    console.log('session navbar ', session)
    if (typeof Storage !== 'undefined') {
      
    const userExistsInDB = getUserExistsInDB();
  
    // if user logged in, and already signed up -> /t/userSlug page
      if (!loading && session && (userExistsInDB === true)) {
          var userslug = getUserSlug();
          if (typeof window !== 'undefined') {
            console.log('if user logged in, and already signed up -> /t/userSlug page');
            router.push(`/t/${userslug}`);
          }
       // if user logged in, not already signed up -> /complete-signup
      } else if ( !loading && session && (userExistsInDB === false)) {
          if (typeof window !== 'undefined') {
              console.log('if user logged in, not already signed up -> /complete-signup');
              router.push('/complete-signup');
          }
      } else { 
        // if no user logged in  -> signIn()
        // or when no active session
        console.log('if no user logged in  -> signIn()');
        signIn('auth0', { callbackUrl: `/login` });
      }
    }
  };

  const checkWhichIcon = () => {
    if (typeof Storage !== 'undefined') {
      const userProfilePic = getUserProfilePic()
      const userSlug = getUserSlug()
      //if logged in user && exist in db && profilepic is set -> show profile pic
      if (!loading && session && userProfilePic) {
        return <img src={getS3Image('profile','avatar',userProfilePic)} height="26px" width="26px" style={{borderRadius: '40px'}}/>
      } 
      // if no session -> icon depending on path
      // If complete-signup or it's private profile page
      else if (router.pathname === '/complete-signup' || router.pathname === `/t/${userSlug}`){
        return <MeSelected color={styles.primaryColor}/>
      } else {
        return <Me color={styles.primaryFontColor} />
      }
    }
    return null;
  }

  const { toggleTheme } = React.useContext(ThemeContext);

  return (
    <>
      {/* Top Navbar */}
      <div
        className={styles.top_nav}
      >
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
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                      alt={t('common:about_pftp')}
                    />
                  </a>
                </div>
              </div>
            </div>
          ) : (
              <div
                className={`${styles.first_icon} ${styles.tenant_logo}`}
                style={{ padding: '0rem 0.5rem' }}
              >
                <div className={styles.tenant_logo_container}>
                  <div style={{ padding: '0.4rem 0.5rem' }}>
                    <a href="https://www.plant-for-the-planet.org">
                      <img
                        src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                        alt={t('common:about_pftp')}
                      />
                    </a>
                  </div>
                </div>
              </div>
          )}

          {config.header?.items.map((item) => (
              <div key={item.id} style={{marginTop:'8px'}}>
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
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {t('common:'+ item.title)}
                        </p>
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
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {t('common:'+ item.title)}
                        </p>
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
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {t('common:'+ item.title)}
                        </p>
                      </div>
                  </Link>
                ) : null}

                {item.key === 'me' && item.visible === true ? (
                <div key={item.id} onClick={checkWhichPath}>
                      <div className={styles.link_container}>
                        <div className={styles.link_icon}>
                          {checkWhichIcon()}
                        </div>
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {t('common:'+ item.title)}
                        </p>
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
      <div
        className={styles.bottom_nav}
      >
        <div className={`${styles.mobile_nav}`}>
          {config.header?.isSecondaryTenant ? (
            <div className={styles.bottomLogo}>
              <Link
                href={config.header?.tenantLogoLink}
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <div
                  className={styles.link_container}
                >
                  <img src={config.header.tenantLogoURL} />
                </div>
              </Link>
              <Link
                href="https://www.plant-for-the-planet.org"
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <div
                  className={styles.link_container}
                >
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
                  <Link href={item.onclick} key={item.id} style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}>
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
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {item.title}
                        </p>
                      </div>
                  </Link>
                ) : null}
                {item.key === 'donate' && item.visible === true ? (
                  <Link key={item.id} href={item.onclick} style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}>
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
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {item.title}
                        </p>
                      </div>
                  </Link>
                ) : null}

                {item.key === 'leaderboard' && item.visible === true ? (
                  <Link href={item.onclick} key={item.id} style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}>
                      <div
                        className={styles.link_container}
                      >
                        <div className={styles.link_icon}>
                          {router.pathname === item.onclick ? (
                            <LeaderboardSelected color={styles.primaryColor} />
                          ) : (
                              <Leaderboard color={styles.primaryFontColor} />
                          )}
                        </div>
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {item.title}
                        </p>
                      </div>
                  </Link>
                ) : null}

                {item.key === 'me' && item.visible === true ? (
                <div
                  key={item.id}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                  onClick={checkWhichPath}
                >
                      <div
                    className={styles.link_container} >
                        <div className={styles.link_icon}>
                          {checkWhichIcon()}
                        </div>
                        <p
                          className={
                            router.pathname === item.onclick
                              ? styles.active_icon
                              : ''
                          }
                        >
                          {item.title}
                        </p>
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
