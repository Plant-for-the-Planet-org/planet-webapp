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

function BottomNavbar({ config,router,UserProfileIcon,gotoUserPage}: Props): ReactElement {
    const { t, ready } = useTranslation(['common']);
   
    return (
        <div>
            <div className={'bottom_nav'}>
                <div className={`mobile_nav`}>
                    {config.header?.isSecondaryTenant ? (
                        <div className={'bottomLogo'}>
                            {config.tenantName !== 'ttc' && (
                                <Link
                                    href={config.header?.tenantLogoLink}
                                    
                                >
                                    <div style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }} className={'link_container'}>
                                        <img src={config.header.tenantLogoURL} />
                                    </div>
                                </Link>
                            )}
                            <Link
                                href="https://a.plant-for-the-planet.org"
                                
                            >
                                <div style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }} className={'link_container'}>
                                    <img
                                        src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                                        alt="About Plant-for-the-Planet"
                                    />
                                </div>
                            </Link>
                        </div>
                    ) : (
                            <div className={'bottomLogo'}>
                                <Link
                                    href="https://www.plant-for-the-planet.org"
                                    
                                >
                                    <div
                                        className={'link_container'}
                                        style={{ margin: '0px 4px',paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                                    >
                                        <img
                                            src={`${process.env.CDN_URL}/logo/svg/planet.svg`}
                                            alt="About Plant-for-the-Planet"
                                        />
                                    </div>
                                </Link>
                            </div>
                        )}

                    {config.header?.items.map((item:any) => (
                        <div key={item.id}>
                            {item.key === 'home' && item.visible === true ? (
                                <Link
                                    href={item.onclick}
                                    key={item.id}
                                >
                                    <div
                                        className={'link_container'}
                                        style={{ margin: '0px 4px',paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                                    >
                                        <div className={'link_icon'}>
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
                                <Link
                                    key={item.id}
                                    href={item.onclick}
                                    
                                >
                                    <div
                                        className={'link_container'}
                                    // style={{ margin: '0px 8px' }}
                                    style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                                    >
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
                                <Link
                                    href={item.onclick}
                                    key={item.id}
                                    
                                >
                                    <div style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }} className={'link_container'}>
                                        <div className={'link_icon'}>
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
                                <div
                                    key={item.id}
                                    style={{ paddingBottom: '0.4rem', paddingTop: '0.4rem' }}
                                    onClick={()=>gotoUserPage()}
                                >
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
                </div>
            </div>
        </div>
    )
}

export default BottomNavbar
