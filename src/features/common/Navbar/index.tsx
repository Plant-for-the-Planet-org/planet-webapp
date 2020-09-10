import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import tenantConfig from '../../../../tenant.config';
import Donate from '../../../assets/images/navigation/Donate';
import DonateSelected from '../../../assets/images/navigation/DonateSelected';
import Globe from '../../../assets/images/navigation/Globe';
import GlobeSelected from '../../../assets/images/navigation/GlobeSelected';
import Leaderboard from '../../../assets/images/navigation/Leaderboard';
import LeaderboardSelected from '../../../assets/images/navigation/LeaderboardSelected';
import Me from '../../../assets/images/navigation/Me';
import MeSelected from '../../../assets/images/navigation/MeSelected';
import styles from './Navbar.module.scss';
const config = tenantConfig();

export default function NavbarComponent(props: any) {
  const router = useRouter();

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        fixed="top"
        className={styles.top_nav}
        bg={props.theme === 'theme-light' ? '' : 'dark'}
        variant={props.theme === 'theme-light' ? 'light' : 'dark'}
      >
        <Nav className={'d-none d-md-flex flex-row ' + styles.nav_container}>
          {process.env.TENANT !== 'planet' && process.env.TENANT ? (
            <div
              className={`${styles.first_icon} ${styles.tenant_logo}`}
              style={{ padding: '0rem 0.5rem' }}
            >
              <div className={styles.tenant_logo_container}>
                <div className={styles.navlink}>
                  <a href={config.tenantLogoURL}>
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/${process.env.TENANT}.svg`}
                      alt={config.tenantName}
                    />
                  </a>
                </div>
                <div className={styles.logo_divider}></div>
                <div className={styles.navlink}>
                  <a href="https://www.plant-for-the-planet.org">
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                      alt="About Plant-for-the-Planet"
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
                      alt="About Plant-for-the-Planet"
                    />
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className={styles.navlink}>
            <Link href={'/'} className={styles.navlink}>
              <div className={styles.link_container}>
                <div className={styles.link_icon}>
                  {router.pathname === `/` ? (
                    <DonateSelected color={styles.primaryColor} />
                  ) : (
                    <Donate color={styles.primaryFontColor} />
                  )}
                </div>
                <p
                  className={router.pathname === '/' ? styles.active_icon : ''}
                >
                  Donate/Gift
                </p>
              </div>
            </Link>
          </div>

          {process.env.TENANT !== 'planet' && process.env.TENANT ? (
            <div className={styles.navlink}>
              <Link href={'/leaderboard'}>
                <div className={styles.link_container}>
                  <div className={styles.link_icon}>
                    {/* <i className="fas fa-ad"></i> */}
                    {router.pathname === '/leaderboard' ? (
                      <GlobeSelected color={styles.primaryColor} />
                    ) : (
                      <Globe color={styles.primaryFontColor} />
                    )}
                  </div>
                  <p
                    className={
                      router.pathname === '/leaderboard'
                        ? styles.active_icon
                        : ''
                    }
                  >
                    Home
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <div className={styles.navlink}>
              <Link href={'/leaderboard'}>
                <div className={styles.link_container}>
                  <div className={styles.link_icon}>
                    {/* <i className="fas fa-ad"></i> */}
                    {router.pathname === '/leaderboard' ? (
                      <LeaderboardSelected color={styles.primaryColor} />
                    ) : (
                      <Leaderboard color={styles.primaryFontColor} />
                    )}
                  </div>
                  <p
                    className={
                      router.pathname === '/leaderboard'
                        ? styles.active_icon
                        : ''
                    }
                  >
                    Leaders
                  </p>
                </div>
              </Link>
            </div>
          )}
          {process.env.TENANT !== 'salesforce' ? (
            <div className={styles.navlink}>
              <Link href={'/me'}>
                <div className={styles.link_container}>
                  <div className={styles.link_icon}>
                    {router.pathname === '/me' ? (
                      <MeSelected color={styles.primaryColor} />
                    ) : (
                      <Me color={styles.primaryFontColor} />
                    )}
                  </div>
                  <p
                    className={
                      router.pathname === '/me' ? styles.active_icon : ''
                    }
                  >
                    Me
                  </p>
                </div>
              </Link>
            </div>
          ) : null}
        </Nav>
      </Navbar>

      {/* Bottom navbar */}
      <Navbar
        fixed="bottom"
        className={`d-md-none ${styles.bottom_nav}`}
        bg="light"
        expand="lg"
      >
        <Nav className={'d-flex flex-row ' + styles.mobile_nav}>
          {process.env.TENANT !== 'planet' && process.env.TENANT ? (
            <>
              <div className={styles.navlink}>
                <a href="https://salesforce.com">
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/${process.env.TENANT}.svg`}
                      alt={config.tenantName}
                    />
                  </div>
                </a>
              </div>
              <div className={styles.navlink}>
                <a href={'https://www.plant-for-the-planet.org'}>
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                      alt="About Plant-for-the-Planet"
                    />
                  </div>
                </a>
              </div>
            </>
          ) : (
            <>
              <div className={styles.navlink}>
                <a href={'https://www.plant-for-the-planet.org'}>
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                      alt="About Plant-for-the-Planet"
                    />
                  </div>
                </a>
              </div>
            </>
          )}
          <div>
            <Link href={'/'}>
              <div
                className={styles.link_container}
                style={{ margin: '0px 8px' }}
              >
                <div className={styles.link_icon}>
                  <Donate
                    color={
                      router.pathname === `/`
                        ? styles.primaryColor
                        : styles.primaryFontColor
                    }
                  />
                </div>
                <p
                  className={router.pathname === '/' ? styles.active_icon : ''}
                >
                  Donate/Gift
                </p>
              </div>
            </Link>
          </div>
          <div>
            <Link href={'/leaderboard'}>
              <div
                className={styles.link_container}
                style={{ margin: '0px 8px' }}
              >
                <div className={styles.link_icon}>
                  <Leaderboard
                    color={
                      router.pathname === '/leaderboard'
                        ? styles.primaryColor
                        : styles.primaryFontColor
                    }
                  />
                </div>
                <p
                  className={
                    router.pathname === '/leaderboard' ? styles.active_icon : ''
                  }
                >
                  Leaders
                </p>
              </div>
            </Link>
          </div>
          {process.env.TENANT !== 'salesforce' ? (
            <div>
              <Link href={'/me'}>
                <div
                  className={styles.link_container}
                  style={{ margin: '0px 8px' }}
                >
                  <div className={styles.link_icon}>
                    <Me
                      color={
                        router.pathname === '/me'
                          ? styles.primaryColor
                          : styles.primaryFontColor
                      }
                    />
                  </div>
                  <p
                    className={
                      router.pathname === '/me' ? styles.active_icon : ''
                    }
                  >
                    Me
                  </p>
                </div>
              </Link>
            </div>
          ) : null}
        </Nav>
      </Navbar>
    </>
  );
}
