import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import tenantConfig from '../../../../tenant.config';
import Donate from '../../../assets/images/navigation/Donate';
import Leaderboard from '../../../assets/images/navigation/Leaderboard';
import Me from '../../../assets/images/navigation/Me';
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
                <Nav.Link
                  href={config.tenantLogoURL}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <a href={config.tenantLogoURL}>
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/${process.env.TENANT}.svg`}
                    />
                  </a>
                </Nav.Link>
                <div className={styles.logo_divider}></div>
                <Nav.Link
                  href="https://www.plant-for-the-planet.org"
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <a href="https://www.plant-for-the-planet.org">
                    <img src={`${process.env.CDN_URL}/logo/svg/planet.svg`} />
                  </a>
                </Nav.Link>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.first_icon} ${styles.tenant_logo}`}
              style={{ padding: '0rem 0.5rem' }}
            >
              <div className={styles.tenant_logo_container}>
                <Nav.Link
                  href="https://www.plant-for-the-planet.org"
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <a href="https://www.plant-for-the-planet.org">
                    <img src={`${process.env.CDN_URL}/logo/svg/planet.svg`} />
                  </a>
                </Nav.Link>
              </div>
            </div>
          )}
          <Nav.Link>
            <Link href={'/'}>
              <div className={styles.link_container}>
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
          </Nav.Link>
          <Nav.Link>
            <Link href={'/leaderboard'}>
              <div className={styles.link_container}>
                <div className={styles.link_icon}>
                  {/* <i className="fas fa-ad"></i> */}
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
          </Nav.Link>
          {process.env.TENANT !== 'salesforce' ? (
            <Nav.Link>
              <Link href={'/me'}>
                <div className={styles.link_container}>
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
            </Nav.Link>
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
              <Nav.Link
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <a href="https://salesforce.com">
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <img
                      src={`${process.env.CDN_URL}/logo/svg/${process.env.TENANT}.svg`}
                    />
                  </div>
                </a>
              </Nav.Link>
              <Nav.Link
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <a href={'https://www.plant-for-the-planet.org'}>
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <img src={`${process.env.CDN_URL}/logo/svg/planet.svg`} />
                  </div>
                </a>
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <a href={'https://www.plant-for-the-planet.org'}>
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <img src={`${process.env.CDN_URL}/logo/svg/planet.svg`} />
                  </div>
                </a>
              </Nav.Link>
            </>
          )}
          <Nav.Link>
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
          </Nav.Link>
          <Nav.Link>
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
          </Nav.Link>
          {process.env.TENANT !== 'salesforce' ? (
            <Nav.Link>
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
            </Nav.Link>
          ) : null}
        </Nav>
      </Navbar>
    </>
  );
}
