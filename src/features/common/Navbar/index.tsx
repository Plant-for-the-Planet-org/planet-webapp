import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import tenantConfig from '../../../../tenant.config';
import Donate from '../../../assets/images/navigation/Donate';
import DonateSelected from '../../../assets/images/navigation/DonateSelected';
import Globe from '../../../assets/images/navigation/Globe';
import GlobeSelected from '../../../assets/images/navigation/GlobeSelected';
import Leaderboard from '../../../assets/images/navigation/Leaderboard';
import LeaderboardSelected from '../../../assets/images/navigation/LeaderboardSelected';
import Me from '../../../assets/images/navigation/Me';
import MeSelected from '../../../assets/images/navigation/MeSelected';
import { ThemeContext } from '../../../utils/themeContext';
import styles from './Navbar.module.scss';

const config = tenantConfig();

export default function NavbarComponent(props: any) {
  const router = useRouter();

  const { toggleTheme } = React.useContext(ThemeContext);

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
                      {item.title}
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
                      {item.title}
                    </p>
                  </div>
                </Link>
              ) : null}

              {item.key === 'me' && item.visible === true ? (
                <Link key={item.id} href={item.onclick}>
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
      <>
        {!props.searchMode ? (
          <div className={styles.bottom_nav}>
            <div className={`${styles.mobile_nav}`}>
              {config.header?.isSecondaryTenant ? (
                <div className={styles.bottomLogo}>
                  <Link
                    href={config.header?.tenantLogoLink}
                    style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                  >
                    <div className={styles.link_container}>
                      <img src={config.header.tenantLogoURL} />
                    </div>
                  </Link>
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
                    <Link
                      href={item.onclick}
                      key={item.id}
                      style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                    >
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
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </>
    </>
  );
}
