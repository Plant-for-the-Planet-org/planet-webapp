import React, { ReactElement } from 'react'
import Donate from '../../../../../public/assets/images/navigation/Donate';
import DonateSelected from '../../../../../public/assets/images/navigation/DonateSelected';
import Globe from '../../../../../public/assets/images/navigation/Globe';
import GlobeSelected from '../../../../../public/assets/images/navigation/GlobeSelected';
import Leaderboard from '../../../../../public/assets/images/navigation/Leaderboard';
import LeaderboardSelected from '../../../../../public/assets/images/navigation/LeaderboardSelected';
import Link from 'next/link';
import LeafSelected from '../../../../../public/assets/images/navigation/LeafSelected';
import Leaf from '../../../../../public/assets/images/navigation/Leaf';
import i18next from '../../../../../i18n';
import themeProperties from '../../../../theme/themeProperties';

const { useTranslation } = i18next;

interface Props {
    config:any;
    router:any;
    UserProfileIcon:any;
    gotoUserPage:Function;
}

function TopNavbar({ config, router,UserProfileIcon,gotoUserPage}: Props): ReactElement {
    const { t, ready } = useTranslation(['common']);

    return (
        <div>
            <div className={'top_nav'}>
                <div className={`d-sm-flex flex-row nav_container`}>
                    {config.header?.isSecondaryTenant ? (
                        <div
                            className={`first_icon 'tenant_logo`}
                            style={{ padding: '0rem 0.5rem' }}
                        >
                            <div className={'tenant_logo_container'}>
                                <Link
                                    href={config.header?.tenantLogoLink}
                                    
                                >
                                    <a style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }} href={config.header?.tenantLogoLink}>
                                        <img src={config.header.tenantLogoURL} />
                                    </a>
                                </Link>
                                <div className={'logo_divider'} />
                                <div className={'navlink'}>
                                    <a href="https://a.plant-for-the-planet.org">
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
                                className={`'first_icon tenant_logo`}
                                style={{ padding: '0rem 0.5rem' }}
                            >
                                <div className={'tenant_logo_container'}>
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

                    {config.header?.items.map((item:any) => (
                        <div key={item.id} style={{ marginTop: '8px' }}>
                            {item.key === 'home' && item.visible === true ? (
                                <Link key={item.id} href={item.onclick}>
                                    <div className={'link_container'}>
                                        <div className={'link_icon'}>
                                            {/* <i className="fas fa-ad"></i> */}
                                            {router.pathname === item.onclick ? (
                                                <GlobeSelected color={themeProperties.primaryColor} />
                                            ) : (
                                                    <Globe color={themeProperties.light.primaryFontColor} />
                                                )}
                                        </div>
                                        <p
                                            className={
                                                router.pathname === item.onclick
                                                    ? 'active_icon'
                                                    : ''
                                            }
                                        >
                                            {t('common:' + item.title)}
                                        </p>
                                    </div>
                                </Link>
                            ) : null}
                            {item.key === 'donate' && item.visible === true ? (
                                <Link key={item.id} href={item.onclick}>
                                    <div className={'link_container'}>
                                        <div className={'link_icon'}>
                                            {router.pathname === item.onclick ? (
                                                <DonateSelected color={themeProperties.primaryColor} />
                                            ) : (
                                                    <Donate color={themeProperties.light.primaryFontColor} />
                                                )}
                                        </div>
                                        <p
                                            className={
                                                router.pathname === item.onclick
                                                    ? 'active_icon'
                                                    : ''
                                            }
                                        >
                                            {t('common:' + item.title)}
                                        </p>
                                    </div>
                                </Link>
                            ) : null}
                            {item.key === 'about' && item.visible === true ? (
                                <Link key={item.id} href={item.onclick}>
                                    <div className={'link_container'}>
                                        <div className={'link_icon'}>
                                            {/* <i className="fas fa-ad"></i> */}
                                            {router.pathname === item.onclick ? (
                                                <LeafSelected color={themeProperties.primaryColor} />
                                            ) : (
                                                    <Leaf color={themeProperties.light.primaryFontColor} />
                                                )}
                                        </div>
                                        <p
                                            className={
                                                router.pathname === item.onclick
                                                    ? 'active_icon'
                                                    : ''
                                            }
                                        >
                                            {t('common:' + item.title)}
                                        </p>
                                    </div>
                                </Link>
                            ) : null}
                            {item.key === 'leaderboard' && item.visible === true ? (
                                <Link key={item.id} href={item.onclick}>
                                    <div className={'link_container'}>
                                        <div className={'link_icon'}>
                                            {/* <i className="fas fa-ad"></i> */}
                                            {router.pathname === item.onclick ? (
                                                <LeaderboardSelected color={themeProperties.primaryColor} />
                                            ) : (
                                                    <Leaderboard color={themeProperties.light.primaryFontColor} />
                                                )}
                                        </div>
                                        <p
                                            className={
                                                router.pathname === item.onclick
                                                    ? 'active_icon'
                                                    : ''
                                            }
                                        >
                                            {t('common:' + item.title)}
                                        </p>
                                    </div>
                                </Link>
                            ) : null}

                            {item.key === 'me' && item.visible === true ? (
                                <div key={item.id} onClick={()=>gotoUserPage()}>
                                    <div className={'link_container'}>
                                        <div className={'link_icon'}>
                                            <UserProfileIcon />
                                        </div>
                                        <p
                                            className={
                                                router.pathname === item.onclick
                                                    ? 'active_icon'
                                                    : ''
                                            }
                                        >
                                            {t('common:' + item.title)}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}

                    {/* <div
                        className={`${'theme_icon} ${'link_container}`}
                        onClick={toggleTheme}
                    >
                        <div className={'link_icon}>
                        {props.theme === 'theme-light' ? <Moon /> : <Sun />}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default TopNavbar
