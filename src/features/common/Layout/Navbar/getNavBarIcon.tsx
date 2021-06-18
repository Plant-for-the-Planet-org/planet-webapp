import React, { ReactElement } from 'react'
import Donate from '../../../../../public/assets/images/navigation/Donate';
import DonateSelected from '../../../../../public/assets/images/navigation/DonateSelected';
import Globe from '../../../../../public/assets/images/navigation/Globe';
import GlobeSelected from '../../../../../public/assets/images/navigation/GlobeSelected';
import Leaderboard from '../../../../../public/assets/images/navigation/Leaderboard';
import LeaderboardSelected from '../../../../../public/assets/images/navigation/LeaderboardSelected';
import LeafSelected from '../../../../../public/assets/images/navigation/LeafSelected';
import Leaf from '../../../../../public/assets/images/navigation/Leaf';
import themeProperties from '../../../../theme/themeProperties';

interface Props {
    mainKey: any;
    router: any;
    item: any;
}

function GetNavBarIcon({ mainKey, router, item }: Props): ReactElement {

    const HomeLink = () => {
        return (
            <button id={'homeIcon'} className={`link_icon ${router.pathname === item.onclick ? 'active_icon' : ''}`}>
                {router.pathname === item.onclick ? (
                    <GlobeSelected color={themeProperties.primaryColor} />
                ) : (
                    <Globe color={themeProperties.light.primaryFontColor} />
                )}
            </button>
        )
    }
    const DonateLink = () => {
        return (
            <button id={'donateIcon'} className={`link_icon ${router.pathname === item.onclick || router.pathname === "/[p]" ? 'active_icon' : ''}`}>
                {router.pathname === item.onclick || router.pathname === "/[p]" ? (
                    <DonateSelected color={themeProperties.primaryColor} />
                ) : (
                    <Donate color={themeProperties.light.primaryFontColor} />
                )}
            </button>
        )
    }
    const AboutUsLink = () => {
        return (
            <button id={'aboutIcon'} className={`link_icon ${router.pathname === item.onclick ? 'active_icon' : ''}`}>
                {router.pathname === item.onclick ? (
                    <LeafSelected color={themeProperties.primaryColor} />
                ) : (
                    <Leaf color={themeProperties.light.primaryFontColor} />
                )}
            </button>
        )
    }
    const LeadersLink = () => {
        return (
            <button id={'leaderIcon'} className={`link_icon ${router.pathname === item.onclick ? 'active_icon' : ''}`}>
                {router.pathname === item.onclick ? (
                    <LeaderboardSelected color={themeProperties.primaryColor} />
                ) : (
                    <Leaderboard color={themeProperties.light.primaryFontColor} />
                )}
            </button>
        )
    }
    switch (mainKey) {
        case 'home': return <HomeLink />;
        case 'donate': return <DonateLink />;
        case 'about': return <AboutUsLink />;
        case 'leaderboard': return <LeadersLink />;
        default: <></>;
    }
}

export default GetNavBarIcon
