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
          {config.header?.isSecondaryTenant ? (
            <div
              className={`${styles.first_icon} ${styles.tenant_logo}`}
              style={{ padding: '0rem 0.5rem' }}
            >
              <div className={styles.tenant_logo_container}>
                <Nav.Link
                  href={config.header?.tenantLogoLink}
                  style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                >
                  <a href={config.header?.tenantLogoLink}>
                    <img src={config.header.tenantLogoURL} />
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

          {config.header?.items.map((item) => {
            return (
              <>
                {item.key === 'home' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
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
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  </Nav.Link>
                ) : null}
                {item.key === 'donate' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
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
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  </Nav.Link>
                ) : null}

                {item.key === 'leaderboard' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
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
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  </Nav.Link>
                ) : null}

                {item.key === 'me' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
                      <div className={styles.link_container}>
                        <div className={styles.link_icon}>
                          {router.pathname === item.onclick ? (
                            <MeSelected color={styles.primaryColor} />
                          ) : (
                            <Me color={styles.primaryFontColor} />
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
                  </Nav.Link>
                ) : null}
              </>
            );
          })}
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
          {config.header?.isSecondaryTenant ? (
            <>
              <Nav.Link
                href={config.header?.tenantLogoLink}
                style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
              >
                <a href={config.header?.tenantLogoLink}>
                  <div
                    className={styles.link_container}
                    style={{ margin: '0px 8px' }}
                  >
                    <img src={config.header.tenantLogoURL} />
                  </div>
                </a>
              </Nav.Link>
              <Nav.Link
                href={'https://www.plant-for-the-planet.org'}
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
                href={'https://www.plant-for-the-planet.org'}
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

          {config.header?.items.map((item) => {
            return (
              <>
                {item.key === 'home' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
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
                  </Nav.Link>
                ) : null}
                {item.key === 'donate' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
                      <div
                        className={styles.link_container}
                        style={{ margin: '0px 8px' }}
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
                  </Nav.Link>
                ) : null}

                {item.key === 'leaderboard' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
                      <div
                        className={styles.link_container}
                        style={{ margin: '0px 8px' }}
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
                  </Nav.Link>
                ) : null}

                {item.key === 'me' && item.visible === true ? (
                  <Nav.Link key={item.id}>
                    <Link href={item.onclick}>
                      <div
                        className={styles.link_container}
                        style={{ margin: '0px 8px' }}
                      >
                        <div className={styles.link_icon}>
                          {router.pathname === item.onclick ? (
                            <MeSelected color={styles.primaryColor} />
                          ) : (
                            <Me color={styles.primaryFontColor} />
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
                  </Nav.Link>
                ) : null}
              </>
            );
          })}
        </Nav>
      </Navbar>
    </>
  );
}
